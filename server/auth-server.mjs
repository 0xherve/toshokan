import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth, runAuthMigrations, shutdownAuth } from "./auth-config.mjs";

const port = Number(process.env.AUTH_PORT || 4000);
const handler = toNodeHandler(auth);

await runAuthMigrations();

const server = createServer(async (req, res) => {
  if (req.url?.startsWith("/api/auth")) {
    await handler(req, res);
    return;
  }

  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.end(
    JSON.stringify({
      ok: true,
      service: "better-auth",
      authBasePath: "/api/auth",
    }),
  );
});

server.listen(port, () => {
  console.log(`[auth] Better Auth running on http://localhost:${port}/api/auth`);
});

const shutdown = async () => {
  server.close();
  await shutdownAuth();
};

process.on("SIGINT", () => {
  void shutdown();
});
process.on("SIGTERM", () => {
  void shutdown();
});
