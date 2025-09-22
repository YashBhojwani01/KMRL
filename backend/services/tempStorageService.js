const fs = require('fs').promises;
const path = require('path');

class TempStorageService {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp/attachments');
        this.ensureTempDir();
    }

    async ensureTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (error) {
            console.error('Error creating temp directory:', error);
        }
    }

    async saveAttachment(attachment, emailId) {
        try {
            const timestamp = Date.now();
            const fileExtension = this.getFileExtension(attachment.filename);
            const tempFilename = `${emailId}_${timestamp}_${attachment.filename}`;
            const tempPath = path.join(this.tempDir, tempFilename);

            await fs.writeFile(tempPath, attachment.data);
            
            return {
                success: true,
                tempPath: tempPath,
                tempFilename: tempFilename,
                originalFilename: attachment.filename,
                fileExtension: fileExtension,
                size: attachment.size
            };
        } catch (error) {
            console.error('Error saving attachment to temp storage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAttachment(tempPath) {
        try {
            const data = await fs.readFile(tempPath);
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error reading attachment from temp storage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteAttachment(tempPath) {
        try {
            await fs.unlink(tempPath);
            return { success: true };
        } catch (error) {
            console.error('Error deleting attachment from temp storage:', error);
            return { success: false, error: error.message };
        }
    }

    async cleanupOldFiles(maxAgeHours = 24) {
        try {
            const files = await fs.readdir(this.tempDir);
            const now = Date.now();
            const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds

            let deletedCount = 0;
            for (const file of files) {
                const filePath = path.join(this.tempDir, file);
                const stats = await fs.stat(filePath);
                
                if (now - stats.mtime.getTime() > maxAge) {
                    await fs.unlink(filePath);
                    deletedCount++;
                }
            }

            console.log(`Cleaned up ${deletedCount} old temp files`);
            return { success: true, deletedCount };
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
            return { success: false, error: error.message };
        }
    }

    getFileExtension(filename) {
        const lastDot = filename.lastIndexOf('.');
        return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
    }

    async getTempDirSize() {
        try {
            const files = await fs.readdir(this.tempDir);
            let totalSize = 0;

            for (const file of files) {
                const filePath = path.join(this.tempDir, file);
                const stats = await fs.stat(filePath);
                totalSize += stats.size;
            }

            return {
                success: true,
                size: totalSize,
                fileCount: files.length
            };
        } catch (error) {
            console.error('Error getting temp dir size:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = TempStorageService;
