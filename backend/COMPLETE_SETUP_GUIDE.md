# 🚀 KMRL Metro Email Classification System - Complete Setup Guide

This guide provides step-by-step instructions for setting up the complete email classification and processing system.

## 📋 **Prerequisites**

- Node.js (v16 or higher)
- Supabase account and project
- Google Cloud Console account
- Google AI Studio account (for Gemini API)
- Git (for cloning the repository)

## 🎯 **System Overview**

The system provides:
- **Email Reading**: Automatic Gmail integration
- **Document Processing**: PDF, Excel, Word, Image text extraction
- **AI Classification**: Google Gemini-powered email categorization
- **Relevance Filtering**: Smart filtering of important emails
- **Storage Management**: Supabase storage for attachments
- **Dashboard Integration**: Structured data for frontend display

## 🗄️ **Database Schema**

### Tables Created:
1. **`users`** - User accounts and authentication
2. **`email_data`** - Email content with AI classification
3. **`email_attachments`** - Attachment details and extracted content

### Storage Buckets:
1. **`email-attachments`** - Permanent attachment storage (50MB limit)
2. **`temp-attachments`** - Temporary file processing (100MB limit)

## 🚀 **Quick Setup (5 Minutes)**

### Step 1: Database Setup
```sql
-- Run this in your Supabase SQL Editor
-- Copy and paste the entire content of scripts/complete-setup.sql
```

### Step 2: Install Dependencies
```bash
cd KMRL/backend
npm install
```

### Step 3: Environment Configuration
Create `.env` file:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key

# Gmail API Configuration
GMAIL_READ_ONLY_SCOPE=https://www.googleapis.com/auth/gmail.readonly

# Server Configuration
PORT=3001
```

### Step 4: Gmail API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Download credentials as `credentials.json`
6. Place in `KMRL/backend/config/credentials.json`

### Step 5: Start the System
```bash
node server.js
```

## 📊 **Detailed Setup Instructions**

### 1. Database Setup

#### Option A: Complete Setup (Recommended)
```sql
-- Run the complete setup script
-- This creates all tables, indexes, triggers, and storage buckets
-- File: scripts/complete-setup.sql
```

#### Option B: Individual Setup
```sql
-- 1. Create tables
-- File: database/email_data_table.sql

-- 2. Setup storage
-- File: scripts/setup-storage.sql
```

### 2. Gmail API Configuration

#### Step 1: Google Cloud Console Setup
1. **Create Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project"
   - Name: "KMRL Metro Email System"

2. **Enable Gmail API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

3. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Desktop application"
   - Name: "KMRL Metro Email Reader"
   - Download the JSON file

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields
   - Add your email as a test user

#### Step 2: Local Configuration
```bash
# Place credentials file
cp ~/Downloads/client_secret_*.json KMRL/backend/config/credentials.json

# Run OAuth setup
cd KMRL/backend
node scripts/oauth-setup.js
```

### 3. Google Gemini API Setup

1. **Get API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign up or log in with your Google account
   - Go to "Get API Key"
   - Create new API key
   - Copy the key

2. **Add to Environment**:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 4. Supabase Configuration

#### Step 1: Project Setup
1. Go to [Supabase](https://supabase.com/)
2. Create new project
3. Note down your project URL and API keys

#### Step 2: Database Setup
```sql
-- Run the complete setup script in Supabase SQL Editor
-- This will create all necessary tables and storage buckets
```

#### Step 3: Storage Configuration
1. Go to "Storage" in Supabase Dashboard
2. Verify buckets are created:
   - `email-attachments`
   - `temp-attachments`
3. Set both buckets as public

### 5. Environment Variables

Create `.env` file in `KMRL/backend/`:

```env
# ===========================================
# KMRL Metro Email Classification System
# ===========================================

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail API Configuration
GMAIL_READ_ONLY_SCOPE=https://www.googleapis.com/auth/gmail.readonly

# Server Configuration
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

## 🧪 **Testing the System**

### 1. Start the Server
```bash
cd KMRL/backend
node server.js
```

### 2. Test Database Connection
```sql
-- Run in Supabase SQL Editor
SELECT * FROM get_storage_stats();
SELECT * FROM get_email_classification_stats();
```

### 3. Test API Endpoints

#### Register a User
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kmrl.com",
    "password": "password123",
    "name": "Test User",
    "department": "Operations",
    "phone": "1234567890",
    "employeeId": "EMP001"
  }'
```

#### Login and Get Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kmrl.com",
    "password": "password123"
  }'
```

