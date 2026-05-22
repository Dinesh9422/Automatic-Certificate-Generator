import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Sparkles, Shield, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back, Admin!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden
                      bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-r border-dark-400">
        {/* Decorative gold ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
                        border border-gold-500/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]
                        border border-gold-500/15 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px]
                        border border-gold-500/20 rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-mesh pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold">
            <Sparkles size={20} className="text-black" />
          </div>
          <div>
            <h1 className="font-orbitron text-xl font-black text-gradient-gold">CertifyAI</h1>
            <p className="font-rajdhani text-xs text-dark-100 tracking-[0.2em]">DOCUMENT INTELLIGENCE SYSTEM</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-orbitron text-4xl font-black leading-tight mb-4">
              <span className="text-white">Automatic</span><br />
              <span className="text-gradient-gold">Certificate</span><br />
              <span className="text-white">Generator</span>
            </h2>
            <p className="font-rajdhani text-dark-100 text-lg leading-relaxed max-w-sm">
              AI-powered document management platform for colleges and companies. 
              Generate, verify, and manage certificates with zero manual effort.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['OCR Extraction', 'ATS Analysis', 'QR Verification', 'Bulk Printing', 'Auto Generation', 'Secure Storage'].map(f => (
              <span key={f} className="badge-gold">{f}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: '10K+', l: 'Certificates' },
              { n: '99.9%', l: 'Uptime' },
              { n: '<1s', l: 'Generation' },
            ].map(({ n, l }) => (
              <div key={l} className="text-center p-3 bg-dark-600/50 rounded-xl border border-dark-400">
                <div className="font-orbitron text-xl font-bold text-gold-500">{n}</div>
                <div className="font-rajdhani text-xs text-dark-100 tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="font-rajdhani text-dark-100 text-xs tracking-wider relative z-10">
          © 2024 CertifyAI. All rights reserved.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-black" />
            </div>
            <h1 className="font-orbitron text-xl font-black text-gradient-gold">CertifyAI</h1>
          </div>

          <div className="mb-8">
            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">Admin Login</h3>
            <p className="font-rajdhani text-dark-100 tracking-wide">
              Secure access to document management system
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 mb-8">
            <Shield size={14} className="text-gold-500" />
            <span className="font-rajdhani text-xs text-dark-100 tracking-wide">
              Protected with JWT Authentication & 256-bit encryption
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-100" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-dark pl-10"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-100" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-dark pl-10 pr-10"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-100 hover:text-gold-500 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 mt-6 h-11 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield size={15} />
                  <span>Access System</span>
                </>
              )}
            </button>
          </form>

          <p className="font-rajdhani text-dark-100 text-xs text-center mt-6 tracking-wide">
            Unauthorized access is strictly prohibited and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}
