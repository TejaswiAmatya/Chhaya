import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

/** Sets req.user when a valid session cookie is present; continues as anonymous otherwise. */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    req.user = verifyToken(token);
  } catch {
    req.user = undefined;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, data: null, error: "Login garnus pehile." });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res
      .status(401)
      .json({
        success: false,
        data: null,
        error: "Session puraan bhayo. Feri login garnus.",
      });
  }
}
