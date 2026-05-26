# Rollback Playbook

If anything goes wrong after the migration is integrated, this is how you go
back. Read top to bottom — pick the section that matches what's broken.

## Why a fast rollback is possible

Two design choices make this safe:

1. **Supabase storage objects are never deleted.** The migration only copies
   files to Hostinger and rewrites DB rows. The originals stay in the Supabase
   buckets. So flipping DB URLs back to Supabase always works.
2. **Every DB rewrite is recorded with its previous value.** `migration-report.json`
   captures `rowUpdatesBefore[]` — the exact old URL for every row. The
   `--rollback` flag re-PATCHes them.

There is no destructive step in this entire migration until you choose to empty
the Supabase buckets in the final cleanup. Until then, every change is reversible.

## Pre-rollback: how to tell what's broken

| Symptom | Likely culprit | Section |
|---|---|---|
| Existing images/PDFs on public pages return 404 | DB rewrite happened but Hostinger files missing/broken | §1 |
| Admin upload fails with 401/403 | `upload-config.php` has wrong JWT secret or admin email | §2 |
| Admin upload fails with 500 "not configured" | `upload-config.php` didn't deploy | §3 |
| All pages broken (white screen, 500s) | `.htaccess` deploy broke routing | §4 |
| Site builds but `upload.php` returns HTML | Apache routing the request to React SPA | §5 |
| Lost confidence in migration as a whole — just want it gone | Full revert | §6 |

## §1 — Existing images broken (DB rewrites need to be undone)

**Effect:** Public site shows broken images/PDFs because DB rows point to
Hostinger URLs that aren't serving the files.

**Recovery (≈30 seconds):**

```bash
node scripts/migrate-storage-to-hostinger.mjs --rollback
```

What it does: reads `migration-report.json`, re-PATCHes every row's URL columns
back to the original `https://[project].supabase.co/storage/v1/object/public/...`
value. Since Supabase storage was never deleted, the URLs immediately serve again.

**Then investigate without time pressure** — uploads on Hostinger are still
there, you can fix the URL path / permissions issue and re-run `--apply` later.

## §2 — Admin uploads return 401/403

**Effect:** Public site is fine, but admins can't upload new images/PDFs. New
uploads fail with "Account is not an admin" or "Invalid token signature".

**Likely causes:**
- `SUPABASE_JWT_SECRET` in GitHub Secrets is wrong (must be the JWT Secret from Supabase Dashboard → Project Settings → API, NOT the anon key)
- `ADMIN_EMAILS` doesn't include the email the admin actually logs in with

**Recovery (≈3 min, one redeploy):**

1. GitHub repo → Settings → Secrets and variables → Actions → fix the wrong secret
2. Push an empty commit to trigger a redeploy:
   ```bash
   git commit --allow-empty -m "Fix upload-config secrets"
   git push origin main
   ```
3. After the workflow finishes, ask an admin to try uploading again

No DB rollback needed — existing image URLs are unaffected.

## §3 — `upload-config.php` didn't deploy at all (500 "not configured")

**Effect:** `upload.php` returns `{"error":"Upload endpoint is not configured on this host"}`.

**Diagnosis:** the "Generate upload-config.php from secrets" workflow step
failed, or the FTP step skipped the file.

**Recovery:**

1. Open the failed workflow run on GitHub → check the "Generate upload-config.php" step log
2. Most likely cause: a required secret is missing. The generator throws
   `SUPABASE_JWT_SECRET is required` / `ADMIN_EMAILS is required` / `UPLOADS_URL is required`
3. Add the missing secret, then re-run the workflow (Actions → failed run → "Re-run all jobs")

No DB rollback needed.

## §4 — `.htaccess` broke the whole site

**Effect:** Every URL returns 500 or wrong content. Routing is broken.

**Recovery (≈3 min, one revert):**

```bash
git log --oneline    # find the integration commit hash
git revert <hash>    # creates a new commit reverting the integration
git push origin main
```

