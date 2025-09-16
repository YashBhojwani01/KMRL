import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, DollarSign } from 'lucide-react';

const urgentActions = [
  { 
    id: 1, 
    title: 'Critical Safety Incident Report', 
    description: 'Document Review',
    impact: 'High Risk',
    department: 'Operations', 
    deadline: 'Today', 
    priority: 'high',
    icon: <FileText className="h-4 w-4" />
  },
  { 
    id: 2, 
    title: 'Budget Approval Pending', 
    description: 'Management Approval',
    impact: 'Project Delay',
    department: 'Finance', 
    deadline: 'Tomorrow', 
    priority: 'high',
    icon: <DollarSign className="h-4 w-4" />
  },
];

export const UrgentActions = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
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
                {action.icon}
              <div>
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
              >
                Quick Resolve
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`${getPriorityColor(action.priority)} text-xs`}>
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
  );
};
