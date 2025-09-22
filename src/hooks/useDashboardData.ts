import { useState, useCallback } from 'react';
import { renderIcon } from '@/utils/iconUtils';

// Types for dashboard data
export interface Metric {
  id: string;
  title: string;
  value: string;
  trend: string;
  iconType: 'FileCheck2' | 'Clock3' | 'ShieldCheck' | 'TrendingUp';
  iconClass: string;
}

export interface UrgentAction {
  id: number;
  title: string;
  description: string;
  impact: string;
  department: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  iconType: 'FileText' | 'DollarSign';
  iconClass: string;
}

export interface BriefingItem {
  type: 'positive' | 'completed' | 'attention';
  title: string;
  description: string;
  iconType: 'TrendingUp' | 'CheckCircle' | 'AlertTriangle';
  iconClass: string;
}

export interface DueWorkItem {
  category: string;
  count: number;
  status: string;
  statusColor: string;
  buttonColor: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'training' | 'reminder';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  description?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'urgent' | 'success' | 'reminder' | 'info';
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Document {
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
}

export interface CommunicationThread {
  id: string;
  title: string;
  author: string;
  lastMessage: string;
  timestamp: string;
  participants: number;
  status: 'active' | 'resolved' | 'archived';
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  changes: string[];
  version: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  documentId: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  department: string;
  dueDate: string;
  status: 'Pending' | 'In-Progress' | 'Completed';
}

export interface WeeklyUpdateItem {
  title: string;
  summary: string;
  status: 'completed' | 'upcoming' | 'in-progress';
  date: string;
  iconType: 'CheckCircle' | 'Calendar' | 'TrendingUp';
  iconClass: string;
}

export interface DashboardData {
  metrics: Metric[];
  urgentActions: UrgentAction[];
  briefingItems: BriefingItem[];
  dueWorkItems: DueWorkItem[];
  calendarEvents: CalendarEvent[];
  tasks: Task[];
  weeklyUpdates: WeeklyUpdateItem[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  quickQuestions: string[];
  documents: Document[];
  communicationThreads: CommunicationThread[];
  auditLogs: AuditLog[];
  completionRate: number;
}

export const useDashboardData = () => {
  // Initial data
  const [data] = useState<DashboardData>({
    metrics: [
      {
        id: 'processedDocs',
        title: 'Documents Processed',
        value: '1,248',
        trend: '+15%',
        iconType: 'FileCheck2',
        iconClass: 'h-5 w-5 text-blue-600'
      },
      {
        id: 'onTimeRate',
        title: 'On-time Completion',
        value: '92%',
        trend: '+3%',
        iconType: 'Clock3',
        iconClass: 'h-5 w-5 text-green-600'
      },
      {
        id: 'complianceScore',
        title: 'Compliance Score',
        value: '98',
        trend: 'Stable',
        iconType: 'ShieldCheck',
        iconClass: 'h-5 w-5 text-emerald-600'
      },
      {
        id: 'weeklyTrend',
        title: 'Weekly Trend',
        value: 'Upward',
        trend: '+7%',
        iconType: 'TrendingUp',
        iconClass: 'h-5 w-5 text-orange-600'
      },
    ],
    urgentActions: [
      { 
        id: 1, 
        title: 'Critical Safety Incident Report', 
        description: 'Document Review',
        impact: 'High Risk',
        department: 'Operations', 
        deadline: 'Today', 
        priority: 'high',
        iconType: 'FileText',
        iconClass: 'h-4 w-4'
      },
      { 
        id: 2, 
        title: 'Budget Approval Pending', 
        description: 'Management Approval',
        impact: 'Project Delay',
        department: 'Finance', 
        deadline: 'Tomorrow', 
        priority: 'high',
        iconType: 'DollarSign',
        iconClass: 'h-4 w-4'
      },
    ],
    briefingItems: [
      {
        type: 'positive',
        title: 'Positive Trend',
        description: 'Document processing efficiency increased by 15% this week. Automation features are reducing manual workload effectively. Staff training completion rate improved to 89% with new digital modules.',
        iconType: 'TrendingUp',
        iconClass: 'h-3 w-3 text-green-600'
      },
      {
        type: 'completed',
        title: 'Completed',
        description: 'Safety audit completed for all 22 stations. Quality score: 98%',
        iconType: 'CheckCircle',
        iconClass: 'h-3 w-3 text-green-600'
      },
      {
        type: 'attention',
        title: 'Attention Required',
        description: 'Budget approval pending for Q1 infrastructure upgrades. Deadline: Jan 18',
        iconType: 'AlertTriangle',
        iconClass: 'h-3 w-3 text-orange-600'
      }
    ],
    dueWorkItems: [
      {
        category: "Due Today",
        count: 3,
        status: "Action Needed",
        statusColor: "bg-orange-100 text-orange-800 border-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600 text-white"
      },
      {
        category: "Due This Week",
        count: 8,
        status: "On Track",
        statusColor: "bg-blue-100 text-blue-800 border-blue-200",
        buttonColor: "bg-blue-500 hover:bg-blue-600 text-white"
      },
      {
        category: "Overdue",
        count: 1,
        status: "Late",
        statusColor: "bg-red-100 text-red-800 border-red-200",
        buttonColor: "bg-red-500 hover:bg-red-600 text-white"
      }
    ],
    calendarEvents: [
      {
        id: 1,
        title: "Safety Protocol Review",
        date: "2024-01-15",
        time: "10:00 AM",
        type: "meeting",
        priority: "high",
        description: "Monthly safety protocol review meeting"
      },
      {
        id: 2,
        title: "Budget Approval Deadline",
        date: "2024-01-18",
        time: "5:00 PM",
        type: "deadline",
        priority: "urgent",
        description: "Q1 infrastructure budget approval deadline"
      },
      {
        id: 3,
        title: "Staff Training Session",
        date: "2024-01-20",
        time: "2:00 PM",
        type: "training",
        priority: "medium",
        description: "Mandatory safety training for all staff"
      },
      {
        id: 4,
        title: "Monthly Report Submission",
        date: "2024-01-25",
        time: "12:00 PM",
        type: "deadline",
        priority: "high",
        description: "Submit monthly operational report"
      },
      {
        id: 5,
        title: "Vendor Meeting",
        date: "2024-01-28",
        time: "3:00 PM",
        type: "meeting",
        priority: "medium",
        description: "Meet with electrical components vendor"
      }
    ],
    tasks: [
      { 
        id: 1, 
        title: 'Employee Training Records Verification', 
        completed: false, 
        documentId: 'doc1',
        priority: 'high',
        department: 'HR',
        dueDate: '15/01/2024',
        status: 'Pending'
      },
      { 
        id: 2, 
        title: 'Safety Protocol Update Documentation', 
        completed: false, 
        documentId: 'doc2',
        priority: 'urgent',
        department: 'Operations',
        dueDate: '12/01/2024',
        status: 'Pending'
      },
      { 
        id: 3, 
        title: 'Monthly Financial Report Review', 
        completed: false, 
        documentId: 'doc3',
        priority: 'medium',
        department: 'Finance',
        dueDate: '18/01/2024',
        status: 'In-Progress'
      },
    ],
    weeklyUpdates: [
      { 
        title: 'Completed: Safety Audit', 
        summary: 'Successfully completed the annual safety audit with 98% compliance rate. All safety protocols have been reviewed and updated.',
        status: 'completed',
        date: 'Jan 10, 2024',
        iconType: 'CheckCircle',
        iconClass: 'h-5 w-5 text-green-600'
      },
      { 
        title: 'Upcoming: Financial Report Review', 
        summary: 'Review of Q4 financial reports scheduled for next week. Preliminary data shows positive growth trends.',
        status: 'upcoming',
        date: 'Jan 15, 2024',
        iconType: 'Calendar',
        iconClass: 'h-5 w-5 text-blue-600'
      },
      { 
        title: 'In Progress: Employee Training', 
        summary: 'Employee training module 5 is currently in progress. 75% of staff have completed the new compliance training.',
        status: 'in-progress',
        date: 'Jan 12, 2024',
        iconType: 'TrendingUp',
        iconClass: 'h-5 w-5 text-orange-600'
      },
    ],
    notifications: [
      {
        id: 1,
        title: "Urgent: Budget Approval Required",
        message: "Q1 infrastructure budget approval is pending. Deadline: Jan 18, 2024",
        type: "urgent",
        time: "2 hours ago",
        read: false
      },
      {
        id: 2,
        title: "Safety Audit Completed",
        message: "Monthly safety audit for all 22 stations has been completed successfully.",
        type: "success",
        time: "4 hours ago",
        read: false
      },
      {
        id: 3,
        title: "Training Session Reminder",
        message: "Mandatory safety training session scheduled for tomorrow at 2:00 PM",
        type: "reminder",
        time: "1 day ago",
        read: true
      }
    ],
    chatMessages: [
      {
        id: "1",
        type: "assistant",
        content: "Hello! I'm your KMRL Document Intelligence Assistant. I can help you find information about safety protocols, maintenance records, compliance reports, and more. What would you like to know?",
        timestamp: "10:30 AM"
      },
      {
        id: "2",
        type: "user",
        content: "What were the key takeaways from the last board meeting?",
        timestamp: "10:32 AM"
      },
      {
        id: "3",
        type: "assistant",
        content: "Based on the December 2023 board meeting minutes, here are the key takeaways:\n\n• Budget approval for Phase 2 extension (₹2,400 crores)\n• New safety protocols for monsoon operations\n• Digital ticketing system upgrade scheduled for Q2 2024\n• Staff training program for AI document platform\n\nWould you like me to provide more details on any of these points?",
        timestamp: "10:32 AM"
      }
    ],
    quickQuestions: [
      "Show me today's safety bulletins",
      "Any pending vendor payments?",
      "Latest maintenance schedules",
      "Compliance status overview"
    ],
    documents: [
      {
        id: "1",
        title: "Q4 Financial Report",
        department: "Finance",
        category: "Financial Report",
        urgency: "high",
        date: "10/01/2024",
        author: "System User",
        summary: "Comprehensive quarterly financial analysis showing 12% revenue growth and operational improvements across all metro lines.",
        language: "english",
        fileType: "PDF",
        fileSize: "2.3 MB",
        status: "pending",
        contentTags: ["financial", "quarterly", "report"]
      },
      {
        id: "2",
        title: "Safety Protocol Updates",
        department: "Operations",
        category: "Safety Document",
        urgency: "urgent",
        date: "09/01/2024",
        author: "Priya Nair",
        summary: "Updated safety procedures following recent industry standards and regulatory requirements for metro operations.",
        language: "english",
        fileType: "DOCX",
        fileSize: "1.1 MB",
        status: "acknowledged",
        contentTags: ["safety", "protocol", "operations"]
      },
      {
        id: "3",
        title: "Employee Training Schedule",
        department: "HR",
        category: "Training Document",
        urgency: "medium",
        date: "08/01/2024",
        author: "Anita Singh",
        summary: "Detailed training schedule for Q1 2024 including technical skills, safety protocols, and customer service modules.",
        language: "english",
        fileType: "XLSX",
        fileSize: "890 KB",
        status: "completed",
        contentTags: ["training", "hr", "schedule"]
      }
    ],
    communicationThreads: [
      {
        id: "1",
        title: "Budget Approval Discussion",
        author: "Finance Team",
        lastMessage: "Please review the Q1 budget proposal and provide feedback by Friday.",
        timestamp: "2 hours ago",
        participants: 5,
        status: "active"
      },
      {
        id: "2",
        title: "Safety Protocol Updates",
        author: "Operations Team",
        lastMessage: "New safety protocols have been implemented. All staff should review.",
        timestamp: "1 day ago",
        participants: 12,
        status: "active"
      },
      {
        id: "3",
        title: "System Maintenance Window",
        author: "IT Department",
        lastMessage: "Maintenance completed successfully. All systems are operational.",
        timestamp: "3 days ago",
        participants: 8,
        status: "resolved"
      }
    ],
    auditLogs: [
      {
        id: "1",
        action: "Document Updated",
        user: "Priya Nair",
        timestamp: "2024-01-15 10:30:00",
        details: "Safety Protocol Updates document modified",
        changes: ["Updated emergency procedures", "Added new compliance requirements"],
        version: "v2.1"
      },
      {
        id: "2",
        action: "User Login",
        user: "Anita Singh",
        timestamp: "2024-01-15 09:15:00",
        details: "User logged into the system",
        changes: [],
        version: "v1.0"
      },
      {
        id: "3",
        action: "Document Deleted",
        user: "System Admin",
        timestamp: "2024-01-14 16:45:00",
        details: "Outdated training material removed",
        changes: ["Removed old training schedule", "Archived legacy documents"],
        version: "v1.5"
      }
    ],
    completionRate: 85
  });

  // Task management functions
  const [tasks, setTasks] = useState<Task[]>(data.tasks);
  const [notifications, setNotifications] = useState<Notification[]>(data.notifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(data.chatMessages);

  const handleTaskComplete = useCallback((taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: true, status: 'Completed' as const } : task
      )
    );
  }, []);

