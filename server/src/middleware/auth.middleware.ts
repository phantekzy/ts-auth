import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { sessions, users } from "../db/schema.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.auth_session;
  if (!sessionId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const [sessionWithUser] = await db.select({
      user: {
        id: users.id,
        email: users.email,
      },
      expiresAt: sessions.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
