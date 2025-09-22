import { BackendEmailData, FrontendEmailData } from './emailApiService';
import GeminiDataExtractionService from './geminiDataExtractionService';

export class EmailDataTransformer {
  private static geminiService = new GeminiDataExtractionService();

  // Convert backend email data to frontend format
  static async transformEmailData(backendData: BackendEmailData): Promise<FrontendEmailData> {
    // Use Gemini AI for intelligent data extraction
    const extractedData = await this.geminiService.extractEmailData(
      backendData.subject,
      backendData.body,
      backendData.sender_email
    );

    return {
      id: backendData.id,
      title: extractedData.shortTitle || backendData.subject,
      department: this.mapDepartment(backendData.department) || extractedData.metadata.department,
      category: this.mapCategory(backendData.document_category) || extractedData.metadata.category,
      urgency: this.mapPriority(backendData.priority_level) || this.mapPriority(extractedData.metadata.urgency),
      date: this.formatDate(backendData.email_date),
      author: this.extractAuthorName(backendData.sender_email),
      summary: extractedData.summary || backendData.summary || backendData.classification_reason || 'No summary available',
      language: this.detectLanguage(backendData.body),
      fileType: this.mapFileType(backendData.attachment_type),
      fileSize: this.calculateFileSize(backendData.attachment_link),
      status: this.mapProcessingStatus(backendData.processing_status),
      contentTags: this.extractContentTags(backendData),
      senderEmail: backendData.sender_email,
      body: backendData.body,
      hasDeadline: this.hasDeadline(backendData) || !!extractedData.deadlineDate,
      deadlineDate: extractedData.deadlineDate || this.calculateDeadlineDate(backendData),
      implementationTime: extractedData.implementationTime || this.extractImplementationTime(backendData),
      affectedStations: extractedData.affectedStations || this.extractAffectedStations(backendData),
      actionItems: extractedData.actionItems.length > 0 ? extractedData.actionItems : this.extractActionItems(backendData),
      keyPoints: extractedData.keyPoints.length > 0 ? extractedData.keyPoints : this.extractDetailedKeyPoints(backendData),
      attachmentInfo: {
        filename: backendData.filename,
        attachmentLink: backendData.attachment_link,
        attachmentType: backendData.attachment_type
      },
      classificationInfo: {
        documentCategory: backendData.document_category || extractedData.metadata.category,
        department: backendData.department || extractedData.metadata.department,
        priorityLevel: backendData.priority_level || extractedData.metadata.urgency,
        classificationReason: backendData.classification_reason
      },
      processingInfo: {
        isProcessed: backendData.is_processed,
        processingStatus: backendData.processing_status
      }
    };
  }

  // Transform multiple emails
  static async transformEmailDataList(backendDataList: BackendEmailData[]): Promise<FrontendEmailData[]> {
    const transformedEmails = await Promise.all(
      backendDataList.map(email => this.transformEmailData(email))
    );
    return transformedEmails;
  }

  // Map backend department to frontend department
  private static mapDepartment(backendDepartment: string | null): string {
    if (!backendDepartment) return 'Administration';
    
    const departmentMap: Record<string, string> = {
      'Operations': 'Operations',
      'Maintenance': 'Maintenance',
      'Safety': 'Safety',
      'Engineering': 'Engineering',
      'Administration': 'Administration',
      'Finance': 'Finance',
      'Human Resources': 'HR',
      'IT': 'IT',
      'Customer Service': 'Customer Service',
      'Security': 'Security'
    };

    return departmentMap[backendDepartment] || 'Administration';
  }

  // Map backend category to frontend category
  private static mapCategory(backendCategory: string | null): string {
    if (!backendCategory) return 'Communication';
    
    const categoryMap: Record<string, string> = {
      'CRITICAL_SAFETY': 'Safety Document',
      'BUDGET_FINANCE': 'Financial Report',
      'HR_TRAINING': 'Training Document',
      'OPERATIONS': 'Operations Document',
      'COMPLIANCE_AUDIT': 'Compliance Document',
      'COMMUNICATION': 'Communication',
      'OTHER': 'Other'
    };

    return categoryMap[backendCategory] || 'Communication';
  }

