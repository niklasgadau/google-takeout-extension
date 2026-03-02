import { TAKEOUT_DOWNLOAD_HOST } from "./constants.js";

const HEADER_WHITELIST = new Set([
  "accept",
  "accept-language",
  "cookie",
  "referer",
  "user-agent"
]);

export function extractFilename(urlString) {
  try {
    const url = new URL(urlString);
    const parts = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts.at(-1) || "");
  } catch {
    return "";
  }
}

export function isTakeoutDownloadUrl(urlString) {
  try {
    const url = new URL(urlString);
    if (url.hostname !== TAKEOUT_DOWNLOAD_HOST) return false;
    if (!url.pathname.startsWith("/download/")) return false;
    const filename = extractFilename(urlString);
    return filename.endsWith(".tgz");
  } catch {
    return false;
  }
}

export function dedupeByUrl(entries) {
  const seen = new Set();
  const deduped = [];

  for (const entry of entries) {
    if (!entry || typeof entry.url !== "string") continue;
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    deduped.push(entry);
  }

  return deduped;
}

export function createCapturedEntry(urlString, now = new Date()) {
  return {
    url: urlString,
    filename: extractFilename(urlString),
    capturedAt: now.toISOString()
  };
}

export function pickRelevantHeaders(requestHeaders = []) {
  const captured = {};

  for (const header of requestHeaders) {
    if (!header || typeof header.name !== "string") continue;
    const name = header.name.toLowerCase();
    if (!HEADER_WHITELIST.has(name)) continue;
    if (typeof header.value !== "string" || !header.value.length) continue;
    captured[name] = header.value;
  }

  return captured;
}

export function createCapturedEntryFromRequest(details, now = new Date()) {
  return {
    ...createCapturedEntry(details.url, now),
    method: details.method || "GET",
    headers: pickRelevantHeaders(details.requestHeaders)
  };
}
