import process from "node:process";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "./db";
import * as schema from "../src/db/schema";

const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";
const hasGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

const socialProviders = hasGoogle
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          prompt: "select_account" as const,
        },
      }
    : undefined;

export const auth = betterAuth({
  baseURL: appOrigin,
  basePath: "/api/auth",
  secret: (process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET) as string,
  trustedOrigins: [appOrigin],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders,
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },
  session: {
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  plugins: [tanstackStartCookies()],
});
