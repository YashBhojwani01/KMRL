import { useState } from "react";
import { Search, Bell, MessageCircle, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NotificationPanel } from "./NotificationPanel";

export const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative">
      <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">KMRL Document Intelligence</h1>
                <p className="text-sm text-slate-600">Government Document Management System</p>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search documents, summaries, or ask AI..."
                className="pl-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">Rajesh Kumar</p>
                <p className="text-slate-600">Station Controller</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
};
