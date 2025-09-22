import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ArrowRight, 
  ThumbsUp, 
  Eye, 
  Download, 
  Bot, 
  Plus, 
  FileDown, 
  Search, 
  GitCompare,
  MessageSquare,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Centralized button styling
export const getButtonStyles = (variant: ButtonVariant, size: ButtonSize = 'md') => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";
  
  const sizeStyles = {
    sm: "h-8 px-3 text-xs [&_svg]:size-3",
    md: "h-10 px-4 text-sm [&_svg]:size-4", 
    lg: "h-12 px-6 text-base [&_svg]:size-5"
  };

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-500",
    ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm hover:shadow-md",
    warning: "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500 shadow-sm hover:shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm hover:shadow-md"
  };

  return cn(baseStyles, sizeStyles[size], variantStyles[variant]);
};

// Pre-configured button components
export const QuickResolveButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={cn(getButtonStyles('success', 'sm'), className)}
  >
    <CheckCircle className="h-3 w-3" />
    Quick Resolve
  </Button>
);

export const AddEventButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={cn(getButtonStyles('primary', 'sm'), className)}
  >
    <Plus className="h-3 w-3" />
    Add Event
  </Button>
);

export const ExportButton = ({ onClick, disabled = false, className, children = "Export" }: { onClick: () => void; disabled?: boolean; className?: string; children?: React.ReactNode }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <FileDown className="h-3 w-3" />
    {children}
  </Button>
);

export const AcknowledgeButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <ThumbsUp className="h-3 w-3" />
    Acknowledge
  </Button>
);

export const DoneButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={cn(getButtonStyles('success', 'sm'), className)}
  >
    <CheckCircle className="h-3 w-3" />
    Done
  </Button>
);

export const ForwardButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <ArrowRight className="h-3 w-3" />
    Forward
  </Button>
);

export const AskAIButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <Bot className="h-3 w-3" />
    Ask AI
  </Button>
);

export const ViewButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <Eye className="h-3 w-3" />
    View
  </Button>
);

export const DownloadButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <Download className="h-3 w-3" />
    Download
  </Button>
);

export const AddThreadButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={cn(getButtonStyles('primary', 'md'), className)}
  >
    <MessageSquare className="h-4 w-4" />
    Add Thread
  </Button>
);

export const ExportLogsButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <FileDown className="h-3 w-3" />
    Export Logs
  </Button>
);

export const ViewDetailsButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <Eye className="h-3 w-3" />
    View Details
  </Button>
);

export const CompareVersionsButton = ({ onClick, disabled = false, className }: { onClick: () => void; disabled?: boolean; className?: string }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant="outline"
    className={cn(getButtonStyles('outline', 'sm'), className)}
  >
    <GitCompare className="h-3 w-3" />
    Compare Versions
  </Button>
);
