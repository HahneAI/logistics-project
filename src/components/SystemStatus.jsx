import { useState, useEffect } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { DEMO_METRICS } from '../constants/demoMetrics.js'
import { logTimestamp } from '../utils/timeHelpers.js'

const STATUS_LABELS = { online: 'ONLINE', faulted: 'FAULT', moving: 'MOVING' }
const STATUS_COLORS = {
  online:  'text-status-green',
  faulted: 'text-status-red',
  moving:  'text-accent-cyan',
}

function AgvNode({ id, status, agvTechMode, onSendToChat }) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-text-dim">{id}</span>
      <div className="flex items-center gap-2">
        {agvTechMode && status === 'faulted' && (
          <button
            onClick={() => onSendToChat({ id, status })}
            title="Send to AGV diagnostic chat"
            className="text-status-yellow hover:text-accent-cyan transition-colors text-xs border border-status-yellow/40 px-1.5 py-0.5 hover:border-accent-cyan"
            style={{ borderRadius: '2px' }}
          >
            ⤷ DIAGNOSE
          </button>
        )}
        <span className={`${STATUS_COLORS[status]} ${status === 'faulted' ? 'animate-pulse' : ''} font-bold text-sm`}>
          {STATUS_LABELS[status]}
        </span>
      </div>
    </div>
  )
}

export default function SystemStatus() {
  const { subsite, agvTechMode, setAgvDebugTarget } = useSubsite()
  const data = DEMO_METRICS[subsite?.id] ?? DEMO_METRICS.diaper
  const [logs,     setLogs]     = useState(data.systemLogs)
  const [agvNodes, setAgvNodes] = useState(data.agvNodes)

  useEffect(() => {
    setLogs(data.systemLogs)
    setAgvNodes(data.agvNodes)
  }, [data])

  useEffect(() => {
    const LIVE_MSGS = [
      'HEARTBEAT: ALL SYSTEMS NOMINAL',
      'AGV CYCLE CHECK COMPLETE',
      'SCAN RATE NOMINAL',
      'STAGING COMPLIANCE: OK',
    ]
    const id = setInterval(() => {
      const msg = LIVE_MSGS[Math.floor(Math.random() * LIVE_MSGS.length)]
      setLogs(prev => [{ msg, ts: Date.now() }, ...prev].slice(0, 12))
    }, 45000)
    return () => clearInterval(id)
  }, [])

  const faultCount  = agvNodes.filter(n => n.status === 'faulted').length
  const onlineCount = agvNodes.filter(n => n.status === 'online').length

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Panel header */}
      <div className="border-b border-border-panel px-3 py-2 shrink-0 flex justify-between items-center">
        <span className="font-display text-base text-text-primary tracking-wider">SYSTEM STATUS</span>
        <div className="flex items-center gap-2">
          {agvTechMode && (
            <span className="text-status-yellow text-xs border border-status-yellow/40 px-1.5 py-0.5" style={{ borderRadius: '2px' }}>
              ⚙ TECH MODE
            </span>
          )}
          {faultCount > 0 && (
            <span className="text-status-red text-sm animate-pulse">⚠ {faultCount} FAULT{faultCount > 1 ? 'S' : ''}</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">

        {/* AGV Network */}
        <div>
          <div className="text-text-dim text-sm border-b border-border-panel pb-1 mb-2 flex justify-between">
            <span>AGV NETWORK</span>
            <span className="text-status-green">{onlineCount}/{agvNodes.length} ONLINE</span>
          </div>
          {agvNodes.map(node => (
            <AgvNode
              key={node.id}
              id={node.id}
              status={node.status}
              agvTechMode={agvTechMode}
              onSendToChat={setAgvDebugTarget}
            />
          ))}
        </div>

        {/* System Log Feed */}
        <div>
          <div className="text-text-dim text-sm border-b border-border-panel pb-1 mb-2">SYSTEM LOG</div>
          <div className="space-y-1.5">
            {logs.map((entry, i) => (
              <div key={i} className="text-sm leading-relaxed">
                <span className="text-text-muted mr-2">
                  [{logTimestamp(entry.ts ? -Math.floor((Date.now() - entry.ts) / 60000) : entry.offsetMin)}]
                </span>
                <span className={
                  entry.msg.startsWith('ALERT') || entry.msg.startsWith('FAULT')
                    ? 'text-status-red'
                    : entry.msg.startsWith('HEARTBEAT') || entry.msg.includes('NOMINAL')
                    ? 'text-status-green'
                    : 'text-text-primary'
                }>
                  {entry.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