  // Map backend priority to frontend urgency
  private static mapPriority(backendPriority: string | null): 'urgent' | 'high' | 'medium' | 'low' {
    if (!backendPriority) return 'medium';
    
    const priorityMap: Record<string, 'urgent' | 'high' | 'medium' | 'low'> = {
      'URGENT': 'urgent',
      'HIGH': 'high',
      'MEDIUM': 'medium',
      'LOW': 'low'
    };

    return priorityMap[backendPriority] || 'medium';
  }

  // Map processing status to frontend status
  private static mapProcessingStatus(backendStatus: string | null): 'pending' | 'acknowledged' | 'completed' {
    if (!backendStatus) return 'pending';
    
    const statusMap: Record<string, 'pending' | 'acknowledged' | 'completed'> = {
      'pending': 'pending',
      'processing': 'pending',
      'completed': 'completed',
      'failed': 'pending'
    };

    return statusMap[backendStatus] || 'pending';
  }

  // Extract author name from email
  private static extractAuthorName(senderEmail: string): string {
    // Try to extract name from email format like "John Doe <john@example.com>"
    const nameMatch = senderEmail.match(/^(.+?)\s*<.+>$/);
    if (nameMatch) {
      return nameMatch[1].trim();
    }
    
    // If no name found, use email prefix
    const emailPrefix = senderEmail.split('@')[0];
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }

  // Detect language from email body
  private static detectLanguage(body: string): 'english' | 'malayalam' {
    // Simple language detection based on Malayalam characters
    const malayalamRegex = /[\u0D00-\u0D7F]/;
    return malayalamRegex.test(body) ? 'malayalam' : 'english';
  }

  // Map attachment type to file type
  private static mapFileType(attachmentType: string | null): string {
    if (!attachmentType) return 'TXT';
    
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/vnd.ms-excel': 'XLS',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'text/plain': 'TXT',
      'text/csv': 'CSV',
      'application/json': 'JSON'
    };

