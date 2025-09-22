import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { renderIcon } from '@/utils/iconUtils';

export const MetricsCards = () => {
  const { metrics } = useDashboardData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <Card key={m.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{m.title}</CardTitle>
            {renderIcon(m.iconType, m.iconClass)}
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
