import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles = {
  '/dashboard':    { title: 'Dashboard',            sub: 'Overview & Analytics' },
  '/certificates': { title: 'Certificate Generator', sub: 'Create & Manage Certificates' },
  '/templates':    { title: 'Templates',             sub: 'Certificate Templates' },
  '/ocr':          { title: 'OCR Extractor',         sub: 'Extract Data from Documents' },
  '/ats':          { title: 'ATS Analyzer',          sub: 'Resume Scoring & Analysis' },
  '/bulk-print':   { title: 'Bulk Print',            sub: 'Department-wise Batch Printing' },
  '/verify':       { title: 'QR Verification',       sub: 'Scan & Verify Certificates' },
  '/database':     { title: 'Database',              sub: 'Records Management' },
  '/settings':     { title: 'Settings',              sub: 'System Configuration' },
}

export default function Layout() {
  const location = useLocation()
  const pageInfo = pageTitles[location.pathname] || { title: 'CertifyAI', sub: '' }

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={pageInfo.title} subtitle={pageInfo.sub} />
        <main className="flex-1 overflow-y-auto bg-mesh">
          <div className="p-6 animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
