// Test script for Google Gemini API integration
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log('🧪 Testing Google Gemini API integration...\n');

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not found in environment variables');
            console.log('Please add GEMINI_API_KEY to your .env file');
            return;
        }

        console.log('✅ GEMINI_API_KEY found in environment');

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('✅ Gemini model initialized (gemini-1.5-flash)');

        // Test classification prompt
        const testEmailData = {
            subject: "Safety Incident Report - Fire Hazard Detected",
            body: "A fire hazard was detected in the main control room. Immediate action required.",
            attachments: [
                {
                    filename: "safety_report.pdf",
                    mimeType: "application/pdf",
                    size: 1024
                }
            ]
        };

        console.log('\n📧 Testing email classification...');
        console.log('Test email:', testEmailData.subject);

        // Create classification prompt
        const prompt = `
        Classify the following email for KMRL (Government Document Management System):

        - Subject: ${testEmailData.subject}
        - Body: ${testEmailData.body}
        - Attachments: ${testEmailData.attachments.map(att => 
            `Filename: ${att.filename}, Type: ${att.mimeType}, Size: ${att.size} bytes`
        ).join('; ')}

        Please classify this email and respond in the following format:
        CATEGORY: [One of: CRITICAL_SAFETY, BUDGET_FINANCE, HR_TRAINING, OPERATIONS, COMPLIANCE_AUDIT, COMMUNICATION, OTHER]
        DEPARTMENT: [One of: Operations, Maintenance, Safety, Engineering, Administration, Finance, Human Resources, IT, Customer Service, Security]
        PRIORITY: [One of: URGENT, HIGH, MEDIUM, LOW]
        REASON: [One sentence explanation]
        `;

        // Generate classification
        const response = await model.generateContent(prompt);
        const classificationText = response.response.text().trim();

        console.log('\n🤖 Gemini Classification Result:');
        console.log(classificationText);

        // Parse the response
        const lines = classificationText.split('\n');
        let category = 'OTHER', department = 'Administration', priority = 'MEDIUM', reason = 'Unable to parse';

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('CATEGORY:')) {
                category = trimmedLine.replace('CATEGORY:', '').trim();
            } else if (trimmedLine.startsWith('DEPARTMENT:')) {
                department = trimmedLine.replace('DEPARTMENT:', '').trim();
            } else if (trimmedLine.startsWith('PRIORITY:')) {
                priority = trimmedLine.replace('PRIORITY:', '').trim();
            } else if (trimmedLine.startsWith('REASON:')) {
                reason = trimmedLine.replace('REASON:', '').trim();
            }
        }

        console.log('\n📊 Parsed Classification:');
        console.log(`Category: ${category}`);
        console.log(`Department: ${department}`);
        console.log(`Priority: ${priority}`);
        console.log(`Reason: ${reason}`);

        console.log('\n✅ Gemini API test completed successfully!');
        console.log('\n🎉 Your email classification system is ready to use!');

    } catch (error) {
        console.error('\n❌ Gemini API test failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('\n💡 Solution: Check your GEMINI_API_KEY in the .env file');
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
            console.log('\n💡 Solution: Check your Gemini API quota');
        } else {
            console.log('\n💡 Solution: Check your internet connection and API key');
        }
    }
}

// Run the test
testGemini();
