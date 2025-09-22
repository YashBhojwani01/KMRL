const EmailService = require('../services/emailService');
const EmailDataService = require('../services/emailDataService');

class EmailController {
    constructor() {
        this.emailService = new EmailService();
        this.emailDataService = new EmailDataService();
    }

    async readUserEmails(req, res) {
        try {
            const userId = req.user.id;
            const { startDate, endDate } = req.body;

            // Default to last 2 days if no dates provided
            const defaultEndDate = new Date();
            const defaultStartDate = new Date();
            defaultStartDate.setDate(defaultStartDate.getDate() - 2);

            const start = startDate || defaultStartDate.toISOString().split('T')[0];
            const end = endDate || defaultEndDate.toISOString().split('T')[0];

            console.log(`Reading top 5 emails for user ${userId} from ${start} to ${end}`);

            // Extract emails from Gmail (limit to top 5)
            const emails = await this.emailService.extractEmails(start, end, 5);
            
            if (!emails || emails.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No emails found for the specified date range',
                    data: { emailsProcessed: 0, emailsSaved: 0 }
                });
            }

            let emailsSaved = 0;
            let emailsSkipped = 0;

            // Save each email to database
            for (const email of emails) {
                try {
                    // Check if email already exists
                    const exists = await this.emailDataService.checkEmailExists(email.id);
                    
                    if (!exists) {
                        await this.emailDataService.saveEmailData(userId, email);
                        emailsSaved++;
                    } else {
                        emailsSkipped++;
                    }
                } catch (error) {
                    console.error(`Error saving email ${email.id}:`, error);
                    // Continue with other emails even if one fails
                }
            }

            res.status(200).json({
                success: true,
                message: 'Emails processed successfully',
                data: {
                    emailsProcessed: emails.length,
                    emailsSaved,
                    emailsSkipped,
                    dateRange: { start, end }
                }
            });

        } catch (error) {
            console.error('Error in readUserEmails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to read emails',
                error: error.message
            });
        }
    }

    async getUserEmails(req, res) {
        try {
            const userId = req.user.id;
            const { limit = 50, offset = 0, relevantOnly = false } = req.query;

            let emails;
            if (relevantOnly === 'true') {
                emails = await this.emailDataService.getRelevantEmailsByUserId(userId, parseInt(limit));
            } else {
                emails = await this.emailDataService.getEmailDataByUserId(
                    userId, 
                    parseInt(limit), 
                    parseInt(offset)
                );
            }

            res.status(200).json({
                success: true,
                data: emails
            });

        } catch (error) {
            console.error('Error in getUserEmails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch emails',
                error: error.message
            });
        }
    }

    async getEmailStats(req, res) {
        try {
            const userId = req.user.id;
            const stats = await this.emailDataService.getEmailStatsByUserId(userId);

            res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Error in getEmailStats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch email statistics',
                error: error.message
            });
        }
    }

    async updateEmailRelevance(req, res) {
        try {
            const { emailId } = req.params;
            const { isRelevant, summary, keyPoints } = req.body;
            const userId = req.user.id;

            // Verify the email belongs to the user
            const email = await this.emailDataService.getEmailDataByUserId(userId, 1, 0);
            const userEmail = email.find(e => e.id === emailId);
            
            if (!userEmail) {
                return res.status(404).json({
                    success: false,
                    message: 'Email not found or does not belong to user'
                });
            }

            await this.emailDataService.updateEmailRelevance(emailId, isRelevant, summary, keyPoints);

            res.status(200).json({
                success: true,
                message: 'Email relevance updated successfully'
            });

        } catch (error) {
            console.error('Error in updateEmailRelevance:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update email relevance',
                error: error.message
            });
        }
    }

    async getTopEmails(req, res) {
        try {
            const userId = req.user.id;
            const { limit = 5, relevantOnly = false, priority = null } = req.query;

            console.log(`Fetching top ${limit} emails for user ${userId}`);
            console.log(`Filters - Relevant only: ${relevantOnly}, Priority: ${priority || 'All'}`);

            let emails;
            if (relevantOnly === 'true') {
                // Get top relevant emails
                emails = await this.emailDataService.getRelevantEmailsByUserId(userId, parseInt(limit));
            } else if (priority) {
                // Get top emails by priority
                emails = await this.emailDataService.getEmailsByPriority(userId, priority, parseInt(limit));
            } else {
                // Get top emails overall
                emails = await this.emailDataService.getEmailDataByUserId(
                    userId, 
                    parseInt(limit), 
                    0
                );
            }

            // Sort by priority and date if not already sorted
            if (emails && emails.length > 0) {
                emails.sort((a, b) => {
                    // Priority order: URGENT > HIGH > MEDIUM > LOW
                    const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                    const aPriority = priorityOrder[a.priority_level] || 0;
                    const bPriority = priorityOrder[b.priority_level] || 0;
                    
                    if (aPriority !== bPriority) {
                        return bPriority - aPriority; // Higher priority first
                    }
                    
                    // If same priority, sort by date (newest first)
                    return new Date(b.email_date) - new Date(a.email_date);
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    emails: emails || [],
                    count: emails ? emails.length : 0,
                    filters: {
                        limit: parseInt(limit),
                        relevantOnly: relevantOnly === 'true',
                        priority: priority || 'All'
                    }
                }
            });

        } catch (error) {
            console.error('Error in getTopEmails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch top emails',
                error: error.message
            });
        }
    }

    async cleanupOldEmails(req, res) {
        try {
            const userId = req.user.id;
            const { daysOld = 30 } = req.body;

            await this.emailDataService.deleteOldEmails(userId, daysOld);

            res.status(200).json({
                success: true,
                message: `Old emails older than ${daysOld} days have been cleaned up`
            });

        } catch (error) {
            console.error('Error in cleanupOldEmails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to cleanup old emails',
                error: error.message
            });
        }
    }
}

module.exports = EmailController;
