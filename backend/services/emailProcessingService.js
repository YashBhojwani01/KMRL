const EmailClassificationService = require('./emailClassificationService');
const TempStorageService = require('./tempStorageService');
const AttachmentContentExtractor = require('./attachmentContentExtractor');
const { createClient } = require('@supabase/supabase-js');

class EmailProcessingService {
    constructor() {
        this.classificationService = new EmailClassificationService();
        this.tempStorage = new TempStorageService();
        this.contentExtractor = new AttachmentContentExtractor();
        this.supabase = null;
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

    async processEmailsWithClassification(userId, emails) {
        try {
            console.log(`🔄 Processing ${emails.length} emails with AI classification and attachment extraction...`);
            console.log('─'.repeat(50));
            
            const processedEmails = [];
            const relevantEmails = [];
            let classificationCount = 0;
            let attachmentCount = 0;

            for (let i = 0; i < emails.length; i++) {
                const email = emails[i];
                console.log(`\n📧 [${i + 1}/${emails.length}] Processing: ${email.subject.substring(0, 50)}...`);

                try {
                    // Step 1: AI Classification
                    console.log(`   🤖 Classifying email...`);
                    const classification = await this.classificationService.classifyEmail(email);
                    classificationCount++;
                    
                    console.log(`   📊 Classification: ${classification.category} | ${classification.department} | ${classification.priority}`);
                    
                    // Step 2: Process attachments
                    let processedAttachments = [];
                    if (email.attachments && email.attachments.length > 0) {
                        console.log(`   📎 Processing ${email.attachments.length} attachment(s)...`);
                        processedAttachments = await this.processAttachments(email.attachments, email.id);
                        attachmentCount += processedAttachments.length;
                        
                        processedAttachments.forEach((att, idx) => {
                            console.log(`      📄 Attachment ${idx + 1}: ${att.originalFilename} (${att.fileExtension}) - ${att.isProcessed ? '✅ Processed' : '❌ Failed'}`);
                        });
                    } else {
                        console.log(`   📎 No attachments found`);
                    }

                    // Step 3: Determine relevance
                    const isRelevant = this.isRelevantEmail(classification, processedAttachments);
                    console.log(`   🎯 Relevance: ${isRelevant ? '✅ RELEVANT' : '❌ Not relevant'}`);

                    const processedEmail = {
                        ...email,
                        classification,
                        processedAttachments,
                        isRelevant
                    };

                    processedEmails.push(processedEmail);

                    // If relevant, add to relevant emails list
                    if (processedEmail.isRelevant) {
                        relevantEmails.push(processedEmail);
                        console.log(`   💾 Will save to database`);
                    } else {
                        console.log(`   🗑️ Skipping (not relevant)`);
                    }

                } catch (error) {
                    console.error(`   ❌ Error processing email ${email.id}:`, error.message);
                    // Add email with default classification
                    processedEmails.push({
                        ...email,
                        classification: {
                            category: 'OTHER',
                            department: 'Administration',
                            priority: 'MEDIUM',
                            reason: `Processing failed: ${error.message}`
                        },
                        processedAttachments: [],
                        isRelevant: false
                    });
                }
            }

            console.log('\n💾 Saving relevant emails to database...');
            // Save relevant emails to database
            if (relevantEmails.length > 0) {
                await this.saveRelevantEmails(userId, relevantEmails);
                console.log(`✅ Saved ${relevantEmails.length} relevant emails to database`);
            } else {
                console.log(`ℹ️ No relevant emails to save`);
            }

            console.log('\n📊 Processing Summary:');
            console.log(`   📧 Total emails processed: ${processedEmails.length}`);
            console.log(`   🤖 AI classifications: ${classificationCount}`);
            console.log(`   📎 Attachments processed: ${attachmentCount}`);
            console.log(`   🎯 Relevant emails: ${relevantEmails.length}`);
            console.log(`   ❌ Irrelevant emails: ${processedEmails.length - relevantEmails.length}`);

            return {
                totalProcessed: processedEmails.length,
                relevantCount: relevantEmails.length,
                processedEmails,
                relevantEmails
            };

        } catch (error) {
            console.error('❌ Error in processEmailsWithClassification:', error);
            throw error;
        }
    }

    async processAttachments(attachments, emailId) {
        const processedAttachments = [];

        for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            console.log(`      📄 [${i + 1}/${attachments.length}] Processing: ${attachment.filename}`);

            try {
                // Step 1: Save to temp storage
                console.log(`         💾 Saving to temporary storage...`);
                const tempResult = await this.tempStorage.saveAttachment(attachment, emailId);
                
                if (tempResult.success) {
                    console.log(`         ✅ Saved to: ${tempResult.tempFilename}`);
                    
                    // Step 2: Extract content
                    console.log(`         🔍 Extracting content from ${attachment.fileExtension} file...`);
                    const contentResult = await this.contentExtractor.extractContent(
                        attachment.data,
                        attachment.fileExtension,
                        attachment.mimeType
                    );

                    if (contentResult.success) {
                        console.log(`         ✅ Content extracted: ${contentResult.extractedText ? contentResult.extractedText.length : 0} characters`);
                    } else {
                        console.log(`         ⚠️ Content extraction failed: ${contentResult.error || 'Unknown error'}`);
                    }

                    processedAttachments.push({
                        ...attachment,
                        tempPath: tempResult.tempPath,
                        tempFilename: tempResult.tempFilename,
                        extractedContent: contentResult.content,
                        extractedText: contentResult.extractedText,
                        contentMetadata: contentResult.metadata,
                        isProcessed: contentResult.success
                    });
                } else {
                    console.log(`         ❌ Failed to save to temp storage: ${tempResult.error}`);
                    processedAttachments.push({
                        ...attachment,
                        error: tempResult.error,
                        isProcessed: false
                    });
                }
            } catch (error) {
                console.error(`         ❌ Error processing attachment ${attachment.filename}:`, error.message);
                processedAttachments.push({
                    ...attachment,
                    error: error.message,
                    isProcessed: false
                });
            }
        }

        return processedAttachments;
    }

