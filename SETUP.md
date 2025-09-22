# KMRL Metro Insights - Setup Guide

This guide will help you set up the KMRL Metro Insights application with authentication, profile management, and Supabase integration.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Git

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account
2. Create a new project
3. Note down your project URL and anon key from the project settings

### Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the SQL commands from `backend/database/supabase_schema.sql`
3. This will create the necessary tables and sample data

## 2. Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update the `.env` file with your Supabase credentials:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

### Start the Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:3001`

## 3. Frontend Setup

### Install Dependencies

```bash
cd .. # Go back to the root directory
npm install
```

### Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update the `.env` file:
```env
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=KMRL Metro Insights
VITE_APP_VERSION=1.0.0
```

### Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 4. Testing the Application

### Default Login Credentials

After running the database setup, you can use these credentials:

- **Admin User:**
  - Email: `admin@kmrl.com`
  - Password: `admin123`

- **Sample Users:**
  - Email: `john.doe@kmrl.com`
  - Password: `admin123`
  - Department: Operations (Manager)

### Features to Test

1. **Authentication:**
   - Sign up with a new account
   - Login with existing credentials
   - Logout functionality

2. **Profile Management:**
   - View profile information
   - Edit profile details
   - Update department and contact information

3. **Navigation:**
   - Access protected routes
   - User dropdown menu
   - Sidebar navigation

## 5. API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Health Check

- `GET /api/health` - Server health status

## 6. Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `name` (VARCHAR)
- `department` (VARCHAR)
- `role` (ENUM: admin, manager, employee)
- `phone` (VARCHAR, Optional)
- `employee_id` (VARCHAR, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### User Sessions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `token_hash` (VARCHAR)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### Audit Logs Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `action` (VARCHAR)
- `resource` (VARCHAR)
- `resource_id` (VARCHAR, Optional)
- `details` (JSONB, Optional)
- `ip_address` (INET, Optional)
- `user_agent` (TEXT, Optional)
- `created_at` (TIMESTAMP)

## 7. Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Row Level Security (RLS) in Supabase
- CORS protection
- Input validation

## 8. Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify Supabase credentials in `.env`
   - Check if the database schema is properly set up

2. **CORS Error:**
   - Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

3. **Authentication Error:**
   - Check JWT secret is set correctly
   - Verify user exists in database

4. **Build Errors:**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

### Logs

- Backend logs are displayed in the terminal
- Check browser console for frontend errors
- Supabase logs are available in the dashboard

## 9. Production Deployment

### Environment Variables

Make sure to set secure values for:
- `JWT_SECRET` (use a strong, random string)
- `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)
- `NODE_ENV=production`

### Security Considerations

- Enable HTTPS in production
- Set up proper CORS policies
- Use environment-specific Supabase projects
- Implement proper error handling
- Set up monitoring and logging

## 10. Support

For issues or questions:
1. Check the troubleshooting section
2. Review the Supabase documentation
3. Check the application logs
4. Verify all environment variables are set correctly
