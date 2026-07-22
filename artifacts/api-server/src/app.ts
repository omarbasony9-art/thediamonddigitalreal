import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { eq } from "drizzle-orm";
import { db, sitesTable, sitePagesTable } from "@workspace/db";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const MIME_MAP: Record<string, string> = {
  html: "text/html; charset=utf-8",
  css:  "text/css; charset=utf-8",
  js:   "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg:  "image/svg+xml",
  txt:  "text/plain; charset=utf-8",
};

// Build the set of platform-owned domains at startup so we never intercept them.
// REPLIT_DOMAINS can be comma-separated; include all variants.
const PLATFORM_DOMAINS = new Set<string>(
  [
    ...(process.env.REPLIT_DOMAINS || "").split(","),
    ...(process.env.REPLIT_DEV_DOMAIN || "").split(","),
  ]
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean)
);

/** Serve client sites on their custom domains (before any /api routing). */
async function customDomainMiddleware(req: any, res: any, next: any) {
  try {
    const rawHost =
      (req.headers["x-forwarded-host"] as string)?.split(",")[0].trim() ||
      req.headers.host ||
      "";
    const host = rawHost.split(":")[0].toLowerCase();

    // Skip the platform's own domains — only intercept genuine client domains
    if (
      !host ||
      host === "localhost" ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) ||
      host.endsWith(".replit.dev") ||
      host.endsWith(".replit.app") ||
      host.endsWith(".worf.replit.dev") ||
      PLATFORM_DOMAINS.has(host)
    ) {
      return next();
    }

    // Look up a published site by custom domain
    const [site] = await db
      .select()
      .from(sitesTable)
      .where(eq(sitesTable.domain, host));
    if (!site) return next();

    // Determine which file to serve
    const urlPath = req.path === "" ? "/" : req.path;
    const filename =
      urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");

    const pages = await db
      .select()
      .from(sitePagesTable)
      .where(eq(sitePagesTable.siteId, site.id));

    if (!pages.length) {
      res.status(404).send("<h1>Site not yet published</h1>");
      return;
    }

    const page =
      pages.find((p) => p.slug === filename) ??
      (filename === "index.html" ? pages[0] : null);

    if (!page) {
      res.status(404).send(`<h1>Page not found: ${filename}</h1>`);
      return;
    }

    const ext = page.slug.split(".").pop()?.toLowerCase() ?? "html";
    res.setHeader("Content-Type", MIME_MAP[ext] ?? "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60");
    res.send(page.content);
  } catch (err) {
    next(err);
  }
}

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Custom domain routing — must be before /api and before body parsers
app.use(customDomainMiddleware);

// Clerk proxy must be before body parsers
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

// Resolve the publishable key from the incoming request host
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

export default app;
