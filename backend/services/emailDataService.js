const { createClient } = require('@supabase/supabase-js');

class EmailDataService {
    constructor() {
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

    async saveEmailData(userId, emailData) {
        try {
            const supabase = this.getSupabaseClient();
            const { data, error } = await supabase
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
                });

            if (error) {
                console.error('Error saving email data:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in saveEmailData:', error);
            throw error;
        }
    }

    async getEmailDataByUserId(userId, limit = 50, offset = 0) {
        try {
            const supabase = this.getSupabaseClient();
            const { data, error } = await supabase
                .from('email_data')
                .select('*')
                .eq('user_id', userId)
                .order('email_date', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error('Error fetching email data:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getEmailDataByUserId:', error);
            throw error;
        }
    }

    async getRelevantEmailsByUserId(userId, limit = 20) {
        try {
            const supabase = this.getSupabaseClient();
            const { data, error } = await supabase
                .from('email_data')
                .select('*')
                .eq('user_id', userId)
                .eq('is_relevant', true)
                .order('email_date', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching relevant emails:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getRelevantEmailsByUserId:', error);
            throw error;
        }
    }

    async getEmailsByPriority(userId, priority, limit = 20) {
        try {
            const supabase = this.getSupabaseClient();
            const { data, error } = await supabase
                .from('email_data')
                .select('*')
                .eq('user_id', userId)
                .eq('priority_level', priority)
                .order('email_date', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching emails by priority:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getEmailsByPriority:', error);
            throw error;
        }
    }

    async checkEmailExists(gmailMessageId) {
        try {
            const supabase = this.getSupabaseClient();
            const { data, error } = await supabase
                .from('email_data')
                .select('id')
                .eq('gmail_message_id', gmailMessageId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking email existence:', error);
                throw error;
            }

            return !!data;
        } catch (error) {
            console.error('Error in checkEmailExists:', error);
            throw error;
        }
    }

    async updateEmailRelevance(emailId, isRelevant, summary = null, keyPoints = null) {
        try {
            const supabase = this.getSupabaseClient();
            const updateData = { is_relevant: isRelevant };
            if (summary) updateData.summary = summary;
            if (keyPoints) updateData.key_points = keyPoints;

            const { data, error } = await supabase
                .from('email_data')
                .update(updateData)
                .eq('id', emailId);

            if (error) {
                console.error('Error updating email relevance:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in updateEmailRelevance:', error);
            throw error;
        }
    }

    async getEmailStatsByUserId(userId) {
        try {
            const supabase = this.getSupabaseClient();
            const { data, error } = await supabase
                .from('email_data')
                .select('is_relevant, email_date')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching email stats:', error);
                throw error;
            }

            const stats = {
                total: data.length,
                relevant: data.filter(email => email.is_relevant).length,
                notRelevant: data.filter(email => !email.is_relevant).length,
                today: data.filter(email => {
                    const today = new Date().toISOString().split('T')[0];
                    return email.email_date === today;
                }).length
            };

            return stats;
        } catch (error) {
            console.error('Error in getEmailStatsByUserId:', error);
            throw error;
        }
    }

    async deleteOldEmails(userId, daysOld = 30) {
        try {
            const supabase = this.getSupabaseClient();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('email_data')
                .delete()
                .eq('user_id', userId)
                .lt('email_date', cutoffDateStr);

            if (error) {
                console.error('Error deleting old emails:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in deleteOldEmails:', error);
            throw error;
        }
    }
}

module.exports = EmailDataService;
