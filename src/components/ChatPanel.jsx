import { useState, useRef, useEffect } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { sendMessage } from '../api/chat.js'

// AGV diagnostic questionnaire — who/what/when/where/why + attempted fix + outcome
const AGV_STEPS = [
  {
    id:       'who',
    label:    'STEP 1/6 — IDENTIFY',
    question: 'Who reported this issue, and who is currently at the machine?',
    type:     'text',
  },
  {
    id:       'what',
    label:    'STEP 2/6 — DESCRIBE FAULT',
    question: 'What is the AGV doing (or not doing)?',
    type:     'choice',
    choices:  [
      'Not moving / stopped mid-route',
      'Displaying error code',
      'Not responding to commands',
      'Making unusual noise or vibration',
      'Other',
    ],
  },
  {
    id:       'when',
    label:    'STEP 3/6 — TIMELINE',
    question: 'When did this fault begin?',
    type:     'choice',
    choices:  [
      'Just now (under 5 minutes)',
      'Within the last 30 minutes',
      'More than 1 hour ago',
      'Unknown',
    ],
  },
  {
    id:       'where',
    label:    'STEP 4/6 — LOCATION',
    question: 'Confirm zone and lane location for this unit:',
    type:     'text',
  },
  {
    id:       'why',
    label:    'STEP 5/6 — ROOT CAUSE THEORY',
    question: 'What do you believe caused this? Be as specific as possible.',
    type:     'text',
  },
  {
    id:       'attempted',
    label:    'STEP 6/6 — ATTEMPTED FIX & OUTCOME',
    question: 'What did you attempt, and what was the result of that attempt?',
    type:     'text',
  },
]

function buildDiagnosticSummary(node, answers) {
  const fault = answers.what ?? 'Unknown fault'
  const recommendations = {
    'Not moving / stopped mid-route':
      'Verify lane clearance — check for physical obstruction at last reported position. Inspect encoder status via RDT console. If lane is clear and encoder reads normal, attempt a soft reset from the RDT panel. Do not manually push the unit.',
    'Displaying error code':
      'Document the exact error code and timestamp. Common codes on this network: E01 (encoder misalign), E04 (battery critical), E07 (path obstruction). Cross-reference against the fault log in the RDT system. If E04, unit must be removed from service and sent to charge.',
    'Not responding to commands':
      'Attempt soft reset sequence from RDT: hold RESET for 5 seconds, wait 30 seconds, re-issue command. If no response, check network signal at unit location — dead zones exist near D6 and C4 lanes. If still unresponsive after 60 seconds, escalate to equipment supervisor.',
    'Making unusual noise or vibration':
      'Remove unit from service immediately. Do not attempt further operation. Tag unit as OUT OF SERVICE and notify equipment maintenance. Unusual mechanical sounds indicate potential drivetrain or wheel assembly issue — operating under these conditions risks further damage or a floor incident.',
    'Other':
      'Based on the description provided, this situation requires supervisor review. Document all findings thoroughly. Hold the unit at its current position and do not attempt further operation until a qualified technician has assessed.',
  }

  const rec = Object.keys(recommendations).find(k => fault.startsWith(k))
    ? recommendations[fault]
    : recommendations['Other']

  return `AGV DIAGNOSTIC REPORT — ${node.id}
${'─'.repeat(40)}
REPORTED BY........ ${answers.who ?? 'Not provided'}
FAULT TYPE......... ${answers.what ?? 'Not provided'}
ONSET.............. ${answers.when ?? 'Not provided'}
LOCATION........... ${answers.where ?? node.id}
TECH ASSESSMENT.... ${answers.why ?? 'Not provided'}
ATTEMPTED FIX...... ${answers.attempted ?? 'Not provided'}
${'─'.repeat(40)}
DIAGNOSTIC RECOMMENDATION:

${rec}
${'─'.repeat(40)}
Log this report with your supervisor. If unit cannot be restored within 15 minutes, submit a maintenance request and reassign the affected lane.`
}