  const handleTaskAcknowledge = useCallback((taskId: number) => {
    // This could be expanded to update task status or add acknowledgment tracking
    console.log(`Acknowledging task ${taskId}`);
  }, []);

  const handleTaskForward = useCallback((taskId: number) => {
    // This could be expanded to forward task to another user or department
    console.log(`Forwarding task ${taskId}`);
  }, []);

  // Notification management functions
  const markNotificationAsRead = useCallback((notificationId: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Chat management functions
  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
  }, []);

  // Document management functions
  const handleDocumentView = useCallback((documentId: string) => {
    console.log(`Viewing document ${documentId}`);
    // This would open the document detail modal
  }, []);

  const handleDocumentDownload = useCallback((documentId: string) => {
    console.log(`Downloading document ${documentId}`);
    // This would trigger the download
  }, []);

  const handleDocumentAskAI = useCallback((documentId: string) => {
    console.log(`Asking AI about document ${documentId}`);
    // This would open AI chat for the document
  }, []);

  // Communication management functions
  const handleAddThread = useCallback(() => {
    console.log('Creating new communication thread');
    // This would open a new thread creation modal
  }, []);

  // Audit management functions
  const handleExportLogs = useCallback(() => {
    console.log('Exporting audit logs');
    // This would trigger the export
  }, []);

