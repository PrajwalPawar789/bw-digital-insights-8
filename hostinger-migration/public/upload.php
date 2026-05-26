<?php

declare(strict_types=1);

// Hostinger-hosted upload endpoint. Replaces Supabase storage for images and PDFs.
//
// Endpoints:
//   POST /upload.php               multipart: file, bucket, folder         -> { url }
//   POST /upload.php?action=delete JSON:     { url }                       -> { ok: true }
//
// Auth:
//   Authorization: Bearer <supabase-jwt>   verified locally (HS256) against
//   the project's JWT secret; email claim must be in the admin allowlist.
//
//   Alternatively, X-Migration-Token: <token> matches config['migration_token']
//   for the one-time bulk migration script. Leave migration_token empty in
//   normal operation.

$configPath = __DIR__ . '/upload-config.php';
if (!file_exists($configPath)) {
    jsonError(500, 'Upload endpoint is not configured on this host');
}

/** @var array{
 *   jwt_secret: string,
 *   admin_emails: array<int, string>,
 *   uploads_path: string,
 *   uploads_url: string,
 *   migration_token?: string,
 * } $config */
$config = require $configPath;

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($method === 'OPTIONS') {
    http_response_code(204);
    header('Access-Control-Allow-Methods: POST,OPTIONS');
    header('Access-Control-Allow-Headers: authorization,content-type,x-migration-token');
    exit;
}

$headers = collectHeaders();
authenticate($headers, $config);

$action = isset($_GET['action']) ? (string) $_GET['action'] : 'upload';

if ($action === 'delete') {
    handleDelete($config);
    exit;
}

if ($method !== 'POST') {
    jsonError(405, 'Method not allowed');
}

handleUpload($config);

// ---------- helpers ----------

function jsonError(int $status, string $message): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

function jsonOk(array $payload): void
{
    header('Content-Type: application/json');
    echo json_encode($payload);
}

function collectHeaders(): array
{
    $out = [];
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            $out[strtolower((string) $name)] = (string) $value;
        }
    } else {
        foreach ($_SERVER as $key => $value) {
            if (strncmp($key, 'HTTP_', 5) === 0) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $out[$name] = (string) $value;
            }
        }
    }
    return $out;
}

function base64UrlDecode(string $data): string
{
    $remainder = strlen($data) % 4;
    if ($remainder !== 0) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    $decoded = base64_decode(strtr($data, '-_', '+/'), true);
    return $decoded === false ? '' : $decoded;
}

function verifySupabaseJwt(string $token, string $secret): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        jsonError(401, 'Malformed token');
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

    $signature = base64UrlDecode($encodedSignature);
    if ($signature === '') {
        jsonError(401, 'Invalid signature encoding');
    }

    $expected = hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $secret, true);
    if (!hash_equals($expected, $signature)) {
        jsonError(401, 'Invalid token signature');
    }

    $payloadJson = base64UrlDecode($encodedPayload);
    $payload = json_decode($payloadJson, true);
    if (!is_array($payload)) {
        jsonError(401, 'Invalid token payload');
    }

    $exp = $payload['exp'] ?? 0;
    if (!is_int($exp) || $exp < time()) {
        jsonError(401, 'Token expired');
    }

    return $payload;
}

function authenticate(array $headers, array $config): void
{
    // Allow one-time bulk migration via a shared header token.
    if (!empty($config['migration_token'] ?? '') && isset($headers['x-migration-token'])) {
        if (hash_equals((string) $config['migration_token'], $headers['x-migration-token'])) {
            return;
        }
        jsonError(401, 'Invalid migration token');
    }

    $authHeader = $headers['authorization'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        jsonError(401, 'Missing bearer token');
    }

    $payload = verifySupabaseJwt(trim($matches[1]), (string) $config['jwt_secret']);

    $email = strtolower((string) ($payload['email'] ?? ''));
    $allowed = array_map('strtolower', (array) ($config['admin_emails'] ?? []));
    if ($email === '' || !in_array($email, $allowed, true)) {
        jsonError(403, 'Account is not an admin');
    }
}