    return typeMap[attachmentType] || 'TXT';
  }

  // Calculate file size (placeholder - would need actual file size from backend)
  private static calculateFileSize(attachmentLink: string | null): string {
    if (!attachmentLink) return '0 KB';
    
    // This is a placeholder - in a real implementation, you'd get the actual file size
    // from the backend or calculate it from the attachment data
    return '1.2 MB';
  }

  // Format date for frontend display
  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Extract content tags from email data
  private static extractContentTags(emailData: BackendEmailData): string[] {
    const tags: string[] = [];
    
    // Add category-based tags
    if (emailData.document_category) {
      tags.push(emailData.document_category.toLowerCase().replace('_', '-'));
    }
    
    // Add department-based tags
    if (emailData.department) {
      tags.push(emailData.department.toLowerCase());
    }
    
    // Add priority-based tags
    if (emailData.priority_level) {
      tags.push(emailData.priority_level.toLowerCase());
    }
    
    // Add attachment-based tags
    if (emailData.attachment_type) {
      const fileType = this.mapFileType(emailData.attachment_type);
      tags.push(fileType.toLowerCase());
    }
    
    // Add language-based tags
    const language = this.detectLanguage(emailData.body);
    tags.push(language);
    
    return tags;
  }

  // Generate summary from email data
  static generateSummary(emailData: BackendEmailData): string {
    if (emailData.summary) {
      return emailData.summary;
    }
    
    if (emailData.classification_reason) {
      return emailData.classification_reason;
    }
    
    // Generate a basic summary from subject and body
    const subject = emailData.subject;
    const bodyPreview = emailData.body.substring(0, 100);
    
    return `${subject}. ${bodyPreview}...`;
  }

  // Generate key points from email data
  static generateKeyPoints(emailData: BackendEmailData): string[] {
    const keyPoints: string[] = [];
    
    // Add classification info as key points
    if (emailData.document_category) {
      keyPoints.push(`Category: ${emailData.document_category}`);
    }
    
    if (emailData.department) {
      keyPoints.push(`Department: ${emailData.department}`);
    }
    
    if (emailData.priority_level) {
      keyPoints.push(`Priority: ${emailData.priority_level}`);
    }
    
    // Add attachment info if available
    if (emailData.filename) {
      keyPoints.push(`Attachment: ${emailData.filename}`);
    }
    
    // Add processing status
    if (emailData.processing_status) {
      keyPoints.push(`Status: ${emailData.processing_status}`);
    }
    
    return keyPoints;
  }

  // Check if email has a deadline based on urgency and category
  private static hasDeadline(emailData: BackendEmailData): boolean {
    const urgentCategories = ['CRITICAL_SAFETY', 'BUDGET_FINANCE', 'COMPLIANCE_AUDIT'];
    const urgentPriorities = ['URGENT', 'HIGH'];
    
    return urgentCategories.includes(emailData.document_category || '') || 
           urgentPriorities.includes(emailData.priority_level || '');
  }

  // Calculate deadline date based on urgency and email date
  private static calculateDeadlineDate(emailData: BackendEmailData): string | undefined {
    // First, try to extract dates from subject and body
    const extractedDate = this.extractDateFromContent(emailData);
    if (extractedDate) {
      return extractedDate;
    }

    if (!this.hasDeadline(emailData)) {
      return undefined;
    }

    const emailDate = new Date(emailData.email_date);
    const urgency = emailData.priority_level?.toUpperCase();
    
    let daysToAdd = 7; // Default: 1 week
    
    switch (urgency) {
      case 'URGENT':
        daysToAdd = 1; // 1 day for urgent
        break;
      case 'HIGH':
        daysToAdd = 3; // 3 days for high priority
        break;
      case 'MEDIUM':
        daysToAdd = 7; // 1 week for medium
        break;
      case 'LOW':
        daysToAdd = 14; // 2 weeks for low
        break;
    }

    const deadlineDate = new Date(emailDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return deadlineDate.toISOString().split('T')[0];
  }

  // Extract dates from email subject and body content
  private static extractDateFromContent(emailData: BackendEmailData): string | undefined {
    const content = `${emailData.subject} ${emailData.body}`.toLowerCase();
    
    // Common date patterns
    const datePatterns = [
      // DD/MM/YYYY or DD-MM-YYYY
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
      // YYYY-MM-DD
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g,
      // Month DD, YYYY or DD Month YYYY
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/gi,
      /(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/gi,
      // Relative dates
      /deadline[:\s]+(.*?)(?=\n|$|\.)/gi,
      /due[:\s]+(.*?)(?=\n|$|\.)/gi,
      /complete by[:\s]+(.*?)(?=\n|$|\.)/gi,
      /by[:\s]+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/gi
    ];

    const extractedDates: Date[] = [];

    // Try to extract dates using patterns
    for (const pattern of datePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        try {
          let dateStr = match[0];
          
          // Clean up the date string
          dateStr = dateStr.replace(/deadline[:\s]+/gi, '').replace(/due[:\s]+/gi, '').replace(/complete by[:\s]+/gi, '').trim();
          
          // Parse the date
          const parsedDate = new Date(dateStr);
          
          // Validate the date
          if (!isNaN(parsedDate.getTime()) && parsedDate > new Date()) {
            extractedDates.push(parsedDate);
          }
        } catch (error) {
          // Ignore invalid dates
        }
      }
    }

    // Return the earliest valid future date
    if (extractedDates.length > 0) {
      const earliestDate = extractedDates.sort((a, b) => a.getTime() - b.getTime())[0];
      return earliestDate.toISOString().split('T')[0];
    }

    return undefined;
  }

  // Extract implementation time from email content
  private static extractImplementationTime(emailData: BackendEmailData): string | undefined {
    const content = `${emailData.subject} ${emailData.body}`;
    
    const timePatterns = [
      /implementation time[:\s]*([^.\n]+)/gi,
      /timeline[:\s]*([^.\n]+)/gi,
      /duration[:\s]*([^.\n]+)/gi,
      /(\d+)\s*(days?|weeks?|months?)/gi,
      /within\s+(\d+\s*(?:days?|weeks?|months?))/gi
    ];

    for (const pattern of timePatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1]?.trim() || match[0]?.trim();
      }
    }

    return undefined;
  }

  // Extract affected stations information
  private static extractAffectedStations(emailData: BackendEmailData): string | undefined {
    const content = `${emailData.subject} ${emailData.body}`;
    
    const stationPatterns = [
      /affected stations[:\s]*([^.\n]+)/gi,
      /(\d+)\s*(?:metro\s*)?stations?/gi,
      /all\s+(\d+)\s+(?:metro\s*)?stations?/gi,
      /stations?[:\s]*([^.\n]+)/gi
    ];

    for (const pattern of stationPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1]?.trim() || match[0]?.trim();
      }
    }

    return undefined;
  }

  // Extract action items from email content
  private static extractActionItems(emailData: BackendEmailData): string[] {
    const content = emailData.body;
    const actionItems: string[] = [];
    
    // Look for structured action items
    const actionPatterns = [
      /action items?[:\s]*\n?(.*?)(?=\n\n|\n[A-Z]|$)/gis,
      /action[:\s]*\n?(.*?)(?=\n\n|\n[A-Z]|$)/gis,
      /tasks?[:\s]*\n?(.*?)(?=\n\n|\n[A-Z]|$)/gis,
      /to-?do[:\s]*\n?(.*?)(?=\n\n|\n[A-Z]|$)/gis
    ];

    for (const pattern of actionPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          // Split by lines and filter non-empty ones
          const items = match[1]
            .split(/\n/)
            .map(item => item.trim())
            .filter(item => item.length > 0 && !item.match(/^[:\-\*\s]*$/))
            .slice(0, 5); // Limit to 5 items
          
          actionItems.push(...items);
        }
      }
    }

    // If no structured action items found, look for bullet points or numbered lists
    if (actionItems.length === 0) {
      const bulletPatterns = [
        /^[\*\-\•]\s*(.+)$/gm,
        /^\d+\.\s*(.+)$/gm
      ];

      for (const pattern of bulletPatterns) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].length > 10) { // Filter out short lines
            actionItems.push(match[1].trim());
          }
        }
      }
    }

    return actionItems.slice(0, 5); // Return max 5 action items
  }

  // Extract detailed key points from email content
  private static extractDetailedKeyPoints(emailData: BackendEmailData): string[] {
    const content = emailData.body;
    const keyPoints: string[] = [];
    
    // Look for structured key points
    const keyPointPatterns = [
      /(?:key points?|main points?|highlights?|details?)[:\s]*\n?(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)/gis,
      /(?:summary|overview)[:\s]*\n?(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)/gis
    ];

    for (const pattern of keyPointPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          const points = match[1]
            .split(/\n/)
            .map(point => point.trim())
            .filter(point => point.length > 15 && !point.match(/^[:\-\*\s]*$/))
            .slice(0, 5);
          
          keyPoints.push(...points);
        }
      }
    }

    // If no structured key points found, extract important sentences
    if (keyPoints.length === 0) {
      const sentences = content.split(/[.!?]/)
        .map(sentence => sentence.trim())
        .filter(sentence => 
          sentence.length > 30 && 
          sentence.length < 200 &&
          (sentence.includes('require') || 
           sentence.includes('must') || 
           sentence.includes('important') ||
           sentence.includes('critical') ||
           sentence.includes('deadline') ||
           sentence.includes('update'))
        )
        .slice(0, 5);
      
      keyPoints.push(...sentences);
    }

    return keyPoints;
  }
}
