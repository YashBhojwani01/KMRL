import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export const DueWork = () => {
  const { emailData, isLoadingEmails } = useDashboardData();

  // Calculate due work items from email data
  const calculateDueWorkItems = () => {
    if (isLoadingEmails || !emailData.length) {
      return {
        completionRate: 0,
        items: [
          {
            category: "Loading...",
            status: "Loading",
            count: 0,
            statusColor: "bg-gray-100 text-gray-700",
            buttonColor: "bg-gray-100 text-gray-700"
          }
        ]
      };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneWeekFromNowStr = oneWeekFromNow.toISOString().split('T')[0];

    // Filter emails by due dates
    const dueToday = emailData.filter(email => 
      email.deadlineDate === todayStr && email.status !== 'completed'
    );
    
    const dueThisWeek = emailData.filter(email => {
      if (!email.deadlineDate) return false;
      const emailDate = new Date(email.deadlineDate);
      return emailDate > today && emailDate <= oneWeekFromNow && email.status !== 'completed';
    });
    
    const overdue = emailData.filter(email => {
      if (!email.deadlineDate) return false;
      const emailDate = new Date(email.deadlineDate);
      return emailDate < today && email.status !== 'completed';
    });

    // Calculate completion rate
    const totalEmails = emailData.length;
    const completedEmails = emailData.filter(email => email.status === 'completed').length;
    const completionRate = totalEmails > 0 ? Math.round((completedEmails / totalEmails) * 100) : 0;

    const items = [
      {
        category: "Due Today",
        status: dueToday.length > 0 ? "Action Needed" : "On Track",
        count: dueToday.length,
        statusColor: dueToday.length > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700",
        buttonColor: dueToday.length > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
      },
      {
        category: "Due This Week",
        status: dueThisWeek.length > 0 ? "On Track" : "Completed",
        count: dueThisWeek.length,
        statusColor: dueThisWeek.length > 0 ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700",
        buttonColor: dueThisWeek.length > 0 ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
      },
      {
        category: "Overdue",
        status: overdue.length > 0 ? "Late" : "None",
        count: overdue.length,
        statusColor: overdue.length > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
        buttonColor: overdue.length > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }
    ];

    return { completionRate, items };
  };

  const { completionRate, items } = calculateDueWorkItems();

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
          {items.map((item, index) => (
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