    isRelevantEmail(classification, attachments) {
        // Define relevance criteria
        const relevantCategories = [
            'CRITICAL_SAFETY',
            'BUDGET_FINANCE',
            'HR_TRAINING',
            'OPERATIONS',
            'COMPLIANCE_AUDIT'
        ];

        const highPriority = ['URGENT', 'HIGH'];

        // Check if email has relevant category
        const hasRelevantCategory = relevantCategories.includes(classification.category);
        
        // Check if email has high priority
        const hasHighPriority = highPriority.includes(classification.priority);
        
        // Check if email has attachments
        const hasAttachments = attachments && attachments.length > 0;

        // Email is relevant if it meets any of these criteria
        return hasRelevantCategory || hasHighPriority || hasAttachments;
    }

    async saveRelevantEmails(userId, relevantEmails) {
        try {
            console.log(`💾 Saving ${relevantEmails.length} relevant emails to database...`);
            const supabase = this.getSupabaseClient();
            let savedEmails = 0;
            let savedAttachments = 0;
            
            for (let i = 0; i < relevantEmails.length; i++) {
                const email = relevantEmails[i];
                console.log(`   📧 [${i + 1}/${relevantEmails.length}] Saving: ${email.subject.substring(0, 40)}...`);

                try {
                    // Save email data with classification
                    console.log(`      💾 Saving email data...`);
                    const { data: emailRecord, error: emailError } = await supabase
                        .from('email_data')
                        .insert({
                            user_id: userId,
                            sender_email: email.sender_email,
                            subject: email.subject,
                            body: email.body,
                            email_date: email.date,
                            gmail_message_id: email.id,
                            gmail_thread_id: email.threadId,
                            is_relevant: true,
                            is_processed: true,
                            processing_status: 'completed',
                            document_category: email.classification.category,
                            department: email.classification.department,
                            priority_level: email.classification.priority,
                            classification_reason: email.classification.reason,
                            summary: email.classification.reason,
                            key_points: `Category: ${email.classification.category}, Department: ${email.classification.department}, Priority: ${email.classification.priority}`
                        })
                        .select()
                        .single();

                    if (emailError) {
                        console.error(`      ❌ Error saving email:`, emailError.message);
                        continue;
                    }

                    console.log(`      ✅ Email saved with ID: ${emailRecord.id}`);
                    savedEmails++;

                    // Save attachments if any
                    if (email.processedAttachments && email.processedAttachments.length > 0) {
                        console.log(`      📎 Saving ${email.processedAttachments.length} attachment(s)...`);
                        
                        for (let j = 0; j < email.processedAttachments.length; j++) {
                            const attachment = email.processedAttachments[j];
                            console.log(`         📄 [${j + 1}/${email.processedAttachments.length}] ${attachment.filename}`);
                            
                            try {
                                const { error: attachmentError } = await supabase
                                    .from('email_attachments')
                                    .insert({
                                        email_data_id: emailRecord.id,
                                        original_filename: attachment.filename,
                                        unique_filename: attachment.tempFilename,
                                        file_path: attachment.tempPath,
                                        mime_type: attachment.mimeType,
                                        file_size: attachment.size,
                                        file_extension: attachment.fileExtension,
                                        extracted_content: attachment.extractedContent,
                                        extracted_text: attachment.extractedText,
                                        content_metadata: attachment.contentMetadata,
                                        is_processed: attachment.isProcessed,
                                        processing_status: attachment.isProcessed ? 'completed' : 'failed',
                                        error_message: attachment.error || null
                                    });

                                if (attachmentError) {
                                    console.error(`         ❌ Error saving attachment:`, attachmentError.message);
                                } else {
                                    console.log(`         ✅ Attachment saved`);
                                    savedAttachments++;
                                }
                            } catch (attachmentError) {
                                console.error(`         ❌ Error saving attachment:`, attachmentError.message);
                            }
                        }
                    } else {
                        console.log(`      📎 No attachments to save`);
                    }

                } catch (error) {
                    console.error(`   ❌ Error processing email ${email.id}:`, error.message);
                }
            }

            console.log(`\n💾 Database Save Summary:`);
            console.log(`   📧 Emails saved: ${savedEmails}/${relevantEmails.length}`);
            console.log(`   📎 Attachments saved: ${savedAttachments}`);

        } catch (error) {
            console.error('❌ Error saving relevant emails:', error);
            throw error;
        }
    }

