import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'training' | 'reminder';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  description?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Safety Protocol Review",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "meeting",
    priority: "high",
    description: "Monthly safety protocol review meeting"
  },
  {
    id: 2,
    title: "Budget Approval Deadline",
    date: "2024-01-18",
    time: "5:00 PM",
    type: "deadline",
    priority: "urgent",
    description: "Q1 infrastructure budget approval deadline"
  },
  {
    id: 3,
    title: "Staff Training Session",
    date: "2024-01-20",
    time: "2:00 PM",
    type: "training",
    priority: "medium",
    description: "Mandatory safety training for all staff"
  },
  {
    id: 4,
    title: "Monthly Report Submission",
    date: "2024-01-25",
    time: "12:00 PM",
    type: "deadline",
    priority: "high",
    description: "Submit monthly operational report"
  },
  {
    id: 5,
    title: "Vendor Meeting",
    date: "2024-01-28",
    time: "3:00 PM",
    type: "meeting",
    priority: "medium",
    description: "Meet with electrical components vendor"
  }
];

interface FullCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullCalendar = ({ isOpen, onClose }: FullCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => event.date === date);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="h-3 w-3" />;
      case 'deadline': return <AlertCircle className="h-3 w-3" />;
      case 'training': return <CheckCircle className="h-3 w-3" />;
      case 'reminder': return <Clock className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDateForAPI = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const days = getDaysInMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Schedule & Calendar</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{formatDate(currentDate)}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="h-16"></div>;
                    }
                    
                    const dateString = formatDateForAPI(day);
                    const dayEvents = getEventsForDate(dateString);
                    const isSelected = selectedDate === dateString;
                    const isToday = dateString === new Date().toISOString().split('T')[0];
                    
                    return (
                      <div
                        key={day}
                        className={`h-16 p-1 border border-slate-200 cursor-pointer hover:bg-slate-50 ${
                          isSelected ? 'bg-blue-100 border-blue-300' : ''
                        } ${isToday ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedDate(dateString)}
                      >
                        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-slate-900'}`}>
                          {day}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}
                              title={event.title}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-slate-500">+{dayEvents.length - 2}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? `Events - ${formatDateString(selectedDate)}` : 'Select a Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map(event => (
                        <div key={event.id} className="p-3 border rounded-lg hover:bg-slate-50">
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-full ${getPriorityColor(event.priority)}`}>
                              {getEventIcon(event.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{event.title}</h4>
                              <p className="text-sm text-slate-600">{event.time}</p>
                              {event.description && (
                                <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                              )}
                              <Badge className={`text-xs mt-2 ${getPriorityColor(event.priority)} text-white`}>
                                {event.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No events scheduled</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p>Click on a date to view events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

