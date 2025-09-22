import { Calendar, User, FileText, AlertCircle, Clock, FileType, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ViewButton, DownloadButton, AskAIButton } from "@/utils/buttonUtils";
import { useDashboardData } from "@/hooks/useDashboardData";

interface DocumentCardProps {
  id: string;
  title: string;
  department: string;
  category: string;
  urgency: "high" | "medium" | "low" | "urgent";
  date: string;
  author: string;
  summary: string;
  language: "english" | "malayalam" | "bilingual";
  hasDeadline?: boolean;
  deadlineDate?: string;
  fileType?: string;
  fileSize?: string;
  status?: string;
  contentTags?: string[];
}

const urgencyColors = {
  high: "border-l-urgent bg-urgent/5",
  medium: "border-l-medium bg-medium/5",
  low: "border-l-success bg-success/5",
  urgent: "border-l-red-500 bg-red-50"
};

const urgencyBadgeColors = {
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  low: "bg-green-100 text-green-800 border-green-200",
  urgent: "bg-red-100 text-red-800 border-red-200"
};

const statusColors = {
  pending: "bg-orange-100 text-orange-800 border-orange-200",
  acknowledged: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  forwarded: "bg-green-100 text-green-800 border-green-200"
};

const getFileIcon = (fileType: string) => {
  switch (fileType?.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-4 w-4" />;
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheet className="h-4 w-4" />;
    case 'docx':
    case 'doc':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileType className="h-4 w-4" />;
  }
};

export const DocumentCard = ({
  id,
  title,
  department,
  category,
  urgency,
  date,
  author,
  summary,
  language,
  hasDeadline,
  deadlineDate,
  fileType,
  fileSize,
  status,
  contentTags,
  onClick
}: DocumentCardProps & { onClick?: () => void }) => {
  const { handleDocumentView, handleDocumentDownload, handleDocumentAskAI } = useDashboardData();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg cursor-pointer bg-white border border-slate-200 hover:border-blue-300 rounded-lg shadow-sm hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader className="pb-4 p-6 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-xl leading-tight mb-2">{title}</h3>
            <div className="flex items-center space-x-2 text-slate-500">
              {getFileIcon(fileType || 'pdf')}
              <span className="text-sm font-medium">{fileType?.toUpperCase()}</span>
              <span className="text-slate-300">•</span>
              <span className="text-sm">{fileSize}</span>
            </div>
          </div>
        </div>

        {/* Status Tags Row */}
        <div className="flex items-center space-x-2">
          <Badge className={cn("text-xs px-3 py-1.5 font-semibold", urgencyBadgeColors[urgency])}>
            {urgency.toUpperCase()}
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1.5 font-medium">
            {department}
          </Badge>
          <Badge className={cn("text-xs px-3 py-1.5 font-medium", statusColors[status as keyof typeof statusColors] || "bg-slate-100 text-slate-700")}>
            {status}
          </Badge>
        </div>

        {/* Description */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-slate-700 text-sm leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-600">
            <User className="h-4 w-4" />
            <span className="font-medium">{author}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{date}</span>
          </div>
        </div>

        {/* Content Tags */}
        {contentTags && contentTags.length > 0 && (
          <div className="flex items-center space-x-2">
            {contentTags.map((tag, index) => (
              <Badge key={index} className="bg-slate-600 text-white text-xs px-3 py-1.5 flex items-center space-x-1.5 font-medium">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>{tag}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-3">
            <ViewButton 
              onClick={() => handleDocumentView(id)}
            />
            <AskAIButton 
              onClick={() => handleDocumentAskAI(id)}
            />
            <DownloadButton 
              onClick={() => handleDocumentDownload(id)}
            />
          </div>
          
          {/* Feedback Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Was this helpful?</span>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-3 text-xs text-green-600 hover:bg-green-50 hover:text-green-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Helpful
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Not Helpful
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
