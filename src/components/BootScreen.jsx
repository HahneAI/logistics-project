import { useState, useEffect } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { SUBSITES } from '../constants/subsites.js'

const BOOT_LINES = [
  'INITIALIZING DHL/P&G OPS TERMINAL v2.4.1...',
  'LOADING FACILITY CONFIG: JACKSON MO / P&G PLANT 7',
  'CONNECTING TO SHIFT MANAGEMENT SYSTEM........OK',
  'LOADING AGV NETWORK INTERFACE.................OK',
  'LOADING SOP KNOWLEDGE BASE....................OK',
  'CONNECTING TO AI INFERENCE ENGINE.............OK',
  'RUNNING SAFETY SYSTEMS CHECK..................OK',
  '-----------------------------------------------',
  'SYSTEM READY.',
]

export default function BootScreen({ onBoot }) {
  const { setSubsite } = useSubsite()
  const [visibleLines, setVisibleLines] = useState(0)
  const [selected, setSelected] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return
    const delay = visibleLines < BOOT_LINES.length - 2 ? 180 : 400
    const t = setTimeout(() => setVisibleLines(v => v + 1), delay)
    return () => clearTimeout(t)
  }, [visibleLines])

  useEffect(() => {
    const onKey = (e) => {
      if (visibleLines < BOOT_LINES.length) return
      if (e.key === 'ArrowDown' || e.key === '2') setSelected(s => (s + 1) % SUBSITES.length)
      if (e.key === 'ArrowUp'   || e.key === '8') setSelected(s => (s - 1 + SUBSITES.length) % SUBSITES.length)
      if (e.key === 'Enter') handleConfirm()
      SUBSITES.forEach((sub, i) => { if (e.key === sub.key) setSelected(i) })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visibleLines, selected])

  function handleConfirm() {
    if (confirmed) return
    setConfirmed(true)
    setSubsite(SUBSITES[selected])
    setTimeout(onBoot, 600)
  }

  const booting = visibleLines < BOOT_LINES.length
  const showSelector = !booting

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="min-h-screen bg-bg-primary font-terminal text-text-primary flex flex-col p-4">

      {/* Status bar — matches top bar on real terminal */}
      <div className="flex justify-between items-center text-xs text-text-dim mb-6">
        <span>{timeStr}</span>
        <span className="text-text-primary">DHL/P&G OPS RDT</span>
        <span>[T]</span>
      </div>

      {/* Boot sequence (top-left aligned, sparse — like real terminal) */}
      <div className="space-y-0.5 mb-6 min-h-[12rem] text-sm">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={
            line === 'SYSTEM READY.'
              ? 'text-status-green'
              : line.startsWith('---')
              ? 'text-text-muted'
              : 'text-text-primary'
          }>
            {line || <span>&nbsp;</span>}
          </div>
        ))}
        {booting && <span className="text-accent-cyan cursor-blink">█</span>}
      </div>

      {/* Login form — styled like Screen 00.01 */}
      {showSelector && (
        <div className="text-sm space-y-4">
          {/* TECHID row (decorative — shows operator terminal ID) */}
          <div className="flex items-center gap-2">
            <span className="text-text-primary w-20">TECHID:</span>
            <span className="bg-status-green text-bg-primary px-8 py-0.5 min-w-[12rem]">
              &nbsp;
            </span>
          </div>

          {/* PASSWORD row (decorative) */}
          <div className="flex items-center gap-2">
            <span className="text-text-primary w-20">PASSWORD:</span>
            <span className="bg-status-yellow text-bg-primary px-8 py-0.5 min-w-[12rem]">
              &nbsp;
            </span>
          </div>

          {/* EQUIPMENT TYPE — the subsite selector */}
          <div className="mt-6">
            <div className="text-text-primary mb-2">EQUIPMENT TYPE:</div>
            <div className="space-y-1 ml-2">
              {SUBSITES.map((sub, i) => (
                <div
                  key={sub.id}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer ${
                    selected === i
                      ? 'bg-status-green text-bg-primary'
                      : 'text-text-primary hover:text-accent-cyan'
                  }`}
                >
                  <span className={selected === i ? 'text-bg-primary' : 'text-text-dim'}>[{sub.key}]</span>
                  <span>{sub.label}</span>
                  {selected === i && <span className="cursor-blink ml-1">█</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Confirm */}
          <div className="mt-6">
            <button
              onClick={handleConfirm}
              disabled={confirmed}
              className="text-text-primary hover:text-accent-cyan disabled:opacity-60 font-terminal text-sm"
            >
              {confirmed
                ? `LOADING ${SUBSITES[selected].shortName}...`
                : '> CONFIRM [ENTER]'}
              {!confirmed && <span className="cursor-blink ml-1">_</span>}
            </button>
          </div>
        </div>
      )}

      {/* Screen identifier — bottom-left like real terminal */}
      <div className="mt-auto pt-4 text-xs text-text-dim">
        <div>Screen 00.01</div>
        <div className="mt-1">DB:ops_live&nbsp;&nbsp;Grp:dhl_pg</div>
      </div>
    </div>
  )
}
