import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Award, ScanLine, FileSearch, Printer,
  QrCode, Database, LayoutTemplate, Settings, LogOut,
  ChevronLeft, ChevronRight, Sparkles, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',       group: 'main' },
  { path: '/certificates',icon: Award,           label: 'Certificate Gen', group: 'main' },
  { path: '/templates',   icon: LayoutTemplate,  label: 'Templates',       group: 'main' },
  { path: '/ocr',         icon: ScanLine,        label: 'OCR Extractor',   group: 'tools' },
  { path: '/ats',         icon: FileSearch,       label: 'ATS Analyzer',    group: 'tools' },
  { path: '/bulk-print',  icon: Printer,          label: 'Bulk Print',      group: 'tools' },
  { path: '/verify',      icon: QrCode,           label: 'QR Verify',       group: 'tools' },
  { path: '/database',    icon: Database,         label: 'Database',        group: 'system' },
  { path: '/settings',    icon: Settings,         label: 'Settings',        group: 'system' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const groups = {
    main:   { label: 'Main',  items: navItems.filter(i => i.group === 'main') },
    tools:  { label: 'Tools', items: navItems.filter(i => i.group === 'tools') },
    system: { label: 'System',items: navItems.filter(i => i.group === 'system') },
  }

  return (
    <aside className={`
      flex flex-col bg-dark-800 border-r border-dark-400 
      transition-all duration-300 ease-in-out relative flex-shrink-0
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-dark-400 h-16 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="text-black" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-orbitron text-sm font-bold text-gradient-gold leading-none">CertifyAI</h1>
            <p className="font-rajdhani text-xs text-dark-100 tracking-widest">DOCUMENT SYSTEM</p>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
        {Object.entries(groups).map(([key, group]) => (
          <div key={key}>
            {!collapsed && (
              <p className="text-dark-100 text-xs font-rajdhani tracking-widest uppercase px-3 mb-2">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map(({ path, icon: Icon, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      font-rajdhani font-semibold text-sm tracking-wide
                      transition-all duration-150
                      ${isActive
                        ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                        : 'text-dark-100 hover:bg-dark-600 hover:text-white border border-transparent'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? label : ''}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-dark-400 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-dark-600">
            <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <Shield size={14} className="text-black" />
            </div>
            <div className="min-w-0">
              <p className="font-rajdhani font-semibold text-white text-sm truncate">{user?.username || 'Admin'}</p>
              <p className="font-rajdhani text-dark-100 text-xs truncate">{user?.email || 'admin@certifyai.com'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg
            text-dark-100 hover:bg-red-500/10 hover:text-red-400
            font-rajdhani font-semibold text-sm transition-all duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-dark-600 border border-dark-400 rounded-full 
                   flex items-center justify-center text-dark-100 hover:text-gold-500 hover:border-gold-500
                   transition-all duration-150 z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
