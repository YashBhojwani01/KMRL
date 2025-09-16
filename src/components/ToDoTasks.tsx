import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ThumbsUp, CheckCircle, ArrowRight } from 'lucide-react';

const tasks = [
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
];

export const ToDoTasks = () => {
  const [tasksState, setTasksState] = useState(tasks);

  const handleAcknowledge = (taskId: number) => {
    alert(`Acknowledging task ${taskId}`);
  };

  const handleComplete = (taskId: number) => {
    setTasksState(tasksState.map(task => task.id === taskId ? {...task, completed: true} : task));
  };

  const handleForward = (taskId: number) => {
    alert(`Forwarding task ${taskId}`);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Interactive task management with AI suggestions</p>
      
      <div className="space-y-4">
      {tasksState.map(task => (
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
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAcknowledge(task.id)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Acknowledge
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleComplete(task.id)}
                    disabled={task.completed}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Done
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleForward(task.id)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                  >
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Forward
              </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};
