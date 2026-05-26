import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const envPath = resolve(process.cwd(), ".env");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const password = env.VITE_DB_PASSWORD;
if (!password) throw new Error("VITE_DB_PASSWORD missing from .env");

const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260525120000_leadership_home_sections_add_cxo.sql"),
  "utf8"
);

const client = new pg.Client({
  host: "db.elrnafeyidalkswgdqvx.supabase.co",
  port: 5432,
  user: "postgres",
  database: "postgres",
  password,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query("begin");
  await client.query(sql);
  await client.query("commit");
  console.log("migration applied");

  const { rows } = await client.query(
    `select conname, pg_get_constraintdef(oid) as def
       from pg_constraint
      where conname = 'leadership_home_sections_check'`
  );
  console.log("constraint now:", rows[0]?.def);
} catch (err) {
  await client.query("rollback").catch(() => {});
  console.error("migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
