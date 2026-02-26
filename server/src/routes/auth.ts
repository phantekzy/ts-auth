import { Router } from "express";
import argon2 from "argon2";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await argon2.hash(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hash,
      })
      .returning();
  } catch (error) {}
});

export default router;
