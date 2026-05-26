#!/usr/bin/env node
// One-time migration: move every object from the Supabase storage buckets
// (`website-images`, `magazine-pdfs`) to the Hostinger PHP endpoint, then
// rewrite every DB column that references the old Supabase URLs.
//
// This script is intentionally CAUTIOUS:
//   • Default mode is dry-run (no uploads, no DB writes).
//   • `--upload-only` uploads files but never touches the DB.
//   • `--apply` does both, but ONLY after every uploaded URL passes a HEAD
//     verification pre-flight check. If any URL fails, no DB writes happen.
//   • `--rollback` re-PATCHes every changed row back to its original Supabase
//     URL using migration-report.json. Safe to run anytime after --apply.
//   • Every successful upload is persisted to migration-report.json immediately
//     so a crash leaves a resumable state — re-running picks up where it left off.
//   • The Supabase storage objects are NEVER deleted by this script.
//     After you have verified everything renders from Hostinger, you can empty
//     the buckets from the Supabase dashboard yourself.
//
// Required environment variables (loaded from .env at repo root):
//   VITE_SUPABASE_URL            e.g. https://elrnafeyidalkswgdqvx.supabase.co
//   VITE_SERVICE_ROLE_KEY        service role JWT (NOT the anon key)
//   HOSTINGER_UPLOAD_URL         e.g. https://theciovision.com/upload.php
//   HOSTINGER_MIGRATION_TOKEN    must match upload-config.php migration_token
//
// Usage:
//   node scripts/migrate-storage-to-hostinger.mjs              # dry-run
//   node scripts/migrate-storage-to-hostinger.mjs --upload-only
//   node scripts/migrate-storage-to-hostinger.mjs --apply
//   node scripts/migrate-storage-to-hostinger.mjs --rollback
//
// Output: writes ./migration-report.json with old→new URL mappings and any
// per-file or per-row failures.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { Blob } from "node:buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

// ---------- arg parsing ----------
const args = new Set(process.argv.slice(2));
const ROLLBACK = args.has("--rollback");
const APPLY = args.has("--apply") && !ROLLBACK;
const UPLOAD_ONLY = args.has("--upload-only") && !ROLLBACK && !APPLY;
const DRY_RUN = !APPLY && !UPLOAD_ONLY && !ROLLBACK;

// ---------- env loading ----------
const envPath = path.join(repoRoot, ".env");
if (existsSync(envPath)) {
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE_ROLE = process.env.VITE_SERVICE_ROLE_KEY || "";
const HOSTINGER_UPLOAD_URL = (process.env.HOSTINGER_UPLOAD_URL || "").trim();
const HOSTINGER_MIGRATION_TOKEN = (process.env.HOSTINGER_MIGRATION_TOKEN || "").trim();

function requireEnv() {
  const missing = [];
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SERVICE_ROLE) missing.push("VITE_SERVICE_ROLE_KEY");
  if (!DRY_RUN) {
    if (!HOSTINGER_UPLOAD_URL) missing.push("HOSTINGER_UPLOAD_URL");
    if (!HOSTINGER_MIGRATION_TOKEN) missing.push("HOSTINGER_MIGRATION_TOKEN");
  }
  if (missing.length) {
    console.error("Missing required env vars:", missing.join(", "));
    process.exit(1);
  }
}
requireEnv();

// ---------- config ----------
const BUCKETS = ["website-images", "magazine-pdfs"];

// Tables and columns that may contain storage URLs. Free-text/HTML columns
// (content, description) get scanned for embedded URLs too.
const TABLES_TO_REWRITE = [
  { table: "articles", urlColumns: ["image_url"], textColumns: ["content"] },
  { table: "case_studies", urlColumns: ["image_url"], textColumns: [] },
  { table: "client_logos", urlColumns: ["logo_url"], textColumns: [] },
  { table: "documentation", urlColumns: [], textColumns: ["content"] },
  { table: "home_section_items", urlColumns: ["image_url"], textColumns: [] },
  { table: "home_sections", urlColumns: ["background_image_url"], textColumns: [] },
  { table: "leadership_profiles", urlColumns: ["image_url"], textColumns: [] },
  { table: "linkedin_posts", urlColumns: ["image_url"], textColumns: [] },
  { table: "magazines", urlColumns: ["cover_image_url", "pdf_url"], textColumns: ["description"] },
  { table: "press_releases", urlColumns: ["image_url"], textColumns: ["content"] },
  { table: "testimonials", urlColumns: ["avatar_url"], textColumns: [] },
  { table: "upcoming_editions", urlColumns: ["image_url"], textColumns: [] },
];

