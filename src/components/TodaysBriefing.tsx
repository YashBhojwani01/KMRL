import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, TrendingUp } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';

export const TodaysBriefing = () => {
  const { briefingItems } = useDashboardData();

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
                item.type === 'completed' ? 'bg-green-500' : 'bg-orange-500'
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
