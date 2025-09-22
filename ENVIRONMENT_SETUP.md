# Environment Setup Instructions

## Frontend Environment Variables

To fix the Supabase configuration error, you need to create a `.env` file in the frontend directory with your Supabase credentials.

### Step 1: Create .env file

Create a file named `.env` in the `KMRL` directory (same level as `package.json`) with the following content:

```env
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=KMRL Metro Insights
VITE_APP_VERSION=1.0.0

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`

### Step 3: Update .env file

Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 4: Restart Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Backend Environment Variables

Make sure your backend `.env` file also has the correct Supabase configuration:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Verification

Once both frontend and backend `.env` files are configured:

1. The Supabase configuration error should disappear
2. Email features will be enabled
3. You can test email reading functionality

## Troubleshooting

- **Still getting errors?** Make sure the `.env` file is in the correct location (same directory as `package.json`)
- **Environment variables not loading?** Restart the development server after creating the `.env` file
- **Supabase connection issues?** Verify your credentials are correct and your Supabase project is active
