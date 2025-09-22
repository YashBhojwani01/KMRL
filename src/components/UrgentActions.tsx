import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';
import { QuickResolveButton } from '@/utils/buttonUtils';
import { QuickResolveModal } from './QuickResolveModal';

export const UrgentActions = () => {
  const { urgentActions, getPriorityColorOutline, handleQuickResolve } = useDashboardData();
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    title: string;
    description: string;
    priority: string;
    department: string;
    deadline: string;
  } | null>(null);
  const [isQuickResolveOpen, setIsQuickResolveOpen] = useState(false);

  const getDepartmentColor = (department: string) => {
    return 'bg-stone-100 text-stone-700 border-stone-200';
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
      {urgentActions.map(action => (
          <div key={action.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {renderIcon(action.iconType, action.iconClass)}
              <div>
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
              <QuickResolveButton 
                onClick={() => handleQuickResolveClick(action)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`${getPriorityColorOutline(action.priority)} text-xs`}>
                  {action.impact}
                </Badge>
                <Badge className={`${getDepartmentColor(action.department)} text-xs`}>
                  {action.department}
              </Badge>
              </div>
              <span className="text-xs text-gray-500">Due: {action.deadline}</span>
            </div>
          </div>
            ))}
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
