const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const cheerio = require('cheerio');

class EmailService {
    constructor() {
        this.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
        this.service = null;
    }

    async authenticate() {
        try {
            // Check if we have credentials file
            const credentialsPath = path.join(__dirname, '../config/credentials.json');
            const tokenPath = path.join(__dirname, '../config/token.json');
            
            let credentials;
            try {
                const credentialsFile = await fs.readFile(credentialsPath, 'utf8');
                credentials = JSON.parse(credentialsFile);
            } catch (error) {
                throw new Error('Credentials file not found. Please add credentials.json to the config folder.');
            }

            // Check if we have existing token
            let token;
            try {
                const tokenFile = await fs.readFile(tokenPath, 'utf8');
                token = JSON.parse(tokenFile);
            } catch (error) {
                // No existing token, need to authenticate
                return await this.authenticateWithOAuth(credentials);
            }

            // Use existing token
            const auth = new OAuth2Client();
            auth.setCredentials(token);

            // Check if token is expired and refresh if needed
            if (token.expiry_date && Date.now() >= token.expiry_date) {
                try {
                    const { credentials: newToken } = await auth.refreshAccessToken();
                    auth.setCredentials(newToken);
                    await fs.writeFile(tokenPath, JSON.stringify(newToken, null, 2));
                } catch (error) {
                    console.log('Token refresh failed, re-authenticating...');
                    return await this.authenticateWithOAuth(credentials);
                }
            }

            this.service = google.gmail({ version: 'v1', auth });
            return this.service;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    async authenticateWithOAuth(credentials) {
        console.log('\n🔐 Gmail OAuth authentication required!');
        console.log('Please run the OAuth setup script:');
        console.log('node scripts/oauth-setup.js');
        console.log('\nThis will guide you through the authentication process.');
        
        throw new Error('OAuth authentication required. Please run: node scripts/oauth-setup.js');
    }

    async extractEmails(startDate, endDate, limit = 5) {
        try {
            if (!this.service) {
                await this.authenticate();
            }

            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
            const adjustedEndDateStr = adjustedEndDate.toISOString().split('T')[0];

            const query = `after:${startDate} before:${adjustedEndDateStr}`;
            const response = await this.service.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: limit
            });

            const messages = response.data.messages || [];
            const emailData = [];

            for (const message of messages) {
                try {
                    const msgResponse = await this.service.users.messages.get({
                        userId: 'me',
                        id: message.id,
                        format: 'full'
                    });

                    const email = await this.extractEmailDetails(msgResponse.data);
                    if (email) {
                        emailData.push(email);
                    }
                } catch (error) {
                    console.error(`Error processing message ${message.id}:`, error);
                }
            }

            return emailData;
        } catch (error) {
            console.error('Error extracting emails:', error);
            throw error;
        }
    }

    async extractEmailDetails(message) {
        try {
            const payload = message.payload;
            const headers = payload.headers || [];

            // Extract basic email information
            const sender = this.getHeaderValue(headers, 'From') || 'Unknown';
            const subject = this.getHeaderValue(headers, 'Subject') || 'No Subject';
            const dateHeader = this.getHeaderValue(headers, 'Date') || 'Unknown Date';
            const emailDate = this.parseEmailDate(dateHeader);

            // Extract email body
            const body = this.extractBody(payload);

            // Extract and download attachments
            const attachments = await this.extractAndDownloadAttachments(payload, message.id);

            return {
                id: message.id,
                sender_email: sender,
                subject: subject,
                body: body,
                date: emailDate,
                attachments: attachments,
                threadId: message.threadId
            };
        } catch (error) {
            console.error('Error extracting email details:', error);
            return null;
        }
    }

    getHeaderValue(headers, name) {
        const header = headers.find(h => h.name === name);
        return header ? header.value : null;
    }

    parseEmailDate(dateHeader) {
        try {
            // Remove timezone info in parentheses
            const cleanDate = dateHeader.replace(/\s*\(.*\)$/, '');
            const date = new Date(cleanDate);
            return date.toISOString().split('T')[0];
        } catch (error) {
            return 'Unknown Date';
        }
    }

    extractBody(payload) {
        let body = '';
        
        if (payload.body && payload.body.data) {
            body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        } else if (payload.parts) {
            for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' && part.body && part.body.data) {
                    body += Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
                    const htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
                    body += this.stripHtml(htmlContent);
                } else if (part.parts) {
                    body += this.extractBody(part);
                }
            }
        }

        return body.trim() || 'No Content Available';
    }

    stripHtml(html) {
        const $ = cheerio.load(html);
        return $.text();
    }

    async extractAndDownloadAttachments(payload, messageId) {
        const attachments = [];
        
        if (payload.parts) {
            for (const part of payload.parts) {
                if (part.filename && part.body && part.body.attachmentId) {
                    try {
                        // Download attachment data
                        const attachmentData = await this.downloadAttachment(messageId, part.body.attachmentId);
                        
                        // Generate unique filename
                        const timestamp = Date.now();
                        const fileExtension = this.getFileExtension(part.filename);
                        const uniqueFilename = `${messageId}_${timestamp}_${part.filename}`;
                        
                        attachments.push({
                            filename: part.filename,
                            uniqueFilename: uniqueFilename,
                            mimeType: part.mimeType,
                            size: part.body.size,
                            attachmentId: part.body.attachmentId,
                            messageId: messageId,
                            data: attachmentData,
                            fileExtension: fileExtension
                        });
                    } catch (error) {
                        console.error(`Error downloading attachment ${part.filename}:`, error);
                        // Still add attachment info but without data
                        attachments.push({
                            filename: part.filename,
                            mimeType: part.mimeType,
                            size: part.body.size,
                            attachmentId: part.body.attachmentId,
                            messageId: messageId,
                            error: error.message
                        });
                    }
                }
            }
        }

        return attachments;
    }

    getFileExtension(filename) {
        const lastDot = filename.lastIndexOf('.');
        return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
    }

    async downloadAttachment(messageId, attachmentId) {
        try {
            if (!this.service) {
                await this.authenticate();
            }

            const response = await this.service.users.messages.attachments.get({
                userId: 'me',
                messageId: messageId,
                id: attachmentId
            });

            return Buffer.from(response.data.data, 'base64');
        } catch (error) {
            console.error('Error downloading attachment:', error);
            throw error;
        }
    }
}

module.exports = EmailService;