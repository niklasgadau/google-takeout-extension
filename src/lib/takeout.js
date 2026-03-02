import { TAKEOUT_DOWNLOAD_HOST } from "./constants.js";

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
