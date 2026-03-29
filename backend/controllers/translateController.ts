import { Request, Response } from 'express'
import { translateSchema } from '../schema/translateSchema'
import { claude, MODEL } from '../lib/claude'

const SYSTEM_PROMPT = `You are a translator for MannSathi, a Nepali women's community platform.

Rules:
- If translating Nepali to English: preserve Nenglish codemix flavor where it adds warmth. Keep it natural, like a friend explaining.
- If translating English to Nepali: use natural spoken Nepali (Devanagari script), not formal/literary. Write how women actually talk.
- NEVER use clinical terms (depression, trauma, therapy, disorder, suicide, PTSD, mental illness). Use heart language equivalents.
- Return ONLY the translated text, nothing else. No quotes, no explanation.`

export const translate = async (req: Request, res: Response) => {
  const parsed = translateSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Text ra targetLang (en/ne) pathaunuhos',
    })
  }

  const { text, targetLang } = parsed.data
  const langLabel = targetLang === 'en' ? 'English' : 'Nepali (Devanagari)'

  try {
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Translate the following text to ${langLabel}:\n\n${text}`,
        },
      ],
    })

    const translated =
      response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    res.json({
      success: true,
      data: { translated, targetLang },
    })
  } catch (err) {
    console.error('Translation error:', err)
    res.status(500).json({
      success: false,
      data: null,
      error: 'Anuwad garna sakena — feri try garnus',
    })
  }
}