const STORAGE_URL_PATTERN =
  /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/[A-Za-z0-9._\-\/%]+/gi;

// ---------- Supabase REST helpers ----------
const sbHeaders = {
  apikey: SERVICE_ROLE,
  Authorization: `Bearer ${SERVICE_ROLE}`,
};

async function listObjects(bucket) {
  // POST /storage/v1/object/list/<bucket> with paged search.
  const results = [];
  const seen = new Set();
  const queue = [""]; // start at bucket root
  while (queue.length) {
    const prefix = queue.shift();
    let offset = 0;
    const limit = 100;
    while (true) {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucket}`, {
        method: "POST",
        headers: { ...sbHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ prefix, limit, offset, sortBy: { column: "name", order: "asc" } }),
      });
      if (!res.ok) {
        throw new Error(`list ${bucket}/${prefix} failed: ${res.status} ${await res.text()}`);
      }
      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) break;
      for (const item of items) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        if (seen.has(fullPath)) continue;
        seen.add(fullPath);
        if (item.id === null && (!item.metadata || item.metadata.mimetype === undefined)) {
          // It's a folder — recurse.
          queue.push(fullPath);
        } else {
          results.push({ bucket, path: fullPath, item });
        }
      }
      if (items.length < limit) break;
      offset += limit;
    }
  }
  return results;
}

async function downloadObject(bucket, objectPath) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${objectPath
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    { headers: sbHeaders }
  );
  if (!res.ok) {
    throw new Error(`download ${bucket}/${objectPath} failed: ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, contentType };
}

function publicUrlFor(bucket, objectPath) {
  const encoded = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encoded}`;
}

// ---------- Hostinger upload ----------
async function uploadToHostinger(bucket, objectPath, buf, contentType) {
  // First segment of objectPath is the folder (matches PHP endpoint validation).
  const segments = objectPath.split("/");
  const folder = segments.length > 1 ? segments[0] : "general";
  const filenameHint = segments[segments.length - 1] || "file";

  if (!/^[A-Za-z0-9_-]{1,64}$/.test(folder)) {
    throw new Error(`Folder name "${folder}" rejected by upload.php validator`);
  }

  const form = new FormData();
  const blob = new Blob([buf], { type: contentType });
  form.append("file", blob, filenameHint);
  form.append("bucket", bucket);
  form.append("folder", folder);

  const res = await fetch(HOSTINGER_UPLOAD_URL, {
    method: "POST",
    headers: { "X-Migration-Token": HOSTINGER_MIGRATION_TOKEN },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`upload ${bucket}/${objectPath} failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  if (!data?.url) throw new Error("upload response missing url");
  return data.url;
}

async function verifyUrlReachable(url, expectedKind) {
  // HEAD the new public URL to confirm Hostinger is serving it before we
  // overwrite any DB row. Returns { ok, status, contentType, contentLength }.
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  const contentType = res.headers.get("content-type") || "";
  const contentLength = Number(res.headers.get("content-length") || "0");
  let kindOk = true;
  if (expectedKind === "image") kindOk = contentType.startsWith("image/");
  else if (expectedKind === "pdf") kindOk = contentType.includes("pdf");
  return { ok: res.ok && kindOk && contentLength > 0, status: res.status, contentType, contentLength };
}

// ---------- DB rewrite via Supabase REST (PostgREST) ----------
async function fetchRowsWithStorageUrls(table, columns) {
  // We pull all rows once and filter client-side. For modest tables this is
  // simpler than crafting per-column OR filters with PostgREST.
  const select = ["id", ...columns].join(",");
  const all = [];
  const pageSize = 500;
  let from = 0;
  while (true) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}`, {
      headers: {
        ...sbHeaders,
        Range: `${from}-${from + pageSize - 1}`,
        "Range-Unit": "items",
      },
    });
    if (!res.ok) {
      throw new Error(`fetch ${table} failed: ${res.status} ${await res.text()}`);
    }
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) break;
    all.push(...rows);
    if (rows.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

async function patchRow(table, id, patch) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { ...sbHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(patch),
    }
  );
  if (!res.ok) {
    throw new Error(`patch ${table}#${id} failed: ${res.status} ${await res.text()}`);
  }
}

