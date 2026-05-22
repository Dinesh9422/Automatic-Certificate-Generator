import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CertificateGenerator from './pages/CertificateGenerator'
import OCRExtractor from './pages/OCRExtractor'
import ATSAnalyzer from './pages/ATSAnalyzer'
import BulkPrint from './pages/BulkPrint'
import QRVerification from './pages/QRVerification'
import DatabaseManagement from './pages/DatabaseManagement'
import Templates from './pages/Templates'
import Settings from './pages/Settings'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-rajdhani text-dark-100 tracking-widest text-sm uppercase">Loading CertifyAI...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e1e',
              color: '#fff',
              border: '1px solid #3a3a3a',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.03em',
            },
            success: { iconTheme: { primary: '#F0B90B', secondary: '#000' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="certificates" element={<CertificateGenerator />} />
            <Route path="ocr" element={<OCRExtractor />} />
            <Route path="ats" element={<ATSAnalyzer />} />
            <Route path="bulk-print" element={<BulkPrint />} />
            <Route path="verify" element={<QRVerification />} />
            <Route path="database" element={<DatabaseManagement />} />
            <Route path="templates" element={<Templates />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
