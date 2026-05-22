import React, { useState } from 'react'
import { Settings, Building2, Key, Bell, Database, Shield, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [org, setOrg] = useState({ name: 'ABC College of Engineering', address: 'Chennai, Tamil Nadu', email: 'admin@abccollege.edu.in', phone: '+91 44 2345 6789', logo: '', mode: 'college' })
  const [showSecret, setShowSecret] = useState(false)
  const [notif, setNotif] = useState({ email: true, bulk: true, verify: false, ats: true })
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' })

  const save = (section) => toast.success(`${section} settings saved!`)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Organization */}
      <div className="card">
        <h3 className="section-title mb-5 flex items-center gap-2"><Building2 size={16} className="text-gold-500" />Organization Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div><label className="input-label">Organization Name</label><input className="input-dark" value={org.name} onChange={e => setOrg({ ...org, name: e.target.value })} /></div>
          <div><label className="input-label">Mode</label>
            <select className="select-dark" value={org.mode} onChange={e => setOrg({ ...org, mode: e.target.value })}>
              <option value="college">College / University</option>
              <option value="company">Company / Organization</option>
            </select>
          </div>
          <div className="sm:col-span-2"><label className="input-label">Address</label><input className="input-dark" value={org.address} onChange={e => setOrg({ ...org, address: e.target.value })} /></div>
          <div><label className="input-label">Email</label><input className="input-dark" type="email" value={org.email} onChange={e => setOrg({ ...org, email: e.target.value })} /></div>
          <div><label className="input-label">Phone</label><input className="input-dark" value={org.phone} onChange={e => setOrg({ ...org, phone: e.target.value })} /></div>
        </div>
        <button onClick={() => save('Organization')} className="btn-gold flex items-center gap-2"><Save size={14} />Save Organization</button>
      </div>

      {/* API Keys */}
      <div className="card">
        <h3 className="section-title mb-5 flex items-center gap-2"><Key size={16} className="text-gold-500" />API Configuration</h3>
        <div className="space-y-4 mb-5">
          {[
            { label: 'Django Secret Key', val: 'django-insecure-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', secret: true },
            { label: 'PostgreSQL / Neon DB URL', val: 'postgresql://user:pass@host/dbname', secret: true },
            { label: 'JWT Token Expiry (hours)', val: '24', secret: false },
            { label: 'Frontend URL (CORS)', val: 'https://certifyai.vercel.app', secret: false },
          ].map(({ label, val, secret }) => (
            <div key={label}>
              <label className="input-label">{label}</label>
              <div className="relative">
                <input type={secret && !showSecret ? 'password' : 'text'} className="input-dark pr-10" defaultValue={val} />
                {secret && (
                  <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-100 hover:text-gold-500">
                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => save('API')} className="btn-gold flex items-center gap-2"><Save size={14} />Save API Config</button>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 className="section-title mb-5 flex items-center gap-2"><Bell size={16} className="text-gold-500" />Notifications</h3>
        <div className="space-y-3 mb-5">
          {[
            { key: 'email', label: 'Email on certificate generation' },
            { key: 'bulk',  label: 'Notify after bulk print completes' },
            { key: 'verify',label: 'Alert on QR verification attempt' },
            { key: 'ats',   label: 'ATS analysis completion notification' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between p-3 bg-dark-700 border border-dark-400 rounded-lg cursor-pointer hover:border-gold-500/30 transition-all">
              <span className="font-rajdhani text-white text-sm">{label}</span>
              <div onClick={() => setNotif({ ...notif, [key]: !notif[key] })}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${notif[key] ? 'bg-gold-500' : 'bg-dark-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${notif[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
        <button onClick={() => save('Notifications')} className="btn-gold flex items-center gap-2"><Save size={14} />Save Notifications</button>
      </div>

      {/* Change Password */}
      <div className="card">
        <h3 className="section-title mb-5 flex items-center gap-2"><Shield size={16} className="text-gold-500" />Change Password</h3>
        <div className="space-y-4 mb-5">
          <div><label className="input-label">Current Password</label><input type="password" className="input-dark" value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} /></div>
          <div><label className="input-label">New Password</label><input type="password" className="input-dark" value={pwd.new} onChange={e => setPwd({ ...pwd, new: e.target.value })} /></div>
          <div><label className="input-label">Confirm New Password</label><input type="password" className="input-dark" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} /></div>
        </div>
        <button onClick={() => {
          if (pwd.new !== pwd.confirm) { toast.error('Passwords do not match'); return }
          save('Password')
          setPwd({ current: '', new: '', confirm: '' })
        }} className="btn-danger flex items-center gap-2"><Shield size={14} />Update Password</button>
      </div>

      {/* Database */}
      <div className="card">
        <h3 className="section-title mb-4 flex items-center gap-2"><Database size={16} className="text-gold-500" />Database Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => toast.success('Database backup started...')} className="btn-outline-gold flex items-center justify-center gap-2 text-sm">
            <Database size={14} /> Backup Database
          </button>
          <button onClick={() => toast.success('Connection test: ✅ PostgreSQL Connected')} className="btn-ghost border border-dark-400 flex items-center justify-center gap-2 text-sm">
            <Shield size={14} /> Test Connection
          </button>
        </div>
      </div>
    </div>
  )
}
