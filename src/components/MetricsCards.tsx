import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileCheck2, Clock3, ShieldCheck } from 'lucide-react';

export const MetricsCards = () => {
  const metrics = [
    {
      id: 'processedDocs',
      title: 'Documents Processed',
      value: '1,248',
      trend: '+15%',
      icon: <FileCheck2 className="h-5 w-5 text-blue-600" />,
    },
    {
      id: 'onTimeRate',
      title: 'On-time Completion',
      value: '92%',
      trend: '+3%',
      icon: <Clock3 className="h-5 w-5 text-green-600" />,
    },
    {
      id: 'complianceScore',
      title: 'Compliance Score',
      value: '98',
      trend: 'Stable',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    },
    {
      id: 'weeklyTrend',
      title: 'Weekly Trend',
      value: 'Upward',
      trend: '+7%',
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <Card key={m.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{m.title}</CardTitle>
            {m.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{m.value}</div>
            <p className="text-xs text-slate-500">{m.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
