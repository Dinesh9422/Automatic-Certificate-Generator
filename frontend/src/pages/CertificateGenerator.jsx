import React, { useState } from 'react'
import { Award, Download, Eye, RefreshCw, Plus, CheckCircle, User, Building2, Calendar, Hash } from 'lucide-react'
import toast from 'react-hot-toast'

const CERT_TYPES = [
  { id: 'degree',     label: 'Degree Certificate',     color: 'text-gold-500',    bg: 'bg-gold-500/10',    border: 'border-gold-500/20' },
  { id: 'experience', label: 'Experience Certificate', color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { id: 'completion', label: 'Completion Certificate', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'relieving',  label: 'Relieving Certificate',  color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
]

const DEPARTMENTS = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'IT', 'Electronics', 'MBA', 'MCA']

const initialForm = {
  certType: 'degree',
  name: '', rollNo: '', department: '', course: '',
  startDate: '', endDate: '', issueDate: '',
  organization: '', designation: '',
  cgpa: '', grade: '',
  mode: 'college',
}

export default function CertificateGenerator() {
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleGenerate = async () => {
    if (!form.name || !form.department) {
      toast.error('Please fill required fields')
      return
    }
    setGenerating(true)
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1800))
      const certId = `CERT-${Date.now().toString(36).toUpperCase()}`
      setGenerated({ ...form, certId, qrCode: `https://certifyai.app/verify/${certId}` })
      setPreview(true)
      toast.success('Certificate generated successfully!')
    } catch {
      toast.error('Generation failed. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    toast.success('Certificate downloaded as PDF!')
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {CERT_TYPES.map(({ id, label, color, bg, border }) => (
            <button
              key={id}
              onClick={() => set('certType', id)}
              className={`px-4 py-2 rounded-lg border font-rajdhani font-semibold text-sm tracking-wide transition-all duration-150
                ${form.certType === id ? `${bg} ${color} ${border}` : 'bg-dark-600 border-dark-400 text-dark-100 hover:border-dark-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setForm(initialForm)} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Form */}
        <div className="xl:col-span-3 space-y-6">
          {/* Institution mode */}
          <div className="card">
            <h3 className="section-title mb-4">Institution Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'college', label: 'College / University', icon: Building2 },
                { id: 'company', label: 'Company / Organization', icon: Building2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => set('mode', id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                    ${form.mode === id ? 'bg-gold-500/10 border-gold-500/40 text-gold-400' : 'bg-dark-700 border-dark-400 text-dark-100 hover:border-dark-300'}`}
                >
                  <Icon size={18} />
                  <span className="font-rajdhani font-semibold text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="card">
            <h3 className="section-title mb-4 flex items-center gap-2">
              <User size={16} className="text-gold-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name *</label>
                <input className="input-dark" placeholder="e.g. Arjun Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Roll / Employee No *</label>
                <input className="input-dark" placeholder="e.g. 21CS001" value={form.rollNo} onChange={e => set('rollNo', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Department *</label>
                <select className="select-dark" value={form.department} onChange={e => set('department', e.target.value)}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {form.mode === 'college' ? (
                <div>
                  <label className="input-label">Course</label>
                  <input className="input-dark" placeholder="e.g. B.E. Computer Science" value={form.course} onChange={e => set('course', e.target.value)} />
                </div>
              ) : (
                <div>
                  <label className="input-label">Designation</label>
                  <input className="input-dark" placeholder="e.g. Software Engineer" value={form.designation} onChange={e => set('designation', e.target.value)} />
                </div>
              )}
            </div>
          </div>

          {/* Certificate Details */}
          <div className="card">
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-gold-500" /> Certificate Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Start Date</label>
                <input type="date" className="input-dark" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
              </div>
              <div>
                <label className="input-label">End / Completion Date</label>
                <input type="date" className="input-dark" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Issue Date</label>
                <input type="date" className="input-dark" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} />
              </div>
              {form.mode === 'college' && (
                <div>
                  <label className="input-label">CGPA / Grade</label>
                  <input className="input-dark" placeholder="e.g. 8.7 CGPA" value={form.cgpa} onChange={e => set('cgpa', e.target.value)} />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="input-label">Organization Name</label>
                <input className="input-dark" placeholder="e.g. ABC College of Engineering" value={form.organization} onChange={e => set('organization', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-gold w-full flex items-center justify-center gap-3 h-12 text-base disabled:opacity-60"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Generating Certificate...
              </>
            ) : (
              <>
                <Award size={18} />
                Generate Certificate
              </>
            )}
          </button>
        </div>

        {/* Preview panel */}
        <div className="xl:col-span-2">
          <div className="card sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title flex items-center gap-2">
                <Eye size={16} className="text-gold-500" /> Preview
              </h3>
              {generated && (
                <button onClick={handleDownload} className="btn-gold flex items-center gap-2 py-2 px-3 text-xs">
                  <Download size={13} /> Download PDF
                </button>
              )}
            </div>

            {!generated ? (
              <div className="aspect-[1.41/1] bg-dark-700 border-2 border-dashed border-dark-400 rounded-xl flex flex-col items-center justify-center text-center p-6">
                <Award size={40} className="text-dark-300 mb-3" />
                <p className="font-rajdhani text-dark-100 text-sm">Fill the form and click</p>
                <p className="font-rajdhani font-semibold text-gold-500 text-sm">"Generate Certificate"</p>
                <p className="font-rajdhani text-dark-100 text-sm">to see preview here</p>
              </div>
            ) : (
              <div className="aspect-[1.41/1] bg-gradient-to-br from-dark-800 to-dark-700 border border-gold-500/40 rounded-xl p-6 relative overflow-hidden shadow-gold">
                {/* Certificate design */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-4 border-2 border-gold-500 rounded-lg" />
                  <div className="absolute inset-6 border border-gold-500 rounded-lg" />
                </div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center mb-1">
                    <Award size={18} className="text-black" />
                  </div>
                  <p className="font-rajdhani text-dark-100 text-xs tracking-[0.2em] uppercase">{generated.organization || 'Institution'}</p>
                  <h2 className="font-orbitron text-gold-500 text-base font-bold">Certificate of {generated.certType}</h2>
                  <p className="font-rajdhani text-dark-100 text-xs">This is to certify that</p>
                  <p className="font-orbitron text-white text-lg font-bold">{generated.name}</p>
                  <p className="font-rajdhani text-dark-100 text-xs max-w-[200px] leading-relaxed">
                    has successfully completed {generated.course || generated.designation || 'the program'}<br />
                    from {generated.department}
                  </p>
                  {generated.cgpa && (
                    <p className="font-rajdhani text-gold-400 text-xs font-semibold">Grade: {generated.cgpa}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 bg-dark-900/50 border border-dark-400 rounded px-2 py-1">
                    <Hash size={10} className="text-gold-500" />
                    <span className="font-mono-jet text-xs text-dark-100">{generated.certId}</span>
                  </div>
                </div>
              </div>
            )}

            {generated && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="font-rajdhani text-emerald-400 text-xs font-semibold">Certificate ID: {generated.certId}</span>
                </div>
                <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-2">
                  <Hash size={14} className="text-gold-500" />
                  <span className="font-rajdhani text-gold-400 text-xs">QR code generated for verification</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={handleDownload} className="btn-success flex items-center justify-center gap-2 text-xs py-2">
                    <Download size={13} /> Save PDF
                  </button>
                  <button onClick={() => { setGenerated(null); setForm(initialForm) }} className="btn-ghost flex items-center justify-center gap-2 text-xs py-2">
                    <Plus size={13} /> New Cert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
