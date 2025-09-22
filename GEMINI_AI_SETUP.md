# Gemini AI Integration Setup Guide

## Overview
This guide explains how to set up Google Gemini AI for intelligent email data extraction and classification in the KMRL Metro system.

## Prerequisites
- Google Cloud Platform account
- Gemini API access enabled
- API key generated

## Step 1: Get Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/
   - Sign in with your Google account

2. **Create API Key**
   - Click on "Get API Key" in the left sidebar
   - Click "Create API Key"
   - Choose "Create API key in new project" or select existing project
   - Copy the generated API key

## Step 2: Configure Environment Variables

1. **Update your `.env` file** in the frontend root directory:
   ```env
   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your-actual-gemini-api-key-here
   ```

2. **Replace the placeholder** with your actual API key

## Step 3: Features Enabled by Gemini AI

### Intelligent Data Extraction
- **Key Points**: AI extracts the most important information from email content
- **Action Items**: Automatically identifies tasks and action items
- **Deadlines**: Smart date extraction from various formats
- **Implementation Time**: Extracts project timelines and durations
- **Affected Stations**: Identifies metro stations mentioned in emails

### Enhanced Classification
- **Priority Detection**: AI determines urgency based on content analysis
- **Category Classification**: Automatically categorizes emails (Safety, Budget, Training, etc.)
- **Department Mapping**: Identifies relevant departments
- **Summary Generation**: Creates concise, meaningful summaries

### Smart Date Extraction
The AI can extract dates from various formats:
- `DD/MM/YYYY` (e.g., 22/09/2025)
- `Month DD, YYYY` (e.g., January 20, 2024)
- `YYYY-MM-DD` (e.g., 2024-01-20)
- Relative dates (e.g., "next week", "in 2 days")

### Example Email Processing

**Input Email:**
```
Subject: Safety Protocol Update - Platform Edge Doors Maintenance
Body: All platform edge doors across 22 metro stations require monthly inspections starting January 15th. New emergency protocol: 30-second response time for door malfunction alerts. Mandatory training sessions scheduled for all station controllers and technical staff.
```

**AI Extracted Data:**
```json
{
  "keyPoints": [
    "Monthly inspections required for all 22 metro stations",
    "30-second response time for door malfunction alerts",
    "Mandatory training for station controllers and technical staff"
  ],
  "actionItems": [
    "Schedule monthly inspections starting January 15th",
    "Implement 30-second response protocol",
    "Conduct mandatory training sessions"
  ],
  "deadlineDate": "2025-01-15",
  "affectedStations": "22 metro stations",
  "priority": "HIGH",
  "category": "CRITICAL_SAFETY"
}
```

## Step 4: Fallback Behavior

If Gemini AI is not available or fails:
- The system automatically falls back to basic extraction methods
- Basic regex patterns for date extraction
- Simple keyword-based priority detection
- Manual content parsing for key points

## Step 5: Testing the Integration

1. **Start the frontend**:
   ```bash
   npm run dev
   ```

2. **Check browser console** for Gemini integration logs:
   - Look for "✅ Gemini AI initialized successfully"
   - Watch for extraction progress logs

3. **Verify data quality**:
   - Check if emails show enhanced key points
   - Verify action items are properly extracted
   - Confirm deadlines are accurately identified

## Troubleshooting

### Common Issues

1. **"Gemini API key not found"**
   - Ensure `VITE_GEMINI_API_KEY` is set in your `.env` file
   - Restart the development server after adding the key

2. **"Gemini extraction failed"**
   - Check your API key is valid and active
   - Verify you have sufficient API quota
   - Check browser console for specific error messages

3. **Poor extraction quality**
   - Ensure email content is clear and well-formatted
   - Check if the email contains relevant information
   - Verify the AI prompt is working correctly

### API Quota and Limits

- **Free Tier**: 15 requests per minute
- **Paid Tier**: Higher limits available
- **Rate Limiting**: Built-in retry logic handles temporary failures

## Advanced Configuration

### Customizing Extraction Prompts

You can modify the AI prompts in `src/services/geminiDataExtractionService.ts`:

```typescript
private createExtractionPrompt(subject: string, body: string, senderEmail: string): string {
  // Customize this prompt for your specific needs
  return `Your custom prompt here...`;
}
```

### Adding New Extraction Fields

To extract additional information:

1. Update the `ExtractedData` interface
2. Modify the AI prompt to include new fields
3. Update the parsing logic in `parseGeminiResponse`

## Security Notes

- **API Key Security**: Never commit API keys to version control
- **Environment Variables**: Use `.env` files for local development
- **Production**: Use secure environment variable management in production

## Support

For issues with Gemini AI integration:
1. Check the browser console for error messages
2. Verify your API key and quota
3. Review the fallback extraction logs
4. Contact the development team for assistance

## Performance Impact

- **Initial Load**: Slight delay due to AI processing
- **Caching**: Extracted data is cached for better performance
- **Fallback**: Quick fallback ensures system reliability
- **Batch Processing**: Multiple emails processed in parallel

The Gemini AI integration significantly improves data extraction quality while maintaining system reliability through intelligent fallback mechanisms.
