import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailStatusIndicatorProps {
  isLoading: boolean;
  emailCount: number;
  error: string | null;
  onRefresh: () => void;
  className?: string;
}

export const EmailStatusIndicator: React.FC<EmailStatusIndicatorProps> = ({
  isLoading,
  emailCount,
  error,
  onRefresh,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Email Count Badge */}
      <div className="flex items-center space-x-2">
        <Mail className="h-4 w-4 text-blue-600" />
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {emailCount} emails
        </Badge>
      </div>

      {/* Status Indicator */}
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-600">Loading emails...</span>
        </div>
      ) : error ? (
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">Failed to load emails</span>
        </div>
      ) : emailCount > 0 ? (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600">Emails loaded</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <span className="text-sm text-orange-600">No emails found</span>
        </div>
      )}

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="h-8 px-3"
      >
        <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
        Refresh
      </Button>
    </div>
  );
};
