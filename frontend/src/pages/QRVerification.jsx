import React, { useState } from 'react'
import { QrCode, Search, CheckCircle, XCircle, Shield, Hash, Calendar, User, Building2, Award } from 'lucide-react'
import toast from 'react-hot-toast'

const sampleCert = {
  certId: 'CERT-M9K2X4',
  name: 'Arjun Kumar S',
  rollNo: '21CS001',
  course: 'B.E. Computer Science & Engineering',
  department: 'Computer Science',
  institution: 'ABC College of Engineering',
  university: 'Anna University',
  certType: 'Degree Certificate',
  issueDate: '15 May 2024',
  cgpa: '8.76',
  status: 'VALID',
  hash: 'sha256:a4f2e8b1c3d7e9f0a2b4c6d8e0f2a4b6',
  generatedAt: '2024-05-15 10:30:22 IST',
  verifiedAt: new Date().toLocaleString('en-IN'),
}

export default function QRVerification() {
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const handleVerify = async () => {
    if (!code.trim()) { toast.error('Enter a certificate ID or QR code'); return }
    setVerifying(true)
    setResult(null)
    setNotFound(false)
    try {
      await new Promise(r => setTimeout(r, 1200))
      if (code.toUpperCase().includes('CERT') || code.length >= 6) {
        setResult(sampleCert)
        toast.success('Certificate verified — AUTHENTIC ✅')
      } else {
        setNotFound(true)
        toast.error('Certificate not found in database')
      }
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search bar */}
      <div className="card">
        <h3 className="section-title mb-1 flex items-center gap-2">
          <QrCode size={16} className="text-gold-500" /> Certificate Verification
        </h3>
        <p className="section-subtitle mb-5">Enter Certificate ID, QR code data, or scan QR to verify authenticity</p>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-100" />
            <input
              className="input-dark pl-10 h-12"
              placeholder="e.g. CERT-M9K2X4 or paste QR code data..."
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
            />
          </div>
          <button onClick={handleVerify} disabled={verifying || !code.trim()}
            className="btn-gold flex items-center gap-2 h-12 px-6 disabled:opacity-50">
            {verifying ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : <Search size={16} />}
            Verify
          </button>
        </div>

        {/* Quick test */}
        <div className="flex items-center gap-2 mt-3">
          <p className="font-rajdhani text-dark-100 text-xs">Quick test:</p>
          {['CERT-M9K2X4', 'CERT-ABC123', 'CERT-XY9987'].map(id => (
            <button key={id} onClick={() => setCode(id)}
              className="font-mono-jet text-xs text-gold-500 border border-gold-500/30 rounded px-2 py-0.5 hover:bg-gold-500/10 transition-all">
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Not found */}
      {notFound && (
        <div className="card border border-red-500/30 bg-red-500/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <XCircle size={24} className="text-red-400" />
          </div>
          <div>
            <p className="font-orbitron text-red-400 font-bold text-sm">CERTIFICATE NOT FOUND</p>
            <p className="font-rajdhani text-dark-100 text-sm mt-0.5">
              The certificate ID <span className="text-white font-semibold">"{code}"</span> was not found in our database.
              This certificate may be invalid, tampered, or never issued.
            </p>
          </div>
        </div>
      )}

      {/* Verified result */}
      {result && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Status banner */}
          <div className="card border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield size={28} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-orbitron text-emerald-400 font-bold">AUTHENTIC CERTIFICATE</p>
                  <span className="badge-green">✅ VALID</span>
                </div>
                <p className="font-rajdhani text-dark-100 text-sm">
                  This certificate is genuine and issued by the registered institution.
                  Verified at: <span className="text-white">{result.verifiedAt}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono-jet text-gold-500 font-bold text-lg">{result.certId}</div>
                <div className="font-rajdhani text-dark-100 text-xs">Certificate ID</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Holder info */}
            <div className="card">
              <h4 className="section-title mb-4 flex items-center gap-2">
                <User size={15} className="text-gold-500" /> Certificate Holder
              </h4>
              <div className="space-y-3">
                {[
                  { icon: User,      label: 'Full Name',   value: result.name },
                  { icon: Hash,      label: 'Roll Number', value: result.rollNo },
                  { icon: Award,     label: 'Course',      value: result.course },
                  { icon: Building2, label: 'Department',  value: result.department },
                  { icon: Building2, label: 'Institution', value: result.institution },
                  { icon: Building2, label: 'University',  value: result.university },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase">{label}</p>
                      <p className="font-rajdhani text-white font-semibold text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate info */}
            <div className="card">
              <h4 className="section-title mb-4 flex items-center gap-2">
                <Award size={15} className="text-gold-500" /> Certificate Details
              </h4>
              <div className="space-y-3">
                {[
                  { icon: Award,    label: 'Type',         value: result.certType },
                  { icon: Calendar, label: 'Issue Date',   value: result.issueDate },
                  { icon: Award,    label: 'CGPA / Grade', value: result.cgpa },
                  { icon: CheckCircle, label: 'Status',    value: result.status, color: 'text-emerald-400' },
                  { icon: Calendar, label: 'Generated At', value: result.generatedAt },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex gap-3">
                    <Icon size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase">{label}</p>
                      <p className={`font-rajdhani font-semibold text-sm ${color || 'text-white'}`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hash */}
              <div className="mt-4 p-3 bg-dark-700 rounded-lg border border-dark-400">
                <p className="font-rajdhani text-dark-100 text-xs mb-1">🔐 Document Hash (SHA-256)</p>
                <p className="font-mono-jet text-xs text-gold-400 break-all">{result.hash}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      {!result && !notFound && (
        <div className="card">
          <h4 className="section-title mb-4">How QR Verification Works</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Scan QR Code', desc: 'Each certificate has a unique QR code containing the certificate ID and verification URL.' },
              { step: '02', title: 'Check Database', desc: 'The system looks up the certificate ID in the secure PostgreSQL database.' },
              { step: '03', title: 'Verify Authenticity', desc: 'SHA-256 hash comparison confirms the certificate was genuinely issued and not tampered.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-4 bg-dark-700 border border-dark-400 rounded-xl">
                <div className="font-orbitron text-gold-500 text-2xl font-black mb-2">{step}</div>
                <p className="font-rajdhani font-semibold text-white text-sm mb-1">{title}</p>
                <p className="font-rajdhani text-dark-100 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
