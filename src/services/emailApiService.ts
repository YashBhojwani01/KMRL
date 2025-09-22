import { createClient } from '@supabase/supabase-js';

// Types for backend email data
export interface BackendEmailData {
  id: string;
  user_id: string;
  sender_email: string;
  subject: string;
  body: string;
  email_date: string;
  filename: string | null;
  attachment_link: string | null;
  attachment_type: string | null;
  gmail_message_id: string;
  gmail_thread_id: string | null;
  is_relevant: boolean | null;
  summary: string | null;
  key_points: string | null;
  document_category: string | null;
  department: string | null;
  priority_level: string | null;
  classification_reason: string | null;
  is_processed: boolean | null;
  processing_status: string | null;
  created_at: string;
  updated_at: string;
}

// Types for frontend email data
export interface FrontendEmailData {
  id: string;
  title: string;
  department: string;
  category: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
  date: string;
  author: string;
  summary: string;
  language: 'english' | 'malayalam';
  fileType: string;
  fileSize: string;
  status: 'pending' | 'acknowledged' | 'completed';
  contentTags: string[];
  senderEmail: string;
  body: string;
  hasDeadline?: boolean;
  deadlineDate?: string;
  implementationTime?: string;
  affectedStations?: string;
  actionItems?: string[];
  keyPoints?: string[];
  attachmentInfo?: {
    filename: string | null;
    attachmentLink: string | null;
    attachmentType: string | null;
  };
  classificationInfo?: {
    documentCategory: string | null;
    department: string | null;
    priorityLevel: string | null;
    classificationReason: string | null;
  };
  processingInfo?: {
    isProcessed: boolean | null;
    processingStatus: string | null;
  };
}

class EmailApiService {
  private supabase: any;
  private static instance: EmailApiService | null = null;

  constructor() {
    // Return existing instance if available
    if (EmailApiService.instance) {
      return EmailApiService.instance;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔧 EmailApiService constructor called');
    console.log('🔧 VITE_SUPABASE_URL:', supabaseUrl);
    console.log('🔧 VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase configuration is missing. Email features will be disabled.');
      console.warn('Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      this.supabase = null;
      EmailApiService.instance = this;
      return;
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Store instance for singleton pattern
    EmailApiService.instance = this;
  }

  // Static method to get singleton instance
  static getInstance(): EmailApiService {
    if (!EmailApiService.instance) {
      EmailApiService.instance = new EmailApiService();
    }
    return EmailApiService.instance;
  }

  // Fetch email data for a specific user
  async fetchUserEmails(userId: string, limit: number = 50): Promise<BackendEmailData[]> {
    if (!this.supabase) {
      console.warn('Supabase not configured. Returning empty email data.');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('email_data')
        .select('*')
        .eq('user_id', userId)
        .eq('is_relevant', true) // Only fetch relevant emails
        .order('email_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user emails:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchUserEmails:', error);
      throw error;
    }
  }

  // Fetch email statistics for a user
  async fetchEmailStats(userId: string) {
    if (!this.supabase) {
      console.warn('Supabase not configured. Returning empty email stats.');
      return {
        total: 0,
        byCategory: {},
        byDepartment: {},
        byPriority: {},
        byStatus: {}
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('email_data')
        .select('document_category, department, priority_level, processing_status')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching email stats:', error);
        throw error;
      }

      // Process statistics
      const stats = {
        total: data?.length || 0,
        byCategory: {} as Record<string, number>,
        byDepartment: {} as Record<string, number>,
        byPriority: {} as Record<string, number>,
        byStatus: {} as Record<string, number>
      };

      data?.forEach((email: any) => {
        // Count by category
        if (email.document_category) {
          stats.byCategory[email.document_category] = (stats.byCategory[email.document_category] || 0) + 1;
        }
        
        // Count by department
        if (email.department) {
          stats.byDepartment[email.department] = (stats.byDepartment[email.department] || 0) + 1;
        }
        
        // Count by priority
        if (email.priority_level) {
          stats.byPriority[email.priority_level] = (stats.byPriority[email.priority_level] || 0) + 1;
        }
        
        // Count by status
        if (email.processing_status) {
          stats.byStatus[email.processing_status] = (stats.byStatus[email.processing_status] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error in fetchEmailStats:', error);
      throw error;
    }
  }

  // Fetch top emails by priority
  async fetchTopEmails(userId: string, limit: number = 5, priority?: string) {
    if (!this.supabase) {
      console.warn('Supabase not configured. Returning empty top emails.');
      return [];
    }

    try {
      let query = this.supabase
        .from('email_data')
        .select('*')
        .eq('user_id', userId)
        .eq('is_relevant', true);

      if (priority) {
        query = query.eq('priority_level', priority);
      }

      const { data, error } = await query
        .order('email_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching top emails:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchTopEmails:', error);
      throw error;
    }
  }

  // Trigger email reading for a user
  async triggerEmailReading(userId: string) {
    try {
      const response = await fetch('/api/emails/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error triggering email reading:', error);
      throw error;
    }
  }
}

export default EmailApiService;
