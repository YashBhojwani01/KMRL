// Test script for complete email processing cycle
require('dotenv').config();
const EmailTriggerService = require('../services/emailTriggerService');

async function testCompleteCycle() {
    try {
        console.log('🚀 Testing Complete Email Processing Cycle');
        console.log('='.repeat(60));
        
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
        
        console.log('\n📧 Starting email processing cycle...');
        
        // Initialize email trigger service
        const emailTriggerService = new EmailTriggerService();
        
        // Test user ID (you can replace this with a real user ID)
        const testUserId = 'edd95471-8754-4130-ac54-02939c225c29';
        
        // Trigger the complete email processing cycle
        const result = await emailTriggerService.triggerEmailReading(testUserId);
        
        console.log('\n📊 Final Results:');
        console.log('='.repeat(40));
        console.log(`✅ Success: ${result.success}`);
        console.log(`📧 Emails Processed: ${result.emailsProcessed}`);
        console.log(`💾 Emails Saved: ${result.emailsSaved}`);
        console.log(`🎯 Relevant Emails: ${result.relevantEmails}`);
        console.log(`⏭️ Skipped: ${result.emailsSkipped}`);
        
        if (result.classificationReport) {
            console.log('\n📈 Classification Report:');
            console.log(`   📧 Total: ${result.classificationReport.total}`);
            console.log(`   🚨 Urgent/High: ${result.classificationReport.urgentHigh}`);
            console.log(`   📂 Categories:`, Object.keys(result.classificationReport.categories).join(', '));
            console.log(`   🏢 Departments:`, Object.keys(result.classificationReport.departments).join(', '));
        }
        
        if (result.dateRange) {
            console.log(`\n📅 Date Range: ${result.dateRange.start} to ${result.dateRange.end}`);
        }
        
        if (result.error) {
            console.log(`\n❌ Error: ${result.error}`);
        }
        
        console.log('\n🎉 Complete email processing cycle test finished!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testCompleteCycle();
