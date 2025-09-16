import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    title: "Urgent: Budget Approval Required",
    message: "Q1 infrastructure budget approval is pending. Deadline: Jan 18, 2024",
    type: "urgent",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    title: "Safety Audit Completed",
    message: "Monthly safety audit for all 22 stations has been completed successfully.",
    type: "success",
    time: "4 hours ago",
    read: false
  },
  {
    id: 3,
    title: "Training Session Reminder",
    message: "Mandatory safety training session scheduled for tomorrow at 2:00 PM",
    type: "reminder",
    time: "1 day ago",
    read: true
  }
];

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reminder': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'reminder': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`fixed top-16 right-6 z-50 w-80 ${isOpen ? "block" : "hidden"}`}>
      <div className="bg-white shadow-xl rounded-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 border-l-4 cursor-pointer hover:bg-slate-50 transition-colors ${getNotificationColor(notification.type)} ${
                !notification.read ? 'bg-slate-50' : 'bg-white'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <Button variant="ghost" size="sm" className="w-full text-xs text-slate-600 hover:text-slate-900">
            Mark all as read
          </Button>
        </div>
      </div>
    </div>
  );
};
