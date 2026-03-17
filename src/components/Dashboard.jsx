import { useState } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import ChatPanel from './ChatPanel.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import SystemStatus from './SystemStatus.jsx'
import HeatmapView from './HeatmapView.jsx'

const TAB_LABELS = { chat: 'SOP AGENT', metrics: 'METRICS', status: 'SYSTEM' }

export default function Dashboard() {
  const { subsite, shiftStart } = useSubsite()
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [activeTab, setActiveTab] = useState('metrics')

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="min-h-screen bg-bg-primary font-terminal text-text-primary flex flex-col">

      {/* Top bar */}
      <div className="border-b border-border-panel bg-bg-secondary px-4 py-2 flex justify-between items-center text-xs text-text-dim shrink-0">
        <span className="font-display text-base text-accent-cyan tracking-widest">DHL/P&G OPS TERMINAL</span>
        <span className="hidden md:inline">STATION: <span className="text-text-primary">{subsite?.shortName}</span></span>
        <span className="hidden md:inline">SHIFT: <span className="text-status-green">ACTIVE</span></span>
        <span className="hidden md:inline">{dateStr} {timeStr}</span>
        <button
          onClick={() => setShowHeatmap(v => !v)}
          className="border border-border-panel px-2 py-0.5 hover:border-accent-cyan hover:text-accent-cyan transition-colors"
          style={{ borderRadius: '2px' }}
        >
          {showHeatmap ? '[ DASHBOARD ]' : '[ SCORECARD ]'}
        </button>
      </div>

      {showHeatmap ? (
        <HeatmapView />
      ) : (
        <>
          {/* Desktop: 3-panel layout */}
          <div className="hidden md:flex flex-1 overflow-hidden">
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

          {/* Mobile: single panel + bottom tab bar */}
          <div className="flex md:hidden flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat'    && <ChatPanel />}
              {activeTab === 'metrics' && <MetricsPanel />}
              {activeTab === 'status'  && <SystemStatus />}
            </div>
            <div className="border-t border-border-panel shrink-0 flex">
              {Object.entries(TAB_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2 text-xs font-terminal transition-colors ${
                    activeTab === key
                      ? 'text-accent-cyan border-t-2 border-accent-cyan bg-accent-cyan/5'
                      : 'text-text-dim hover:text-text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
