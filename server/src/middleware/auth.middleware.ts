import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { sessions, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

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
    const [sessionWithUser] = db
      .select({
        user: {
          id: users.id,
          email: users.email,
        },
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId));

    if (!sessionWithUser || sessionWithUser.expiresAt < Date.now()) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
