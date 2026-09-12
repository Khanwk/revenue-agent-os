import "dotenv/config";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => typeof value === "string" && value.trim() === "" ? undefined : value;

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(4100),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  REDIS_URL: z.preprocess(emptyToUndefined, z.string().optional()),
  AI_PROVIDER: z.enum(["mock", "gemini"]).default("mock"),
  GEMINI_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  GEMINI_MODEL: z.string().default("gemini-3.7-flash"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  OAUTH_ENCRYPTION_KEY: z.preprocess(emptyToUndefined, z.string().min(32).optional()),
  UPWORK_CLIENT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  UPWORK_CLIENT_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  UPWORK_REDIRECT_URI: z.preprocess(emptyToUndefined, z.string().url().optional()),
  UPWORK_TENANT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  UPWORK_GRAPHQL_URL: z.string().url().default("https://api.upwork.com/graphql"),
  OPPORTUNITY_TOP_N: z.coerce.number().int().min(1).max(25).default(10),
  SOURCE_FETCH_LIMIT: z.coerce.number().int().min(5).max(100).default(30),
  DEMO_SOURCE_ENABLED: z.enum(["true","false"]).default("true").transform(v=>v==="true"),
  DEMO_SCAN_LIMIT: z.coerce.number().int().min(1).max(1000).default(5),
  AGENT_RUNS_PER_HOUR: z.coerce.number().int().min(1).max(500).default(30),
});

export const env = schema.parse(process.env);
export const allowedOrigins = env.WEB_ORIGIN.split(",").map((v) => v.trim().replace(/\/$/, "")).filter(Boolean);
