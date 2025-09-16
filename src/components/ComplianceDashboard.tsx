import { AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const complianceMetrics = [
  {
    title: "Safety Bulletins",
    completed: 8,
    total: 10,
    percentage: 80,
    priority: "high",
    dueDate: "2024-01-15"
  },
  {
    title: "Financial Reports",
    completed: 12,
    total: 12,
    percentage: 100,
    priority: "medium",
    dueDate: "2024-01-10"
  },
  {
    title: "HR Compliance",
    completed: 5,
    total: 8,
    percentage: 62,
    priority: "medium",
    dueDate: "2024-01-20"
  },
  {
    title: "Maintenance Records",
    completed: 15,
    total: 18,
    percentage: 83,
    priority: "high",
    dueDate: "2024-01-12"
  }
];

const urgentActions = [
  {
    title: "Station Safety Protocol Update",
    department: "Safety",
    deadline: "Today",
    priority: "high"
  },
  {
    title: "Vendor Payment Approval",
    department: "Finance",
    deadline: "Tomorrow",
    priority: "high"
  },
  {
    title: "Employee Training Schedule",
    department: "HR",
    deadline: "3 days",
    priority: "medium"
  }
];

const stats = [
  {
    icon: FileText,
    label: "Documents Processed Today",
    value: "247",
    change: "+12%",
    trend: "up"
  },
  {
    icon: CheckCircle,
    label: "Compliance Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up"
  },
  {
    icon: Clock,
    label: "Avg. Processing Time",
    value: "2.3 min",
    change: "-0.8 min",
    trend: "down"
  },
  {
    icon: Users,
    label: "Active Users",
    value: "156",
    change: "+8",
    trend: "up"
  }
];

export const ComplianceDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className={`h-3 w-3 ${stat.trend === 'up' ? 'text-success' : 'text-urgent'}`} />
                    <span className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-urgent'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Compliance Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceMetrics.map((metric) => (
              <div key={metric.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {metric.completed}/{metric.total} completed • Due {metric.dueDate}
                    </p>
                  </div>
                  <Badge 
                    variant={metric.percentage === 100 ? "default" : "secondary"}
                    className={metric.percentage === 100 ? "bg-success" : ""}
                  >
                    {metric.percentage}%
                  </Badge>
                </div>
                <Progress value={metric.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-urgent" />
              <span>Urgent Actions Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{action.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {action.department}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Due: {action.deadline}</span>
                  </div>
                </div>
                <Badge 
                  className={action.priority === 'high' ? 'bg-urgent text-urgent-foreground' : 'bg-medium text-warning-foreground'}
                >
                  {action.priority.toUpperCase()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
