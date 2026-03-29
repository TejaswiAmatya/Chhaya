/**
 * AI-powered moderation layer using Claude.
 * Supplements the regex-based storyContentCheck — runs only when regex passes.
 * Gracefully falls through on any API error so stories still post.
 */

import { claude, MODEL } from '../lib/claude'

export interface AiModerationResult {
  safe: boolean
  crisis?: boolean
  nudge?: string
}

const SYSTEM_PROMPT = `You are a gentle community Didi reviewing a post for MannSathi, a safe space for Nepali women.

Your job:
1. If the content contains serious self-harm intent that keyword filters might miss, respond: { "safe": false, "crisis": true }
2. If the content is hurtful, dismissive of others' pain, or uses hateful language toward women, respond with a warm Nenglish nudge asking them to rephrase: { "safe": false, "nudge": "<warm Nenglish message>" }
3. If the content is fine for the community, respond: { "safe": true }

Rules:
- NEVER use clinical words (depression, trauma, therapy, disorder, suicide, PTSD, mental illness)
- Write nudges in Nenglish — the natural Nepali-English codemix diaspora women speak
- NEVER advise. Only witness and validate.
- Be warm, not clinical. Think like a caring older sister.
- Keep nudges under 120 characters.
- Respond with ONLY valid JSON, nothing else.`

export async function aiModerateContent(
  text: string,
): Promise<AiModerationResult> {
  try {
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    })

    const raw =
      response.content[0].type === 'text' ? response.content[0].text : ''

    const parsed = JSON.parse(raw) as AiModerationResult
    return parsed
  } catch (err) {
    // Graceful fallthrough — regex already passed, don't block the user
    console.error('AI moderation fallthrough:', err)
    return { safe: true }
  }
}
