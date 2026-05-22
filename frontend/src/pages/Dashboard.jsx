import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  Award, ScanLine, FileSearch, Printer, TrendingUp,
  CheckCircle, Clock, Users, ArrowUpRight, Activity
} from 'lucide-react'

const monthlyData = [
  { month: 'Jan', certificates: 145, ocr: 89, ats: 67 },
  { month: 'Feb', certificates: 198, ocr: 112, ats: 84 },
  { month: 'Mar', certificates: 176, ocr: 134, ats: 93 },
  { month: 'Apr', certificates: 234, ocr: 156, ats: 112 },
  { month: 'May', certificates: 289, ocr: 178, ats: 134 },
  { month: 'Jun', certificates: 312, ocr: 201, ats: 156 },
  { month: 'Jul', certificates: 278, ocr: 189, ats: 143 },
  { month: 'Aug', certificates: 345, ocr: 223, ats: 178 },
  { month: 'Sep', certificates: 398, ocr: 245, ats: 201 },
  { month: 'Oct', certificates: 421, ocr: 267, ats: 223 },
  { month: 'Nov', certificates: 389, ocr: 234, ats: 198 },
  { month: 'Dec', certificates: 456, ocr: 289, ats: 245 },
]

const certTypePie = [
  { name: 'Degree',      value: 38, color: '#F0B90B' },
  { name: 'Experience',  value: 27, color: '#3B82F6' },
  { name: 'Completion',  value: 21, color: '#10B981' },
  { name: 'Relieving',   value: 14, color: '#8B5CF6' },
]

const recentActivity = [
  { id: 1, action: 'Certificate Generated', name: 'Arjun Kumar',       type: 'Degree',     time: '2 min ago',  status: 'success' },
  { id: 2, action: 'OCR Extraction',        name: 'Priya Sharma',      type: 'Resume',     time: '8 min ago',  status: 'success' },
  { id: 3, action: 'ATS Analysis',          name: 'Karthik R.',        type: 'Engineer',   time: '15 min ago', status: 'success' },
  { id: 4, action: 'Bulk Print',            name: 'CS Department',     type: '45 certs',   time: '32 min ago', status: 'success' },
  { id: 5, action: 'QR Verified',           name: 'Sneha Patel',       type: 'Experience', time: '1 hr ago',   status: 'success' },
  { id: 6, action: 'Certificate Generated', name: 'Ravi Annamalai',    type: 'Completion', time: '2 hr ago',   status: 'success' },
]

const stats = [
  { label: 'Total Certificates', value: '3,842', icon: Award,      change: '+12.4%', color: 'text-gold-500',    bg: 'bg-gold-500/10',    border: 'border-gold-500/20' },
  { label: 'OCR Extractions',    value: '1,256', icon: ScanLine,   change: '+8.7%',  color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { label: 'ATS Analyses',       value: '847',   icon: FileSearch,  change: '+15.2%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { label: 'Bulk Prints',        value: '234',   icon: Printer,    change: '+5.1%',  color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-dark-600 border border-dark-400 rounded-lg p-3 shadow-card">
      <p className="font-orbitron text-xs text-gold-500 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-rajdhani text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
  return null
}

export default function Dashboard() {
  const [animVal, setAnimVal] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnimVal(100), 100); return () => clearTimeout(t) }, [])

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, change, color, bg, border }, i) => (
          <div key={label} className={`card border ${border} animate-fade-in-up stagger-${i + 1}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${bg} ${border} border rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                <ArrowUpRight size={11} className="text-emerald-400" />
                <span className="font-rajdhani text-emerald-400 text-xs font-bold">{change}</span>
              </div>
            </div>
            <div className="stat-number">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="xl:col-span-2 card animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">Monthly Activity</h3>
              <p className="section-subtitle mt-0.5">Certificates, OCR & ATS over 12 months</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'Certificates', color: '#F0B90B' },
                { label: 'OCR', color: '#3B82F6' },
                { label: 'ATS', color: '#10B981' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="font-rajdhani text-xs text-dark-100">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F0B90B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="certificates" stroke="#F0B90B" strokeWidth={2} fill="url(#goldGrad)" name="Certificates" />
              <Area type="monotone" dataKey="ocr"          stroke="#3B82F6" strokeWidth={2} fill="url(#blueGrad)"  name="OCR" />
              <Area type="monotone" dataKey="ats"          stroke="#10B981" strokeWidth={2} fill="url(#greenGrad)" name="ATS" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card animate-fade-in-up stagger-2">
          <div className="mb-6">
            <h3 className="section-title">Certificate Types</h3>
            <p className="section-subtitle mt-0.5">Distribution by category</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={certTypePie} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                   paddingAngle={3} dataKey="value">
                {certTypePie.map(({ name, color }) => (
                  <Cell key={name} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: '#1e1e1e', border: '1px solid #3a3a3a', fontFamily: 'Rajdhani' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {certTypePie.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="font-rajdhani text-sm text-dark-100">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 progress-bar">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
                  </div>
                  <span className="font-rajdhani text-xs text-white w-8 text-right">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="section-title">Recent Activity</h3>
            <p className="section-subtitle mt-0.5">Latest system operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-gold-500 animate-pulse" />
            <span className="font-rajdhani text-xs text-gold-500 tracking-wider">LIVE</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Action</th>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row) => (
                <tr key={row.id}>
                  <td className="font-semibold">{row.action}</td>
                  <td>{row.name}</td>
                  <td><span className="badge-blue">{row.type}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-semibold tracking-wide">SUCCESS</span>
                    </div>
                  </td>
                  <td className="text-dark-100 text-xs">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
