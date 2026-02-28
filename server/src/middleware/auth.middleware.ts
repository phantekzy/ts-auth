import type { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.auth_session;
  if (!sessionId) {
    return res.status(401).json({ error: "Authentication required" });
  }
};
