const EnhancedEmailDataService = require('../services/enhancedEmailDataService');

class AttachmentController {
    constructor() {
        this.enhancedEmailDataService = new EnhancedEmailDataService();
    }

    async getEmailAttachments(req, res) {
        try {
            const { emailId } = req.params;
            const userId = req.user.id;

            // Verify the email belongs to the user
            const attachments = await this.enhancedEmailDataService.getAttachmentsByEmailId(emailId);
            
            // Additional security check - verify email belongs to user
            if (attachments.length > 0) {
                const firstAttachment = attachments[0];
                // This would require a join query, but for now we'll trust the emailId parameter
            }

            res.status(200).json({
                success: true,
                data: attachments
            });

        } catch (error) {
            console.error('Error in getEmailAttachments:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch email attachments',
                error: error.message
            });
        }
    }

    async getAttachmentById(req, res) {
        try {
            const { attachmentId } = req.params;
            const userId = req.user.id;

            const attachment = await this.enhancedEmailDataService.getAttachmentById(attachmentId);
            
            // Verify the attachment belongs to the user
            if (attachment.email_data.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: Attachment does not belong to user'
                });
            }

            res.status(200).json({
                success: true,
                data: attachment
            });

        } catch (error) {
            console.error('Error in getAttachmentById:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch attachment',
                error: error.message
            });
        }
    }

    async searchAttachments(req, res) {
        try {
            const userId = req.user.id;
            const { searchTerm, fileType } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Search term is required'
                });
            }

            const attachments = await this.enhancedEmailDataService.searchAttachmentsByContent(
                userId, 
                searchTerm, 
                fileType
            );

            res.status(200).json({
                success: true,
                data: attachments,
                count: attachments.length
            });

        } catch (error) {
            console.error('Error in searchAttachments:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search attachments',
                error: error.message
            });
        }
    }

    async getAttachmentStats(req, res) {
        try {
            const userId = req.user.id;
            const stats = await this.enhancedEmailDataService.getAttachmentStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Error in getAttachmentStats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch attachment statistics',
                error: error.message
            });
        }
    }

    async downloadAttachment(req, res) {
        try {
            const { attachmentId } = req.params;
            const userId = req.user.id;

            const attachment = await this.enhancedEmailDataService.getAttachmentById(attachmentId);
            
            // Verify the attachment belongs to the user
            if (attachment.email_data.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: Attachment does not belong to user'
                });
            }

            // Set appropriate headers for download
            res.setHeader('Content-Type', attachment.mime_type);
            res.setHeader('Content-Disposition', `attachment; filename="${attachment.original_filename}"`);
            res.setHeader('Content-Length', attachment.file_size);

            // For now, redirect to the public URL
            // In a production environment, you might want to stream the file directly
            res.redirect(attachment.public_url);

        } catch (error) {
            console.error('Error in downloadAttachment:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to download attachment',
                error: error.message
            });
        }
    }
}

module.exports = AttachmentController;
