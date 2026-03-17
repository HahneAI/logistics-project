import { SOPS } from '../constants/sops.js'

export function getSystemPrompt(subsiteId) {
  const sopText = SOPS[subsiteId] ?? 'No SOP context available for this subsite.'
  return `You are an operations assistant for DHL operators at the P&G facility in Jackson, Missouri.
You are assigned to the ${subsiteId?.toUpperCase() ?? 'UNKNOWN'} area.
Answer questions about standard operating procedures, safety protocols, and shift tasks.
Keep answers concise and practical. Use plain language suitable for a warehouse floor environment.
If you do not know the answer, say so clearly and suggest the operator contact their team lead.
Do not use markdown formatting — plain text only, short paragraphs or numbered steps.

SOP CONTEXT FOR THIS SUBSITE:
${sopText}`
}

/**
 * Send a message to Claude and stream back the response text.
 * @param {Array}    messages   - array of { role, content } objects
 * @param {string}   subsiteId  - current subsite id for SOP scoping
 * @param {function} onChunk    - called with each text delta string
 * @returns {Promise<void>}
 */
export async function sendMessage(messages, subsiteId, onChunk) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt: getSystemPrompt(subsiteId) }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value, { stream: true }))
  }
}
