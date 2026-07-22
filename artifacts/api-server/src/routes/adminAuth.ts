import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, adminUsersTable } from "@workspace/db";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

// POST /admin/auth/login
router.post("/admin/auth/login", async (req, res): Promise<void> => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, username)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ adminId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/auth/me
router.get("/admin/auth/me", (req, res): void => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    res.json({ username: payload.username, adminId: payload.adminId });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
