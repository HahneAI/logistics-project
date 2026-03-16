import { useState, useRef, useEffect } from 'react'
import { useSubsite } from '../context/SubsiteContext.jsx'
import { sendMessage } from '../api/chat.js'

export default function ChatPanel() {
  const { subsite } = useSubsite()
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError]         = useState(null)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  async function handleSend() {
    const text = input.trim()
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
    } catch (err) {
      setError('SYS ERROR: API UNAVAILABLE — CHECK KEY OR NETWORK')
    } finally {
      setStreamText('')
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Panel header */}
      <div className="border-b border-border-panel px-3 py-2 text-xs text-text-dim shrink-0 flex justify-between">
        <span className="font-display text-base text-text-primary tracking-wider">SOP AGENT</span>
        <span>STATION: {subsite?.shortName ?? '—'}</span>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-xs">
        {messages.length === 0 && !loading && (
          <div className="text-text-dim mt-4 space-y-1">
            <div>SYSTEM READY.</div>
            <div>ASK A QUESTION ABOUT YOUR SOPs, SAFETY PROTOCOLS, OR SHIFT TASKS.</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="text-accent-cyan">
                <span className="text-text-dim">&gt; </span>{msg.content}
              </div>
            ) : (
              <div className="text-text-primary whitespace-pre-wrap leading-relaxed">
                <span className="text-status-green">SYS: </span>{msg.content}
              </div>
            )}
          </div>
        ))}

        {/* Streaming response in progress */}
        {loading && streamText && (
          <div className="text-text-primary whitespace-pre-wrap leading-relaxed">
            <span className="text-status-green">SYS: </span>
            {streamText}
            <span className="cursor-blink text-accent-cyan">█</span>
          </div>
        )}

        {loading && !streamText && (
          <div className="text-text-dim">
            SYS: <span className="cursor-blink">█</span>
          </div>
        )}

        {error && (
          <div className="text-status-red text-xs">{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border-panel px-3 py-2 shrink-0">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-accent-cyan shrink-0">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="ENTER COMMAND..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none font-terminal text-xs disabled:opacity-40"
            autoFocus
          />
          {!loading && input && (
            <span className="cursor-blink text-accent-cyan">_</span>
          )}
        </div>
      </div>
    </div>
  )
}