function handleUpload(array $config): void
{
    $bucket = isset($_POST['bucket']) ? (string) $_POST['bucket'] : '';
    $folder = isset($_POST['folder']) ? (string) $_POST['folder'] : '';

    if (!in_array($bucket, ['website-images', 'magazine-pdfs'], true)) {
        jsonError(400, 'Invalid bucket');
    }
    if (!preg_match('/^[A-Za-z0-9_-]{1,64}$/', $folder)) {
        jsonError(400, 'Invalid folder name');
    }

    if (!isset($_FILES['file']) || !is_array($_FILES['file']) || ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        jsonError(400, 'No file uploaded');
    }

    $file = $_FILES['file'];
    $tmpPath = (string) $file['tmp_name'];
    $size = (int) $file['size'];

    if (!is_uploaded_file($tmpPath)) {
        jsonError(400, 'Invalid upload');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string) $finfo->file($tmpPath);

    if ($bucket === 'website-images') {
        if (strncmp($mime, 'image/', 6) !== 0) {
            jsonError(400, 'Only image files are allowed');
        }
        if ($size > 10 * 1024 * 1024) {
            jsonError(400, 'Image size must be less than 10MB');
        }
    } else { // magazine-pdfs
        if ($mime !== 'application/pdf') {
            jsonError(400, 'Only PDF files are allowed');
        }
        if ($size > 50 * 1024 * 1024) {
            jsonError(400, 'PDF size must be less than 50MB');
        }
    }

    $extByMime = [
        'image/jpeg'    => 'jpg',
        'image/pjpeg'   => 'jpg',
        'image/png'     => 'png',
        'image/webp'    => 'webp',
        'image/gif'     => 'gif',
        'image/svg+xml' => 'svg',
        'image/avif'    => 'avif',
        'application/pdf' => 'pdf',
    ];

    $ext = $extByMime[$mime] ?? '';
    if ($ext === '') {
        // Fall back to a sanitized client extension if mime is generic.
        $clientExt = strtolower((string) pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        if (preg_match('/^[a-z0-9]{1,5}$/', $clientExt)) {
            $ext = $clientExt;
        } else {
            jsonError(400, 'Unsupported file type');
        }
    }

    $uploadsRoot = rtrim((string) $config['uploads_path'], '/\\');
    $targetDir = $uploadsRoot . DIRECTORY_SEPARATOR . $bucket . DIRECTORY_SEPARATOR . $folder;

    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        jsonError(500, 'Failed to create target directory');
    }

    $timestamp = (int) (microtime(true) * 1000);
    $random = bin2hex(random_bytes(6));
    $filename = $timestamp . '-' . $random . '.' . $ext;
    $targetPath = $targetDir . DIRECTORY_SEPARATOR . $filename;

    if (!move_uploaded_file($tmpPath, $targetPath)) {
        jsonError(500, 'Failed to save uploaded file');
    }
    @chmod($targetPath, 0644);

    $publicUrl = rtrim((string) $config['uploads_url'], '/')
        . '/' . $bucket
        . '/' . $folder
        . '/' . $filename;

    jsonOk(['url' => $publicUrl]);
}

function handleDelete(array $config): void
{
    $rawBody = (string) file_get_contents('php://input');
    $body = json_decode($rawBody, true);
    $url = is_array($body) && isset($body['url']) ? (string) $body['url'] : '';
    if ($url === '') {
        jsonError(400, 'Missing url');
    }

    $base = rtrim((string) $config['uploads_url'], '/') . '/';
    if (strncmp($url, $base, strlen($base)) !== 0) {
        jsonError(400, 'URL is outside the uploads scope');
    }

    $relative = substr($url, strlen($base));
    // Normalise separators and forbid traversal.
    $relative = str_replace('\\', '/', $relative);
    if ($relative === '' || strpos($relative, '..') !== false) {
        jsonError(400, 'Invalid path');
    }

    $uploadsRoot = rtrim((string) $config['uploads_path'], '/\\');
    $absolute = $uploadsRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);

    $rootReal = realpath($uploadsRoot);
    $absoluteReal = realpath($absolute);

    if ($rootReal === false) {
        jsonError(500, 'Uploads root not found');
    }
    if ($absoluteReal === false) {
        // File already missing — treat as success so callers can be idempotent.
        jsonOk(['ok' => true, 'missing' => true]);
        return;
    }
    if (strncmp($absoluteReal, $rootReal . DIRECTORY_SEPARATOR, strlen($rootReal) + 1) !== 0) {
        jsonError(400, 'Path escapes uploads root');
    }

    if (!unlink($absoluteReal)) {
        jsonError(500, 'Failed to delete file');
    }

    jsonOk(['ok' => true]);
}
