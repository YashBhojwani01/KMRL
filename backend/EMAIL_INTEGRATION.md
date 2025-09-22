# Email Integration for KMRL Metro

This document explains the email integration functionality that automatically reads and processes user emails when they log in.

## Overview

The email integration system:
- Automatically reads emails from Gmail when users log in
- Extracts email data (sender, subject, body, date, attachments)
- Stores email data in the database with user association
- Provides APIs to retrieve and manage email data
- Supports future classification and summarization features

## Database Schema

### email_data Table

```sql
CREATE TABLE public.email_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sender_email character varying(255) NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  email_date date NOT NULL,
  filename character varying(255) NULL,
  attachment_link text NULL,
  attachment_type character varying(100) NULL,
  gmail_message_id character varying(255) NOT NULL,
  gmail_thread_id character varying(255) NULL,
  is_relevant boolean NULL DEFAULT false,
  summary text NULL,
  key_points text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT email_data_pkey PRIMARY KEY (id),
  CONSTRAINT email_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
```

## API Endpoints

### POST /api/emails/read
Manually trigger email reading for a user.

**Request Body:**
```json
{
  "startDate": "2024-12-01",
  "endDate": "2024-12-03"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emails processed successfully",
  "data": {
    "emailsProcessed": 25,
    "emailsSaved": 20,
    "emailsSkipped": 5,
    "dateRange": {
      "start": "2024-12-01",
      "end": "2024-12-03"
    }
  }
}
```

### GET /api/emails
Get user's emails with pagination.

**Query Parameters:**
- `limit` (optional): Number of emails to return (default: 50)
- `offset` (optional): Number of emails to skip (default: 0)
- `relevantOnly` (optional): Only return relevant emails (default: false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sender_email": "sender@example.com",
      "subject": "Email Subject",
      "body": "Email body content...",
      "email_date": "2024-12-01",
      "filename": "attachment.pdf",
      "attachment_link": "attachment_uuid_filename.pdf",
      "attachment_type": "application/pdf",
      "is_relevant": false,
      "summary": null,
      "key_points": null,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

### GET /api/emails/stats
Get email statistics for a user.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "relevant": 25,
    "notRelevant": 75,
    "today": 5
  }
}
```

### PUT /api/emails/:emailId/relevance
Update email relevance and add summary/key points.

**Request Body:**
```json
{
  "isRelevant": true,
  "summary": "This email contains important project updates",
  "keyPoints": "1. Project deadline extended\n2. New requirements added\n3. Budget increased"
}
```

### DELETE /api/emails/cleanup
Clean up old emails.

**Request Body:**
```json
{
  "daysOld": 30
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd KMRL/backend
npm install
```

### 2. Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Gmail API
4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
5. Choose "Desktop application"
6. Download the credentials file
7. Rename it to `credentials.json`
8. Place it in `KMRL/backend/config/credentials.json`

### 3. Database Setup

Run the SQL script to create the email_data table:

```bash
# Execute the SQL file in your Supabase dashboard or using psql
psql -h your-db-host -U your-username -d your-database -f database/email_data_table.sql
```

### 4. Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`

### 5. First Time Authentication

When you first run the application and a user logs in:
1. The system will generate an OAuth URL
2. Visit the URL and complete authentication
3. The token will be automatically saved to `config/token.json`

## How It Works

### Automatic Email Reading

1. User logs in successfully
2. System triggers email reading in the background
3. Reads emails from the last 2 days
4. Extracts email data (sender, subject, body, attachments)
5. Saves to database with user association
6. Skips duplicate emails

### Data Processing

- **Sender Email**: Extracted from 'From' header
- **Subject**: Extracted from 'Subject' header
- **Body**: Extracted from email content (text/plain preferred, HTML stripped)
- **Date**: Parsed from 'Date' header
- **Attachments**: Extracted and stored with metadata
- **Deduplication**: Uses Gmail message ID to prevent duplicates

### Security

- All email routes require authentication
- Users can only access their own email data
- Gmail API uses OAuth2 with read-only scope
- Sensitive files (credentials, tokens) are gitignored

## Future Enhancements

1. **Email Classification**: AI-powered relevance detection
2. **Email Summarization**: Automatic summary generation
3. **Key Points Extraction**: Important information extraction
4. **Dashboard Integration**: Display email insights on dashboard
5. **Real-time Updates**: WebSocket-based live email updates
6. **Email Filtering**: Advanced filtering and search capabilities

## Troubleshooting

### Common Issues

1. **"Credentials file not found"**
   - Ensure `config/credentials.json` exists
   - Check file permissions

2. **"OAuth authentication required"**
   - Visit the provided OAuth URL
   - Complete authentication flow
   - Token will be saved automatically

3. **"No emails found"**
   - Check Gmail API permissions
   - Verify date range
   - Check if emails exist in the specified period

4. **Database errors**
   - Ensure email_data table exists
   - Check Supabase connection
   - Verify user_id foreign key relationship

### Logs

Check server logs for detailed error information:
- Email extraction errors
- Database operation errors
- Authentication issues

## Development

### Running Setup Script

```bash
node scripts/setup-email.js
```

### Testing Email Reading

```bash
# Test email reading manually
curl -X POST http://localhost:3001/api/emails/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2024-12-01", "endDate": "2024-12-03"}'
```

### Monitoring

- Check server logs for email processing status
- Monitor database for new email records
- Use email stats endpoint to track progress
