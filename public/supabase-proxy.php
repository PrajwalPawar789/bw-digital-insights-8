<?php

declare(strict_types=1);

// Fixed upstream target; avoids open-proxy behavior.
$upstreamBase = 'https://elrnafeyidalkswgdqvx.supabase.co';

if (!function_exists('curl_init')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'cURL extension is required']);
    exit;
}

$rawPath = isset($_GET['path']) ? (string) $_GET['path'] : '';

// Support both query style (`?path=rest/v1/...`) and path-info style
// (`/supabase-proxy.php/rest/v1/...`) so hosting rewrites are optional.
if ($rawPath === '') {
    $pathInfo = isset($_SERVER['PATH_INFO']) ? (string) $_SERVER['PATH_INFO'] : '';
    if ($pathInfo !== '') {
        $rawPath = $pathInfo;
    } else {
        $requestUri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
        $scriptName = isset($_SERVER['SCRIPT_NAME']) ? (string) $_SERVER['SCRIPT_NAME'] : '';
        $requestPath = (string) (parse_url($requestUri, PHP_URL_PATH) ?? '');

        if ($requestPath !== '' && $scriptName !== '' && str_starts_with($requestPath, $scriptName)) {
            $rawPath = substr($requestPath, strlen($scriptName));
        }
    }
}

$path = ltrim($rawPath, '/');

if ($path === '' || strpos($path, '..') !== false) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid proxy path']);
    exit;
}

$queryParams = $_GET;
unset($queryParams['path']);
$queryString = http_build_query($queryParams);
$targetUrl = $upstreamBase . '/' . $path . ($queryString !== '' ? '?' . $queryString : '');

$method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS');
    header('Access-Control-Allow-Headers: apikey,authorization,content-type,prefer,range,accept-profile,content-profile,x-client-info,x-supabase-api-version,if-none-match');
    exit;
}

$incomingHeaders = function_exists('getallheaders') ? getallheaders() : [];
$allowedHeaders = [
    'apikey',
    'authorization',
    'content-type',
    'prefer',
    'range',
    'accept-profile',
    'content-profile',
    'x-client-info',
    'x-supabase-api-version',
    'accept',
    'if-none-match',
];

$forwardHeaders = [];
foreach ($incomingHeaders as $name => $value) {
    $lower = strtolower((string) $name);
    if (in_array($lower, $allowedHeaders, true)) {
        $forwardHeaders[] = $name . ': ' . $value;
    }
}

$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_ENCODING, '');

if (!empty($forwardHeaders)) {
    curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
}

$requestBody = file_get_contents('php://input');
if ($requestBody !== false && $requestBody !== '' && !in_array($method, ['GET', 'HEAD'], true)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
}

$rawResponse = curl_exec($ch);

if ($rawResponse === false) {
    $errorMessage = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Proxy upstream request failed', 'details' => $errorMessage]);
    exit;
}

$statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$rawHeaders = substr($rawResponse, 0, $headerSize);
$responseBody = substr($rawResponse, $headerSize);

http_response_code($statusCode > 0 ? $statusCode : 502);

$hopByHopHeaders = [
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    'content-length',
];

$headerLines = preg_split('/\r\n|\r|\n/', (string) $rawHeaders);
if (is_array($headerLines)) {
    foreach ($headerLines as $line) {
        if (strpos($line, ':') === false) {
            continue;
        }
        [$name, $value] = explode(':', $line, 2);
        $name = trim($name);
        $value = trim($value);
        $lower = strtolower($name);

        if ($name === '' || $value === '' || in_array($lower, $hopByHopHeaders, true) || $lower === 'set-cookie') {
            continue;
        }

        header($name . ': ' . $value, false);
    }
}

echo $responseBody;
