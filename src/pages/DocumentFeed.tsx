import { useState } from "react";
import { Header } from "@/components/Header";
import { DocumentCard } from "@/components/DocumentCard";
import { DocumentDetailModal } from "@/components/DocumentDetailModal";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";

// Mock documents - now using centralized data from useDashboardData
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
  const { documents } = useDashboardData();
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
                  <span className="text-sm font-bold text-slate-900">{documents.length}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                {...doc}
                onClick={() => handleDocumentClick(doc)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Document Detail Modal */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DocumentFeed;
