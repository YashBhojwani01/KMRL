import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, User, FileText } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface QuickResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionId: string;
  actionTitle: string;
  actionDescription: string;
  actionPriority: string;
  actionDepartment: string;
  actionDeadline: string;
}

export const QuickResolveModal = ({ 
  isOpen, 
  onClose, 
  actionId, 
  actionTitle, 
  actionDescription, 
  actionPriority, 
  actionDepartment, 
  actionDeadline 
}: QuickResolveModalProps) => {
  const { handleQuickResolve } = useDashboardData();
  const [resolutionData, setResolutionData] = useState({
    resolution: '',
    status: '',
    notes: '',
    assignTo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Resolving action:', { actionId, resolutionData });
    handleQuickResolve(actionId);
    onClose();
    // Reset form
    setResolutionData({
      resolution: '',
      status: '',
      notes: '',
      assignTo: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setResolutionData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Quick Resolve Action</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Action Details</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-1" />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{actionTitle}</h5>
                  <p className="text-sm text-gray-600 mt-1">{actionDescription}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColor(actionPriority)} text-xs`}>
                    {actionPriority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{actionDepartment}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>Due: {actionDeadline}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resolution Type */}
            <div>
              <Label htmlFor="resolution" className="text-sm font-medium text-gray-700">
                Resolution Type *
              </Label>
              <Select value={resolutionData.resolution} onValueChange={(value) => handleInputChange('resolution', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select resolution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delegated">Delegated</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="postponed">Postponed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status *
              </Label>
              <Select value={resolutionData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="requires-follow-up">Requires Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assign To */}
            <div className="md:col-span-2">
              <Label htmlFor="assignTo" className="text-sm font-medium text-gray-700">
                Assign To (Optional)
              </Label>
              <Select value={resolutionData.assignTo} onValueChange={(value) => handleInputChange('assignTo', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select person to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Myself</SelectItem>
                  <SelectItem value="team-lead">Team Lead</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="operations-team">Operations Team</SelectItem>
                  <SelectItem value="finance-team">Finance Team</SelectItem>
                  <SelectItem value="hr-team">HR Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Resolution Notes
            </Label>
            <Textarea
              id="notes"
              value={resolutionData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Describe what was done to resolve this action..."
              className="mt-1 min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Resolution Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resolution Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  {resolutionData.resolution || 'Resolution Type'} - {resolutionData.status || 'Status'}
                </span>
              </div>
              {resolutionData.assignTo && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Assigned to: {resolutionData.assignTo}</span>
                </div>
              )}
              {resolutionData.notes && (
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                  <p className="text-gray-600">{resolutionData.notes}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