  const handleViewAuditDetails = useCallback((logId: string) => {
    console.log(`Viewing audit details for ${logId}`);
    // This would open audit details modal
  }, []);

  const handleCompareVersions = useCallback((logId: string) => {
    console.log(`Comparing versions for ${logId}`);
    // This would open version comparison modal
  }, []);

  // Event management functions
  const handleAddEvent = useCallback(() => {
    console.log('Adding new event');
    // This would open event creation modal
  }, []);

  const handleExportEvents = useCallback(() => {
    console.log('Exporting events');
    // This would trigger the export
  }, []);

  // Quick resolve function
  const handleQuickResolve = useCallback((actionId: string) => {
    console.log(`Quick resolving action ${actionId}`);
    // This would mark the action as resolved
  }, []);


  // Utility functions for styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDepartmentColor = () => {
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColorOutline = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return { iconType: 'Calendar' as const, iconClass: 'h-3 w-3' };
      case 'deadline': return { iconType: 'AlertTriangle' as const, iconClass: 'h-3 w-3' };
      case 'training': return { iconType: 'Clock3' as const, iconClass: 'h-3 w-3' };
      case 'reminder': return { iconType: 'Clock3' as const, iconClass: 'h-3 w-3' };
      default: return { iconType: 'Calendar' as const, iconClass: 'h-3 w-3' };
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return { iconType: 'AlertTriangle' as const, iconClass: 'h-4 w-4 text-red-600' };
      case 'success': return { iconType: 'CheckCircle' as const, iconClass: 'h-4 w-4 text-green-600' };
      case 'reminder': return { iconType: 'Clock3' as const, iconClass: 'h-4 w-4 text-blue-600' };
      case 'info': return { iconType: 'CheckCircle' as const, iconClass: 'h-4 w-4 text-gray-600' };
      default: return { iconType: 'CheckCircle' as const, iconClass: 'h-4 w-4 text-gray-600' };
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'reminder': return 'border-l-blue-500 bg-blue-50';
      case 'info': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return {
    // Data
    metrics: data.metrics,
    urgentActions: data.urgentActions,
    briefingItems: data.briefingItems,
    dueWorkItems: data.dueWorkItems,
    calendarEvents: data.calendarEvents,
    tasks,
    weeklyUpdates: data.weeklyUpdates,
    notifications,
    chatMessages,
    quickQuestions: data.quickQuestions,
    documents: data.documents,
    communicationThreads: data.communicationThreads,
    auditLogs: data.auditLogs,
    completionRate: data.completionRate,
    
    // Actions
    handleTaskComplete,
    handleTaskAcknowledge,
    handleTaskForward,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addChatMessage,
    handleDocumentView,
    handleDocumentDownload,
    handleDocumentAskAI,
    handleAddThread,
    handleExportLogs,
    handleViewAuditDetails,
    handleCompareVersions,
    handleAddEvent,
    handleExportEvents,
    handleQuickResolve,
    
    // Utilities
    renderIcon,
    getPriorityColor,
    getDepartmentColor,
    getStatusColor,
    getPriorityColorOutline,
    getTypeIcon,
    getNotificationIcon,
    getNotificationColor,
    formatDate,
  };
};