function rewriteValue(value, urlMap) {
  if (typeof value !== "string" || value.length === 0) return { value, changed: false };
  let changed = false;
  const next = value.replace(STORAGE_URL_PATTERN, (match) => {
    const decoded = match; // map keys are the exact URLs we built from list output
    if (urlMap.has(decoded)) {
      changed = true;
      return urlMap.get(decoded);
    }
    return match;
  });
  return { value: next, changed };
}

// ---------- main ----------
const reportPath = path.join(repoRoot, "migration-report.json");

function loadReport() {
  if (!existsSync(reportPath)) return null;
  try {
    return JSON.parse(readFileSync(reportPath, "utf8"));
  } catch {
    return null;
  }
}

function saveReport(report) {
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
}

async function runRollback() {
  // Re-PATCH every row from migration-report.json's rowUpdates back to its
  // previous value. Requires the report to contain a `rowUpdatesBefore` field
  // captured during --apply (added by main() below).
  const report = loadReport();
  if (!report) {
    console.error("No migration-report.json found — nothing to rollback.");
    process.exit(1);
  }
  const before = report.rowUpdatesBefore || [];
  if (before.length === 0) {
    console.error("Report contains no rowUpdatesBefore entries. Rollback aborted.");
    process.exit(1);
  }
  console.log(`Rolling back ${before.length} rows…`);
  const failures = [];
  for (const entry of before) {
    try {
      await patchRow(entry.table, entry.id, entry.patch);
      console.log(`  restored ${entry.table}#${entry.id}`);
    } catch (err) {
      failures.push({ table: entry.table, id: entry.id, error: String(err?.message || err) });
      console.error(`  FAILED ${entry.table}#${entry.id}: ${err?.message || err}`);
    }
  }
  console.log(`\nRollback complete. ${before.length - failures.length} restored, ${failures.length} failed.`);
  if (failures.length) {
    report.rollbackFailures = failures;
    saveReport(report);
    process.exit(1);
  }
}

