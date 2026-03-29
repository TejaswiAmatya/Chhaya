import { z } from 'zod'

export const translateSchema = z.object({
  text: z.string().min(1).max(2000),
  targetLang: z.enum(['en', 'ne']),
})
