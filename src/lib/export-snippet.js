const WGET_FLAG_PREFIX = "wget -c -t 0 --retry-connrefused";
const ARIA2_FLAG_PREFIX =
  "aria2c -c -x 5 -s 5 --retry-wait=5 --max-concurrent-downloads=1";

function shellSingleQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function toHeaderLines(headers = {}, mode = "wget") {
  const headerPairs = [];
  const orderedKeys = ["accept", "accept-language", "cookie", "referer", "user-agent"];

  for (const key of orderedKeys) {
    const value = headers[key];
    if (typeof value !== "string" || !value.length) continue;

    const headerName =
      mode === "aria2" && key === "user-agent"
        ? "User-Agent"
        : mode === "aria2" && key === "cookie"
          ? "Cookie"
          : key;

    headerPairs.push(`${headerName}: ${value}`);
  }

  return headerPairs;
}

function normalizeEntries(entries = []) {
  return entries
    .map((entry) => {
      if (typeof entry === "string") {
        return { url: entry, headers: {} };
      }
      return entry;
    })
    .filter((entry) => entry && typeof entry.url === "string" && entry.url.length);
}

function buildWgetCommand(entry) {
  const headers = toHeaderLines(entry.headers, "wget");
  const headerFlags = headers
    .map((header) => `  --header=${shellSingleQuote(header)} \\\n+`)
    .join("");

  return `${WGET_FLAG_PREFIX} \\
${headerFlags}  ${shellSingleQuote(entry.url)}`;
}

function buildAria2Command(entry) {
  const headers = toHeaderLines(entry.headers, "aria2");
  const headerFlags = headers
    .map((header) => `  --header=${shellSingleQuote(header)} \\\n+`)
    .join("");

  return `${ARIA2_FLAG_PREFIX} \\
${headerFlags}  ${shellSingleQuote(entry.url)}`;
}

export function buildWgetSnippet(entries) {
  return normalizeEntries(entries)
    .map((entry) => buildWgetCommand(entry))
    .join("\n\n");
}

export function buildAria2Snippet(entries) {
  return normalizeEntries(entries)
    .map((entry) => buildAria2Command(entry))
    .join("\n\n");
}
