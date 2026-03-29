import { Request, Response } from 'express'
import { moderateSchema } from '../schema/moderateSchema'
import { checkStoryContent } from '../src/storyContentCheck'
import { aiModerateContent } from '../src/aiModeration'

export const moderate = async (req: Request, res: Response) => {
  const parsed = moderateSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Text pathaunuhos — kam se kam 1 character chahiyo',
    })
  }

  const { text } = parsed.data

  // Layer 1: regex check
  const regexCheck = checkStoryContent(text)
  if (!regexCheck.ok) {
    return res.status(422).json({
      success: false,
      data: null,
      error: regexCheck.message,
      code: regexCheck.code,
      showResources: regexCheck.showResources,
    })
  }

  // Layer 2: AI moderation
  const aiResult = await aiModerateContent(text)

  if (aiResult.crisis) {
    return res.status(422).json({
      success: false,
      data: null,
      error:
        'Tapaiko kura mahatwako cha. Sahara maa sampark garna saknuhuncha.',
      showResources: true,
    })
  }

  res.json({
    success: true,
    data: {
      safe: aiResult.safe,
      nudge: aiResult.nudge ?? null,
    },
  })
}
