import "dotenv/config.js";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4100),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  AI_PROVIDER: z.enum(["mock", "gemini"]).default("mock"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-3.7-flash"),
  UPWORK_ACCESS_TOKEN: z.string().optional(),
  UPWORK_CLIENT_ID: z.string().optional(),
  UPWORK_CLIENT_SECRET: z.string().optional(),
  UPWORK_REDIRECT_URI: z.string().optional(),
  UPWORK_TENANT_ID: z.string().optional(),
  UPWORK_GRAPHQL_URL: z.string().default("https://api.upwork.com/graphql"),
  OPPORTUNITY_TOP_N: z.coerce.number().int().min(1).max(25).default(10),
  SOURCE_FETCH_LIMIT: z.coerce.number().int().min(5).max(100).default(30),
});

export const env = schema.parse(process.env);
