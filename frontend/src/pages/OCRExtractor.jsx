import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ScanLine, Upload, FileText, CheckCircle, Copy, Download, X, Eye, Zap, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const SUPPORTED = ['PDF', 'PNG', 'JPG', 'JPEG', 'TIFF', 'BMP']

const FIELD_LABELS = [
  { key: 'name',           label: 'Full Name',          icon: '👤' },
  { key: 'dob',            label: 'Date of Birth',       icon: '📅' },
  { key: 'roll_no',        label: 'Roll / Reg No',       icon: '🔢' },
  { key: 'registration_no',label: 'Registration No',     icon: '🔢' },
  { key: 'course',         label: 'Course',              icon: '🎓' },
  { key: 'institution',    label: 'Institution',         icon: '🏛️' },
  { key: 'university',     label: 'University',          icon: '🎓' },
  { key: 'organization',   label: 'Organization',        icon: '🏢' },
  { key: 'year',           label: 'Year',                icon: '📆' },
  { key: 'cgpa',           label: 'CGPA',                icon: '⭐' },
  { key: 'grade',          label: 'Grade',               icon: '🏆' },
  { key: 'email',          label: 'Email',               icon: '📧' },
  { key: 'phone',          label: 'Mobile',              icon: '📱' },
  { key: 'department',     label: 'Department',          icon: '🏫' },
]

