import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DocumentChatWindow } from "@/components/DocumentChatWindow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";

const UploadDocuments = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setIsProcessing(true);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const mockAnalysisResults = {
    category: "Safety Bulletin",
    department: "Safety & Operations",
    urgency: "high",
    language: "English",
    entities: [
      { type: "Date", value: "January 15, 2024" },
      { type: "Location", value: "Platform Edge Doors" },
      { type: "Priority", value: "Urgent" }
    ],
    summary: [
      "Emergency safety protocol update for platform edge doors",
      "Immediate implementation required across all stations",
      "Staff training mandatory by January 20th",
      "Coordination with maintenance teams for system checks"
    ],
    compliance: {
      status: "Action Required",
      deadline: "January 20, 2024",
      responsible: "Station Controllers"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Upload Documents</h1>
              <p className="text-muted-foreground">
                Upload documents for AI-powered analysis and processing
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Upload</CardTitle>
                  <CardDescription>
                    Select your role and upload documents for intelligent processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Role</label>
                    <Select defaultValue="station-controller">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="station-controller">Station Controller</SelectItem>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="finance-officer">Finance Officer</SelectItem>
                        <SelectItem value="hr-manager">HR Manager</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Drop files here or click to upload</p>
                        <p className="text-sm text-muted-foreground">
                          Supports PDF, DOC, DOCX, Images (PNG, JPG, JPEG)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="file-upload">
                          <Button variant="outline" className="mt-4 cursor-pointer">
                            Select Files
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {isProcessing && uploadedFile && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">{uploadedFile}</span>
                          {uploadProgress === 100 ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Clock className="h-4 w-4 text-medium animate-spin" />
                          )}
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                          {uploadProgress === 100 ? "Processing complete" : `Processing... ${uploadProgress}%`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Supported Sources */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Supported Sources:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>• Email attachments</div>
                      <div>• SharePoint documents</div>
                      <div>• Maximo exports</div>
                      <div>• WhatsApp PDFs</div>
                      <div>• Cloud storage links</div>
                      <div>• Scanned documents</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {uploadProgress === 100 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Analysis Complete</span>
                    </CardTitle>
                    <CardDescription>
                      AI-powered document analysis results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Classification */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Document Classification</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Category</p>
                          <Badge variant="secondary">{mockAnalysisResults.category}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <Badge variant="outline">{mockAnalysisResults.department}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Urgency</p>
                          <Badge className="bg-urgent/10 text-urgent border-urgent">
                            {mockAnalysisResults.urgency.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Language</p>
                          <Badge variant="outline">{mockAnalysisResults.language}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Key Entities */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Extracted Entities</h4>
                      <div className="space-y-2">
                        {mockAnalysisResults.entities.map((entity, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{entity.type}:</span>
                            <span className="text-muted-foreground">{entity.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="space-y-3">
                      <h4 className="font-medium">AI Summary</h4>
                      <ul className="space-y-1 text-sm">
                        {mockAnalysisResults.summary.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Compliance Alert */}
                    <div className="bg-urgent/5 border border-urgent/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-urgent" />
                        <span className="font-medium text-urgent">Compliance Alert</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Status:</span> {mockAnalysisResults.compliance.status}</p>
                        <p><span className="font-medium">Deadline:</span> {mockAnalysisResults.compliance.deadline}</p>
                        <p><span className="font-medium">Responsible:</span> {mockAnalysisResults.compliance.responsible}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Add to Document Feed
                      </Button>
                      <Button variant="outline" size="sm">
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Document Chat Window - appears after upload is complete */}
            {uploadProgress === 100 && (
              <div className="mt-6">
                <DocumentChatWindow documentTitle={uploadedFile} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadDocuments;
