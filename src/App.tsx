import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DocumentFeed from "./pages/DocumentFeed";
import { CrossDepartmentCommunication } from "./pages/Communication";
import AuditTraceability from "./pages/AuditTraceability";
import NotFound from "./pages/NotFound";
import { Sidebar } from "./components/Sidebar"; // Import Sidebar

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar /> {/* Add Sidebar here */}
          <div style={{ flex: 1 }}> {/* Main content area */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/document-feed" element={<DocumentFeed />} />
              <Route path="/communication" element={<CrossDepartmentCommunication userRole="employee" language="en" />} />
              <Route path="/audit" element={<AuditTraceability />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
