import React, { useState } from 'react'
import { LayoutTemplate, Eye, Download, Star, Award, Briefcase, GraduationCap, UserMinus } from 'lucide-react'
import toast from 'react-hot-toast'

const templates = [
  {
    id: 1, name: 'Classic Gold', type: 'Degree', icon: GraduationCap,
    desc: 'Traditional gold-bordered degree certificate with university seal',
    tags: ['College', 'Formal'], popular: true,
    preview: { bg: 'from-yellow-950 to-yellow-900', border: 'border-yellow-600', accent: 'text-yellow-400' }
  },
  {
    id: 2, name: 'Corporate Blue', type: 'Experience', icon: Briefcase,
    desc: 'Professional blue theme for corporate experience certificates',
    tags: ['Company', 'Corporate'], popular: true,
    preview: { bg: 'from-blue-950 to-blue-900', border: 'border-blue-600', accent: 'text-blue-400' }
  },
  {
    id: 3, name: 'Emerald Completion', type: 'Completion', icon: Award,
    desc: 'Clean green design for course completion certificates',
    tags: ['Course', 'Training'],
    preview: { bg: 'from-emerald-950 to-emerald-900', border: 'border-emerald-600', accent: 'text-emerald-400' }
  },
  {
    id: 4, name: 'Minimal Dark', type: 'Relieving', icon: UserMinus,
    desc: 'Sleek minimal dark theme for relieving letters',
    tags: ['Company', 'Minimal'],
    preview: { bg: 'from-dark-800 to-dark-700', border: 'border-dark-300', accent: 'text-white' }
  },
  {
    id: 5, name: 'Royal Purple', type: 'Degree', icon: GraduationCap,
    desc: 'Regal purple design for postgraduate degrees',
    tags: ['PG', 'Premium'],
    preview: { bg: 'from-purple-950 to-purple-900', border: 'border-purple-600', accent: 'text-purple-400' }
  },
  {
    id: 6, name: 'Modern Minimal', type: 'Experience', icon: Briefcase,
    desc: 'Clean minimal layout with subtle grid lines',
    tags: ['Startup', 'Modern'],
    preview: { bg: 'from-dark-700 to-dark-600', border: 'border-gold-500/40', accent: 'text-gold-400' }
  },
]

export default function Templates() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')

  const types = ['All', 'Degree', 'Experience', 'Completion', 'Relieving']
  const filtered = filter === 'All' ? templates : templates.filter(t => t.type === filter)

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg border font-rajdhani font-semibold text-sm tracking-wide transition-all
              ${filter === t ? 'bg-gold-500/15 text-gold-400 border-gold-500/40' : 'bg-dark-600 border-dark-400 text-dark-100 hover:border-dark-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(tpl => {
          const Icon = tpl.icon
          const isSelected = selected === tpl.id
          return (
            <div key={tpl.id} onClick={() => setSelected(isSelected ? null : tpl.id)}
              className={`card cursor-pointer transition-all duration-200 ${isSelected ? 'border-gold-500/60 shadow-gold' : 'hover:border-gold-500/30'}`}>
              {/* Mini preview */}
              <div className={`aspect-[1.4/1] bg-gradient-to-br ${tpl.preview.bg} border ${tpl.preview.border} rounded-xl mb-4 flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className={`absolute inset-3 border ${tpl.preview.border} rounded-lg opacity-40`} />
                <div className={`absolute inset-5 border ${tpl.preview.border} rounded opacity-20`} />
                <Icon size={28} className={tpl.preview.accent} />
                <p className={`font-orbitron text-xs font-bold mt-2 ${tpl.preview.accent}`}>CERTIFICATE</p>
                <p className="font-rajdhani text-white/40 text-xs mt-1">of {tpl.type}</p>
                {tpl.popular && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-gold-500/20 border border-gold-500/40 rounded-full px-2 py-0.5">
                    <Star size={9} className="text-gold-500 fill-gold-500" />
                    <span className="font-rajdhani text-gold-400 text-xs">Popular</span>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-orbitron text-white font-bold text-sm">{tpl.name}</p>
                  <p className="font-rajdhani text-dark-100 text-xs mt-0.5">{tpl.desc}</p>
                </div>
              </div>

              <div className="flex gap-1.5 mb-3">
                <span className="badge-gold">{tpl.type}</span>
                {tpl.tags.map(tag => <span key={tag} className="badge-blue">{tag}</span>)}
              </div>

              <div className="flex gap-2">
                <button onClick={e => { e.stopPropagation(); toast.success(`Previewing ${tpl.name}`) }}
                  className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-xs py-2">
                  <Eye size={12} /> Preview
                </button>
                <button onClick={e => { e.stopPropagation(); toast.success(`${tpl.name} selected as default!`) }}
                  className="btn-gold flex-1 flex items-center justify-center gap-1.5 text-xs py-2">
                  <Download size={12} /> Use Template
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
