import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { renderIcon } from "@/utils/iconUtils";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    getNotificationIcon, 
    getNotificationColor 
  } = useDashboardData();


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
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {renderIcon(getNotificationIcon(notification.type).iconType, getNotificationIcon(notification.type).iconClass)}
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-slate-600 hover:text-slate-900"
            onClick={markAllNotificationsAsRead}
          >
            Mark all as read
          </Button>
        </div>
      </div>
    </div>
  );
};
