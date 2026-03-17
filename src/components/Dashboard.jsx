import { useState } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import ChatPanel from './ChatPanel.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import SystemStatus from './SystemStatus.jsx'
import HeatmapView from './HeatmapView.jsx'

export default function Dashboard() {
  const { subsite, shiftStart } = useSubsite()
  const [showHeatmap, setShowHeatmap] = useState(false)

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="min-h-screen bg-bg-primary font-terminal text-text-primary flex flex-col">

      {/* Top bar — matches real terminal status bar */}
      <div className="border-b border-border-panel bg-bg-secondary px-3 py-1 flex justify-between items-center text-xs text-text-dim shrink-0">
        <div className="flex items-center gap-4">
          <span>{timeStr}</span>
          <span className="text-text-primary">DHL/P&G OPS RDT</span>
          <span>[T]</span>
          <span className="text-text-dim">Screen 00.02</span>
        </div>
        <div className="flex items-center gap-4">
          <span>STATION: <span className="text-text-primary">{subsite?.shortName}</span></span>
          <span>SHIFT: <span className="text-status-green">ACTIVE</span></span>
          <span className="text-text-dim">{dateStr}</span>
          <button
            onClick={() => setShowHeatmap(v => !v)}
            className="border border-border-panel px-2 py-0.5 hover:border-accent-cyan hover:text-accent-cyan transition-colors"
            style={{ borderRadius: '2px' }}
          >
            {showHeatmap ? '[ DASHBOARD ]' : '[ SCORECARD ]'}
          </button>
        </div>
      </div>

      {showHeatmap ? (
        <HeatmapView />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Chat (30%) */}
          <div className="w-[30%] border-r border-border-panel flex flex-col overflow-hidden">
            <ChatPanel />
          </div>

          {/* Center — Metrics (40%) */}
          <div className="w-[40%] border-r border-border-panel flex flex-col overflow-hidden">
            <MetricsPanel />
          </div>

          {/* Right — System Status (30%) */}
          <div className="w-[30%] flex flex-col overflow-hidden">
            <SystemStatus />
          </div>
        </div>
      )}
    </div>
  )
}
