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
  const { calendarEvents, getPriorityColorOutline, getTypeIcon, formatDate, handleAddEvent, handleExportEvents } = useDashboardData();

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
            {calendarEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {renderIcon(getTypeIcon(event.type).iconType, getTypeIcon(event.type).iconClass)}
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

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        selectedDate={selectedDate}
      />
    </Card>
  );
};
