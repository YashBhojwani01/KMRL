import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { FullCalendar } from './FullCalendar';
import { AddEventModal } from './AddEventModal';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';
import { AddEventButton, ExportButton } from '@/utils/buttonUtils';

export const CalendarFeature = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { emailData, isLoadingEmails } = useDashboardData();

  // Generate calendar events from email data
  const generateCalendarEvents = () => {
    if (isLoadingEmails || !emailData.length) {
      return [];
    }

    // Convert emails to calendar events
    const events = emailData
      .filter(email => email.deadlineDate) // Only emails with deadlines
      .slice(0, 5) // Show top 5 upcoming events
      .map((email, index) => {
        const eventDate = new Date(email.deadlineDate!);
        const now = new Date();
        const isOverdue = eventDate < now;
        const isToday = eventDate.toDateString() === now.toDateString();
        
        return {
          id: email.id,
          title: email.title,
          date: email.deadlineDate!,
          time: isToday ? 'Today' : eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          priority: email.urgency,
          type: email.category.toLowerCase().replace(' document', ''),
          department: email.department,
          isOverdue,
          isToday
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return events;
  };

  const calendarEvents = generateCalendarEvents();

  const getPriorityColorOutline = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'safety':
        return { iconType: 'alert-triangle', iconClass: 'text-red-500' };
      case 'budget':
      case 'finance':
        return { iconType: 'dollar-sign', iconClass: 'text-green-500' };
      case 'training':
        return { iconType: 'book', iconClass: 'text-blue-500' };
      case 'operations':
        return { iconType: 'settings', iconClass: 'text-purple-500' };
      case 'compliance':
        return { iconType: 'shield', iconClass: 'text-orange-500' };
      default:
        return { iconType: 'calendar', iconClass: 'text-gray-500' };
    }
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'No Date';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Not specified';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExportEvents = () => {
    // Export functionality
    console.log('Exporting calendar events...');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold">Schedule & Calendar</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <AddEventButton onClick={() => setIsAddEventOpen(true)} />
          <ExportButton onClick={handleExportEvents} children="Export" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Events */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 text-sm">Upcoming Events</h4>
          <div className="space-y-2">
            {isLoadingEmails ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-500">Loading events...</span>
              </div>
            ) : calendarEvents.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Calendar className="mx-auto h-8 w-8" />
                </div>
                <p className="text-sm text-gray-500">No upcoming events scheduled</p>
              </div>
            ) : (
              calendarEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {renderIcon(getTypeIcon(event.type).iconType as any, getTypeIcon(event.type).iconClass)}
                      <span className="text-sm font-medium text-slate-900">{event.title}</span>
                    </div>
                    <Badge className={`${getPriorityColorOutline(event.priority)} text-xs`}>
                      {event.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span>{formatDate(event.date)}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))
            )}
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

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        selectedDate={selectedDate}
      />
    </Card>
  );
};
