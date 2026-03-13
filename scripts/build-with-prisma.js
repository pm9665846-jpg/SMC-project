/**
 * Ensures DATABASE_URL exists for prisma generate (required by Prisma schema).
 * Uses a dummy URL only when the env var is missing so build succeeds on Vercel
 * before the user adds the variable. Runtime still requires real DATABASE_URL.
 */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://build:build@localhost:3306/build";
}
const path = require("path");
const { execSync } = require("child_process");
const root = path.join(__dirname, "..");
execSync("npx prisma generate", { stdio: "inherit", cwd: root });
