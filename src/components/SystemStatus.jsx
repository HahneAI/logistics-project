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

function AgvNode({ id, status }) {
  return (
    <div className="flex justify-between items-center text-xs py-0.5">
      <span className="text-text-dim">{id}</span>
      <span className={`${STATUS_COLORS[status]} ${status === 'faulted' ? 'animate-pulse' : ''} font-bold`}>
        {STATUS_LABELS[status]}
      </span>
    </div>
  )
}

export default function SystemStatus() {
  const { subsite } = useSubsite()
  const data = DEMO_METRICS[subsite?.id] ?? DEMO_METRICS.diaper
  const [logs, setLogs] = useState(data.systemLogs)
  const [agvNodes, setAgvNodes] = useState(data.agvNodes)

  // Reset when subsite changes
  useEffect(() => {
    setLogs(data.systemLogs)
    setAgvNodes(data.agvNodes)
  }, [data])

  // Simulate occasional log entries every ~45 seconds
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

  const faultCount = agvNodes.filter(n => n.status === 'faulted').length
  const onlineCount = agvNodes.filter(n => n.status === 'online').length

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Panel header */}
      <div className="border-b border-border-panel px-3 py-2 shrink-0 flex justify-between items-center">
        <span className="font-display text-base text-text-primary tracking-wider">SYSTEM STATUS</span>
        {faultCount > 0 && (
          <span className="text-status-red text-xs animate-pulse">⚠ {faultCount} FAULT{faultCount > 1 ? 'S' : ''}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">

        {/* AGV Network */}
        <div>
          <div className="text-text-dim text-xs border-b border-border-panel pb-1 mb-2 flex justify-between">
            <span>AGV NETWORK</span>
            <span className="text-status-green">{onlineCount}/{agvNodes.length} ONLINE</span>
          </div>
          {agvNodes.map(node => (
            <AgvNode key={node.id} id={node.id} status={node.status} />
          ))}
        </div>

        {/* System Log Feed */}
        <div>
          <div className="text-text-dim text-xs border-b border-border-panel pb-1 mb-2">SYSTEM LOG</div>
          <div className="space-y-1">
            {logs.map((entry, i) => (
              <div key={i} className="text-xs leading-relaxed">
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