export default function OCRExtractor() {
  const [file, setFile]           = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult]       = useState(null)
  const [progress, setProgress]   = useState(0)
  const [rawText, setRawText]     = useState('')
  const [showRaw, setShowRaw]     = useState(false)
  const [error, setError]         = useState('')

  const onDrop = useCallback((accepted) => {
    if (accepted.length) {
      setFile(accepted[0])
      setResult(null)
      setError('')
      setRawText('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.bmp'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  })

  const handleExtract = async () => {
    if (!file) { toast.error('Please upload a document first'); return }
    setProcessing(true)
    setProgress(0)
    setError('')
    setResult(null)

    // Show progress animation
    const progressSteps = [
      { p: 15, delay: 300 },
      { p: 35, delay: 600 },
      { p: 60, delay: 900 },
      { p: 80, delay: 1200 },
    ]
    for (const step of progressSteps) {
      await new Promise(r => setTimeout(r, step.delay))
      setProgress(step.p)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('access_token')
      const res = await axios.post('http://localhost:8000/api/ocr/extract/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      })

      setProgress(100)
      const data = res.data
      setResult(data.fields || {})
      setRawText(data.raw_text || '')
      toast.success(`✅ OCR complete! ${data.confidence?.toFixed(1)}% confidence`)
    } catch (err) {
      setProgress(0)
      const msg = err.response?.data?.error || 'OCR extraction failed. Check backend is running.'
      setError(msg)
      toast.error(msg)
    } finally {
      setProcessing(false)
    }
  }

  const copyField = (v) => { navigator.clipboard.writeText(String(v)); toast.success('Copied!') }

  const handleExport = () => {
    if (!result) return
    const json = JSON.stringify(result, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `ocr_result_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as JSON!')
  }

  const visibleFields = FIELD_LABELS.filter(({ key }) => result?.[key])
  const skills = result?.skills || []
  const confidence = result?.confidence

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Upload Side ── */}
        <div className="space-y-5">
          <div className="card">
            <h3 className="section-title mb-1 flex items-center gap-2">
              <Upload size={16} className="text-gold-500" /> Upload Document
            </h3>
            <p className="section-subtitle mb-4">Supports: {SUPPORTED.join(', ')}</p>

            <div
              {...getRootProps()}
              className={`drop-zone ${isDragActive ? 'drop-zone-active' : ''} ${file ? 'border-emerald-500/40 bg-emerald-500/5' : ''}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center">
                    <FileText size={22} className="text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-rajdhani font-semibold text-white">{file.name}</p>
                    <p className="font-rajdhani text-dark-100 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span className="font-rajdhani text-emerald-400 text-sm font-semibold">Ready to process</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-dark-600 border border-dark-300 rounded-xl flex items-center justify-center">
                    <ScanLine size={26} className="text-gold-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-rajdhani font-semibold text-white">
                      {isDragActive ? 'Drop it here!' : 'Drag & Drop or Click to Upload'}
                    </p>
                    <p className="font-rajdhani text-dark-100 text-sm mt-1">
                      Resume, certificates, transcripts, ID cards
                    </p>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <button onClick={() => { setFile(null); setResult(null); setError('') }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-dark-100 hover:text-red-400 font-rajdhani text-sm transition-colors">
                <X size={14} /> Remove file
              </button>
            )}
          </div>

          {/* Progress */}
          {(processing || progress > 0) && (
            <div className="card border border-gold-500/20 bg-gold-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gold-500/20 border border-gold-500/40 rounded-lg flex items-center justify-center">
                  <Zap size={15} className="text-gold-500 animate-pulse" />
                </div>
                <div>
                  <p className="font-rajdhani font-semibold text-white text-sm">OCR Processing Pipeline</p>
                  <p className="font-rajdhani text-dark-100 text-xs">Tesseract + OpenCV + spaCy NLP</p>
                </div>
                <span className="ml-auto font-orbitron text-gold-500 font-bold text-sm">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 space-y-1.5">
                {[
                  { label: 'Image preprocessing',   done: progress >= 15 },
                  { label: 'Tesseract OCR scan',    done: progress >= 35 },
                  { label: 'NLP field parsing',     done: progress >= 60 },
                  { label: 'Data structuring',      done: progress >= 80 },
                  { label: 'Extraction complete',   done: progress >= 100 },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all
                      ${done ? 'bg-emerald-500 border-emerald-500' : 'border-dark-300'}`}>
                      {done && <CheckCircle size={10} className="text-black" />}
                    </div>
                    <span className={`font-rajdhani text-xs ${done ? 'text-emerald-400' : 'text-dark-100'}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card border border-red-500/30 bg-red-500/5 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-rajdhani font-semibold text-red-400 text-sm">Extraction Failed</p>
                <p className="font-rajdhani text-dark-100 text-xs mt-0.5">{error}</p>
                <p className="font-rajdhani text-dark-100 text-xs mt-1">
                  💡 Make sure Django backend is running at <span className="text-gold-400">localhost:8000</span>
                </p>
              </div>
            </div>
          )}

          <button onClick={handleExtract} disabled={!file || processing}
            className="btn-gold w-full flex items-center justify-center gap-3 h-12 text-base disabled:opacity-50">
            {processing ? (
              <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />Extracting Data...</>
            ) : (
              <><ScanLine size={18} />Extract with OCR</>
            )}
          </button>
        </div>

        {/* ── Results Side ── */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title flex items-center gap-2">
              <Eye size={16} className="text-gold-500" /> Extracted Data
            </h3>
            {result && (
              <div className="flex items-center gap-2">
                {confidence && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <CheckCircle size={12} className="text-emerald-400" />
                    <span className="font-rajdhani text-emerald-400 text-xs font-bold">
                      {typeof confidence === 'number' ? confidence.toFixed(1) : confidence}% Confidence
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {!result ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ScanLine size={48} className="text-dark-300 mb-4" />
              <p className="font-rajdhani text-dark-100">Upload your resume or document</p>
              <p className="font-rajdhani text-dark-100 text-sm">and click Extract to see results</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">

              {/* No fields found */}
              {visibleFields.length === 0 && skills.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle size={32} className="text-gold-500 mx-auto mb-2" />
                  <p className="font-rajdhani text-white font-semibold">Text extracted but fields not parsed</p>
                  <p className="font-rajdhani text-dark-100 text-sm mt-1">
                    The document may be scanned or image-based. Try a clearer scan.
                  </p>
                </div>
              )}

              {/* Extracted fields */}
              {visibleFields.map(({ key, label, icon }) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg border border-dark-400 group hover:border-gold-500/30 transition-all">
                  <span className="text-base">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase">{label}</p>
                    <p className="font-rajdhani text-white font-semibold text-sm truncate">
                      {Array.isArray(result[key]) ? result[key].join(', ') : result[key]}
                    </p>
                  </div>
                  <button onClick={() => copyField(Array.isArray(result[key]) ? result[key].join(', ') : result[key])}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-dark-100 hover:text-gold-500 transition-all">
                    <Copy size={13} />
                  </button>
                </div>
              ))}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="p-3 bg-dark-700 rounded-lg border border-dark-400">
                  <p className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase mb-2">🛠️ Skills Detected ({skills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => <span key={s} className="badge-blue">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Raw text toggle */}
              {rawText && (
                <div>
                  <button onClick={() => setShowRaw(!showRaw)}
                    className="w-full text-left p-3 bg-dark-700 rounded-lg border border-dark-400 hover:border-gold-500/30 transition-all">
                    <p className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase flex items-center justify-between">
                      📝 Raw Extracted Text
                      <span className="text-gold-500">{showRaw ? '▲ Hide' : '▼ Show'}</span>
                    </p>
                  </button>
                  {showRaw && (
                    <div className="mt-1 p-3 bg-dark-900 rounded-lg border border-dark-400 max-h-40 overflow-y-auto">
                      <p className="font-mono-jet text-xs text-dark-100 whitespace-pre-wrap">{rawText}</p>
                    </div>
                  )}
                </div>
              )}

              <button onClick={handleExport}
                className="btn-success w-full flex items-center justify-center gap-2 mt-2">
                <Download size={15} /> Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
