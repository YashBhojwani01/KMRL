import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';

const weeklyUpdate = [
  { 
    title: 'Completed: Safety Audit', 
    summary: 'Successfully completed the annual safety audit with 98% compliance rate. All safety protocols have been reviewed and updated.',
    status: 'completed',
    date: 'Jan 10, 2024',
    icon: <CheckCircle className="h-5 w-5 text-green-600" />
  },
  { 
    title: 'Upcoming: Financial Report Review', 
    summary: 'Review of Q4 financial reports scheduled for next week. Preliminary data shows positive growth trends.',
    status: 'upcoming',
    date: 'Jan 15, 2024',
    icon: <Calendar className="h-5 w-5 text-blue-600" />
  },
  { 
    title: 'In Progress: Employee Training', 
    summary: 'Employee training module 5 is currently in progress. 75% of staff have completed the new compliance training.',
    status: 'in-progress',
    date: 'Jan 12, 2024',
    icon: <TrendingUp className="h-5 w-5 text-orange-600" />
  },
];

export const WeeklyUpdate = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Weekly Update</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Comprehensive overview of weekly activities and progress</p>
      
      <div className="space-y-4">
        {weeklyUpdate.map((update, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {update.icon}
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                </div>
                <Badge className={`${getStatusColor(update.status)} text-xs`}>
                  {update.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{update.summary}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Date: {update.date}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Last updated 2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
