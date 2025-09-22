const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function setupOAuth() {
    try {
        console.log('🔐 Setting up Gmail OAuth authentication...\n');

        // Check if credentials file exists
        const credentialsPath = path.join(__dirname, '../config/credentials.json');
        let credentials;
        try {
            const credentialsFile = await fs.readFile(credentialsPath, 'utf8');
            credentials = JSON.parse(credentialsFile);
        } catch (error) {
            console.error('❌ Credentials file not found!');
            console.log('Please ensure credentials.json is in the config folder.');
            return;
        }

        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Generate auth URL
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        console.log('📱 Step 1: Visit this URL to authorize the application:');
        console.log(authUrl);
        console.log('\n📋 Step 2: After authorization, you will be redirected to a page that shows "This site can\'t be reached"');
        console.log('This is normal! Look at the URL in your browser\'s address bar.');
        console.log('You will see something like: http://localhost/?code=4/0AX4XfWh...');
        console.log('Copy the entire "code" parameter value (everything after "code=")');
        console.log('\n⏳ Waiting for authorization code...');

        // Create readline interface
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const code = await new Promise((resolve) => {
            rl.question('Paste the authorization code here: ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });

        if (!code) {
            console.log('❌ No authorization code provided. Exiting.');
            return;
        }

        // Extract just the code from URL if user pasted the full URL
        let authCode = code;
        if (code.includes('code=')) {
            const urlParams = new URLSearchParams(code.split('?')[1] || '');
            authCode = urlParams.get('code');
            if (!authCode) {
                console.log('❌ Could not extract code from URL. Please paste just the code value.');
                return;
            }
            console.log('✅ Extracted code from URL');
        }

        console.log('🔄 Exchanging code for tokens...');

        // Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(authCode);
        oAuth2Client.setCredentials(tokens);

        // Save tokens to file
        const tokenPath = path.join(__dirname, '../config/token.json');
        await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
        
        console.log('✅ OAuth setup complete!');
        console.log('Token saved to:', tokenPath);
        console.log('\n🎉 You can now run the server and email reading will work automatically!');

    } catch (error) {
        console.error('❌ OAuth setup failed:', error.message);
        if (error.message.includes('invalid_grant')) {
            console.log('\n💡 Tip: The authorization code may have expired. Please try again.');
        }
    }
}

// Run the setup
setupOAuth();
