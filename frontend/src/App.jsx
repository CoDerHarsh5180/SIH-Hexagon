import { useState } from 'react'
import UserLayout from './layouts/UserLayout/page'
import LocalAuthLayout from './layouts/LocalAuthLayout/page'
import MainAuthLayout from './layouts/MainAuthLayout/page'
import YourDocsPage from './pages/UserPages/your-docs/page'
import CustomDocsApplyPage from './pages/UserPages/custom-docs-apply/page'
import TrackDocDetailPage from './pages/UserPages/track-docs/page'
import PendingDocsPage from './pages/UserPages/pending-docs/page'
import './App.css'

function App() {


  return (
    <>
      <UserLayout>
        <PendingDocsPage />
      </UserLayout>
    </>
  )
}

export default App
