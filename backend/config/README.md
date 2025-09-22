# Gmail API Configuration

This directory contains the configuration files needed for Gmail API integration.

## Required Files

1. **credentials.json** - Gmail API credentials file
2. **token.json** - OAuth token file (generated after first authentication)

## Setup Instructions

### 1. Create Gmail API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" > "OAuth client ID"
6. Choose "Desktop application" as the application type
7. Download the credentials file and rename it to `credentials.json`
8. Place the file in this directory: `KMRL/backend/config/credentials.json`

### 2. First Time Authentication

When you first run the application, it will:
1. Generate an OAuth URL
2. You need to visit the URL and complete the authentication
3. Copy the authorization code and save it as `token.json` in this directory

### 3. File Structure

```
KMRL/backend/config/
├── README.md
├── credentials.json (you need to add this)
└── token.json (generated after authentication)
```

## Security Notes

- Never commit `credentials.json` or `token.json` to version control
- These files contain sensitive authentication information
- Add them to your `.gitignore` file
