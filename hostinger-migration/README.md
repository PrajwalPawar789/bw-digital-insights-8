# Hostinger Storage Migration — Staging

This folder contains the **complete, ready-to-deploy** code for moving image/PDF
storage from Supabase to Hostinger's filesystem. Nothing in here is wired into
the live website yet — all live files (`src/hooks/useImageUpload.ts`,
`public/.htaccess`, `.gitignore`, `.github/workflows/deploy.yml`) are untouched
and continue to work as they do today.

When you're ready to integrate, follow `INTEGRATION.md`.
If anything goes wrong after integration, follow `ROLLBACK.md`.

## Why migrate?

Supabase free plan caps storage egress at 5 GB/month. Every image and PDF view
counts. Hostinger shared hosting has effectively unmetered bandwidth and already
serves the rest of the site, so moving binaries there eliminates the cost.

## What stays on Supabase

- **Database** (all tables — articles, magazines, leadership, etc.)
- **Auth** (admin login + JWTs)

Only the binary storage layer moves.

## What's in this folder

```
hostinger-migration/
├── README.md                              ← you are here
├── INTEGRATION.md                         ← step-by-step "how to flip the switch"
├── public/
│   ├── upload.php                         ← PHP upload/delete endpoint
│   └── upload-config.example.php          ← reference shape (real file is CI-generated)
├── src/hooks/
│   └── useImageUpload.ts                  ← rewritten hook that POSTs to /upload.php
├── scripts/
│   ├── generate-upload-config.mjs         ← CI step that writes upload-config.php from GitHub Secrets
│   └── migrate-storage-to-hostinger.mjs   ← one-time bulk migration with rollback
└── integration-diffs/
    └── existing-files.patch               ← diffs for .htaccess, .gitignore, deploy.yml
```

## Zero Hostinger login

After integration, the only places you ever touch are this repo and GitHub
Secrets. `upload-config.php` is generated in CI from secrets and FTP-deployed.
`uploads/` auto-creates on the first upload (see the `mkdir` call in
`handleUpload()`). You never SSH/FTP/File-Manager into Hostinger.

## How the new flow works

```
Admin browser → POST /upload.php (multipart, Bearer <supabase-jwt>)
                      ↓ PHP verifies HS256 JWT signature + checks email allowlist
                public_html/uploads/<bucket>/<folder>/<filename>
                      ↓ returns { url }
              https://theciovision.com/uploads/website-images/case-studies/...
                      ↓ saved into the existing DB row (no schema change)
```

DB schema is unchanged. The URL column just holds a Hostinger URL instead of a
Supabase URL.

## Safety guarantees built in

- HEAD-verify after every upload — bad upload never enters URL map
- Pre-flight URL sweep before any DB write — one failure aborts `--apply` entirely
- Incremental report saving — crash-safe and resumable
- `--rollback` flag — restores every changed row to its original Supabase URL
- Supabase storage objects are NEVER deleted by the script — old URLs keep working as a permanent fallback
