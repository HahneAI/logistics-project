import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { HEATMAP_PROFILES, DEMO_METRICS, PROFILE_META } from '../constants/demoMetrics.js'
import { useSubsite } from '../context/SubsiteContext.jsx'

const LEVEL_COLORS = {
  0: '#000088', // idle
  1: '#FFFF55', // slowing
  2: '#55FF55', // steady
  3: '#55FF55', // steady+
  4: '#55FFFF', // burst
}

const LEVEL_LABELS = {
  0: 'IDLE',
  1: 'SLOWING',
  2: 'STEADY',
  3: 'STEADY+',
  4: 'BURST',
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
  const { subsite, activeOperatorIdx } = useSubsite()
  const subsiteData = DEMO_METRICS[subsite?.id] ?? DEMO_METRICS.diaper
  const operator    = subsiteData.operators[activeOperatorIdx] ?? subsiteData.operators[0]
  const profileKey  = operator.heatmapProfile
  const profile     = PROFILE_META[profileKey]
  const data        = HEATMAP_PROFILES[profileKey]

  return (
    <div className="flex flex-col h-full bg-bg-panel font-terminal">
      {/* Header */}
      <div className="border-b border-border-panel px-4 py-2 shrink-0 flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
        <span className="font-display text-lg text-text-primary tracking-wider">SHIFT CONSISTENCY SCORECARD</span>
        <span className="text-xs text-text-dim">
          OPERATOR: <span className="text-text-primary">{operator.name}</span>
          <span className="mx-2 text-border-panel">|</span>
          {operator.role}
        </span>
      </div>

      {/* Driver type banner */}
      <div className={`px-4 py-2 shrink-0 border-b border-border-panel flex items-center gap-3 ${
        profileKey === 'rush'     ? 'bg-status-red/5'    :
        profileKey === 'training' ? 'bg-status-yellow/5' :
                                    'bg-status-green/5'
      }`}>
        <span className={`font-display text-base tracking-wider ${profile.color}`}>
          {profile.label}
        </span>
        <span className={`text-xs ${profile.color} opacity-80`}>
          — {profileKey === 'rush' && '⚠ '}{profile.summary}
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[300px] relative">
        <div className="absolute inset-0 px-4 pb-4 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={18} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#AAAAAA', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                interval={3}
                axisLine={{ stroke: '#5555FF' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fill: '#AAAAAA', fontSize: 10, fontFamily: 'Share Tech Mono' }}
                axisLine={{ stroke: '#5555FF' }}
                tickLine={false}
                tickFormatter={v => LEVEL_LABELS[v]?.slice(0, 5)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(85,85,255,0.2)' }} />
              <Bar dataKey="activityLevel" radius={[2, 2, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={LEVEL_COLORS[entry.activityLevel]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
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
