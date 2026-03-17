import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { HEATMAP_PROFILES } from '../constants/demoMetrics.js'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { DEMO_METRICS } from '../constants/demoMetrics.js'

const LEVEL_COLORS = {
  0: '#2a3f66', // idle
  1: '#ffcc00', // slowing
  2: '#00ff9d', // steady
  3: '#00ff9d', // steady+
  4: '#1a6aff', // burst
}

const LEVEL_LABELS = {
  0: 'IDLE',
  1: 'SLOWING',
  2: 'STEADY',
  3: 'STEADY+',
  4: 'BURST',
}

const PROFILES = {
  consistent: { label: 'CONSISTENT_DRIVER', data: HEATMAP_PROFILES.consistent },
  rush:       { label: 'RUSH_DRIVER',        data: HEATMAP_PROFILES.rush       },
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-bg-secondary border border-border-panel px-2 py-1 text-xs font-terminal text-text-primary">
      <div>{d.label}</div>
      <div className="mt-1" style={{ color: LEVEL_COLORS[d.activityLevel] }}>
        {LEVEL_LABELS[d.activityLevel]}
      </div>
    </div>
  )
}

export default function HeatmapView() {
  const { subsite } = useSubsite()
  const defaultProfile = DEMO_METRICS[subsite?.id]?.heatmapProfile ?? 'consistent'
  const [activeProfile, setActiveProfile] = useState(defaultProfile)

  const { label, data } = PROFILES[activeProfile]

  return (
    <div className="flex flex-col h-full bg-bg-panel font-terminal">
      {/* Header */}
      <div className="border-b border-border-panel px-4 py-2 flex flex-col gap-2 md:flex-row md:justify-between md:items-center shrink-0">
        <span className="font-display text-lg text-text-primary tracking-wider">SHIFT CONSISTENCY SCORECARD</span>
        <div className="flex gap-2">
          {Object.entries(PROFILES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setActiveProfile(key)}
              className={`text-xs px-3 py-1 border transition-colors ${
                activeProfile === key
                  ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10'
                  : 'border-border-panel text-text-dim hover:border-text-dim'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active profile label */}
      <div className="px-4 pt-3 pb-1 text-xs text-text-dim">
        VIEWING: <span className="text-accent-cyan">{label}</span>
        {activeProfile === 'rush' && (
          <span className="ml-4 text-status-red animate-pulse">⚠ IDLE-THEN-RUSH PATTERN DETECTED</span>
        )}
        {activeProfile === 'consistent' && (
          <span className="ml-4 text-status-green">✓ CONSISTENT PACING — LOW RISK PROFILE</span>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 px-4 pb-4 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={18} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#4a6a99', fontSize: 10, fontFamily: 'Share Tech Mono' }}
              interval={3}
              axisLine={{ stroke: '#1e3a6e' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tick={{ fill: '#4a6a99', fontSize: 10, fontFamily: 'Share Tech Mono' }}
              axisLine={{ stroke: '#1e3a6e' }}
              tickLine={false}
              tickFormatter={v => LEVEL_LABELS[v]?.slice(0, 5)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30,58,110,0.3)' }} />
            <Bar dataKey="activityLevel" radius={[2, 2, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={LEVEL_COLORS[entry.activityLevel]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="border-t border-border-panel px-4 py-2 flex flex-wrap gap-3 md:gap-6 shrink-0">
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1 text-xs">
            <span className="inline-block w-3 h-3" style={{ background: color }} />
            <span className="text-text-dim">{LEVEL_LABELS[level]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
