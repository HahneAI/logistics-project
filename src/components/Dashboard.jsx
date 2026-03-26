import { useState, useEffect, useRef } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { SUBSITES } from '../constants/subsites.js'
import ChatPanel from './ChatPanel.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import SystemStatus from './SystemStatus.jsx'
import HeatmapView from './HeatmapView.jsx'

const TABS = [
  { label: 'SOP AGENT' },
  { label: 'METRICS' },
  { label: 'STATUS' },
]

export default function Dashboard({ onLogout }) {
  const { subsite, setSubsite, agvTechMode, setAgvTechMode } = useSubsite()
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [showStationMenu, setShowStationMenu] = useState(false)
  const stationRef = useRef(null)

  // Close station menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (stationRef.current && !stationRef.current.contains(e.target)) {
        setShowStationMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="h-screen overflow-hidden bg-bg-primary font-terminal text-text-primary flex flex-col">

      {/* Top bar — compact on mobile, full on desktop */}
      <div className="border-b border-border-panel bg-bg-secondary px-3 py-1 flex justify-between items-center text-xs text-text-dim shrink-0">
        <div className="flex items-center gap-3">
          <span>{timeStr}</span>
          <span className="hidden sm:inline text-text-primary">DHL/P&G OPS RDT</span>
          <span>[T]</span>
          <span className="hidden sm:inline">Screen 00.02</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Station quick-switcher */}
          <div className="relative" ref={stationRef}>
            <button
              onClick={() => setShowStationMenu(v => !v)}
              className={`border px-2 py-0.5 transition-colors ${
                showStationMenu
                  ? 'border-accent-cyan text-accent-cyan'
                  : 'border-border-panel text-text-dim hover:border-accent-cyan hover:text-accent-cyan'
              }`}
              style={{ borderRadius: '2px' }}
            >
              STATION: <span className="text-text-primary">{subsite?.shortName}</span> ▾
            </button>
            {showStationMenu && (
              <div className="absolute right-0 top-full mt-1 bg-bg-secondary border border-border-panel z-50 min-w-[12rem]">
                {SUBSITES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSubsite(s); setShowStationMenu(false) }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                      subsite?.id === s.id
                        ? 'bg-status-green text-bg-primary'
                        : 'text-text-primary hover:bg-bg-panel hover:text-accent-cyan'
                    }`}
                  >
                    <span className={subsite?.id === s.id ? 'text-bg-primary' : 'text-text-dim'}>[{s.key}]</span>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden sm:inline text-text-dim">SHIFT: <span className="text-status-green">ACTIVE</span></span>
          <span className="hidden md:inline text-text-dim">{dateStr}</span>

          {/* AGV Tech Mode toggle */}
          <button
            onClick={() => setAgvTechMode(v => !v)}
            className={`border px-2 py-0.5 transition-colors text-xs ${
              agvTechMode
                ? 'border-status-yellow text-status-yellow bg-status-yellow/10'
                : 'border-border-panel text-text-dim hover:border-status-yellow hover:text-status-yellow'
            }`}
            style={{ borderRadius: '2px' }}
            title="Toggle AGV Tech Permissions"
          >
            {agvTechMode ? '⚙ AGV TECH: ON' : '⚙ AGV TECH'}
          </button>

          {/* Dashboard / Scorecard toggle */}
          <button
            onClick={() => setShowHeatmap(v => !v)}
            className="border border-border-panel px-2 py-0.5 text-text-dim hover:border-accent-cyan hover:text-accent-cyan transition-colors flex items-center gap-1"
            style={{ borderRadius: '2px' }}
          >
            <span className="text-accent-cyan text-xs">⇄</span>
            {showHeatmap ? 'DASH' : 'SCORE'}
          </button>

          <button
            onClick={onLogout}
            className="border border-border-panel px-2 py-0.5 text-text-dim hover:border-status-red hover:text-status-red transition-colors"
            style={{ borderRadius: '2px' }}
          >
            [LOGOUT]
          </button>
        </div>
      </div>

      {showHeatmap ? (
        <div className="flex-1 overflow-hidden">
          <HeatmapView />
        </div>
      ) : (
        <>
          {/* ── Desktop: 3-panel layout (untouched) ── */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            <div className="w-[30%] border-r border-border-panel flex flex-col overflow-hidden">
              <MetricsPanel />
            </div>
            <div className="w-[40%] border-r border-border-panel flex flex-col overflow-hidden">
              <ChatPanel />
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
