const EmailProcessingService = require('../services/emailProcessingService');

class EmailProcessingController {
    constructor() {
        this.emailProcessingService = new EmailProcessingService();
    }

    async processUserEmails(req, res) {
        try {
            const userId = req.user.id;
            const { startDate, endDate } = req.body;

            // Get emails from database
            const supabase = this.emailProcessingService.getSupabaseClient();
            const { data: emails, error } = await supabase
                .from('email_data')
                .select('*')
                .eq('user_id', userId)
                .gte('email_date', startDate || new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                .lte('email_date', endDate || new Date().toISOString().split('T')[0])
                .order('email_date', { ascending: false });

            if (error) {
                throw error;
            }

            // Process emails with classification
            const result = await this.emailProcessingService.processEmailsWithClassification(userId, emails);

            res.status(200).json({
                success: true,
                message: 'Email processing completed',
                data: {
                    totalProcessed: result.totalProcessed,
                    relevantCount: result.relevantCount,
                    processingSummary: {
                        totalEmails: emails.length,
                        relevantEmails: result.relevantCount,
                        irrelevantEmails: result.totalProcessed - result.relevantCount
                    }
                }
            });

        } catch (error) {
            console.error('Error in processUserEmails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process emails',
                error: error.message
            });
        }
    }

    async getRelevantEmailsDataFrame(req, res) {
        try {
            const userId = req.user.id;
            const dataFrame = await this.emailProcessingService.getRelevantEmailsDataFrame(userId);

            res.status(200).json({
                success: true,
                data: dataFrame,
                count: dataFrame.length
            });

        } catch (error) {
            console.error('Error in getRelevantEmailsDataFrame:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get relevant emails DataFrame',
                error: error.message
            });
        }
    }

    async getClassificationReport(req, res) {
        try {
            const userId = req.user.id;
            const report = await this.emailProcessingService.generateClassificationReport(userId);

            res.status(200).json({
                success: true,
                data: report
            });

        } catch (error) {
            console.error('Error in getClassificationReport:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate classification report',
                error: error.message
            });
        }
    }

    async classifySingleEmail(req, res) {
        try {
            const { emailId } = req.params;
            const userId = req.user.id;

            // Get email from database
            const supabase = this.emailProcessingService.getSupabaseClient();
            const { data: email, error } = await supabase
                .from('email_data')
                .select('*')
                .eq('id', emailId)
                .eq('user_id', userId)
                .single();

            if (error || !email) {
                return res.status(404).json({
                    success: false,
                    message: 'Email not found'
                });
            }

            // Classify the email
            const classification = await this.emailProcessingService.classificationService.classifyEmail(email);

            // Update email with classification
            const { error: updateError } = await supabase
                .from('email_data')
                .update({
                    is_relevant: this.emailProcessingService.isRelevantEmail(classification, []),
                    summary: classification.reason,
                    key_points: `Category: ${classification.category}, Department: ${classification.department}, Priority: ${classification.priority}`
                })
                .eq('id', emailId);

            if (updateError) {
                throw updateError;
            }

            res.status(200).json({
                success: true,
                data: {
                    email: email,
                    classification: classification
                }
            });

        } catch (error) {
            console.error('Error in classifySingleEmail:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to classify email',
                error: error.message
            });
        }
    }

    async cleanupTempFiles(req, res) {
        try {
            const result = await this.emailProcessingService.cleanupTempFiles();

            res.status(200).json({
                success: true,
                message: 'Temp files cleanup completed',
                data: result
            });

        } catch (error) {
            console.error('Error in cleanupTempFiles:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to cleanup temp files',
                error: error.message
            });
        }
    }

    async getTempStorageStats(req, res) {
        try {
            const stats = await this.emailProcessingService.tempStorage.getTempDirSize();

            res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Error in getTempStorageStats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get temp storage stats',
                error: error.message
            });
        }
    }
}

module.exports = EmailProcessingController;
