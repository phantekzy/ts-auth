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

    res.status(201).json({ message: "User created!", id: newUser?.id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Email already exists" });
  }
});

export default router;
