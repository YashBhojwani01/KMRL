import { Calendar, User, FileText, AlertCircle, Clock, FileType, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ViewButton, DownloadButton, AskAIButton } from "@/utils/buttonUtils";
import { useDashboardData } from "@/hooks/useDashboardData";

interface DocumentCardProps {
  document: {
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
  };
  onClick?: () => void;
  onView?: (documentId: string) => void;
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

export const DocumentCard = ({ document, onClick, onView }: DocumentCardProps) => {
  const { handleDocumentView, handleDocumentDownload, handleDocumentAskAI } = useDashboardData();
  
  // Add error handling for undefined document
  if (!document) {
    console.error('DocumentCard: document prop is undefined');
    return null;
  }
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className="transition-all duration-300 hover:shadow-xl cursor-pointer bg-white border border-slate-200 hover:border-blue-400 rounded-xl shadow-md overflow-hidden flex flex-col"
      onClick={handleClick}
    >
      <CardHeader className="p-5 space-y-3 bg-slate-50 border-b border-slate-200">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{document.title}</h3>
          </div>
          <div className="flex items-center space-x-1 text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
            {getFileIcon(document.fileType || 'txt')}
            <span className="text-xs font-semibold">{document.fileType?.toUpperCase() || 'TXT'}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs">{document.fileSize || '0 KB'}</span>
          </div>
        </div>

        {/* Status Tags Row */}
        <div className="flex items-center space-x-2">
          <Badge className={cn("text-xs px-2 py-1 font-semibold", urgencyBadgeColors[document.urgency])}>
            {document.urgency.toUpperCase()}
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 font-medium">
            {document.department}
          </Badge>
          <Badge className={cn("text-xs px-2 py-1 font-medium", statusColors[document.status as keyof typeof statusColors] || "bg-slate-100 text-slate-700")}>
            {document.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-grow space-y-4">
        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
          {document.summary}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{document.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{document.date}</span>
          </div>
        </div>

        {/* Content Tags */}
        {document.contentTags && document.contentTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {document.contentTags.slice(0, 4).map((tag, index) => (
              <Badge key={index} className="bg-slate-600 text-white text-xs px-2 py-1 flex items-center space-x-1.5 font-medium">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>{tag}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Action Buttons */}
      <div className="p-5 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <ViewButton onClick={() => onView ? onView(document.id) : handleDocumentView(document.id)} />
          <AskAIButton onClick={() => handleDocumentAskAI(document.id)} />
          <DownloadButton onClick={() => handleDocumentDownload(document.id)} />
        </div>
      </div>
    </Card>
  );
};
