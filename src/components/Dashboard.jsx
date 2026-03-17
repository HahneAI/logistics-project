import { useState } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import ChatPanel from './ChatPanel.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import SystemStatus from './SystemStatus.jsx'
import HeatmapView from './HeatmapView.jsx'

const TABS = [
  { label: 'SOP AGENT' },
  { label: 'METRICS' },
  { label: 'STATUS' },
]

export default function Dashboard() {
  const { subsite, shiftStart } = useSubsite()
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [activeTab, setActiveTab] = useState(1)

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="min-h-screen bg-bg-primary font-terminal text-text-primary flex flex-col">

      {/* Top bar — compact on mobile, full on desktop */}
      <div className="border-b border-border-panel bg-bg-secondary px-3 py-1 flex justify-between items-center text-xs text-text-dim shrink-0">
        <div className="flex items-center gap-3">
          <span>{timeStr}</span>
          <span className="hidden sm:inline text-text-primary">DHL/P&G OPS RDT</span>
          <span>[T]</span>
          <span className="hidden sm:inline">Screen 00.02</span>
        </div>
        <div className="flex items-center gap-3">
          <span>STATION: <span className="text-text-primary">{subsite?.shortName}</span></span>
          <span className="hidden sm:inline">SHIFT: <span className="text-status-green">ACTIVE</span></span>
          <span className="hidden md:inline text-text-dim">{dateStr}</span>
          <button
            onClick={() => setShowHeatmap(v => !v)}
            className="border border-border-panel px-2 py-0.5 hover:border-accent-cyan hover:text-accent-cyan transition-colors"
            style={{ borderRadius: '2px' }}
          >
            {showHeatmap ? '[DASH]' : '[SCORE]'}
          </button>
        </div>
      </div>

      {showHeatmap ? (
        <HeatmapView />
      ) : (
        <>
          {/* ── Desktop: 3-panel layout (untouched) ── */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            <div className="w-[30%] border-r border-border-panel flex flex-col overflow-hidden">
              <ChatPanel />
            </div>
            <div className="w-[40%] border-r border-border-panel flex flex-col overflow-hidden">
              <MetricsPanel />
            </div>
            <div className="w-[30%] flex flex-col overflow-hidden">
              <SystemStatus />
            </div>
          </div>

          {/* ── Mobile: tab-switched single panel ── */}
          <div className="flex flex-col flex-1 overflow-hidden md:hidden">
            <div className="flex-1 overflow-hidden">
              {activeTab === 0 && <ChatPanel />}
              {activeTab === 1 && <MetricsPanel />}
              {activeTab === 2 && <SystemStatus />}
            </div>

            {/* Tab bar pinned to bottom */}
            <div className="border-t border-border-panel bg-bg-secondary shrink-0 flex text-xs font-terminal">
              {TABS.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2 px-1 text-center transition-colors ${
                    activeTab === i
                      ? 'bg-status-green text-bg-primary font-bold'
                      : 'text-text-dim hover:text-text-primary'
                  }`}
                >
                  {activeTab === i ? `[${tab.label}]` : tab.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
