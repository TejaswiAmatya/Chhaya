import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { storySchema } from "../schema/storySchema";

export const getStories = async (_req: Request, res: Response) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, data: stories });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const setStories = async (req: Request, res: Response) => {
  const parsed = storySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "Aphno katha lekh ta — kam se kam 10 characters chahiyo",
    });
  }

  try {
    const story = await prisma.story.create({ data: parsed.data });
    res.status(201).json({ success: true, data: story });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const suneinStory = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const story = await prisma.story.update({
      where: { id },
      data: { suneinCount: { increment: 1 } },
    });
    res.json({ success: true, data: story });
  } catch {
    res.status(404).json({
      success: false,
      data: null,
      error: "Yo katha ferina — sायद delete bhaisakyo",
    });
  }
};
