import { GoogleGenerativeAI } from '@google/generative-ai';

interface ExtractedData {
  shortTitle: string;
  keyPoints: string[];
  actionItems: string[];
  implementationTime?: string;
  affectedStations?: string;
  deadlineDate?: string;
  priority: string;
  summary: string;
  metadata: {
    urgency: string;
    category: string;
    department: string;
  };
}

class GeminiDataExtractionService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Gemini API key not found. Data extraction will use fallback methods.');
      this.genAI = null as any;
      this.model = null;
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async extractEmailData(subject: string, body: string, senderEmail: string): Promise<ExtractedData> {
    if (!this.model) {
      return this.getFallbackData(subject, body, senderEmail);
    }

    try {
      const prompt = this.createExtractionPrompt(subject, body, senderEmail);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGeminiResponse(text, subject);
    } catch (error) {
      console.error('❌ Gemini extraction failed:', error);
      return this.getFallbackData(subject, body, senderEmail);
    }
  }

  private createExtractionPrompt(subject: string, body: string, senderEmail: string): string {
    return `
You are an AI assistant specialized in extracting structured data from government and metro rail emails. Analyze the following email and extract key information in JSON format.

Email Subject: "${subject}"
Email Body: "${body}"
Sender: "${senderEmail}"

Extract the following information and return ONLY a valid JSON object:

{
  "shortTitle": "A concise, professional title for the email (max 10 words, e.g., 'Metro Coach Failure Report')",
  "keyPoints": ["List of 3-5 most important key points from the email"],
  "actionItems": ["List of specific action items or tasks mentioned"],
  "implementationTime": "Extract timeline/duration if mentioned (e.g., '2 weeks', '1 month')",
  "affectedStations": "Extract number of stations or specific stations mentioned",
  "deadlineDate": "Extract specific deadline dates in YYYY-MM-DD format if mentioned",
  "priority": "URGENT/HIGH/MEDIUM/LOW based on content analysis",
  "summary": "Brief 2-3 sentence summary of the email",
  "metadata": {
    "urgency": "URGENT/HIGH/MEDIUM/LOW",
    "category": "CRITICAL_SAFETY/BUDGET_FINANCE/HR_TRAINING/OPERATIONS/COMPLIANCE_AUDIT/COMMUNICATION/OTHER",
    "department": "Operations/Maintenance/Safety/Engineering/Administration/Finance/Human Resources/IT/Customer Service/Security"
  }
}

Guidelines:
- Look for dates in various formats (DD/MM/YYYY, Month DD YYYY, etc.)
- Extract specific numbers for stations, timelines, deadlines
- Identify urgency based on keywords like "urgent", "critical", "immediate", "deadline"
- Categorize based on content: safety issues, budget matters, training, operations, compliance
- Extract action items from bullet points, numbered lists, or explicit task mentions
- If no specific information is found, use "Not specified" or empty arrays
- Return ONLY the JSON object, no additional text
`;
  }

  private parseGeminiResponse(response: string, subject: string): ExtractedData {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // Validate deadline date
      let deadline = parsed.deadlineDate;
      if (deadline && isNaN(new Date(deadline).getTime())) {
        deadline = undefined; // Set to undefined if invalid
      }

      return {
        shortTitle: parsed.shortTitle || subject,
        keyPoints: parsed.keyPoints || [],
        actionItems: parsed.actionItems || [],
        implementationTime: parsed.implementationTime || undefined,
        affectedStations: parsed.affectedStations || undefined,
        deadlineDate: deadline,
        priority: parsed.priority || 'MEDIUM',
        summary: parsed.summary || '',
        metadata: {
          urgency: parsed.metadata?.urgency || 'MEDIUM',
          category: parsed.metadata?.category || 'OTHER',
          department: parsed.metadata?.department || 'Administration'
        }
      };
    } catch (error) {
      console.error('❌ Failed to parse Gemini response:', error);
      return this.getFallbackData('', '', '');
    }
  }

  private getFallbackData(subject: string, body: string, senderEmail: string): ExtractedData {
    // Fallback to basic extraction when Gemini is not available
    const keyPoints = this.extractBasicKeyPoints(body);
    const actionItems = this.extractBasicActionItems(body);
    const deadlineDate = this.extractBasicDate(subject + ' ' + body);
    
    return {
      shortTitle: subject,
      keyPoints,
      actionItems,
      implementationTime: undefined,
      affectedStations: undefined,
      deadlineDate,
      priority: this.extractBasicPriority(subject + ' ' + body),
      summary: body.substring(0, 200) + '...',
      metadata: {
        urgency: this.extractBasicPriority(subject + ' ' + body),
        category: 'OTHER',
        department: 'Administration'
      }
    };
  }

  private extractBasicKeyPoints(body: string): string[] {
    const sentences = body.split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 30 && s.length < 200)
      .slice(0, 5);
    
    return sentences;
  }

  private extractBasicActionItems(body: string): string[] {
    const actionPatterns = [
      /^[\*\-\•]\s*(.+)$/gm,
      /^\d+\.\s*(.+)$/gm,
      /action[:\s]+(.+)/gi
    ];

    const items: string[] = [];
    for (const pattern of actionPatterns) {
      const matches = body.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 10) {
          items.push(match[1].trim());
        }
      }
    }

    return items.slice(0, 5);
  }

  private extractBasicDate(content: string): string | undefined {
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g,
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/gi
    ];

    for (const pattern of datePatterns) {
      const match = content.match(pattern);
      if (match) {
        try {
          const date = new Date(match[0]);
          if (!isNaN(date.getTime()) && date > new Date()) {
            return date.toISOString().split('T')[0];
          }
        } catch (error) {
          // Ignore invalid dates
        }
      }
    }

    return undefined;
  }

  private extractBasicPriority(content: string): string {
    const urgentKeywords = ['urgent', 'critical', 'immediate', 'emergency', 'asap'];
    const highKeywords = ['important', 'priority', 'deadline', 'due'];
    
    const lowerContent = content.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'URGENT';
    }
    
    if (highKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'HIGH';
    }
    
    return 'MEDIUM';
  }

  async chatWithDocument(document: any, question: string, history: any[]): Promise<string> {
    if (!this.model) {
      return "I'm sorry, the AI service is currently unavailable. Please try again later.";
    }

    try {
      const prompt = this.createChatPrompt(document, question, history);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini chat failed:', error);
      return "Sorry, I encountered an error while processing your request.";
    }
  }

  private createChatPrompt(document: any, question: string, history: any[]): string {
    const historyText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    return `
You are a helpful AI assistant for the KMRL Metro project. Your task is to answer questions about a specific document.
You have been provided with the document's content below. Use ONLY this information to answer the user's question.
Do not use any external knowledge. If the answer is not in the document, say "The answer is not available in the provided document."

DOCUMENT CONTEXT:
---
Title: ${document.title}
Author: ${document.author}
Date: ${document.date}
Summary: ${document.summary}
Content Body:
${document.body}
---

CHAT HISTORY:
---
${historyText}
---

USER'S QUESTION:
---
${question}
---

Your Answer:
`;
  }

  async chatWithKMRLAssistant(question: string, history: any[]): Promise<string> {
    if (!this.model) {
      return "I'm sorry, the AI service is currently unavailable. Please try again later.";
    }

    try {
      const prompt = this.createKMRLAssistantPrompt(question, history);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini KMRL assistant chat failed:', error);
      return "Sorry, I encountered an error while processing your request.";
    }
  }

  private createKMRLAssistantPrompt(question: string, history: any[]): string {
    const historyText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    return `
You are a helpful AI assistant for the Kochi Metro Rail Limited (KMRL) project. You specialize in metro operations, safety protocols, maintenance, and administrative tasks.

Your expertise includes:
- Metro operations and safety procedures
- Maintenance schedules and protocols
- Administrative processes and approvals
- System performance monitoring
- Emergency procedures
- Staff training and compliance
- Infrastructure management
- Financial and operational reporting

CHAT HISTORY:
---
${historyText}
---

USER'S QUESTION:
---
${question}
---

Instructions:
- Provide helpful, accurate information about KMRL operations
- Keep responses SHORT and STRUCTURED
- Use clear, simple language
- Format responses as:
  * Key Point 1
  * Key Point 2
  * Key Point 3
- No special characters like asterisks or emojis
- Be direct and actionable
- If you don't know something specific, suggest where to find the information
- If the question is about specific documents, mention using the "Ask AI" feature on individual documents

Your Answer:
`;
  }
}

export default GeminiDataExtractionService;
