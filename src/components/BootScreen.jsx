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
  '',
  'SUBSITE LOGIN — SELECT STATION',
]

export default function BootScreen({ onBoot }) {
  const { setSubsite } = useSubsite()
  const [visibleLines, setVisibleLines] = useState(0)
  const [selected, setSelected] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return
    const delay = visibleLines < BOOT_LINES.length - 3 ? 180 : 400
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
  const showSelector = visibleLines >= BOOT_LINES.length

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border border-border-panel bg-bg-secondary p-6 font-terminal text-sm">

        {/* Header bar */}
        <div className="border-b border-border-panel pb-2 mb-4 flex justify-between text-text-dim text-xs">
          <span>DHL OPERATIONS TERMINAL</span>
          <span>JACKSON MO — P&G FACILITY 7</span>
        </div>

        {/* Boot lines */}
        <div className="space-y-0.5 min-h-[14rem]">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={
                line === 'SYSTEM READY.'
                  ? 'text-status-green'
                  : line.startsWith('---')
                  ? 'text-border-panel'
                  : line.endsWith('OK')
                  ? 'text-text-primary'
                  : 'text-text-dim'
              }
            >
              {line || <span>&nbsp;</span>}
            </div>
          ))}

          {/* Blinking cursor during boot */}
          {booting && (
            <span className="text-accent-cyan cursor-blink">█</span>
          )}
        </div>

        {/* Subsite selector */}
        {showSelector && (
          <div className="mt-4 border-t border-border-panel pt-4">
            <div className="space-y-1 mb-6">
              {SUBSITES.map((sub, i) => (
                <div
                  key={sub.id}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-3 px-2 py-1 cursor-pointer transition-colors ${
                    selected === i
                      ? 'bg-accent-blue/20 text-accent-cyan border border-accent-blue/40'
                      : 'text-text-primary hover:text-accent-cyan border border-transparent'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  <span className="text-text-dim w-4">[{sub.key}]</span>
                  <span>{sub.label}</span>
                  {selected === i && <span className="ml-auto text-accent-cyan text-xs">◄ SELECTED</span>}
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirmed}
              className="w-full border border-accent-blue text-accent-cyan font-terminal py-2 px-4 text-left hover:bg-accent-blue/20 transition-colors disabled:opacity-50"
              style={{ borderRadius: '2px' }}
            >
              <span className="text-text-dim mr-2">&gt;</span>
              {confirmed ? `LOADING ${SUBSITES[selected].shortName}...` : 'CONFIRM STATION [ENTER]'}
              {!confirmed && <span className="cursor-blink ml-1">_</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
