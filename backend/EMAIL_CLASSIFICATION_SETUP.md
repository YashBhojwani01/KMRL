# Email Classification and Processing System

This document explains the complete email classification and attachment processing system for KMRL Metro.

## 🎯 **System Overview**

The system automatically:
1. **Reads emails** from Gmail when users log in
2. **Downloads attachments** to temporary storage
3. **Extracts text content** from various document types (PDF, Excel, Word, Images)
4. **Classifies emails** using OpenAI GPT-4 for relevance and categorization
5. **Filters relevant emails** based on classification criteria
6. **Stores relevant data** in a structured format for dashboard display

## 📊 **Classification Categories**

### Document Categories:
- **CRITICAL_SAFETY** - Safety protocols, incident reports, emergency procedures
- **BUDGET_FINANCE** - Budget approvals, financial reports, expense documentation
- **HR_TRAINING** - Employee training records, staff verification, HR documentation
- **OPERATIONS** - Daily operational reports, system updates, process documentation
- **COMPLIANCE_AUDIT** - Audit reports, compliance documentation, quality assessments
- **COMMUNICATION** - General communications, meeting notes, internal announcements
- **OTHER** - Documents that don't fit the above categories

### Departments:
- Operations, Maintenance, Safety, Engineering, Administration
- Finance, Human Resources, IT, Customer Service, Security

### Priority Levels:
- **URGENT** - Requires immediate attention
- **HIGH** - Important but not critical
- **MEDIUM** - Standard priority
- **LOW** - Information only

## 🔧 **Setup Instructions**

### 1. Install Dependencies

```bash
cd KMRL/backend
npm install
```

### 2. Environment Configuration

Add to your `.env` file:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Existing configurations...
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

### 3. Database Setup

Run the updated SQL script in your Supabase dashboard:

```sql
-- Execute the content of database/email_data_table.sql
-- This creates both email_data and email_attachments tables
```

### 4. Gmail API Setup

1. Get Gmail API credentials from Google Cloud Console
2. Place `credentials.json` in `KMRL/backend/config/`
3. Run OAuth setup: `node scripts/oauth-setup.js`

### 5. Supabase Storage Setup

1. Create bucket `email-attachments` in Supabase Dashboard
2. Set bucket as public
3. Run SQL to disable RLS: `ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;`

## 🚀 **API Endpoints**

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

## 📁 **Data Structure**

### Relevant Emails DataFrame Columns:
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
  classification_reason: "Email contains safety incident report"
}
```

## 🔄 **Processing Flow**

1. **User Login** → Triggers email reading
2. **Email Reading** → Downloads emails from Gmail (last 2 days)
3. **Attachment Processing** → Downloads and extracts content from attachments
4. **Classification** → Uses OpenAI to classify emails
5. **Relevance Filtering** → Filters emails based on classification
6. **Storage** → Saves relevant emails and attachments to database
7. **Dashboard** → Displays processed data

## 📋 **Supported File Types**

### Text Extraction:
- **PDF** - Using pdf-parse
- **Excel** - Using xlsx (XLSX, XLS)
- **Word** - Using mammoth (DOCX)
- **Images** - Using Tesseract.js (PNG, JPG, JPEG, GIF)
- **Text** - Plain text files
- **CSV** - CSV files
- **JSON** - JSON files

### Temporary Storage:
- Attachments are stored in `KMRL/backend/temp/attachments/`
- Files are automatically cleaned up after 24 hours
- Unique filenames prevent conflicts

## 🎛️ **Configuration Options**

### Relevance Criteria:
Emails are considered relevant if they have:
- Relevant document category (CRITICAL_SAFETY, BUDGET_FINANCE, etc.)
- High priority level (URGENT, HIGH)
- Attachments (any type)

### Classification Model:
- **Model**: GPT-4o-mini-2024-07-18
- **Temperature**: 0 (deterministic)
- **Max Tokens**: 3000
- **Custom prompt** for KMRL-specific classification

## 🔍 **Usage Examples**

### Process All User Emails:
```bash
curl -X POST http://localhost:3001/api/email-processing/process \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2024-12-01", "endDate": "2024-12-03"}'
```

### Get Relevant Emails DataFrame:
```bash
curl -X GET http://localhost:3001/api/email-processing/relevant-dataframe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Classification Report:
```bash
curl -X GET http://localhost:3001/api/email-processing/classification-report \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛠️ **Troubleshooting**

### Common Issues:

1. **OpenAI API Error**:
   - Check `OPENAI_API_KEY` in `.env`
   - Verify API key has sufficient credits

2. **Attachment Processing Fails**:
   - Check temp directory permissions
   - Verify file types are supported

3. **Classification Errors**:
   - Check OpenAI API key and credits
   - Verify model availability

4. **Storage Issues**:
   - Check Supabase storage bucket exists
   - Verify RLS is disabled or policies are set

### Logs:
- Check server console for processing logs
- Email processing logs show progress
- Attachment processing logs show file details

## 📈 **Performance**

- **Email Reading**: ~100 emails per minute
- **Attachment Processing**: Varies by file type and size
- **Classification**: ~1-2 seconds per email
- **Storage**: Optimized for Supabase storage limits

## 🔒 **Security**

- All routes require authentication
- Users can only access their own data
- Attachments are stored with unique filenames
- Temp files are automatically cleaned up
- OpenAI API calls are rate-limited

## 📝 **Next Steps**

1. **Install dependencies**: `npm install`
2. **Configure environment**: Add OpenAI API key
3. **Set up database**: Run SQL scripts
4. **Configure Gmail**: Set up OAuth
5. **Test the system**: Login and check logs
6. **Monitor processing**: Check classification reports

The system is now ready to automatically process, classify, and store relevant emails with full attachment support!
