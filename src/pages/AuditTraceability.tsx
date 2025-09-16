import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Clock, 
  User, 
  FileText, 
  Search, 
  Filter,
  Eye,
  GitBranch,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download
} from "lucide-react";

const mockAuditLogs = [
  {
    id: "1",
    action: "Document Created",
    document: "Safety Protocol Update - Platform Edge Doors",
    user: "Dr. Priya Nair",
    role: "Safety Manager",
    timestamp: "2024-01-11 09:15:32",
    details: "Initial document upload and AI processing completed",
    status: "approved",
    version: "1.0"
  },
  {
    id: "2",
    action: "Document Viewed",
    document: "Safety Protocol Update - Platform Edge Doors",
    user: "Ravi Chandran",
    role: "Station Controller",
    timestamp: "2024-01-11 09:45:12",
    details: "Accessed document summary for shift briefing",
    status: "normal",
    version: "1.0"
  },
  {
    id: "3",
    action: "Document Edited",
    document: "Vendor Invoice Processing - Electrical Components",
    user: "Suresh Menon",
    role: "Finance Officer",
    timestamp: "2024-01-10 14:30:25",
    details: "Updated payment approval status and added notes",
    status: "approved",
    version: "1.2"
  },
  {
    id: "4",
    action: "Access Denied",
    document: "HR Policy Amendment - Confidential",
    user: "Guest User",
    role: "External",
    timestamp: "2024-01-10 11:20:15",
    details: "Unauthorized access attempt blocked",
    status: "security",
    version: "N/A"
  },
  {
    id: "5",
    action: "Version Restored",
    document: "Operations Report - December 2023",
    user: "Admin User",
    role: "System Admin",
    timestamp: "2024-01-09 16:45:30",
    details: "Restored to version 2.1 due to data inconsistency",
    status: "normal",
    version: "2.1"
  }
];

const statusColors = {
  approved: "bg-success text-success-foreground",
  normal: "bg-accent text-accent-foreground",
  security: "bg-urgent text-urgent-foreground",
  pending: "bg-medium text-warning-foreground"
};

const statusIcons = {
  approved: CheckCircle,
  normal: FileText,
  security: AlertCircle,
  pending: Clock
};

const AuditTraceability = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser === "all" || log.user === filterUser;
    const matchesAction = filterAction === "all" || log.action.toLowerCase().includes(filterAction.toLowerCase());
    
    return matchesSearch && matchesUser && matchesAction;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Audit & Traceability</h1>
                <p className="text-slate-600 mt-2">
                  Complete history of document activities and user access logs
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filter
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                      <p className="text-sm text-muted-foreground">Total Actions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">892</p>
                      <p className="text-sm text-muted-foreground">Document Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <GitBranch className="h-8 w-8 text-medium" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-sm text-muted-foreground">Version Changes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-8 w-8 text-urgent" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">3</p>
                      <p className="text-sm text-muted-foreground">Security Events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search & Filter Logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <Input
                      placeholder="Search documents, users, or actions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="Dr. Priya Nair">Dr. Priya Nair</SelectItem>
                      <SelectItem value="Ravi Chandran">Ravi Chandran</SelectItem>
                      <SelectItem value="Suresh Menon">Suresh Menon</SelectItem>
                      <SelectItem value="Admin User">Admin User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="created">Document Created</SelectItem>
                      <SelectItem value="viewed">Document Viewed</SelectItem>
                      <SelectItem value="edited">Document Edited</SelectItem>
                      <SelectItem value="restored">Version Restored</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Audit History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredLogs.map((log) => {
                    const StatusIcon = statusIcons[log.status as keyof typeof statusIcons];
                    return (
                      <div
                        key={log.id}
                        className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <StatusIcon className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-foreground">{log.action}</span>
                                <Badge className={statusColors[log.status as keyof typeof statusColors]}>
                                  {log.status.toUpperCase()}
                                </Badge>
                                {log.version !== "N/A" && (
                                  <Badge variant="outline">v{log.version}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-foreground mb-1">{log.document}</p>
                              <p className="text-sm text-muted-foreground">{log.details}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{log.user} ({log.role})</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{log.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            {log.action === "Document Edited" && (
                              <Button variant="ghost" size="sm">
                                <GitBranch className="h-3 w-3 mr-1" />
                                Compare Versions
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
      </main>
    </div>
  );
};

export default AuditTraceability;
