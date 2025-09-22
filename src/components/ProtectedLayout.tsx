import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import Breadcrumb from './Breadcrumb';
import Index from '../pages/Index';
import DocumentFeed from '../pages/DocumentFeed';
import { CrossDepartmentCommunication } from '../pages/Communication';
import AuditTraceability from '../pages/AuditTraceability';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const ProtectedLayout: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '24px' }}>
        <Breadcrumb />
        <Routes>
          <Route index element={<Index />} />
          <Route path="document-feed" element={<DocumentFeed />} />
          <Route path="communication" element={<CrossDepartmentCommunication userRole="employee" language="en" />} />
          <Route path="audit" element={<AuditTraceability />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProtectedLayout;
