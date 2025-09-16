import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const TodaysBriefing = () => {
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
        {/* Main Briefing */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-700">Positive Trend</span>
            <Button size="sm" variant="ghost" className="ml-auto h-6 w-6 p-0 text-blue-600 hover:bg-blue-50">
              <Volume2 className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Document processing efficiency increased by 15% this week. Automation features are reducing manual workload effectively. 
            Staff training completion rate improved to 89% with new digital modules.
          </p>
        </div>

        {/* Key Updates */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-slate-700">Completed</span>
          </div>
          <p className="text-xs text-slate-600">
            Safety audit completed for all 22 stations. Quality score: 98%
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-3 w-3 text-orange-600" />
            <span className="text-xs font-medium text-slate-700">Attention Required</span>
          </div>
          <p className="text-xs text-slate-600">
            Budget approval pending for Q1 infrastructure upgrades. Deadline: Jan 18
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
