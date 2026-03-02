import { Router } from "express";
import { login, logout, signup } from "../controller/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, (req, res) => {
  res.json({ user: (req as any).user });
});
export default router;
