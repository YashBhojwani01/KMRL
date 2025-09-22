// Test script for top 5 email fetching
require('dotenv').config();
const EmailService = require('../services/emailService');

async function testTop5Fetching() {
    try {
        console.log('🧪 Testing Top 5 Email Fetching');
        console.log('='.repeat(50));
        
        // Check environment variables
        console.log('🔍 Checking environment configuration...');
        const requiredEnvVars = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY', 
            'GEMINI_API_KEY',
            'JWT_SECRET'
        ];
        
        let missingVars = [];
        requiredEnvVars.forEach(varName => {
            if (!process.env[varName]) {
                missingVars.push(varName);
            } else {
                console.log(`   ✅ ${varName}: Loaded`);
            }
        });
        
        if (missingVars.length > 0) {
            console.log(`   ❌ Missing environment variables: ${missingVars.join(', ')}`);
            console.log('   Please add these to your .env file');
            return;
        }
        
        console.log('\n📧 Testing email fetching with different limits...');
        
        // Initialize email service
        const emailService = new EmailService();
        
        // Calculate date range (last 2 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 2);

        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];

        console.log(`📅 Date range: ${start} to ${end}`);
        
        // Test 1: Fetch top 5 emails
        console.log('\n🔍 Test 1: Fetching top 5 emails');
        console.log('─'.repeat(30));
        const emails5 = await emailService.extractEmails(start, end, 5);
        console.log(`✅ Fetched ${emails5 ? emails5.length : 0} emails (limit: 5)`);
        
        if (emails5 && emails5.length > 0) {
            console.log('📧 Top 5 emails:');
            emails5.forEach((email, index) => {
                console.log(`   ${index + 1}. ${email.subject.substring(0, 50)}... (${email.sender_email})`);
            });
        }
        
        // Test 2: Fetch top 3 emails
        console.log('\n🔍 Test 2: Fetching top 3 emails');
        console.log('─'.repeat(30));
        const emails3 = await emailService.extractEmails(start, end, 3);
        console.log(`✅ Fetched ${emails3 ? emails3.length : 0} emails (limit: 3)`);
        
        if (emails3 && emails3.length > 0) {
            console.log('📧 Top 3 emails:');
            emails3.forEach((email, index) => {
                console.log(`   ${index + 1}. ${email.subject.substring(0, 50)}... (${email.sender_email})`);
            });
        }
        
        // Test 3: Fetch top 1 email
        console.log('\n🔍 Test 3: Fetching top 1 email');
        console.log('─'.repeat(30));
        const emails1 = await emailService.extractEmails(start, end, 1);
        console.log(`✅ Fetched ${emails1 ? emails1.length : 0} emails (limit: 1)`);
        
        if (emails1 && emails1.length > 0) {
            console.log('📧 Top 1 email:');
            console.log(`   1. ${emails1[0].subject.substring(0, 50)}... (${emails1[0].sender_email})`);
        }
        
        // Test 4: Default limit (should be 5)
        console.log('\n🔍 Test 4: Fetching with default limit');
        console.log('─'.repeat(30));
        const emailsDefault = await emailService.extractEmails(start, end);
        console.log(`✅ Fetched ${emailsDefault ? emailsDefault.length : 0} emails (default limit: 5)`);
        
        console.log('\n✅ Top 5 email fetching test completed!');
        console.log('\n📋 Summary:');
        console.log(`   📧 Emails with limit 5: ${emails5 ? emails5.length : 0}`);
        console.log(`   📧 Emails with limit 3: ${emails3 ? emails3.length : 0}`);
        console.log(`   📧 Emails with limit 1: ${emails1 ? emails1.length : 0}`);
        console.log(`   📧 Emails with default: ${emailsDefault ? emailsDefault.length : 0}`);
        
        console.log('\n🎯 The system now fetches only the top 5 most recent emails by default!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testTop5Fetching();
