import { z } from 'zod'

export const moderateSchema = z.object({
  text: z.string().min(1).max(2000),
})
