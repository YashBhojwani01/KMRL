import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';
import { QuickResolveButton } from '@/utils/buttonUtils';
import { QuickResolveModal } from './QuickResolveModal';

export const UrgentActions = () => {
  const { emailData, isLoadingEmails } = useDashboardData();
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    title: string;
    description: string;
    priority: string;
    department: string;
    deadline: string;
  } | null>(null);
  const [isQuickResolveOpen, setIsQuickResolveOpen] = useState(false);

  // Get urgent emails (urgent and high priority)
  const urgentEmails = emailData.filter(email => 
    email.urgency === 'urgent' || email.urgency === 'high'
  ).slice(0, 3); // Show top 3 urgent emails

  const getPriorityColorOutline = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'Critical';
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      default:
        return 'Unknown';
    }
  };

  const handleQuickResolveClick = (action: any) => {
    setSelectedAction({
      id: action.id.toString(),
      title: action.title,
      description: action.description,
      priority: action.priority,
      department: action.department,
      deadline: action.deadline
    });
    setIsQuickResolveOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-lg font-semibold">Urgent Action Required</CardTitle>
        </div>
        <Badge variant="outline" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
          AI-sorted by predicted impact
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingEmails ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-500">Loading urgent actions...</span>
          </div>
        ) : urgentEmails.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <AlertTriangle className="mx-auto h-8 w-8" />
            </div>
            <p className="text-sm text-gray-500">No urgent actions required</p>
          </div>
        ) : (
          urgentEmails.map(email => (
            <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{email.title}</h4>
                    <p className="text-sm text-gray-600">{email.summary}</p>
                  </div>
                </div>
                <QuickResolveButton 
                  onClick={() => handleQuickResolveClick({
                    id: email.id,
                    title: email.title,
                    description: email.summary,
                    priority: email.urgency,
                    department: email.department,
                    deadline: email.deadlineDate || 'ASAP'
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColorOutline(email.urgency)} text-xs`}>
                    {getUrgencyLabel(email.urgency)}
                  </Badge>
                  <Badge className={`${getDepartmentColor(email.department)} text-xs`}>
                    {email.department}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  Due: {email.deadlineDate || 'ASAP'}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
        </Card>

        {/* Quick Resolve Modal */}
        {selectedAction && (
          <QuickResolveModal
            isOpen={isQuickResolveOpen}
            onClose={() => {
              setIsQuickResolveOpen(false);
              setSelectedAction(null);
            }}
            actionId={selectedAction.id}
            actionTitle={selectedAction.title}
            actionDescription={selectedAction.description}
            actionPriority={selectedAction.priority}
            actionDepartment={selectedAction.department}
            actionDeadline={selectedAction.deadline}
          />
        )}
      </>
    );
  };