export default function ChatPanel() {
  const { subsite, agvDebugTarget, setAgvDebugTarget } = useSubsite()
  const [messages,   setMessages]   = useState([])
  const [input,      setInput]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error,      setError]      = useState(null)

  // AGV diagnostic state
  const [agvStep,          setAgvStep]          = useState(0)
  const [agvAnswers,       setAgvAnswers]       = useState({})
  const [agvProcessing,    setAgvProcessing]    = useState(false)

  // Last-clicked suggested prompt — excluded from reappear list until a different one is clicked
  const [lastClickedPrompt, setLastClickedPrompt] = useState(null)

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const inAgvMode = agvDebugTarget !== null

  // When a debug target is set, initialize the questionnaire
  useEffect(() => {
    if (agvDebugTarget) {
      setAgvStep(0)
      setAgvAnswers({})
      setMessages([])
      setInput('')
      setError(null)
    }
  }, [agvDebugTarget])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText, agvStep])

  // ── AGV questionnaire logic ──────────────────────────────────────────────

  function handleAgvChoice(choice) {
    const step = AGV_STEPS[agvStep]
    const newAnswers = { ...agvAnswers, [step.id]: choice }
    setAgvAnswers(newAnswers)
    advanceAgvStep(newAnswers)
  }

  function handleAgvText() {
    const text = input.trim()
    if (!text) return
    const step = AGV_STEPS[agvStep]
    const newAnswers = { ...agvAnswers, [step.id]: text }
    setAgvAnswers(newAnswers)
    setInput('')
    advanceAgvStep(newAnswers)
  }

  function advanceAgvStep(answers) {
    const nextStep = agvStep + 1
    setAgvProcessing(true)
    setTimeout(() => {
      setAgvProcessing(false)
      if (nextStep >= AGV_STEPS.length) {
        const summary = buildDiagnosticSummary(agvDebugTarget, answers)
        setMessages([{ role: 'assistant', content: summary }])
        setAgvStep(AGV_STEPS.length)
      } else {
        setAgvStep(nextStep)
      }
    }, 750)
  }

  function exitAgvMode() {
    setAgvDebugTarget(null)
    setMessages([])
    setAgvStep(0)
    setAgvAnswers({})
    setInput('')
  }

  // ── SOP chat logic ───────────────────────────────────────────────────────

  async function handleSendText(text) {
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)
    setStreamText('')
    setError(null)
    try {
      let accumulated = ''
      await sendMessage(
        history.map(m => ({ role: m.role, content: m.content })),
        subsite?.id,
        (chunk) => {
          accumulated += chunk
          setStreamText(accumulated)
        }
      )
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
    } catch {
      setError('SYS ERROR: API UNAVAILABLE — CHECK KEY OR NETWORK')
    } finally {
      setStreamText('')
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSend() {
    setLastClickedPrompt(null) // manual send clears the exclusion
    handleSendText(input.trim())
  }

  function handlePromptClick(prompt) {
    setLastClickedPrompt(prompt)
    handleSendText(prompt)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      inAgvMode ? handleAgvText() : handleSend()
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const currentStep     = AGV_STEPS[agvStep]
  const agvComplete     = inAgvMode && agvStep >= AGV_STEPS.length
  const lastIsAssistant = messages.length > 0 && messages[messages.length - 1].role === 'assistant'
  const allPrompts      = subsite?.suggestedPrompts ?? []
  // Pinned prompts: only show when not loading, last msg is from assistant, not in AGV mode
  // Exclude the most recently clicked prompt (rolling — clears when a different prompt is clicked)
  const pinnedPrompts   = !inAgvMode && !loading && lastIsAssistant
    ? allPrompts.filter(p => p !== lastClickedPrompt)
    : []

  return (
    <div
      className="flex flex-col h-full bg-bg-panel"
      style={inAgvMode ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,85,0.25), 0 0 24px rgba(255,255,85,0.07)' } : {}}
    >
      {/* Panel header */}
      <div className="border-b border-border-panel px-3 py-2 shrink-0 flex justify-between items-center">
        <span className="font-display text-base text-text-primary tracking-wider">
          {inAgvMode ? `AGV DIAGNOSTIC — ${agvDebugTarget.id}` : 'SOP AGENT'}
        </span>
        <div className="flex items-center gap-3 text-sm">
          {inAgvMode && (
            <button
              onClick={exitAgvMode}
              className="text-xs text-text-dim hover:text-status-red transition-colors"
            >
              ✕ EXIT DEBUG
            </button>
          )}
          <span className="text-text-dim">{inAgvMode ? 'AGV DEBUG MODE' : `STATION: ${subsite?.shortName ?? '—'}`}</span>
        </div>
      </div>

      {/* Message / questionnaire area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-sm">

        {/* ── AGV diagnostic questionnaire ── */}
        {inAgvMode && !agvComplete && (
          <div className="space-y-4 mt-2">
            <div className="text-status-yellow text-xs border border-status-yellow/30 bg-status-yellow/5 px-2 py-1.5" style={{ borderRadius: '2px' }}>
              ⚠ AGV FAULT DETECTED — {agvDebugTarget.id}<br />
              <span className="text-text-dim">Answer each question to build the diagnostic report.</span>
            </div>

            {/* Previously answered steps */}
            {AGV_STEPS.slice(0, agvStep).map(step => (
              <div key={step.id} className="text-xs">
                <div className="text-text-muted">{step.label}</div>
                <div className="text-text-dim mt-0.5">{step.question}</div>
                <div className="text-accent-cyan mt-1">
                  <span className="text-text-dim">&gt; </span>{agvAnswers[step.id]}
                </div>
              </div>
            ))}

            {/* Typing indicator between steps */}
            {agvProcessing && (
              <div className="text-status-yellow text-sm flex items-center gap-2">
                <span>SYS: LOGGING INPUT</span>
                <span className="inline-flex gap-0.5">
                  <span className="cursor-blink">▋</span>
                  <span className="cursor-blink" style={{ animationDelay: '0.2s' }}>▋</span>
                  <span className="cursor-blink" style={{ animationDelay: '0.4s' }}>▋</span>
                </span>
              </div>
            )}

            {/* Current step */}
            {!agvProcessing && currentStep && (
              <div className="border border-border-panel p-2 space-y-2" style={{ borderRadius: '2px' }}>
                <div className="text-status-yellow text-xs">{currentStep.label}</div>
                <div className="text-text-primary text-sm">{currentStep.question}</div>
                {currentStep.type === 'choice' && (
                  <div className="space-y-1 mt-1">
                    {currentStep.choices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => handleAgvChoice(choice)}
                        className="w-full text-left text-sm text-text-dim hover:text-accent-cyan hover:bg-bg-panel px-2 py-1 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        <span className="text-text-muted mr-2">[{i + 1}]</span>{choice}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── AGV diagnostic result ── */}
        {inAgvMode && agvComplete && messages.map((msg, i) => (
          <div key={i} className="text-text-primary whitespace-pre-wrap leading-relaxed text-sm font-terminal">
            <span className="text-status-green">SYS: </span>{msg.content}
          </div>
        ))}
        {inAgvMode && agvComplete && (
          <button
            onClick={exitAgvMode}
            className="text-xs border border-border-panel px-3 py-1 text-text-dim hover:border-accent-cyan hover:text-accent-cyan transition-colors mt-2"
            style={{ borderRadius: '2px' }}
          >
            ← RETURN TO SOP AGENT
          </button>
        )}

        {/* ── Normal SOP chat ── */}
        {!inAgvMode && messages.length === 0 && !loading && (
          <div className="mt-4 space-y-3">
            <div className="text-text-dim text-sm">SYSTEM READY.</div>
            <div className="space-y-1 mt-3">
              {allPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full text-left text-sm text-text-dim hover:text-accent-cyan hover:bg-bg-panel px-1 py-0.5 transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  <span className="text-text-muted mr-1">&gt;</span>{prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {!inAgvMode && messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="text-accent-cyan text-sm">
                <span className="text-text-dim">&gt; </span>{msg.content}
              </div>
            ) : (
              <div className="text-text-primary whitespace-pre-wrap leading-relaxed text-sm">
                <span className="text-status-green">SYS: </span>{msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && streamText && (
          <div className="text-text-primary whitespace-pre-wrap leading-relaxed text-sm">
            <span className="text-status-green">SYS: </span>
            {streamText}
            <span className="cursor-blink text-accent-cyan">█</span>
          </div>
        )}
        {loading && !streamText && (
          <div className="text-text-dim text-sm">SYS: <span className="cursor-blink">█</span></div>
        )}
        {error && <div className="text-status-red text-sm">{error}</div>}

        <div ref={bottomRef} />
      </div>

      {/* Pinned suggested queries — above input bar, outside scroll area */}
      {pinnedPrompts.length > 0 && (
        <div className="border-t border-border-panel px-3 pt-2 pb-1 shrink-0 space-y-0.5">
          <div className="text-text-muted text-xs mb-1">SUGGESTED QUERIES</div>
          {pinnedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(prompt)}
              className="w-full text-left text-sm text-text-dim hover:text-accent-cyan hover:bg-bg-panel px-1 py-0.5 transition-colors"
              style={{ borderRadius: '2px' }}
            >
              <span className="text-text-muted mr-1">&gt;</span>{prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input bar — hidden when AGV step is choice-type or questionnaire complete */}
      {(!inAgvMode || (inAgvMode && currentStep?.type === 'text' && !agvComplete && !agvProcessing)) && (
        <div className="border-t border-border-panel px-3 py-2 shrink-0">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-accent-cyan shrink-0">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={inAgvMode ? 'TYPE RESPONSE AND PRESS ENTER...' : 'ENTER COMMAND...'}
              className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none font-terminal text-sm disabled:opacity-40"
              maxLength={500}
              autoFocus
            />
            {input.length > 400 && (
              <span className="text-status-yellow text-xs shrink-0">{500 - input.length}</span>
            )}
            {!loading && input && (
              <span className="cursor-blink text-accent-cyan">_</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
