import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

export const EmailDebugPanel: React.FC = () => {
  const { user } = useAuth();
  const { 
    emailData, 
    emailStats, 
    isLoadingEmails, 
    emailError, 
    fetchEmailData, 
    triggerEmailReading 
  } = useDashboardData();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTestFetch = async () => {
    if (user?.id) {
      console.log('🧪 Testing email fetch for user:', user.id);
      await fetchEmailData(user.id);
    }
  };

  const handleTestTrigger = async () => {
    if (user?.id) {
      console.log('🧪 Testing email trigger for user:', user.id);
      await triggerEmailReading(user.id);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Email Debug Panel</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* User Info */}
          <div>
            <h4 className="font-semibold mb-2">User Information</h4>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
              <p><strong>User Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>User Name:</strong> {user?.name || 'N/A'}</p>
            </div>
          </div>

          {/* Email Data Status */}
          <div>
            <h4 className="font-semibold mb-2">Email Data Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={isLoadingEmails ? "default" : "secondary"}>
                  {isLoadingEmails ? "Loading" : "Idle"}
                </Badge>
                <span>Loading State</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={emailError ? "destructive" : "secondary"}>
                  {emailError ? "Error" : "No Error"}
                </Badge>
                <span>Error State</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {emailData.length} emails
                </Badge>
                <span>Email Count</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {emailError && (
            <div>
              <h4 className="font-semibold mb-2 text-red-600">Error Details</h4>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="text-red-800">{emailError}</p>
              </div>
            </div>
          )}

          {/* Email Stats */}
          {emailStats && (
            <div>
              <h4 className="font-semibold mb-2">Email Statistics</h4>
              <div className="bg-blue-50 p-3 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(emailStats, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Email Data Preview */}
          <div>
            <h4 className="font-semibold mb-2">Email Data Preview</h4>
            <div className="bg-gray-50 p-3 rounded max-h-60 overflow-auto">
              {emailData.length > 0 ? (
                <div className="space-y-2">
                  {emailData.slice(0, 3).map((email, index) => (
                    <div key={email.id} className="border-b pb-2">
                      <p><strong>Title:</strong> {email.title}</p>
                      <p><strong>Department:</strong> {email.department}</p>
                      <p><strong>Category:</strong> {email.category}</p>
                      <p><strong>Urgency:</strong> {email.urgency}</p>
                      <p><strong>Date:</strong> {email.date}</p>
                    </div>
                  ))}
                  {emailData.length > 3 && (
                    <p className="text-sm text-gray-600">
                      ... and {emailData.length - 3} more emails
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No email data available</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleTestFetch} disabled={!user?.id || isLoadingEmails}>
              Test Fetch Emails
            </Button>
            <Button onClick={handleTestTrigger} disabled={!user?.id}>
              Test Trigger Email Reading
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
