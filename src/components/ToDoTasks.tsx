import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AcknowledgeButton, DoneButton, ForwardButton } from '@/utils/buttonUtils';

export const ToDoTasks = () => {
  const { 
    tasks, 
    handleTaskComplete, 
    handleTaskAcknowledge, 
    handleTaskForward, 
    getPriorityColor, 
    getDepartmentColor 
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Interactive task management with AI suggestions</p>
      
      <div className="space-y-4">
      {tasks.map(task => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{task.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={`${getPriorityColor(task.priority)} text-xs px-2 py-1`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${getDepartmentColor()} text-xs px-2 py-1`}>
                      {task.department}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Due: {task.dueDate}</span>
                    <span>Status: {task.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <AcknowledgeButton 
                    onClick={() => handleTaskAcknowledge(task.id)}
                  />
                  <DoneButton 
                    onClick={() => handleTaskComplete(task.id)}
                    disabled={task.completed}
                  />
                  <ForwardButton 
                    onClick={() => handleTaskForward(task.id)}
                  />
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};
