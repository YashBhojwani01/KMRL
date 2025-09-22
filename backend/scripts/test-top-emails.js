// Test script for top emails functionality
require('dotenv').config();
const EmailController = require('../controllers/emailController');

async function testTopEmails() {
    try {
        console.log('🧪 Testing Top Emails Functionality');
        console.log('='.repeat(50));
        
        // Check environment variables
        console.log('🔍 Checking environment configuration...');
        const requiredEnvVars = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY', 
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
        
        console.log('\n📧 Testing different top email scenarios...');
        
        // Initialize email controller
        const emailController = new EmailController();
        
        // Mock request objects for testing
        const mockReq = {
            user: { id: 'edd95471-8754-4130-ac54-02939c225c29' },
            query: {}
        };
        
        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    console.log(`\n📊 Response (Status ${code}):`);
                    console.log(JSON.stringify(data, null, 2));
                    return data;
                }
            })
        };
        
        // Test 1: Get top 5 emails overall
        console.log('\n🔍 Test 1: Top 5 emails overall');
        console.log('─'.repeat(30));
        mockReq.query = { limit: 5 };
        await emailController.getTopEmails(mockReq, mockRes);
        
        // Test 2: Get top 3 relevant emails only
        console.log('\n🔍 Test 2: Top 3 relevant emails only');
        console.log('─'.repeat(30));
        mockReq.query = { limit: 3, relevantOnly: 'true' };
        await emailController.getTopEmails(mockReq, mockRes);
        
        // Test 3: Get top 5 URGENT priority emails
        console.log('\n🔍 Test 3: Top 5 URGENT priority emails');
        console.log('─'.repeat(30));
        mockReq.query = { limit: 5, priority: 'URGENT' };
        await emailController.getTopEmails(mockReq, mockRes);
        
        // Test 4: Get top 3 HIGH priority emails
        console.log('\n🔍 Test 4: Top 3 HIGH priority emails');
        console.log('─'.repeat(30));
        mockReq.query = { limit: 3, priority: 'HIGH' };
        await emailController.getTopEmails(mockReq, mockRes);
        
        // Test 5: Get top 10 emails with all filters
        console.log('\n🔍 Test 5: Top 10 relevant URGENT emails');
        console.log('─'.repeat(30));
        mockReq.query = { limit: 10, relevantOnly: 'true', priority: 'URGENT' };
        await emailController.getTopEmails(mockReq, mockRes);
        
        console.log('\n✅ Top emails functionality test completed!');
        console.log('\n📋 Available API Endpoints:');
        console.log('   GET /api/emails/top?limit=5');
        console.log('   GET /api/emails/top?limit=5&relevantOnly=true');
        console.log('   GET /api/emails/top?limit=5&priority=URGENT');
        console.log('   GET /api/emails/top?limit=5&relevantOnly=true&priority=HIGH');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testTopEmails();
