import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileSearch, Upload, Target, CheckCircle, XCircle, AlertCircle, Zap, TrendingUp, Brain } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

const JOB_ROLES = [
  'Software Engineer', 'Data Scientist', 'Machine Learning Engineer',
  'Full Stack Developer', 'DevOps Engineer', 'Backend Developer',
  'Frontend Developer', 'Cloud Architect', 'Cybersecurity Analyst',
  'Product Manager', 'UI/UX Designer', 'Database Administrator'
]

const sampleResult = {
  overallScore: 82,
  sections: {
    skills:       { score: 88, label: 'Skills Match'   },
    experience:   { score: 75, label: 'Experience'     },
    education:    { score: 90, label: 'Education'      },
    keywords:     { score: 80, label: 'Keywords'       },
    formatting:   { score: 85, label: 'Formatting'     },
    ats:          { score: 78, label: 'ATS Friendly'   },
  },
  matchedKeywords: ['Python', 'Django', 'React', 'PostgreSQL', 'REST API', 'Docker', 'Machine Learning', 'Scikit-learn'],
  missingKeywords: ['Kubernetes', 'Terraform', 'Redis', 'GraphQL', 'TypeScript'],
  suggestions: [
    { type: 'warning', msg: 'Add Kubernetes experience to improve DevOps match by ~12%' },
    { type: 'info',    msg: 'Include quantified achievements (e.g., "reduced load time by 40%")' },
    { type: 'success', msg: 'Education section is well-structured and ATS-friendly' },
    { type: 'warning', msg: 'Missing LinkedIn profile URL — add it to the contact section' },
    { type: 'info',    msg: 'Consider adding a concise professional summary at the top' },
  ],
  extractedSkills: ['Python', 'Django', 'React', 'PostgreSQL', 'Machine Learning', 'Git', 'Linux', 'REST APIs'],
  experienceYears: 2.5,
  educationMatch: 'B.E. Computer Science — matches requirement',
  candidateName: 'Arjun Kumar',
}

const radarData = [
  { subject: 'Skills',      score: 88 },
  { subject: 'Experience',  score: 75 },
  { subject: 'Education',   score: 90 },
  { subject: 'Keywords',    score: 80 },
  { subject: 'Format',      score: 85 },
  { subject: 'ATS',         score: 78 },
]

const ScoreRing = ({ score, size = 120 }) => {
  const r = 46
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F0B90B' : '#EF4444'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#2d2d2d" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="50" y="44" textAnchor="middle" fill={color} fontSize="18" fontFamily="Orbitron" fontWeight="bold">{score}</text>
      <text x="50" y="58" textAnchor="middle" fill="#666" fontSize="8" fontFamily="Rajdhani">ATS SCORE</text>
    </svg>
  )
}

