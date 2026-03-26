import { useState, useEffect } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { DEMO_METRICS, PROFILE_META } from '../constants/demoMetrics.js'
import { timeAgo, shiftDuration, jitter } from '../utils/timeHelpers.js'

const TIER_LABELS = { 1: 'MASTER', 2: 'PROFICIENT', 3: 'CERTIFIED', 4: 'PROVISIONAL' }
const TIER_COLORS = { 1: 'text-accent-cyan', 2: 'text-status-green', 3: 'text-text-primary', 4: 'text-text-dim' }

function AsciiBar({ value, max = 100, width = 10 }) {
  const filled = Math.round((value / max) * width)
  const empty  = width - filled
  return (
    <span className="text-accent-cyan">
      {'['}
      <span className="text-status-green">{'█'.repeat(filled)}</span>
      <span className="text-text-muted">{'░'.repeat(empty)}</span>
      {']'}
    </span>
  )
}

function StatusDot({ status }) {
  const map = {
    online:  'bg-status-green',
    faulted: 'bg-status-red  animate-pulse',
    moving:  'bg-accent-cyan animate-pulse',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] ?? 'bg-text-muted'}`} />
}

function MetricRow({ label, value, extra }) {
  const dots = '.'.repeat(Math.max(1, 22 - label.length))
  return (
    <div className="flex items-baseline gap-1 text-sm leading-relaxed">
      <span className="text-text-dim shrink-0">{label}</span>
      <span className="text-text-muted shrink-0">{dots}</span>
      <span className="text-text-primary">{value}</span>
      {extra && <span className="ml-1">{extra}</span>}
    </div>
  )
}

export default function MetricsPanel() {
  const { subsite, shiftStart, activeOperatorIdx, setActiveOperatorIdx } = useSubsite()
  const subsiteData = DEMO_METRICS[subsite?.id] ?? DEMO_METRICS.diaper
  const operators   = subsiteData.operators
  const base        = operators[activeOperatorIdx] ?? operators[0]
  const profile     = PROFILE_META[base.heatmapProfile]

  const [moves,    setMoves]    = useState(base.shiftMoves)
  const [score,    setScore]    = useState(base.consistencyScore)
  const [, setMinuteTick]       = useState(0)

  // Refresh every 30 seconds with minor variance
  useEffect(() => {
    const id = setInterval(() => {
      setMoves(jitter(base.shiftMoves, 4))
      setScore(Math.min(100, Math.max(0, jitter(base.consistencyScore, 2))))
    }, 30000)
    return () => clearInterval(id)
  }, [base])

  // Tick in sync with the real clock minute boundary
  useEffect(() => {
    const now = new Date()
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    let intervalId
    const timeoutId = setTimeout(() => {
      setMinuteTick(t => t + 1)
      intervalId = setInterval(() => setMinuteTick(t => t + 1), 60000)
    }, msUntilNextMinute)
    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  // Reset when operator or subsite changes
  useEffect(() => {
    setMoves(base.shiftMoves)
    setScore(base.consistencyScore)
  }, [base])

  const scoreColor = score >= 80 ? 'text-status-green' : score >= 60 ? 'text-status-yellow' : 'text-status-red'
  const flagColor  = base.alertFlags > 0 ? 'text-status-red' : 'text-status-green'

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Panel header */}
      <div className="border-b border-border-panel px-3 py-2 shrink-0 flex justify-between items-center">
        <span className="font-display text-base text-text-primary tracking-wider">SHIFT METRICS</span>
        <span className="text-sm text-text-dim">
          {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
          {' '}
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>

      {/* Operator selector */}
      <div className="border-b border-border-panel px-3 py-2 shrink-0">
        <div className="text-sm text-text-dim mb-1.5">SELECT OPERATOR</div>
        <div className="flex gap-1.5 flex-wrap">
          {operators.map((op, i) => (
            <button
              key={i}
              onClick={() => setActiveOperatorIdx(i)}
              className={`text-sm px-2 py-0.5 border transition-colors ${
                activeOperatorIdx === i
                  ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/10'
                  : 'border-border-panel text-text-dim hover:border-text-dim'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {op.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Driver type badge */}
        <div className={`border px-2 py-1.5 text-sm ${
          base.heatmapProfile === 'rush'
            ? 'border-status-red bg-status-red/5'
            : base.heatmapProfile === 'training'
            ? 'border-status-yellow bg-status-yellow/5'
            : 'border-status-green bg-status-green/5'
        }`} style={{ borderRadius: '2px' }}>
          <span className={`font-display text-sm tracking-wider ${profile.color}`}>
            {profile.label}
          </span>
          <div className={`text-sm mt-0.5 ${profile.color} opacity-80`}>
            {base.heatmapProfile === 'rush' && '⚠ '}
            {profile.summary}
          </div>
        </div>

        {/* Operator block */}
        <div className="space-y-0.5 border-b border-border-panel pb-3">
          <MetricRow label="OPERATOR" value={base.name} />
          <MetricRow
            label="TIER"
            value={`${base.tier} — ${TIER_LABELS[base.tier] ?? 'UNKNOWN'}`}
            extra={<span className={TIER_COLORS[base.tier]}>◆</span>}
          />
          <MetricRow label="ROLE" value={base.role} />
          <MetricRow label="EQUIPMENT" value={base.equipment ?? 'N/A'} />
          <MetricRow label="SHIFT DURATION" value={shiftDuration(shiftStart)} />
        </div>

        {/* Performance block */}
        <div className="space-y-0.5 border-b border-border-panel pb-3">
          <MetricRow label="SCANS" value={moves} />
          <div className="text-sm leading-relaxed">
            <div className="flex items-baseline gap-1">
              <span className="text-text-dim shrink-0">CONSISTENCY SCORE</span>
              <span className="text-text-muted">.</span>
              <span className={`font-bold ${scoreColor}`}>{score}/100</span>
              <span className="ml-1">
                <AsciiBar value={score} />
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 text-sm leading-relaxed">
            <span className="text-text-dim shrink-0">ALERT FLAGS</span>
            <span className="text-text-muted">.........</span>
            <span className={flagColor}>{base.alertFlags}</span>
            {base.alertFlags > 0 && <span className="text-status-red ml-1 animate-pulse">⚠</span>}
          </div>
          <MetricRow label="LAST SCAN" value={timeAgo(-4)} />
        </div>

        {/* Shift health */}
        <div className="border border-border-panel p-2 text-sm space-y-1">
          <div className="text-text-dim text-sm mb-1">SHIFT HEALTH</div>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-1">
              <StatusDot status={base.alertFlags === 0 ? 'online' : 'faulted'} />
              <span className="text-text-dim text-sm">SAFETY</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusDot status={score >= 70 ? 'online' : score >= 50 ? 'moving' : 'faulted'} />
              <span className="text-text-dim text-sm">CONSISTENCY</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusDot status="online" />
              <span className="text-text-dim text-sm">SCAN RATE</span>
            </div>
          </div>
        </div>

        {/* All operators on floor */}
        <div className="space-y-1">
          <div className="text-text-dim text-sm border-b border-border-panel pb-1 mb-2">ACTIVE ON FLOOR</div>
          {operators.map((op, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <StatusDot status="online" />
                <span className={activeOperatorIdx === i ? 'text-accent-cyan' : 'text-text-primary'}>
                  {op.name}
                </span>
              </div>
              <span className="text-text-dim">{op.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
