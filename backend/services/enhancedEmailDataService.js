const { createClient } = require('@supabase/supabase-js');
const AttachmentStorageService = require('./attachmentStorageService');
const AttachmentContentExtractor = require('./attachmentContentExtractor');

class EnhancedEmailDataService {
    constructor() {
        this.supabase = null;
        this.attachmentStorage = new AttachmentStorageService();
        this.contentExtractor = new AttachmentContentExtractor();
    }

    getSupabaseClient() {
        if (!this.supabase) {
            if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
                throw new Error('Supabase configuration is missing. Please check your .env file.');
            }
            this.supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY
            );
        }
        return this.supabase;
    }

    async saveEmailDataWithAttachments(userId, emailData) {
        try {
            const supabase = this.getSupabaseClient();
            
            // First, save the email data
            const { data: emailRecord, error: emailError } = await supabase
                .from('email_data')
                .insert({
                    user_id: userId,
                    sender_email: emailData.sender_email,
                    subject: emailData.subject,
                    body: emailData.body,
                    email_date: emailData.date,
                    filename: emailData.attachments.length > 0 ? emailData.attachments[0].filename : 'No attachment',
                    attachment_link: emailData.attachments.length > 0 ? `attachment_${emailData.id}_${emailData.attachments[0].filename}` : 'N/A',
                    attachment_type: emailData.attachments.length > 0 ? emailData.attachments[0].mimeType : 'None',
                    gmail_message_id: emailData.id,
                    gmail_thread_id: emailData.threadId
                })
                .select()
                .single();

            if (emailError) {
                console.error('Error saving email data:', emailError);
                throw emailError;
            }

            // Process attachments if any
            const attachmentRecords = [];
            if (emailData.attachments && emailData.attachments.length > 0) {
                console.log(`Found ${emailData.attachments.length} attachments, processing...`);
                
                for (const attachment of emailData.attachments) {
                    try {
                        // Check if storage is available
                        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
                            console.log(`Skipping attachment ${attachment.filename} - storage not configured`);
                            continue;
                        }

                        // Upload attachment to Supabase Storage
                        const uploadResult = await this.attachmentStorage.uploadAttachment(
                            userId, 
                            emailData.id, 
                            attachment
                        );

                        if (uploadResult.success) {
                            // Extract content from attachment
                            const contentResult = await this.contentExtractor.extractContent(
                                attachment.data,
                                attachment.fileExtension,
                                attachment.mimeType
                            );

                            // Save attachment record to database
                            const { data: attachmentRecord, error: attachmentError } = await supabase
                                .from('email_attachments')
                                .insert({
                                    email_data_id: emailRecord.id,
                                    original_filename: attachment.filename,
                                    unique_filename: attachment.uniqueFilename,
                                    file_path: uploadResult.filePath,
                                    public_url: uploadResult.publicUrl,
                                    mime_type: attachment.mimeType,
                                    file_size: attachment.size,
                                    file_extension: attachment.fileExtension,
                                    extracted_content: contentResult.content,
                                    extracted_text: contentResult.extractedText,
                                    content_metadata: contentResult.metadata,
                                    is_processed: contentResult.success
                                })
                                .select()
                                .single();

                            if (attachmentError) {
                                console.error('Error saving attachment record:', attachmentError);
                            } else {
                                attachmentRecords.push(attachmentRecord);
                                console.log(`Processed attachment: ${attachment.filename}`);
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing attachment ${attachment.filename}:`, error);
                        // Continue with other attachments even if one fails
                    }
                }
            }

            return {
                emailRecord,
                attachmentRecords,
                attachmentsProcessed: attachmentRecords.length
            };

        } catch (error) {
            console.error('Error in saveEmailDataWithAttachments:', error);
            throw error;
        }
    }

    async getEmailDataWithAttachments(userId, limit = 50, offset = 0) {
        try {
            const supabase = this.getSupabaseClient();
            
            // Get email data with attachments
            const { data: emails, error: emailsError } = await supabase
                .from('email_data')
                .select(`
                    *,
                    email_attachments (
                        id,
                        original_filename,
                        unique_filename,
                        file_path,
                        public_url,
                        mime_type,
                        file_size,
                        file_extension,
                        extracted_content,
                        extracted_text,
                        content_metadata,
                        is_processed
                    )
                `)
                .eq('user_id', userId)
                .order('email_date', { ascending: false })
                .range(offset, offset + limit - 1);

            if (emailsError) {
                console.error('Error fetching email data with attachments:', emailsError);
                throw emailsError;
            }

            return emails;

        } catch (error) {
            console.error('Error in getEmailDataWithAttachments:', error);
            throw error;
        }
    }

    async getAttachmentById(attachmentId) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { data: attachment, error } = await supabase
                .from('email_attachments')
                .select(`
                    *,
                    email_data!inner (
                        user_id,
                        sender_email,
                        subject
                    )
                `)
                .eq('id', attachmentId)
                .single();

            if (error) {
                console.error('Error fetching attachment:', error);
                throw error;
            }

            return attachment;

        } catch (error) {
            console.error('Error in getAttachmentById:', error);
            throw error;
        }
    }

    async getAttachmentsByEmailId(emailDataId) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { data: attachments, error } = await supabase
                .from('email_attachments')
                .select('*')
                .eq('email_data_id', emailDataId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching attachments by email ID:', error);
                throw error;
            }

            return attachments;

        } catch (error) {
            console.error('Error in getAttachmentsByEmailId:', error);
            throw error;
        }
    }

    async searchAttachmentsByContent(userId, searchTerm, fileType = null) {
        try {
            const supabase = this.getSupabaseClient();
            
            let query = supabase
                .from('email_attachments')
                .select(`
                    *,
                    email_data!inner (
                        user_id,
                        sender_email,
                        subject,
                        email_date
                    )
                `)
                .eq('email_data.user_id', userId)
                .or(`extracted_text.ilike.%${searchTerm}%,extracted_content.ilike.%${searchTerm}%`);

            if (fileType) {
                query = query.eq('file_extension', fileType.toLowerCase());
            }

            const { data: attachments, error } = await query;

            if (error) {
                console.error('Error searching attachments:', error);
                throw error;
            }

            return attachments;

        } catch (error) {
            console.error('Error in searchAttachmentsByContent:', error);
            throw error;
        }
    }

    async getAttachmentStats(userId) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { data: stats, error } = await supabase
                .from('email_attachments')
                .select(`
                    file_extension,
                    is_processed,
                    file_size
                `)
                .eq('email_data.user_id', userId);

            if (error) {
                console.error('Error fetching attachment stats:', error);
                throw error;
            }

            const processedStats = {
                total: stats.length,
                processed: stats.filter(s => s.is_processed).length,
                byFileType: {},
                totalSize: 0
            };

            stats.forEach(stat => {
                const ext = stat.file_extension || 'unknown';
                if (!processedStats.byFileType[ext]) {
                    processedStats.byFileType[ext] = 0;
                }
                processedStats.byFileType[ext]++;
                processedStats.totalSize += stat.file_size || 0;
            });

            return processedStats;

        } catch (error) {
            console.error('Error in getAttachmentStats:', error);
            throw error;
        }
    }

    async initializeStorage() {
        try {
            const result = await this.attachmentStorage.createStorageBucket();
            return result;
        } catch (error) {
            console.error('Error initializing storage:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = EnhancedEmailDataService;
