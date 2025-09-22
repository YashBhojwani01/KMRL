import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';

export const WeeklyUpdate = () => {
  const { weeklyUpdates, getStatusColor } = useDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Weekly Update</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Comprehensive overview of weekly activities and progress</p>
      
      <div className="space-y-4">
        {weeklyUpdates.map((update, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {renderIcon(update.iconType, update.iconClass)}
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
