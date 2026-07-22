import { db, adminUsersTable } from "./src/index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const USERNAME = "TheTitanMedia";
const PASSWORD = "Mytitan1964@1";

async function seed() {
  const hash = await bcrypt.hash(PASSWORD, 12);
  const existing = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, USERNAME)).limit(1);
  if (existing.length > 0) {
    await db.update(adminUsersTable).set({ passwordHash: hash }).where(eq(adminUsersTable.username, USERNAME));
    console.log("✓ Admin user updated");
  } else {
    await db.insert(adminUsersTable).values({ username: USERNAME, passwordHash: hash });
    console.log("✓ Admin user created:", USERNAME);
  }
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
