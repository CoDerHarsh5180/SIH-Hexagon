import { useState } from 'react'
import UserLayout from './layouts/UserLayout/page'
import LocalAuthLayout from './layouts/LocalAuthLayout/page'
import MainAuthLayout from './layouts/MainAuthLayout/page'
import YourDocsPage from './pages/UserPages/your-docs/page'
import CustomDocsApplyPage from './pages/UserPages/custom-docs-apply/page'
import TrackDocDetailPage from './pages/UserPages/track-docs/page'
import PendingDocsPage from './pages/UserPages/pending-docs/page'
import ListOfApprovalsPage from './pages/UserPages/list-of-approvals/page'
import AskForApprovalPage from './pages/UserPages/ask-for-approvals/page'
import EnterpriseProfilePage from './pages/UserPages/profile-page/page'
import LocalAuthAllRequestsPage from './pages/LocalAuthPages/all-requests/page'
import { AuthLayout } from './layouts/AuthLayout/page'
import { RegisterPage } from './pages/Authentication/RegisterPage'
import { LoginPage } from './pages/Authentication/LoginPage'
import LocalAuthHistoryPage from './pages/LocalAuthPages/HistoryPage/page'
import MainAuthCatalogPage from './pages/MainAuthPages/MainAuthCatlogPage/page'
import MainAuthDocDetailsPage from './pages/MainAuthPages/DocsDetaills/MainAuthDocDetailPage'
import MainAuthCreationPage from './pages/MainAuthPages/AddNewDoc/MainAuthCreationPage'
import './App.css'

function App() {


  return (
    <>
    <MainAuthLayout>
      <MainAuthCreationPage />
    </MainAuthLayout>
    
      
      
    </>
  )
}

export default App