    async getRelevantEmailsDataFrame(userId) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { data: emails, error } = await supabase
                .from('email_data')
                .select(`
                    *,
                    email_attachments (
                        original_filename,
                        file_extension,
                        extracted_content,
                        extracted_text,
                        mime_type
                    )
                `)
                .eq('user_id', userId)
                .eq('is_relevant', true)
                .order('email_date', { ascending: false });

            if (error) {
                throw error;
            }

            // Transform to DataFrame-like structure
            const dataFrame = emails.map(email => ({
                sender_email: email.sender_email,
                subject: email.subject,
                body: email.body,
                email_date: email.email_date,
                attachment_link: email.email_attachments?.[0]?.file_path || 'N/A',
                attachment_type: email.email_attachments?.[0]?.mime_type || 'None',
                storage_id: email.email_attachments?.[0]?.id || null,
                extracted_information_from_attachment: email.email_attachments?.[0]?.extracted_text || '',
                document_category: this.extractCategoryFromKeyPoints(email.key_points),
                department: this.extractDepartmentFromKeyPoints(email.key_points),
                priority_level: this.extractPriorityFromKeyPoints(email.key_points),
                classification_reason: email.summary
            }));

            return dataFrame;

        } catch (error) {
            console.error('Error getting relevant emails DataFrame:', error);
            throw error;
        }
    }

    extractCategoryFromKeyPoints(keyPoints) {
        if (!keyPoints) return 'OTHER';
        const match = keyPoints.match(/Category: (\w+)/);
        return match ? match[1] : 'OTHER';
    }

    extractDepartmentFromKeyPoints(keyPoints) {
        if (!keyPoints) return 'Administration';
        const match = keyPoints.match(/Department: (\w+)/);
        return match ? match[1] : 'Administration';
    }

    extractPriorityFromKeyPoints(keyPoints) {
        if (!keyPoints) return 'MEDIUM';
        const match = keyPoints.match(/Priority: (\w+)/);
        return match ? match[1] : 'MEDIUM';
    }

    async generateClassificationReport(userId) {
        try {
            const dataFrame = await this.getRelevantEmailsDataFrame(userId);
            
            const report = {
                total: dataFrame.length,
                categories: {},
                departments: {},
                priorities: {},
                urgentHigh: 0
            };

            dataFrame.forEach(email => {
                // Count categories
                report.categories[email.document_category] = 
                    (report.categories[email.document_category] || 0) + 1;
                
                // Count departments
                report.departments[email.department] = 
                    (report.departments[email.department] || 0) + 1;
                
                // Count priorities
                report.priorities[email.priority_level] = 
                    (report.priorities[email.priority_level] || 0) + 1;
                
                // Count urgent/high priority
                if (['URGENT', 'HIGH'].includes(email.priority_level)) {
                    report.urgentHigh++;
                }
            });

            return report;

        } catch (error) {
            console.error('Error generating classification report:', error);
            throw error;
        }
    }

    async cleanupTempFiles() {
        try {
            const result = await this.tempStorage.cleanupOldFiles(24); // 24 hours
            return result;
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
            throw error;
        }
    }
}

module.exports = EmailProcessingService;
