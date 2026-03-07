import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { Pool } from "pg";

const required = ["DATABASE_URL"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const appOrigin = process.env.APP_ORIGIN || "http://localhost:3000";
const authOrigin = process.env.AUTH_ORIGIN || "http://localhost:4000";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  password: process.env.DATABASE_PASSWORD || undefined,
});

const googleEnabled =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: authOrigin,
  basePath: "/api/auth",
  trustedOrigins: [appOrigin, authOrigin],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
});

export async function runAuthMigrations() {
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
}

export async function shutdownAuth() {
  await pool.end();
}
