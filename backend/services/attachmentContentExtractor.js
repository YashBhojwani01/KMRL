const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');
const Tesseract = require('tesseract.js');
const mammoth = require('mammoth');
const csv = require('csv-parser');

class AttachmentContentExtractor {
    constructor() {
        this.supportedTypes = {
            'pdf': this.extractFromPdf.bind(this),
            'txt': this.extractFromText.bind(this),
            'json': this.extractFromJson.bind(this),
            'csv': this.extractFromCsv.bind(this),
            'xlsx': this.extractFromExcel.bind(this),
            'xls': this.extractFromExcel.bind(this),
            'docx': this.extractFromDocx.bind(this),
            'doc': this.extractFromDoc.bind(this),
            'png': this.extractFromImage.bind(this),
            'jpg': this.extractFromImage.bind(this),
            'jpeg': this.extractFromImage.bind(this),
            'gif': this.extractFromImage.bind(this)
        };
    }

    async extractContent(attachmentData, fileExtension, mimeType) {
        try {
            const extractor = this.supportedTypes[fileExtension.toLowerCase()];
            
            if (!extractor) {
                return {
                    success: false,
                    content: `Unsupported file type: ${fileExtension}`,
                    extractedText: '',
                    metadata: { fileType: fileExtension, mimeType }
                };
            }

            const result = await extractor(attachmentData, mimeType);
            return {
                success: true,
                content: result.content,
                extractedText: result.extractedText,
                metadata: {
                    fileType: fileExtension,
                    mimeType: mimeType,
                    wordCount: result.extractedText ? result.extractedText.split(/\s+/).length : 0,
                    charCount: result.extractedText ? result.extractedText.length : 0
                }
            };

        } catch (error) {
            console.error(`Error extracting content from ${fileExtension} file:`, error);
            return {
                success: false,
                content: `Error extracting content: ${error.message}`,
                extractedText: '',
                metadata: { fileType: fileExtension, mimeType, error: error.message }
            };
        }
    }

    async extractFromPdf(attachmentData, mimeType) {
        try {
            const data = await pdfParse(attachmentData);
            return {
                content: data.text,
                extractedText: data.text,
                metadata: {
                    pages: data.numpages,
                    info: data.info
                }
            };
        } catch (error) {
            return {
                content: `Error reading PDF: ${error.message}`,
                extractedText: `Error reading PDF: ${error.message}`
            };
        }
    }

    async extractFromText(attachmentData, mimeType) {
        const text = attachmentData.toString('utf-8');
        return {
            content: text,
            extractedText: text
        };
    }

    async extractFromJson(attachmentData, mimeType) {
        try {
            const jsonString = attachmentData.toString('utf-8');
            const jsonData = JSON.parse(jsonString);
            return {
                content: JSON.stringify(jsonData, null, 2),
                extractedText: JSON.stringify(jsonData, null, 2)
            };
        } catch (error) {
            return {
                content: `Invalid JSON: ${error.message}`,
                extractedText: attachmentData.toString('utf-8')
            };
        }
    }

    async extractFromCsv(attachmentData, mimeType) {
        const csvString = attachmentData.toString('utf-8');
        const lines = csvString.split('\n');
        const extractedText = lines.join('\n');
        
        return {
            content: csvString,
            extractedText: extractedText
        };
    }

    async extractFromExcel(attachmentData, mimeType) {
        try {
            const workbook = XLSX.read(attachmentData, { type: 'buffer' });
            let allText = '';
            
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                allText += `Sheet: ${sheetName}\n`;
                allText += jsonData.map(row => row.join('\t')).join('\n') + '\n\n';
            });
            
            return {
                content: allText,
                extractedText: allText,
                metadata: {
                    sheets: workbook.SheetNames,
                    sheetCount: workbook.SheetNames.length
                }
            };
        } catch (error) {
            return {
                content: `Error reading Excel: ${error.message}`,
                extractedText: `Error reading Excel: ${error.message}`
            };
        }
    }

    async extractFromDocx(attachmentData, mimeType) {
        try {
            const result = await mammoth.extractRawText({ buffer: attachmentData });
            return {
                content: result.value,
                extractedText: result.value,
                metadata: {
                    messages: result.messages
                }
            };
        } catch (error) {
            return {
                content: `Error reading DOCX: ${error.message}`,
                extractedText: `Error reading DOCX: ${error.message}`
            };
        }
    }

    async extractFromDoc(attachmentData, mimeType) {
        // For DOC extraction, you would need additional libraries
        // For now, return a placeholder
        return {
            content: 'DOC content extraction requires additional dependencies',
            extractedText: 'DOC text extraction not implemented yet'
        };
    }

    async extractFromImage(attachmentData, mimeType) {
        try {
            const { data: { text } } = await Tesseract.recognize(attachmentData, 'eng', {
                logger: m => console.log(m)
            });
            return {
                content: text,
                extractedText: text,
                metadata: {
                    confidence: 'OCR confidence not available in this version'
                }
            };
        } catch (error) {
            return {
                content: `Error reading image: ${error.message}`,
                extractedText: `Error reading image: ${error.message}`
            };
        }
    }

    isSupported(fileExtension) {
        return this.supportedTypes.hasOwnProperty(fileExtension.toLowerCase());
    }

    getSupportedTypes() {
        return Object.keys(this.supportedTypes);
    }
}

module.exports = AttachmentContentExtractor;
