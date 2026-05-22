import React, { useState, useEffect, useRef } from 'react'
import { Bell, Search, X, CheckCircle, Award, ScanLine, FileSearch, Printer } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const INITIAL_NOTIFS = [
  { id: 1, icon: Award,      color: 'text-gold-500',    bg: 'bg-gold-500/10',    title: 'Certificate Generated',  msg: 'Arjun Kumar — Degree Certificate ready',    time: '2m ago',  read: false },
  { id: 2, icon: ScanLine,   color: 'text-blue-400',    bg: 'bg-blue-500/10',    title: 'OCR Extraction Done',    msg: 'Resume processed with 94.7% confidence',     time: '8m ago',  read: false },
  { id: 3, icon: FileSearch,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'ATS Analysis Complete',  msg: 'Karthik R — Score: 82/100 for SE role',      time: '15m ago', read: true  },
  { id: 4, icon: Printer,    color: 'text-purple-400',  bg: 'bg-purple-500/10',  title: 'Bulk Print Finished',    msg: 'CS Department — 45 certificates generated',  time: '1h ago',  read: true  },
]

export default function Topbar({ title, subtitle }) {
  const { user }                  = useAuth()
  const [time, setTime]           = useState(new Date())
  const [showNotif, setShowNotif] = useState(false)
  const [notifs, setNotifs]       = useState(INITIAL_NOTIFS)
  const notifRef                  = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unread  = notifs.filter(n => !n.read).length
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markOne = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  return (
    <header className="h-16 bg-dark-800 border-b border-dark-400 flex items-center justify-between px-6 flex-shrink-0 relative z-50">

      {/* Left */}
      <div>
        <h2 className="font-orbitron text-base font-bold text-white tracking-wide">{title}</h2>
        {subtitle && <p className="font-rajdhani text-xs text-dark-100 tracking-wider">{subtitle}</p>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Clock */}
        <div className="hidden md:flex items-center gap-2 bg-dark-700 border border-dark-400 rounded-lg px-3 py-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="font-mono-jet text-xs text-dark-100">
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Search */}
        <button className="flex items-center gap-2 bg-dark-700 border border-dark-400 rounded-lg px-3 py-1.5 text-dark-100 hover:text-white hover:border-gold-500/50 transition-all text-xs font-rajdhani tracking-wide">
          <Search size={13} />
          <span className="hidden sm:inline">Search...</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 flex items-center justify-center bg-dark-700 border border-dark-400 rounded-lg text-dark-100 hover:text-gold-500 hover:border-gold-500/50 transition-all"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center">
                <span className="font-orbitron text-black text-xs font-black leading-none">{unread}</span>
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-dark-700 border border-dark-400 rounded-xl shadow-card overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-400">
                <p className="font-orbitron text-white text-sm font-bold">Notifications</p>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={markAll} className="font-rajdhani text-gold-500 text-xs hover:text-gold-400">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotif(false)} className="text-dark-100 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notif list */}
              <div className="max-h-72 overflow-y-auto">
                {notifs.map(({ id, icon: Icon, color, bg, title: t, msg, time: tm, read }) => (
                  <div
                    key={id}
                    onClick={() => markOne(id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-dark-600 cursor-pointer transition-colors
                      ${read ? 'opacity-60' : 'bg-gold-500/5 hover:bg-gold-500/10'}`}
                  >
                    <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={15} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-rajdhani font-semibold text-white text-sm">{t}</p>
                        {!read && <div className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="font-rajdhani text-dark-100 text-xs mt-0.5 leading-relaxed">{msg}</p>
                      <p className="font-rajdhani text-dark-200 text-xs mt-1">{tm}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 text-center border-t border-dark-400">
                <button className="font-rajdhani text-gold-500 text-xs hover:text-gold-400 tracking-wider">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 bg-gold-gradient rounded-lg flex items-center justify-center text-black font-orbitron font-bold text-xs cursor-pointer hover:shadow-gold transition-shadow">
          {(user?.username || 'A')[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