#### Process Emails
```bash
curl -X POST http://localhost:3001/api/email-processing/process \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-12-01",
    "endDate": "2024-12-03"
  }'
```

#### Get Relevant Emails DataFrame
```bash
curl -X GET http://localhost:3001/api/email-processing/relevant-dataframe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 **Data Structure**

### Email DataFrame Columns:
```javascript
{
  sender_email: "sender@example.com",
  subject: "Email Subject",
  body: "Email body content...",
  email_date: "2024-12-01",
  attachment_link: "/path/to/attachment.pdf",
  attachment_type: "application/pdf",
  storage_id: "uuid-if-stored",
  extracted_information_from_attachment: "Extracted text content...",
  document_category: "CRITICAL_SAFETY",
  department: "Safety",
  priority_level: "URGENT",
  classification_reason: "Contains safety incident report"
}
```

### Classification Categories:
- **Document Categories**: CRITICAL_SAFETY, BUDGET_FINANCE, HR_TRAINING, OPERATIONS, COMPLIANCE_AUDIT, COMMUNICATION, OTHER
- **Departments**: Operations, Maintenance, Safety, Engineering, Administration, Finance, Human Resources, IT, Customer Service, Security
- **Priority Levels**: URGENT, HIGH, MEDIUM, LOW

## 🔧 **API Endpoints**

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Email Processing
- `POST /api/email-processing/process` - Process and classify emails
- `GET /api/email-processing/relevant-dataframe` - Get relevant emails as DataFrame
- `GET /api/email-processing/classification-report` - Get classification statistics
- `POST /api/email-processing/classify/:emailId` - Classify single email
- `POST /api/email-processing/cleanup` - Cleanup temp files
- `GET /api/email-processing/temp-stats` - Get temp storage stats

### Email Management
- `POST /api/emails/read` - Manually trigger email reading
- `GET /api/emails` - Get user emails with pagination
- `GET /api/emails/stats` - Get email statistics

### Attachment Management
- `GET /api/attachments/email/:emailId` - Get email attachments
- `GET /api/attachments/:attachmentId` - Get specific attachment
- `GET /api/attachments/search` - Search attachments by content
- `GET /api/attachments/stats` - Get attachment statistics

## 🛠️ **Troubleshooting**

### Common Issues:

1. **Database Connection Error**:
   - Check Supabase URL and keys
   - Verify database tables exist
   - Check network connectivity

2. **Gmail API Error**:
   - Verify credentials.json exists
   - Check OAuth consent screen configuration
   - Ensure Gmail API is enabled

3. **Google Gemini API Error**:
   - Check API key validity
   - Verify account has credits
   - Check rate limits

4. **Storage Upload Error**:
   - Check storage bucket exists
   - Verify RLS policies
   - Check file size limits

5. **Classification Error**:
   - Check Gemini API key
   - Verify model availability
   - Check request format

### Debug Commands:

```bash
# Check server logs
node server.js

# Test database connection
node -e "console.log(process.env.SUPABASE_URL)"

# Test Gmail API
node scripts/oauth-setup.js

# Test Gemini API
node scripts/test-gemini.js
```

## 📈 **Performance Optimization**

### Database Optimization:
- Indexes are created for optimal query performance
- Foreign key constraints ensure data integrity
- Triggers automatically update timestamps

### Storage Optimization:
- File size limits prevent storage bloat
- Automatic cleanup of temp files
- Efficient file organization by user/email

### API Optimization:
- Rate limiting prevents abuse
- JWT authentication for security
- Pagination for large datasets

## 🔒 **Security Considerations**

### Authentication:
- JWT tokens for API access
- Password hashing with bcrypt
- User-specific data isolation

### Data Protection:
- Row Level Security (RLS) for sensitive data
- Secure file storage with unique names
- Input validation and sanitization

### API Security:
- Rate limiting on all endpoints
- CORS configuration
- Error handling without sensitive data exposure

## 📝 **Maintenance**

### Daily Tasks:
- Monitor server logs
- Check storage usage
- Verify email processing

### Weekly Tasks:
- Cleanup temp files
- Review classification accuracy
- Update API keys if needed

### Monthly Tasks:
- Analyze storage statistics
- Review user activity
- Update dependencies

## 🎉 **Success Indicators**

When setup is complete, you should see:
- ✅ Server starts without errors
- ✅ Database tables created successfully
- ✅ Storage buckets accessible
- ✅ Gmail API authentication working
- ✅ OpenAI classification working
- ✅ Email processing completing successfully

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section
2. Review server logs
3. Verify all environment variables
4. Test individual components
5. Check Supabase and Google Cloud Console

The system is now ready for production use! 🚀
