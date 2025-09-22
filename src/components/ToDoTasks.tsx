import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Loader2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AcknowledgeButton, DoneButton, ForwardButton } from '@/utils/buttonUtils';
import { cn } from '@/lib/utils';

const priorityBadgeColors = {
  urgent: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

export const ToDoTasks = () => {
  const { 
    tasks, 
    handleTaskComplete, 
    handleTaskAcknowledge, 
    handleTaskForward,
    isLoadingEmails
  } = useDashboardData();

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Not specified';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI-Generated Tasks</h2>
          <p className="text-sm text-gray-500">Prioritized tasks extracted from recent communications</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoadingEmails ? (
          <div className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-gray-600">
                <h3 className="text-lg font-semibold mb-2">Loading AI-Generated Tasks</h3>
                <p className="text-sm">Analyzing recent communications to extract actionable tasks...</p>
              </div>
            </div>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task: any) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: priorityBadgeColors[task.priority]?.split(' ')[0].replace('bg-', '#') }}>
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-base mb-2">{task.text}</h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <Badge className={cn("px-2 py-0.5", priorityBadgeColors[task.priority])}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{task.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <AcknowledgeButton onClick={() => handleTaskAcknowledge(task.id)} />
                  <DoneButton onClick={() => handleTaskComplete(task.id)} disabled={task.completed} />
                  <ForwardButton onClick={() => handleTaskForward(task.id)} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold">No tasks found</h3>
            <p>The AI has not identified any action items from the recent emails.</p>
          </div>
        )}
      </div>
    </div>
  );
};
