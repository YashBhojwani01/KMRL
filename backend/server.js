const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables FIRST
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Loaded' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓ Loaded' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Loaded' : '✗ Missing');

// Import services after environment variables are loaded
const emailRoutes = require('./routes/emailRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const emailProcessingRoutes = require('./routes/emailProcessingRoutes');
const EmailTriggerService = require('./services/emailTriggerService');

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize email trigger service
const emailTriggerService = new EmailTriggerService();

// Initialize database connection
async function initDatabase() {
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      throw error;
    }
    console.log('Supabase connected successfully');
    
    // Initialize attachment storage (non-blocking)
    emailTriggerService.initializeStorage().catch(err => {
      console.log('Storage initialization will be handled separately');
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Auth rate limiting (more restrictive)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 auth requests per windowMs
});

// JWT middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Helper function to get user by email
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
}

// Helper function to get user by ID
async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, department, role, phone, employee_id, created_at, updated_at')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Email routes
app.use('/api/emails', emailRoutes);

// Attachment routes
app.use('/api/attachments', attachmentRoutes);

// Email processing routes
app.use('/api/email-processing', emailProcessingRoutes);

// Signup
app.post('/api/auth/signup', authLimiter, async (req, res) => {
  try {
    const { email, password, name, department, phone, employeeId } = req.body;

    // Validation
    if (!email || !password || !name || !department) {
      return res.status(400).json({ 
        message: 'Email, password, name, and department are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
        department,
        role: 'employee',
        phone: phone || null,
        employee_id: employeeId || null
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const user = await getUserById(newUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
        phone: user.phone,
        employeeId: user.employee_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Trigger email reading in background (don't wait for completion)
    emailTriggerService.triggerEmailReading(user.id)
      .then(result => {
        console.log(`Email reading result for user ${user.id}:`, result);
      })
      .catch(error => {
        console.error(`Email reading failed for user ${user.id}:`, error);
      });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
        phone: user.phone,
        employeeId: user.employee_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
        phone: user.phone,
        employeeId: user.employee_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, department, phone, employeeId } = req.body;
    const userId = req.user.userId;

    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name,
        department,
        phone: phone || null,
        employee_id: employeeId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Get updated user
    const user = await getUserById(userId);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: user.role,
        phone: user.phone,
        employeeId: user.employee_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can add server-side token blacklisting if needed)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);

module.exports = app;
