const EmailService = require('./emailService');
const EmailDataService = require('./emailDataService');
const EnhancedEmailDataService = require('./enhancedEmailDataService');

class EmailTriggerService {
    constructor() {
        this.emailService = new EmailService();
        this.emailDataService = new EmailDataService();
        this.enhancedEmailDataService = new EnhancedEmailDataService();
    }

    async triggerEmailReading(userId) {
        try {
            console.log(`🚀 Starting complete email processing cycle for user ${userId}`);
            console.log('='.repeat(60));
            
            // Step 1: Read emails from Gmail
            console.log('📧 Step 1: Reading emails from Gmail...');
            
            // Calculate date range (last 2 days)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 2);

            const start = startDate.toISOString().split('T')[0];
            const end = endDate.toISOString().split('T')[0];

            console.log(`📅 Date range: ${start} to ${end}`);
            console.log(`🔢 Fetching top 5 most recent emails`);

            // Extract emails from Gmail (limit to top 5)
            const emails = await this.emailService.extractEmails(start, end, 5);
            
            if (!emails || emails.length === 0) {
                console.log('❌ No emails found for the specified date range');
                return { 
                    success: true, 
                    emailsProcessed: 0, 
                    emailsSaved: 0,
                    relevantEmails: 0,
                    message: 'No emails found' 
                };
            }

            console.log(`✅ Found ${emails.length} emails to process`);

            // Step 2: Process emails with classification and attachment extraction
            console.log('\n🤖 Step 2: Processing emails with AI classification and attachment extraction...');
            const EmailProcessingService = require('./emailProcessingService');
            const processingService = new EmailProcessingService();
            
            const processingResult = await processingService.processEmailsWithClassification(userId, emails);
            
            console.log(`✅ Processing completed:`);
            console.log(`   📊 Total processed: ${processingResult.totalProcessed}`);
            console.log(`   🎯 Relevant emails: ${processingResult.relevantCount}`);
            console.log(`   ❌ Irrelevant emails: ${processingResult.totalProcessed - processingResult.relevantCount}`);

            // Step 3: Generate detailed report
            console.log('\n📈 Step 3: Generating classification report...');
            const report = await processingService.generateClassificationReport(userId);
            
            console.log('📊 Classification Report:');
            console.log(`   📧 Total emails: ${report.total}`);
            console.log(`   🎯 Relevant emails: ${report.urgentHigh} urgent/high priority`);
            console.log(`   📂 Categories:`, Object.keys(report.categories).join(', '));
            console.log(`   🏢 Departments:`, Object.keys(report.departments).join(', '));

            console.log('\n✅ Complete email processing cycle finished successfully!');
            console.log('='.repeat(60));

            return {
                success: true,
                emailsProcessed: processingResult.totalProcessed,
                emailsSaved: processingResult.relevantCount,
                emailsSkipped: processingResult.totalProcessed - processingResult.relevantCount,
                relevantEmails: processingResult.relevantCount,
                classificationReport: report,
                dateRange: { start, end }
            };

        } catch (error) {
            console.error('❌ Error in complete email processing cycle:', error);
            return {
                success: false,
                error: error.message,
                emailsProcessed: 0,
                emailsSaved: 0,
                emailsSkipped: 0,
                relevantEmails: 0
            };
        }
    }

    async getEmailStats(userId) {
        try {
            return await this.emailDataService.getEmailStatsByUserId(userId);
        } catch (error) {
            console.error('Error getting email stats:', error);
            throw error;
        }
    }

    async initializeStorage() {
        try {
            const result = await this.enhancedEmailDataService.initializeStorage();
            if (result.success) {
                console.log('Attachment storage initialized successfully');
            } else {
                console.log('Attachment storage initialization failed, but continuing...');
                console.log('Storage will be created manually in Supabase dashboard');
            }
        } catch (error) {
            console.error('Error initializing storage:', error);
            console.log('Continuing without storage - attachments will not be processed until storage is set up');
        }
    }
}

module.exports = EmailTriggerService;
