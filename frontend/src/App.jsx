import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from './layouts/UserLayout/page';
import LocalAuthLayout from './layouts/LocalAuthLayout/page';
import MainAuthLayout from './layouts/MainAuthLayout/page';
import border from './assets/border.png'
// Auth Pages
import { LoginPage } from './pages/Authentication/LoginPage';
import { RegisterPage } from './pages/Authentication/RegisterPage';

// User Portal Pages
import UserDashboardPage from './pages/UserPages/dashboard/page';
import AskForApprovalPage from './pages/UserPages/ask-for-approvals/page';
import { ListOfApprovalsPage } from './pages/UserPages/list-of-approvals/page';
import { TrackDocDetailPage } from './pages/UserPages/track-docs/page';
import { YourDocsPage } from './pages/UserPages/your-docs/page';
import { PendingDocsPage } from './pages/UserPages/pending-docs/page';
import { CustomDocsApplyPage } from './pages/UserPages/custom-docs-apply/page';
import { EnterpriseProfilePage } from './pages/UserPages/profile-page/page';
import QueryPage from './pages/UserPages/query/page';
import ComplainPage from './pages/UserPages/complain/page';
import FeedbackPage from './pages/UserPages/feedback/page';
import GovBenefitsPage from './pages/UserPages/gov-benefits/page';

// Local Authority Portal Pages
import { LocalAuthAllRequestsPage } from './pages/LocalAuthPages/all-requests/page';
import { LocalAuthHistoryPage } from './pages/LocalAuthPages/HistoryPage/page';
import LocalAuthComplaintsPage from './pages/LocalAuthPages/ComplaintsPage/page';
import LocalAuthProfilePage from './pages/LocalAuthPages/ProfilePage/page';

// Main Authority Portal Pages
import MainAuthDashboardPage from './pages/MainAuthPages/Dashboard/page';
import { MainAuthCatalogPage } from './pages/MainAuthPages/MainAuthCatlogPage/page';
import { MainAuthDocDetailsPage } from './pages/MainAuthPages/DocsDetaills/MainAuthDocDetailPage';
import { MainAuthCreationPage } from './pages/MainAuthPages/AddNewDoc/MainAuthCreationPage';
import LocalAuthsPage from './pages/MainAuthPages/LocalAuthsPage/page';
import MainAuthComplaintsPage from './pages/MainAuthPages/ComplaintsPage/page';
import MainAuthProfilePage from './pages/MainAuthPages/ProfilePage/page';

// Common Pages
import NotificationsPage from './pages/CommonPages/NotificationsPage';
import NotFoundPage from './pages/CommonPages/NotFoundPage';
import BackgroundFlagDecor from './components/common/BackgroundFlagDecor';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Background Indian Tricolor Corner Ribbons */}
      <BackgroundFlagDecor />

      <Routes>
        {/* Default Landing / Auth Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── USER PORTAL ROUTES ── */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="approvals" element={<AskForApprovalPage />} />
          <Route path="approvals/list" element={<ListOfApprovalsPage />} />
          <Route path="track" element={<TrackDocDetailPage />} />
          <Route path="track/:id" element={<TrackDocDetailPage />} />
          <Route path="your-docs" element={<YourDocsPage />} />
          <Route path="pending-docs" element={<PendingDocsPage />} />
          <Route path="custom-docs-apply" element={<CustomDocsApplyPage />} />
          <Route path="profile" element={<EnterpriseProfilePage />} />
          <Route path="query" element={<QueryPage />} />
          <Route path="complain" element={<ComplainPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="gov-benefits" element={<GovBenefitsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* ── LOCAL AUTHORITY PORTAL ROUTES ── */}
        <Route path="/local-auth" element={<LocalAuthLayout />}>
          <Route index element={<Navigate to="/local-auth/requests" replace />} />
          <Route path="requests" element={<LocalAuthAllRequestsPage />} />
          <Route path="history" element={<LocalAuthHistoryPage />} />
          <Route path="complaints" element={<LocalAuthComplaintsPage />} />
          <Route path="profile" element={<LocalAuthProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* ── MAIN AUTHORITY PORTAL ROUTES ── */}
        <Route path="/main-auth" element={<MainAuthLayout />}>
          <Route index element={<Navigate to="/main-auth/dashboard" replace />} />
          <Route path="dashboard" element={<MainAuthDashboardPage />} />
          <Route path="our-docs" element={<MainAuthCatalogPage />} />
          <Route path="our-docs/:id" element={<MainAuthDocDetailsPage />} />
          <Route path="add-new" element={<MainAuthCreationPage />} />
          <Route path="complaints" element={<MainAuthComplaintsPage />} />
          <Route path="local-auths" element={<LocalAuthsPage />} />
          <Route path="profile" element={<MainAuthProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
