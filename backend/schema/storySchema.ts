import { z } from "zod";

export const storySchema = z.object({
  content: z.string().min(10).max(500),
});

export type StoryInput = z.infer<typeof storySchema>;
