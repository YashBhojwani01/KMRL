const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Email Integration for KMRL Metro...\n');

// Check if config directory exists
const configDir = path.join(__dirname, '../config');
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log('✅ Created config directory');
}

// Check if credentials.json exists
const credentialsPath = path.join(configDir, 'credentials.json');
if (!fs.existsSync(credentialsPath)) {
    console.log('❌ Gmail API credentials not found!');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable the Gmail API');
    console.log('4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"');
    console.log('5. Choose "Desktop application"');
    console.log('6. Download the credentials file');
    console.log('7. Rename it to "credentials.json"');
    console.log('8. Place it in: backend/config/credentials.json');
    console.log('\n⚠️  The application will not work without this file!');
} else {
    console.log('✅ Gmail API credentials found');
}

// Check if token.json exists
const tokenPath = path.join(configDir, 'token.json');
if (!fs.existsSync(tokenPath)) {
    console.log('⚠️  Gmail OAuth token not found');
    console.log('   This will be generated automatically on first run');
} else {
    console.log('✅ Gmail OAuth token found');
}

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found');
    console.log('   Copy env.example to .env and fill in your values');
} else {
    console.log('✅ .env file found');
}

console.log('\n📦 Installing dependencies...');
console.log('   Run: npm install');

console.log('\n🗄️  Database Setup:');
console.log('   Run the SQL script: database/email_data_table.sql');

console.log('\n🎯 Next Steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Set up your .env file with Supabase credentials');
console.log('3. Add Gmail API credentials to config/credentials.json');
console.log('4. Run the database migration: email_data_table.sql');
console.log('5. Start the server: npm start');
console.log('6. Login to trigger email reading');

console.log('\n✨ Email integration setup complete!');
