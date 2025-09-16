import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { FullCalendar } from './FullCalendar';

const mockEvents = [
  {
    id: 1,
    title: "Safety Protocol Review",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "meeting",
    priority: "high"
  },
  {
    id: 2,
    title: "Budget Approval Deadline",
    date: "2024-01-18",
    time: "5:00 PM",
    type: "deadline",
    priority: "urgent"
  },
  {
    id: 3,
    title: "Staff Training Session",
    date: "2024-01-20",
    time: "2:00 PM",
    type: "training",
    priority: "medium"
  },
  {
    id: 4,
    title: "Monthly Report Submission",
    date: "2024-01-25",
    time: "12:00 PM",
    type: "deadline",
    priority: "high"
  }
];

export const CalendarFeature = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="h-3 w-3" />;
      case 'deadline': return <AlertCircle className="h-3 w-3" />;
      case 'training': return <Clock className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold">Schedule & Calendar</CardTitle>
        </div>
        <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
          <Plus className="h-3 w-3 mr-1" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Events */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 text-sm">Upcoming Events</h4>
          <div className="space-y-2">
            {mockEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(event.type)}
                    <span className="text-sm font-medium text-slate-900">{event.title}</span>
                  </div>
                  <Badge className={`${getPriorityColor(event.priority)} text-xs`}>
                    {event.priority}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>{formatDate(event.date)}</span>
                  <span>•</span>
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
              onClick={() => setIsFullCalendarOpen(true)}
            >
              View Full Calendar
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-slate-300">
              Export Schedule
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Full Calendar Modal */}
      <FullCalendar 
        isOpen={isFullCalendarOpen} 
        onClose={() => setIsFullCalendarOpen(false)} 
      />
    </Card>
  );
};
