import Anthropic from '@anthropic-ai/sdk'
import { SOPS } from '../constants/sops.js'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // demo-only — move to serverless function in Phase 2
})

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
 * @returns {Promise<string>}   - full response text when complete
 */
export async function sendMessage(messages, subsiteId, onChunk) {
  let fullText = ''

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: getSystemPrompt(subsiteId),
    messages,
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta?.type === 'text_delta'
    ) {
      fullText += chunk.delta.text
      onChunk(chunk.delta.text)
    }
  }

  return fullText
}
