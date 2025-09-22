import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export const DueWork = () => {
  const { dueWorkItems, completionRate } = useDashboardData();

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold">Due Work</CardTitle>
        </div>
        <Badge variant="outline" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
          Predictive timelines with delay warnings
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Completion Rate</span>
            <span className="text-lg font-bold text-gray-900">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Due Work Items */}
        <div className="space-y-4">
          {dueWorkItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {item.category === "Overdue" ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : item.category === "Due Today" ? (
                    <Clock className="h-4 w-4 text-orange-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="font-medium text-gray-900">{item.category}</span>
                </div>
                <Badge className={`${item.statusColor} text-xs`}>
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{item.count} tasks</span>
                <Button 
                  size="sm" 
                  className={`${item.buttonColor} text-xs px-3 py-1`}
                >
                  {item.status}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