async function main() {
  if (ROLLBACK) {
    await runRollback();
    return;
  }

  console.log(`Mode: ${APPLY ? "APPLY (uploads + DB writes)" : UPLOAD_ONLY ? "UPLOAD-ONLY (no DB writes)" : "DRY-RUN (no side effects)"}`);
  console.log(`Supabase: ${SUPABASE_URL}`);
  if (!DRY_RUN) console.log(`Hostinger upload endpoint: ${HOSTINGER_UPLOAD_URL}`);
  console.log();

  // 1. List every object in every bucket.
  const allObjects = [];
  for (const bucket of BUCKETS) {
    console.log(`Listing bucket ${bucket}…`);
    const objects = await listObjects(bucket);
    console.log(`  → ${objects.length} files`);
    allObjects.push(...objects);
  }

  // Resume support: pick up an existing report and skip already-uploaded files.
  const prior = loadReport();
  const urlMap = new Map(prior?.urlMap ? Object.entries(prior.urlMap) : []);
  const uploadFailures = prior?.uploadFailures?.slice() ?? [];
  const verifyFailures = [];

  // 2. Upload + immediately HEAD-verify each new URL.
  for (const { bucket, path: objectPath } of allObjects) {
    const oldUrl = publicUrlFor(bucket, objectPath);
    if (DRY_RUN) {
      console.log(`[dry] would upload ${bucket}/${objectPath}`);
      continue;
    }
    if (urlMap.has(oldUrl)) {
      console.log(`  skip (already uploaded) ${bucket}/${objectPath}`);
      continue;
    }
    try {
      const { buf, contentType } = await downloadObject(bucket, objectPath);
      const newUrl = await uploadToHostinger(bucket, objectPath, buf, contentType);

      const expectedKind = bucket === "magazine-pdfs" ? "pdf" : "image";
      const verify = await verifyUrlReachable(newUrl, expectedKind);
      if (!verify.ok) {
        throw new Error(
          `verify failed: status=${verify.status} type=${verify.contentType} len=${verify.contentLength}`
        );
      }

      urlMap.set(oldUrl, newUrl);
      // Persist after every successful upload so a crash leaves a resumable state.
      saveReport({
        mode: APPLY ? "apply-in-progress" : "upload-only",
        runAt: new Date().toISOString(),
        objectCount: allObjects.length,
        urlMap: Object.fromEntries(urlMap),
        uploadFailures,
        rowUpdates: prior?.rowUpdates ?? [],
        rowUpdatesBefore: prior?.rowUpdatesBefore ?? [],
        rowFailures: prior?.rowFailures ?? [],
      });
      console.log(`  uploaded ${bucket}/${objectPath} → ${newUrl}  [verified ${verify.contentType}, ${verify.contentLength}b]`);
    } catch (err) {
      uploadFailures.push({ bucket, path: objectPath, error: String(err?.message || err) });
      console.error(`  FAILED ${bucket}/${objectPath}: ${err?.message || err}`);
    }
  }

  // 3. Rewrite DB columns (only when --apply).
  const rowUpdates = [];
  const rowUpdatesBefore = [];
  const rowFailures = [];

  if (APPLY) {
    if (uploadFailures.length > 0) {
      console.error(`\nAbort: ${uploadFailures.length} upload(s) failed. Fix those before --apply.`);
      process.exit(1);
    }

    // 3a. Pre-flight: re-HEAD every URL in the map before any DB write.
    console.log(`\nPre-flight: HEAD-verifying ${urlMap.size} URLs before any DB write…`);
    for (const [oldUrl, newUrl] of urlMap) {
      const expectedKind = oldUrl.includes("/magazine-pdfs/") ? "pdf" : "image";
      const verify = await verifyUrlReachable(newUrl, expectedKind);
      if (!verify.ok) {
        verifyFailures.push({ oldUrl, newUrl, status: verify.status, contentType: verify.contentType });
      }
    }
    if (verifyFailures.length > 0) {
      console.error(`Abort: ${verifyFailures.length} URL(s) failed pre-flight verification. No DB writes performed.`);
      console.error(JSON.stringify(verifyFailures.slice(0, 5), null, 2));
      saveReport({
        mode: "apply-aborted-preflight",
        runAt: new Date().toISOString(),
        objectCount: allObjects.length,
        urlMap: Object.fromEntries(urlMap),
        uploadFailures,
        verifyFailures,
        rowUpdates: [],
        rowUpdatesBefore: [],
        rowFailures: [],
      });
      process.exit(1);
    }
    console.log("  → all URLs reachable.\n");

    // 3b. Apply DB writes, capturing the BEFORE patch for rollback.
    for (const def of TABLES_TO_REWRITE) {
      const columns = [...def.urlColumns, ...def.textColumns];
      if (columns.length === 0) continue;
      console.log(`Scanning ${def.table} (${columns.join(", ")})…`);
      const rows = await fetchRowsWithStorageUrls(def.table, columns);
      for (const row of rows) {
        const patch = {};
        const beforePatch = {};
        for (const col of columns) {
          const result = rewriteValue(row[col], urlMap);
          if (result.changed) {
            patch[col] = result.value;
            beforePatch[col] = row[col]; // capture the original Supabase URL
          }
        }
        if (Object.keys(patch).length === 0) continue;
        try {
          await patchRow(def.table, row.id, patch);
          rowUpdates.push({ table: def.table, id: row.id, patch });
          rowUpdatesBefore.push({ table: def.table, id: row.id, patch: beforePatch });
          console.log(`  updated ${def.table}#${row.id} (${Object.keys(patch).join(", ")})`);
        } catch (err) {
          rowFailures.push({ table: def.table, id: row.id, error: String(err?.message || err) });
          console.error(`  FAILED ${def.table}#${row.id}: ${err?.message || err}`);
        }
      }
    }
  } else if (UPLOAD_ONLY) {
    console.log("--upload-only: skipping DB rewrites.");
  } else {
    console.log("[dry] skipping DB scan.");
  }

  // 4. Write final report.
  const report = {
    mode: APPLY ? "apply" : UPLOAD_ONLY ? "upload-only" : "dry-run",
    runAt: new Date().toISOString(),
    objectCount: allObjects.length,
    urlMap: Object.fromEntries(urlMap),
    uploadFailures,
    verifyFailures,
    rowUpdates,
    rowUpdatesBefore, // used by --rollback
    rowFailures,
  };
  saveReport(report);
  console.log(`\nReport written to ${reportPath}`);
  console.log(`Summary: ${urlMap.size} uploads, ${uploadFailures.length} upload failures, ${verifyFailures.length} verify failures, ${rowUpdates.length} row updates, ${rowFailures.length} row failures.`);
  if (APPLY) {
    console.log(`To rollback: node scripts/migrate-storage-to-hostinger.mjs --rollback`);
  }

  if (uploadFailures.length || rowFailures.length || verifyFailures.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
