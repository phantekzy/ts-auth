import { Router } from "express";
import argon2 from "argon2";
import { db } from "../db/index.js";
import { sessions, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

const router = Router();
//Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Both email and password are required!" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }
  try {
    const hash = await argon2.hash(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hash,
      })
      .returning();
    res.status(201).json({ message: "User created!", id: newUser?.id });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Could not create user. Email might be taken." });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Both email and password are required" });
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt,
    });

    res.cookie("auth_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

//Logout
router.post("/logout", async (req, res) => {
  const sessionId = req.cookies.auth_session;
});

export default router;
