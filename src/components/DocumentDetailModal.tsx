import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  User, 
  Eye, 
  FileText, 
  AlertCircle, 
  Clock, 
  Download,
  Languages,
  MessageSquare,
  History,
  Share2,
  ThumbsUp,
  ThumbsDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDetailProps {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const urgencyColors = {
  high: "border-l-urgent bg-urgent/5",
  medium: "border-l-medium bg-medium/5",
  low: "border-l-success bg-success/5",
  urgent: "border-l-red-500 bg-red-50"
};

const urgencyBadgeColors = {
  high: "bg-urgent text-urgent-foreground",
  medium: "bg-medium text-warning-foreground",
  low: "bg-success text-success-foreground",
  urgent: "bg-red-500 text-white"
};

// Mock detailed content
const mockDetailedSummary = {
  english: {
    title: "Safety Protocol Update - Platform Edge Doors Maintenance",
    summary: [
      "Monthly inspection schedule updated for all 22 stations",
      "New emergency response procedures for door malfunctions",
      "Staff training required by January 20th",
      "Coordination with vendor for spare parts inventory"
    ],
    fullContent: {
      keyPoints: [
        "All platform edge doors across 22 metro stations require monthly inspections starting January 15th",
        "New emergency protocol: 30-second response time for door malfunction alerts",
        "Mandatory training sessions scheduled for all station controllers and technical staff",
        "Vendor coordination meeting scheduled for January 18th to discuss spare parts procurement",
        "Updated safety checklist includes 15 new inspection points",
        "Emergency contact protocols updated with backup communication channels"
      ],
      actionItems: [
        "Station Controllers: Complete safety briefing by January 20th",
        "Technical Team: Update inspection logs and reporting systems",
        "HR Department: Schedule and track completion of mandatory training",
        "Procurement: Finalize vendor contracts for spare parts supply"
      ],
      deadline: "January 20, 2024",
      priority: "HIGH",
      affectedStations: "All 22 Metro Stations",
      estimatedImplementationTime: "2 weeks"
    }
  },
  malayalam: {
    title: "സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് - പ്ലാറ്റ്ഫോം എഡ്ജ് ഡോർ മെയിന്റനൻസ്",
    summary: [
      "22 സ്റ്റേഷനുകളിലെ മാസിക പരിശോധന ഷെഡ്യൂൾ അപ്ഡേറ്റ് ചെയ്തു",
      "ഡോർ തകരാറുകൾക്കുള്ള പുതിയ അടിയന്തര പ്രതികരണ നടപടിക്രമങ്ങൾ",
      "ജനുവരി 20-നകം സ്റ്റാഫ് പരിശീലനം ആവശ്യം",
      "സ്പെയർ പാർട്സ് ഇൻവെന്ററിക്കായി വെണ്ടറുമായി ഏകോപനം"
    ],
    fullContent: {
      keyPoints: [
        "22 മെട്രോ സ്റ്റേഷനുകളിലെ എല്ലാ പ്ലാറ്റ്ഫോം എഡ്ജ് ഡോറുകൾക്കും ജനുവരി 15 മുതൽ മാസിക പരിശോധന ആവശ്യം",
        "പുതിയ അടിയന്തര പ്രോട്ടോക്കോൾ: ഡോർ തകരാർ അലേർട്ടുകൾക്ക് 30-സെക്കൻഡ് പ്രതികരണ സമയം",
        "എല്ലാ സ്റ്റേഷൻ കൺട്രോളർമാർക്കും സാങ്കേതിക സ്റ്റാഫിനും നിർബന്ധിത പരിശീലന സെഷനുകൾ ഷെഡ്യൂൾ ചെയ്തു",
        "സ്പെയർ പാർട്സ് സംഭരണത്തെക്കുറിച്ച് ചർച്ച ചെയ്യാൻ ജനുവരി 18-ന് വെണ്ടർ കോർഡിനേഷൻ മീറ്റിംഗ് ഷെഡ്യൂൾ ചെയ്തു"
      ],
      actionItems: [
        "സ്റ്റേഷൻ കൺട്രോളർമാർ: ജനുവരി 20-നകം സുരക്ഷാ ബ്രീഫിംഗ് പൂർത്തിയാക്കുക",
        "സാങ്കേതിക ടീം: പരിശോധന ലോഗുകളും റിപ്പോർട്ടിംഗ് സിസ്റ്റങ്ങളും അപ്ഡേറ്റ് ചെയ്യുക",
        "HR വകുപ്പ്: നിർബന്ധിത പരിശീലനത്തിന്റെ ഷെഡ്യൂളും ട്രാക്കിംഗും",
        "സംഭരണം: സ്പെയർ പാർട്സ് വിതരണത്തിനുള്ള വെണ്ടർ കരാറുകൾ അന്തിമമാക്കുക"
      ]
    }
  }
};

export const DocumentDetailModal = ({ document, isOpen, onClose }: DocumentDetailProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "malayalam">("english");
  const [activeTab, setActiveTab] = useState("fullDetails");

  if (!document) return null;

  const currentContent = mockDetailedSummary[selectedLanguage];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="space-y-4">
          {/* Header with Close Button */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold leading-tight pr-4 text-slate-900">
                {currentContent.title}
              </DialogTitle>
              <div className="flex items-center space-x-2 mt-3">
                <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                  {document.department}
                </Badge>
                <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                  {document.category}
                </Badge>
                <Badge className={cn("text-xs", urgencyBadgeColors[document.urgency])}>
                  {document.urgency.toUpperCase()}
                </Badge>
                {document.language === "bilingual" && (
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                    ML/EN
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Button
                  variant={selectedLanguage === "english" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("english")}
                  className={selectedLanguage === "english" 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }
                >
                  <Languages className="h-3 w-3 mr-1" />
                  English
                </Button>
                <Button
                  variant={selectedLanguage === "malayalam" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage("malayalam")}
                  className={selectedLanguage === "malayalam" 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }
                >
                  <Languages className="h-3 w-3 mr-1" />
                  മലയാളം
                </Button>
              </div>
            </div>
          </div>

          {/* Date, Author, and Due Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
            </div>
            {document.hasDeadline && document.deadlineDate && (
              <div className="flex items-center space-x-1 text-red-600">
                <Clock className="h-3 w-3" />
                <span>Due: {document.deadlineDate}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Meta Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-accent/5 p-3 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{document.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{document.author}</span>
              </div>
            </div>
            {document.hasDeadline && (
              <div className="flex items-center space-x-1 text-urgent">
                <Clock className="h-3 w-3" />
                <span className="text-xs font-medium">Due: {document.deadlineDate}</span>
              </div>
            )}
          </div>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 rounded-lg p-1">
              <TabsTrigger 
                value="summary" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="fullDetails" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                Full Details
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                History
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium"
              >
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-6">
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">Key Points:</h4>
                <ul className="space-y-2">
                  {currentContent.summary.map((point, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="fullDetails" className="space-y-6 mt-6">
              <div className="space-y-6">
                {/* Detailed Key Points */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Detailed Key Points:</h4>
                  <ul className="space-y-3">
                    {currentContent.fullContent.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start space-x-3 leading-relaxed">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                {/* Action Items */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Action Items:</h4>
                  <ul className="space-y-3">
                    {currentContent.fullContent.actionItems.map((item, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start space-x-3 leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary Metadata */}
                {selectedLanguage === "english" && currentContent.fullContent && 'priority' in currentContent.fullContent && (
                  <>
                    <Separator className="my-6" />
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-slate-900">Priority:</span>
                        <span className="ml-2 text-red-600 font-medium">{currentContent.fullContent.priority}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Implementation Time:</span>
                        <span className="ml-2 text-slate-600">{currentContent.fullContent.estimatedImplementationTime}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Affected Stations:</span>
                        <span className="ml-2 text-slate-600">{currentContent.fullContent.affectedStations}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Deadline:</span>
                        <span className="ml-2 text-red-600 font-medium">{currentContent.fullContent.deadline}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="font-medium text-sm">Document Created</span>
                    <Badge variant="outline" className="text-xs">v1.0</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Created by {document.author} on {document.date}</p>
                </div>
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4 text-success" />
                    <span className="font-medium text-sm">Document Accessed</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Viewed by 12 users in last 24 hours</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Original
                </Button>
                <Button variant="outline" className="justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Document
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
                <Button variant="outline" className="justify-start">
                  <History className="h-4 w-4 mr-2" />
                  View Version History
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Feedback:</h4>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-success">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful (24)
                  </Button>
                  <Button variant="ghost" size="sm" className="text-urgent">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Not Helpful (2)
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
