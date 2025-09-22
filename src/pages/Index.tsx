import { useState } from 'react';
import { MetricsCards } from '@/components/MetricsCards';
import { UrgentActions } from '@/components/UrgentActions';
import { TodaysBriefing } from '@/components/TodaysBriefing';
import { DueWork } from '@/components/DueWork';
import { CalendarFeature } from '@/components/CalendarFeature';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToDoTasks } from '@/components/ToDoTasks';
import { WeeklyUpdate } from '@/components/WeeklyUpdate';
import { Header } from "@/components/Header";
import { DashboardChatbot } from '@/components/DashboardChatbot';
import { useDashboardData } from '@/hooks/useDashboardData';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const dashboardData = useDashboardData();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 p-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-slate-200 rounded-lg p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="todo" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
            >
              Weekly Updates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">
            {/* Summary Metrics Cards */}
            <MetricsCards />
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Urgent Actions and Today's Briefing */}
              <div className="lg:col-span-1 space-y-6">
                <UrgentActions />
                <TodaysBriefing />
              </div>
              
              {/* Right Column - Due Work and Calendar */}
              <div className="lg:col-span-2 space-y-8">
                <DueWork />
                <CalendarFeature />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="todo">
            <ToDoTasks />
          </TabsContent>
          
          <TabsContent value="weekly">
            <WeeklyUpdate />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Dashboard Chatbot */}
      <DashboardChatbot />
    </div>
  );
};

export default Index;
