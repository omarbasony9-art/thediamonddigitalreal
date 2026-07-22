import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, clientUsersTable, sitesTable } from "@workspace/db";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "diamonddigital-client-secret-fallback";

// Register a new client
router.post("/client/register", async (req, res): Promise<void> => {
  const { name, email, password, company } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const [existing] = await db.select().from(clientUsersTable).where(eq(clientUsersTable.email, email.toLowerCase()));
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(clientUsersTable).values({
    name,
    email: email.toLowerCase(),
    passwordHash,
    company: company || null,
  }).returning();

  const token = jwt.sign({ clientId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, company: user.company } });
});

// Login
router.post("/client/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const [user] = await db.select().from(clientUsersTable).where(eq(clientUsersTable.email, email.toLowerCase()));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = jwt.sign({ clientId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, company: user.company } });
});

// Get current client + their linked sites
router.get("/client/me", async (req, res): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);

  let payload: { clientId: number; email: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { clientId: number; email: string };
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
    return;
  }

  const [user] = await db.select().from(clientUsersTable).where(eq(clientUsersTable.id, payload.clientId));
  if (!user) {
    res.status(401).json({ error: "User not found." });
    return;
  }

  // Find sites linked to this client's email
  const sites = await db.select().from(sitesTable).where(eq(sitesTable.clientEmail, user.email));

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    sites,
  });
});

export default router;
