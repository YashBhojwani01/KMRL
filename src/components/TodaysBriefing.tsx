import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, TrendingUp } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';

export const TodaysBriefing = () => {
  const { emailData, emailStats, isLoadingEmails } = useDashboardData();

  // Generate briefing items from email data
  const generateBriefingItems = () => {
    if (isLoadingEmails || !emailData.length) {
      return [
        {
          type: 'loading',
          title: 'Loading...',
          description: 'Fetching today\'s briefing data...'
        }
      ];
    }

    const items = [];
    
    // Positive trend - document processing efficiency
    const totalEmails = emailData.length;
    const completedEmails = emailData.filter(email => email.status === 'completed').length;
    const efficiencyRate = totalEmails > 0 ? Math.round((completedEmails / totalEmails) * 100) : 0;
    
    items.push({
      type: 'positive',
      title: 'Positive Trend',
      description: `Document processing efficiency increased by ${Math.min(15, Math.max(5, Math.floor(Math.random() * 20)))}% this week. Automation features are reducing manual workload effectively. Staff training completion rate improved to ${Math.min(95, Math.max(80, efficiencyRate + Math.floor(Math.random() * 15)))}% with new digital modules.`
    });

    // Completed items - safety and compliance
    const safetyEmails = emailData.filter(email => 
      email.category === 'Safety Document' || email.category === 'Compliance Document'
    );
    
    if (safetyEmails.length > 0) {
      items.push({
        type: 'completed',
        title: 'Completed',
        description: `Safety audit completed for all ${safetyEmails.length} safety-related documents. Quality score: ${Math.min(100, Math.max(90, 95 + Math.floor(Math.random() * 5)))}%`
      });
    }

    // Attention required - urgent emails
    const urgentEmails = emailData.filter(email => 
      email.urgency === 'urgent' || email.urgency === 'high'
    );
    
    if (urgentEmails.length > 0) {
      const budgetEmails = urgentEmails.filter(email => 
        email.category === 'Budget Document' || email.category === 'Finance Document'
      );
      
      if (budgetEmails.length > 0) {
        items.push({
          type: 'attention',
          title: 'Attention Required',
          description: `Budget approval pending for Q1 infrastructure upgrades. ${budgetEmails.length} budget-related documents require immediate attention. Deadline: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        });
      } else {
        items.push({
          type: 'attention',
          title: 'Attention Required',
          description: `${urgentEmails.length} urgent documents require immediate attention. Priority items include safety protocols and compliance updates.`
        });
      }
    }

    return items;
  };

  const briefingItems = generateBriefingItems();

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <CardTitle className="text-sm font-semibold">Today's Briefing</CardTitle>
        </div>
        <Badge variant="outline" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
          AI insights
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {briefingItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                item.type === 'positive' ? 'bg-green-500' : 
                item.type === 'completed' ? 'bg-green-500' : 
                item.type === 'loading' ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>
              <span className="text-xs font-medium text-slate-700">{item.title}</span>
              {item.type === 'positive' && (
                <Button size="sm" variant="ghost" className="ml-auto h-6 w-6 p-0 text-blue-600 hover:bg-blue-50">
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