export default function ATSAnalyzer() {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((accepted) => {
    if (accepted.length) { setFile(accepted[0]); setResult(null) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a resume'); return }
    if (!jobRole) { toast.error('Please select a job role'); return }
    setAnalyzing(true)
    setProgress(0)
    try {
      for (let p of [15, 35, 55, 75, 90, 100]) {
        await new Promise(r => setTimeout(r, 500))
        setProgress(p)
      }
      setResult(sampleResult)
      toast.success(`ATS Score: ${sampleResult.overallScore}/100 — ${sampleResult.candidateName}`)
    } catch {
      toast.error('Analysis failed. Try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const iconFor = (type) => ({
    success: <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />,
    warning: <AlertCircle size={14} className="text-gold-500 flex-shrink-0" />,
    info: <AlertCircle size={14} className="text-blue-400 flex-shrink-0" />,
  })[type]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left — Input */}
        <div className="space-y-5">
          {/* Upload */}
          <div className="card">
            <h3 className="section-title mb-3 flex items-center gap-2">
              <Upload size={16} className="text-gold-500" /> Upload Resume
            </h3>
            <div {...getRootProps()} className={`drop-zone ${isDragActive ? 'drop-zone-active' : ''} ${file ? 'border-emerald-500/40 bg-emerald-500/5' : ''}`}>
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <FileSearch size={20} className="text-emerald-400" />
                  </div>
                  <p className="font-rajdhani font-semibold text-white text-sm">{file.name}</p>
                  <span className="badge-green">Ready</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileSearch size={32} className="text-gold-500" />
                  <p className="font-rajdhani text-white text-sm font-semibold">Drop Resume Here</p>
                  <p className="font-rajdhani text-dark-100 text-xs">PDF, DOC, DOCX supported</p>
                </div>
              )}
            </div>
          </div>

          {/* Job role & description */}
          <div className="card space-y-4">
            <h3 className="section-title flex items-center gap-2">
              <Target size={16} className="text-gold-500" /> Job Requirements
            </h3>
            <div>
              <label className="input-label">Target Job Role *</label>
              <select className="select-dark" value={jobRole} onChange={e => setJobRole(e.target.value)}>
                <option value="">Select Job Role</option>
                {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Job Description (optional)</label>
              <textarea
                className="input-dark resize-none h-28"
                placeholder="Paste job description here for precise keyword matching..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
              />
            </div>
          </div>

          {/* Progress */}
          {(analyzing || progress > 0) && (
            <div className="card border border-gold-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={15} className="text-gold-500 animate-pulse" />
                <span className="font-rajdhani font-semibold text-white text-sm">AI Analysis Pipeline</span>
                <span className="ml-auto font-orbitron text-gold-500 text-sm font-bold">{progress}%</span>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {['PDF text extraction', 'NLP keyword parsing', 'Skill matching (spaCy)', 'ATS score calculation (sklearn)', 'Generating recommendations', 'Analysis complete'].map((step, i) => (
                <div key={step} className="flex items-center gap-2 mb-1.5">
                  <div className={`w-3 h-3 rounded-full border ${progress >= (i + 1) * 16.6 ? 'bg-emerald-500 border-emerald-500' : 'border-dark-300'}`} />
                  <span className={`font-rajdhani text-xs ${progress >= (i + 1) * 16.6 ? 'text-emerald-400' : 'text-dark-100'}`}>{step}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={!file || !jobRole || analyzing}
            className="btn-gold w-full flex items-center justify-center gap-3 h-12 text-base disabled:opacity-50">
            {analyzing ? (
              <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />Analyzing Resume...</>
            ) : (
              <><Zap size={18} />Analyze with AI</>
            )}
          </button>
        </div>

        {/* Right — Results */}
        <div className="space-y-5">
          {!result ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <FileSearch size={48} className="text-dark-300 mb-4" />
              <p className="font-rajdhani text-dark-100">Upload a resume and select job role</p>
              <p className="font-rajdhani text-dark-100 text-sm">to see ATS analysis results</p>
            </div>
          ) : (
            <>
              {/* Score overview */}
              <div className="card border border-gold-500/20">
                <div className="flex items-center gap-6">
                  <ScoreRing score={result.overallScore} />
                  <div className="flex-1">
                    <p className="font-rajdhani text-dark-100 text-xs tracking-wider uppercase mb-1">Candidate</p>
                    <p className="font-orbitron text-white font-bold text-lg">{result.candidateName}</p>
                    <p className="font-rajdhani text-dark-100 text-sm mb-2">for {jobRole}</p>
                    <div className={`badge-${result.overallScore >= 80 ? 'green' : result.overallScore >= 60 ? 'gold' : 'red'} inline-flex`}>
                      {result.overallScore >= 80 ? '✅ Strong Match' : result.overallScore >= 60 ? '⚠️ Moderate Match' : '❌ Weak Match'}
                    </div>
                  </div>
                </div>
                {/* Section scores */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {Object.entries(result.sections).map(([k, { score, label }]) => (
                    <div key={k} className="bg-dark-700 rounded-lg p-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-rajdhani text-dark-100 text-xs">{label}</span>
                        <span className="font-rajdhani font-bold text-xs" style={{ color: score >= 80 ? '#10B981' : score >= 60 ? '#F0B90B' : '#EF4444' }}>{score}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: score >= 80 ? '#10B981' : score >= 60 ? '#F0B90B' : '#EF4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar */}
              <div className="card">
                <h4 className="section-title mb-3 flex items-center gap-2">
                  <TrendingUp size={15} className="text-gold-500" /> Skills Radar
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2d2d2d" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 11, fontFamily: 'Rajdhani' }} />
                    <Radar name="Score" dataKey="score" stroke="#F0B90B" fill="#F0B90B" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Keywords */}
              <div className="card">
                <h4 className="section-title mb-3">Keyword Analysis</h4>
                <div className="mb-3">
                  <p className="font-rajdhani text-emerald-400 text-xs font-semibold mb-2">✅ Matched Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map(k => <span key={k} className="badge-green">{k}</span>)}
                  </div>
                </div>
                <div>
                  <p className="font-rajdhani text-red-400 text-xs font-semibold mb-2">❌ Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map(k => <span key={k} className="badge-red">{k}</span>)}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="card">
                <h4 className="section-title mb-3">AI Recommendations</h4>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className={`flex gap-3 p-3 rounded-lg border
                      ${s.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' :
                        s.type === 'warning' ? 'bg-gold-500/5 border-gold-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                      {iconFor(s.type)}
                      <p className="font-rajdhani text-white/80 text-sm">{s.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
