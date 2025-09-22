// Test utility for email integration
// This file can be used to test the email data fetching and transformation

import EmailApiService from '@/services/emailApiService';
import { EmailDataTransformer } from '@/services/emailDataTransformer';

export const testEmailIntegration = async (userId: string) => {
  console.log('🧪 Testing email integration for user:', userId);
  
  try {
    // Test 1: Initialize email API service
    console.log('📧 Test 1: Initializing EmailApiService...');
    const emailService = new EmailApiService();
    console.log('✅ EmailApiService initialized successfully');

    // Test 2: Fetch user emails
    console.log('📧 Test 2: Fetching user emails...');
    const emails = await emailService.fetchUserEmails(userId, 10);
    console.log(`✅ Fetched ${emails.length} emails from backend`);

    // Test 3: Transform email data
    console.log('🔄 Test 3: Transforming email data...');
    const transformedEmails = EmailDataTransformer.transformEmailDataList(emails);
    console.log(`✅ Transformed ${transformedEmails.length} emails for frontend`);

    // Test 4: Fetch email statistics
    console.log('📊 Test 4: Fetching email statistics...');
    const stats = await emailService.fetchEmailStats(userId);
    console.log('✅ Email statistics:', stats);

    // Test 5: Display sample transformed data
    if (transformedEmails.length > 0) {
      console.log('📄 Sample transformed email:');
      console.log(JSON.stringify(transformedEmails[0], null, 2));
    }

    console.log('🎉 All email integration tests passed!');
    return {
      success: true,
      emailCount: emails.length,
      transformedCount: transformedEmails.length,
      stats
    };

  } catch (error) {
    console.error('❌ Email integration test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Export for use in components
export default testEmailIntegration;
