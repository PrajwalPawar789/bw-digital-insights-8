import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

const envText = readFileSync(resolve(repoRoot, ".env"), "utf8");
const dbPassword = envText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))
  .map((l) => l.match(/^VITE_DB_PASSWORD\s*=\s*"?([^"\n]+)"?$/))
  .find(Boolean)?.[1];

if (!dbPassword) {
  console.error("VITE_DB_PASSWORD not found in .env");
  process.exit(1);
}

const migrationSql = readFileSync(
  resolve(repoRoot, "supabase/migrations/20260523120000_repair_localhost_storage_urls.sql"),
  "utf8",
);

const localhostRe = "^https?://(localhost|127\\.0\\.0\\.1|\\[?::1\\]?)(:\\d+)?/supabase/storage/v1/object/public/";

const targets = [
  { table: "magazines",            cols: ["cover_image_url", "pdf_url"] },
  { table: "articles",             cols: ["image_url"] },
  { table: "press_releases",       cols: ["image_url"] },
  { table: "leadership_profiles",  cols: ["image_url"] },
  { table: "case_studies",         cols: ["image_url"] },
  { table: "upcoming_editions",    cols: ["image_url"] },
  { table: "home_section_items",   cols: ["image_url"] },
  { table: "home_sections",        cols: ["background_image_url"] },
  { table: "client_logos",         cols: ["logo_url"] },
  { table: "testimonials",         cols: ["avatar_url"] },
];

const client = new pg.Client({
  host: "db.elrnafeyidalkswgdqvx.supabase.co",
  port: 5432,
  user: "postgres",
  database: "postgres",
  password: dbPassword,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  const { rows: existing } = await client.query(
    `select table_name, column_name
       from information_schema.columns
      where table_schema = 'public'`,
  );
  const has = new Set(existing.map((r) => `${r.table_name}.${r.column_name}`));
  const liveTargets = targets
    .map(({ table, cols }) => ({ table, cols: cols.filter((c) => has.has(`${table}.${c}`)) }))
    .filter((t) => t.cols.length > 0);
  const skipped = targets
    .flatMap(({ table, cols }) => cols.map((c) => `${table}.${c}`))
    .filter((tc) => !has.has(tc));
  if (skipped.length) console.log(`Skipping missing columns: ${skipped.join(", ")}`);

  console.log("\n=== Pre-check: rows with localhost URLs ===");
  let totalBefore = 0;
  for (const { table, cols } of liveTargets) {
    for (const col of cols) {
      const { rows } = await client.query(
        `select count(*)::int as n from public.${table} where ${col} ~ $1`,
        [localhostRe],
      );
      const n = rows[0].n;
      totalBefore += n;
      if (n > 0) console.log(`  ${table}.${col}: ${n}`);
    }
  }
  console.log(`  TOTAL: ${totalBefore}`);

  if (totalBefore === 0) {
    console.log("\nNothing to repair. Migration not applied.");
    process.exit(0);
  }

  console.log("\n=== Sample affected rows (first 5 per column) ===");
  for (const { table, cols } of liveTargets) {
    for (const col of cols) {
      const { rows } = await client.query(
        `select id, ${col} from public.${table} where ${col} ~ $1 limit 5`,
        [localhostRe],
      );
      if (rows.length) {
        console.log(`  ${table}.${col}:`);
        for (const r of rows) console.log(`    ${r.id}  ${r[col]}`);
      }
    }
  }

  console.log("\n=== Applying repair in a transaction ===");
  await client.query("BEGIN");
  for (const { table, cols } of liveTargets) {
    for (const col of cols) {
      await client.query(
        `update public.${table}
            set ${col} = regexp_replace(${col}, $1, 'https://elrnafeyidalkswgdqvx.supabase.co/storage/v1/object/public/')
          where ${col} ~ $1`,
        [localhostRe],
      );
    }
  }

  let totalAfter = 0;
  for (const { table, cols } of liveTargets) {
    for (const col of cols) {
      const { rows } = await client.query(
        `select count(*)::int as n from public.${table} where ${col} ~ $1`,
        [localhostRe],
      );
      totalAfter += rows[0].n;
    }
  }
  if (totalAfter !== 0) {
    console.error(`Post-check still found ${totalAfter} localhost URLs — rolling back.`);
    await client.query("ROLLBACK");
    process.exit(1);
  }
  await client.query("COMMIT");
  console.log(`Committed. Repaired ${totalBefore} URL(s).`);
} finally {
  await client.end();
}