The FTP-Deploy-Action will redeploy the previous (working) `.htaccess` and the
site comes back. The revert also reverts `useImageUpload.ts` so the admin panel
goes back to direct Supabase uploads.

**If DB rewrites were already applied** (you ran `--apply`), also run:

```bash
node scripts/migrate-storage-to-hostinger.mjs --rollback
```

to restore DB URLs to Supabase. Order doesn't matter — `--rollback` only touches
DB rows, the git revert only touches deployed files.

## §5 — `upload.php` returns HTML instead of JSON

**Effect:** Upload endpoint responds with the React SPA's index.html.

**Diagnosis:** Apache is routing `/upload.php` through the SPA fallback rule
instead of serving the PHP file. This means either:
- `upload.php` didn't deploy (check Hostinger File Manager — but you said no
  login, so check the FTP-Deploy step log on GitHub Actions for "upload.php" in
  the file list), OR
- the `.htaccess` rewrite-rule patch didn't apply

**Recovery:**

1. Confirm `public/.htaccess` in the repo contains the `RewriteRule ^upload\.php(/.*)?$ - [L,NC]` line (`git grep "upload.php" public/.htaccess`)
2. If missing, the patch didn't apply cleanly — re-run `git apply hostinger-migration/integration-diffs/existing-files.patch`
3. If present, push an empty commit to force a redeploy
4. If still broken after deploy, this is one scenario where you would need to log into Hostinger and verify `public_html/upload.php` exists and is readable

## §6 — Nuclear option: full revert

**Effect:** You want to abandon the migration entirely.

```bash
# 1. Roll back DB URLs (if --apply was run)
node scripts/migrate-storage-to-hostinger.mjs --rollback

# 2. Revert the integration commit(s)
git log --oneline           # find the commit(s) to revert
git revert <hash>
git push origin main
```

After the redeploy:
- `useImageUpload.ts` reverts to direct Supabase uploads
- `.htaccess` reverts to pre-migration rules
- `upload.php` is still on the Hostinger server but unused (orphaned, harmless)
- `upload-config.php` is still on the Hostinger server but unused (orphaned, harmless — and the FTP exclude is back to `**/.htaccess` so future deploys won't touch it)

**Optional housekeeping:** if you want to delete the orphaned files from
Hostinger, that is the only step that genuinely requires Hostinger login. Or
just leave them — they're inert without the frontend hitting them.

## Pre-migration snapshot (recommended)

Before running `--apply`, take a snapshot of the affected DB columns so you have
a second backup beyond `migration-report.json`. From `psql` or any Supabase SQL
editor:

```sql
-- Run this BEFORE node scripts/migrate-storage-to-hostinger.mjs --apply
CREATE TABLE _backup_storage_urls_20260525 AS
SELECT 'articles' AS tbl, id::text, image_url AS url FROM articles WHERE image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'case_studies', id::text, image_url FROM case_studies WHERE image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'client_logos', id::text, logo_url FROM client_logos WHERE logo_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'home_section_items', id::text, image_url FROM home_section_items WHERE image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'home_sections', id::text, background_image_url FROM home_sections WHERE background_image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'leadership_profiles', id::text, image_url FROM leadership_profiles WHERE image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'linkedin_posts', id::text, image_url FROM linkedin_posts WHERE image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'magazines', id::text, cover_image_url FROM magazines WHERE cover_image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'magazines (pdf)', id::text, pdf_url FROM magazines WHERE pdf_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'press_releases', id::text, image_url FROM press_releases WHERE image_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'testimonials', id::text, avatar_url FROM testimonials WHERE avatar_url ~ 'supabase\.co/storage'
UNION ALL SELECT 'upcoming_editions', id::text, image_url FROM upcoming_editions WHERE image_url ~ 'supabase\.co/storage';
```

Keep `migration-report.json` checked into a private location too (do not commit
to git — it's listed in `.gitignore` already if you follow the patch). If both
the report file and the backup table exist, the migration is fully reversible
even after a laptop wipe.
