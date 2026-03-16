import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import process from "node:process";
import * as schema from "../src/db/schema";

function resolveDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  const password = process.env.DATABASE_PASSWORD;
  if (password && rawUrl.includes("[YOUR-PASSWORD]")) {
    return rawUrl.replace("[YOUR-PASSWORD]", encodeURIComponent(password));
  }

  return rawUrl;
}

export const databaseUrl = resolveDatabaseUrl();

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
