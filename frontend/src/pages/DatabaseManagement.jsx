import React, { useState } from 'react'
import { Database, Search, Filter, Download, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const allRecords = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  certId: `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  name: ['Arjun Kumar', 'Priya Sharma', 'Karthik R', 'Sneha Patel', 'Ravi A', 'Meena Devi', 'Suresh K', 'Anitha M'][i % 8],
  type: ['Degree', 'Experience', 'Completion', 'Relieving'][i % 4],
  dept: ['Computer Science', 'Mechanical', 'IT', 'Electrical', 'Civil'][i % 5],
  date: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  status: i % 7 === 0 ? 'Revoked' : 'Active',
}))

const PAGE_SIZE = 10

export default function DatabaseManagement() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = allRecords.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.certId.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || r.type === typeFilter
    const matchDept = deptFilter === 'All' || r.dept === deptFilter
    const matchStatus = statusFilter === 'All' || r.status === statusFilter
    return matchSearch && matchType && matchDept && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleExport = () => toast.success('Exporting to Excel...')
  const handleDelete = (id) => toast.success(`Record ${id} deleted`)
  const handleView = (certId) => toast.success(`Viewing ${certId}`)
  const handleRegenerate = (certId) => toast.success(`Regenerating ${certId}...`)

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: allRecords.length,                                      color: 'text-gold-500' },
          { label: 'Active',        value: allRecords.filter(r => r.status === 'Active').length,   color: 'text-emerald-400' },
          { label: 'Revoked',       value: allRecords.filter(r => r.status === 'Revoked').length,  color: 'text-red-400' },
          { label: 'This Month',    value: 23,                                                      color: 'text-blue-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card py-4 text-center">
            <div className={`font-orbitron text-2xl font-black ${color}`}>{value}</div>
            <div className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-52 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-100" />
            <input className="input-dark pl-10" placeholder="Search by name or certificate ID..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-dark-100" />
            <span className="font-rajdhani text-dark-100 text-sm">Filter:</span>
          </div>
          {[
            { label: 'Type',   value: typeFilter,   set: setTypeFilter,   options: ['All', 'Degree', 'Experience', 'Completion', 'Relieving'] },
            { label: 'Dept',   value: deptFilter,   set: setDeptFilter,   options: ['All', 'Computer Science', 'Mechanical', 'IT', 'Electrical', 'Civil'] },
            { label: 'Status', value: statusFilter, set: setStatusFilter, options: ['All', 'Active', 'Revoked'] },
          ].map(({ label, value, set, options }) => (
            <select key={label} value={value} onChange={e => { set(e.target.value); setPage(1) }}
              className="select-dark w-auto text-xs py-2">
              {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label}s` : o}</option>)}
            </select>
          ))}
          <button onClick={handleExport} className="btn-outline-gold flex items-center gap-2 text-xs py-2 px-4">
            <Download size={13} /> Export
          </button>
        </div>
        <p className="font-rajdhani text-dark-100 text-xs mt-2">
          Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''} · Page {page} of {totalPages}
        </p>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Certificate ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Department</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(r => (
                <tr key={r.id}>
                  <td className="text-dark-100 text-xs">{(page - 1) * PAGE_SIZE + paginated.indexOf(r) + 1}</td>
                  <td><span className="font-mono-jet text-xs text-gold-400">{r.certId}</span></td>
                  <td className="font-semibold">{r.name}</td>
                  <td><span className="badge-blue">{r.type}</span></td>
                  <td className="text-dark-100 text-xs">{r.dept}</td>
                  <td className="text-dark-100 text-xs">{r.date}</td>
                  <td>
                    <span className={r.status === 'Active' ? 'badge-green' : 'badge-red'}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleView(r.certId)} className="p-1.5 text-dark-100 hover:text-blue-400 transition-colors" title="View">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => handleRegenerate(r.certId)} className="p-1.5 text-dark-100 hover:text-gold-400 transition-colors" title="Regenerate">
                        <RefreshCw size={13} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 text-dark-100 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-dark-400">
          <p className="font-rajdhani text-dark-100 text-xs">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-dark-100 hover:text-gold-400 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page - 2 + i
              if (p < 1 || p > totalPages) return null
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded font-rajdhani text-xs font-semibold transition-all
                    ${p === page ? 'bg-gold-500 text-black' : 'text-dark-100 hover:text-white hover:bg-dark-500'}`}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-dark-100 hover:text-gold-400 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
