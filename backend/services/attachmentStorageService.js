const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

class AttachmentStorageService {
    constructor() {
        this.supabase = null;
    }

    getSupabaseClient() {
        if (!this.supabase) {
            if (!process.env.SUPABASE_URL) {
                throw new Error('SUPABASE_URL is missing. Please check your .env file.');
            }
            
            // Use service role key for storage operations if available, otherwise use anon key
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
            
            if (!supabaseKey) {
                throw new Error('Supabase key is missing. Please check your .env file.');
            }
            
            this.supabase = createClient(
                process.env.SUPABASE_URL,
                supabaseKey
            );
        }
        return this.supabase;
    }

    async uploadAttachment(userId, emailId, attachment) {
        try {
            const supabase = this.getSupabaseClient();
            
            // Create a unique path for the attachment
            const filePath = `attachments/${userId}/${emailId}/${attachment.uniqueFilename}`;
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('email-attachments')
                .upload(filePath, attachment.data, {
                    contentType: attachment.mimeType,
                    upsert: false
                });

            if (error) {
                console.error('Error uploading attachment to Supabase:', error);
                throw error;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('email-attachments')
                .getPublicUrl(filePath);

            return {
                success: true,
                filePath: filePath,
                publicUrl: urlData.publicUrl,
                filename: attachment.filename,
                uniqueFilename: attachment.uniqueFilename,
                mimeType: attachment.mimeType,
                size: attachment.size
            };

        } catch (error) {
            console.error('Error in uploadAttachment:', error);
            throw error;
        }
    }

    async downloadAttachment(filePath) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { data, error } = await supabase.storage
                .from('email-attachments')
                .download(filePath);

            if (error) {
                console.error('Error downloading attachment from Supabase:', error);
                throw error;
            }

            return data;

        } catch (error) {
            console.error('Error in downloadAttachment:', error);
            throw error;
        }
    }

    async deleteAttachment(filePath) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { error } = await supabase.storage
                .from('email-attachments')
                .remove([filePath]);

            if (error) {
                console.error('Error deleting attachment from Supabase:', error);
                throw error;
            }

            return { success: true };

        } catch (error) {
            console.error('Error in deleteAttachment:', error);
            throw error;
        }
    }

    async getAttachmentUrl(filePath) {
        try {
            const supabase = this.getSupabaseClient();
            
            const { data } = supabase.storage
                .from('email-attachments')
                .getPublicUrl(filePath);

            return data.publicUrl;

        } catch (error) {
            console.error('Error in getAttachmentUrl:', error);
            throw error;
        }
    }

    async createStorageBucket() {
        try {
            const supabase = this.getSupabaseClient();
            
            // Check if bucket exists
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();
            
            if (listError) {
                console.error('Error listing buckets:', listError);
                // Don't throw error, just log and continue
                console.log('Continuing without storage bucket - will be created manually');
                return { success: false, created: false, error: listError.message };
            }

            const bucketExists = buckets.some(bucket => bucket.name === 'email-attachments');
            
            if (!bucketExists) {
                // Try to create bucket with minimal configuration
                const { data, error } = await supabase.storage.createBucket('email-attachments', {
                    public: true
                });

                if (error) {
                    console.error('Error creating bucket:', error);
                    console.log('Please create the bucket manually in Supabase dashboard:');
                    console.log('1. Go to Storage in your Supabase dashboard');
                    console.log('2. Create a new bucket named "email-attachments"');
                    console.log('3. Set it as public');
                    console.log('4. Restart the server');
                    return { success: false, created: false, error: error.message };
                }

                console.log('Created email-attachments bucket');
                return { success: true, created: true };
            } else {
                console.log('email-attachments bucket already exists');
                return { success: true, created: false };
            }

        } catch (error) {
            console.error('Error in createStorageBucket:', error);
            console.log('Storage bucket creation failed, but server will continue');
            return { success: false, created: false, error: error.message };
        }
    }
}

module.exports = AttachmentStorageService;
