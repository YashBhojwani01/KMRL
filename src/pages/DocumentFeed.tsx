import { useState } from "react";
import { Header } from "@/components/Header";
import { DocumentCard } from "@/components/DocumentCard";
import { DocumentDetailModal } from "@/components/DocumentDetailModal";
import { DocumentChatModal } from "@/components/DocumentChatModal";
import { EmailStatusIndicator } from "@/components/EmailStatusIndicator";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/AuthContext";

// Mock documents - fallback when no email data is available
const mockDocuments = [
  {
    id: "1",
    title: "Q4 Financial Report",
    department: "Finance",
    category: "Financial Report",
    urgency: "high" as const,
    date: "10/01/2024",
    author: "System User",
    summary: "Comprehensive quarterly financial analysis showing 12% revenue growth and operational improvements across all metro lines.",
    language: "english" as const,
    fileType: "PDF",
    fileSize: "2.3 MB",
    status: "pending",
    contentTags: ["financial", "quarterly", "report"]
  },
  {
    id: "2",
    title: "Safety Protocol Updates",
    department: "Operations",
    category: "Safety Document",
    urgency: "urgent" as const,
    date: "09/01/2024",
    author: "Priya Nair",
    summary: "Updated safety procedures following recent industry standards and regulatory requirements for metro operations.",
    language: "english" as const,
    fileType: "DOCX",
    fileSize: "1.1 MB",
    status: "acknowledged",
    contentTags: ["safety", "protocol", "operations"]
  },
  {
    id: "3",
    title: "Employee Training Schedule",
    department: "HR",
    category: "Training Document",
    urgency: "medium" as const,
    date: "08/01/2024",
    author: "Anita Singh",
    summary: "Detailed training schedule for Q1 2024 including technical skills, safety protocols, and customer service modules.",
    language: "english" as const,
    fileType: "XLSX",
    fileSize: "890 KB",
    status: "completed",
    contentTags: ["training", "hr", "schedule"]
  },
  {
    id: "4",
    title: "Infrastructure Maintenance Report",
    department: "Engineering",
    category: "Maintenance Report",
    urgency: "high" as const,
    date: "07/01/2024",
    author: "Vikram Sharma",
    summary: "Monthly infrastructure assessment covering track conditions, electrical systems, and station facilities maintenance status.",
    language: "english" as const,
    fileType: "PDF",
    fileSize: "3.7 MB",
    status: "forwarded",
    contentTags: ["infrastructure", "maintenance", "engineering"]
  },
];

const DocumentFeed = () => {
  const { user } = useAuth();
  const { 
    documents, 
    emailData, 
    emailStats, 
    isLoadingEmails, 
    emailError, 
    fetchEmailData, 
    triggerEmailReading, 
    isChatModalOpen,
    chatDocument,
    closeChatModal,
  } = useDashboardData();
  
  const [selectedDocument, setSelectedDocument] = useState<
    (typeof documents)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleDocumentClick = (document: typeof documents[0]) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleEmailRefresh = async () => {
    if (user?.id) {
      try {
        await triggerEmailReading(user.id);
      } catch (error) {
        console.error('Failed to refresh emails:', error);
      }
    }
  };

  const handleEmailFetch = async () => {
    if (user?.id) {
      try {
        await fetchEmailData(user.id);
      } catch (error) {
        console.error('Failed to fetch emails:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Document Feed</h1>
              <p className="text-slate-600 text-lg">Recent documents processed by the AI system</p>
              
            {/* Email Status Indicator */}
            <div className="mt-4 flex justify-center">
              <EmailStatusIndicator
                isLoading={isLoadingEmails}
                emailCount={emailData.length}
                error={emailError}
                onRefresh={handleEmailRefresh}
              />
            </div>
            
            {/* Loading State */}
            {isLoadingEmails && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-slate-600">Loading email data...</span>
                </div>
              </div>
            )}
            </div>
            
            
            {/* Search and Date Inputs */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search documents by title, author, or content..."
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="date"
                    placeholder="dd-mm-yyyy"
                    className="pr-12 h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-52 text-base"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Count and Stats */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 font-medium">Total Documents:</span>
                  <span className="text-sm font-bold text-slate-900">{documents.length > 0 ? documents.length : mockDocuments.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 font-medium">Showing:</span>
                  <span className="text-sm font-bold text-blue-600">All</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 font-medium">Last Updated:</span>
                  <span className="text-sm font-bold text-slate-900">Today</span>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Click any document to view details
              </div>
            </div>
          </div>

          {/* Document Cards Grid */}
          {!isLoadingEmails && emailData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No emails found</h3>
              <p className="text-slate-500 mb-4">No relevant emails have been processed yet.</p>
              <Button onClick={handleEmailFetch} variant="outline">
                Refresh Email Data
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {(documents.length > 0 ? documents : mockDocuments).map((doc) => {
                const displayedDocuments = documents.length > 0 ? documents : mockDocuments;
                return (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onClick={() => handleDocumentClick(doc as any)}
                    onView={(documentId) => {
                      const document = displayedDocuments.find(d => d.id === documentId);
                      if (document) {
                        handleDocumentClick(document as any);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Document Detail Modal */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <DocumentChatModal
        isOpen={isChatModalOpen}
        onClose={closeChatModal}
        document={chatDocument}
      />
    </div>
  );
};

export default DocumentFeed;
