import { Router } from "express";
import argon2 from "argon2";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { error } from "node:console";

const router = Router();
//Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || password) {
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
      .json({ error: "Both Email and Password are required" });
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ error: "Incorrect Email or Password" });
    }
    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect Email or Password" });
    }
  } catch (error) {}
});

export default router;
