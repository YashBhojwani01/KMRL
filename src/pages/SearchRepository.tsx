import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, FileText } from "lucide-react";

const mockSearchResults = [
  {
    id: "1",
    title: "Urgent: Updated Track Maintenance Protocol",
    category: "Safety",
    urgency: "High",
    date: "7/29/2024",
    department: "Safety & Operations"
  },
  {
    id: "2",
    title: "Vendor Invoice Deadline Reminder: ACME Corp",
    category: "Finance",
    urgency: "Medium", 
    date: "7/29/2024",
    department: "Finance"
  },
  {
    id: "3",
    title: "പുതിയ ഷിഫ്റ്റ് റോസ്റ്റർ പ്രസിദ്ധീകരിച്ചു",
    category: "HR",
    urgency: "Low",
    date: "7/28/2024",
    department: "HR"
  },
  {
    id: "4",
    title: "Monthly Operations Report - Performance Analysis",
    category: "Operations",
    urgency: "Medium",
    date: "7/27/2024", 
    department: "Operations"
  },
  {
    id: "5",
    title: "Electrical Components Purchase Order Approval",
    category: "Procurement",
    urgency: "High",
    date: "7/26/2024",
    department: "Procurement"
  }
];

const SearchRepository = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("any");

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-urgent/10 text-urgent border-urgent";
      case "medium":
        return "bg-medium/10 text-medium border-medium";
      case "low":
        return "bg-success/10 text-success border-success";
      default:
        return "bg-muted/10 text-muted-foreground border-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Search Document Repository</h1>
              <p className="text-muted-foreground">
                Find documents by content, title, or entities using semantic and keyword search
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-muted/20 rounded-lg p-6 space-y-6">
              {/* Semantic Search */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Semantic Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by content, title, or entities..."
                    className="pl-10 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="procurement">Procurement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full h-10">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Search Results (Showing {mockSearchResults.length} documents)
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{mockSearchResults.length} found</Badge>
                </div>
              </div>

              {/* Results Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Urgency</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSearchResults.map((result) => (
                      <TableRow key={result.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium max-w-md">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{result.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-background">
                            {result.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getUrgencyColor(result.urgency)}>
                            {result.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {result.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Search Tips */}
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-accent">Search Tips:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• Use specific keywords for better results</div>
                  <div>• Search by document content, not just titles</div>
                  <div>• Try searching in Malayalam for regional documents</div>
                  <div>• Use date filters to narrow down results</div>
                  <div>• Search for invoice numbers, dates, or entity names</div>
                  <div>• Combine multiple filters for precise results</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchRepository;
