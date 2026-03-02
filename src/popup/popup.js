import { buildWgetSnippet, buildAria2Snippet } from "../lib/export-snippet.js";
import { getCapturedLinks, flushCapturedLinks } from "../lib/storage.js";

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

function renderLinkList(doc, links) {
  const list = doc.getElementById("link-list");
  list.textContent = "";

  for (const link of links) {
    const item = doc.createElement("li");
    item.className = "link-item";

    const filename = doc.createElement("div");
    filename.className = "filename";
    filename.textContent = link.filename || link.url;

    const capturedAt = doc.createElement("div");
    capturedAt.className = "captured-at";
    capturedAt.textContent = formatTimestamp(link.capturedAt);

    item.append(filename, capturedAt);
    list.append(item);
  }
}

function setStatus(doc, message) {
  const status = doc.getElementById("status");
  status.textContent = message;
}

function setExportButtonsEnabled(doc, enabled) {
  doc.getElementById("copy-wget").disabled = !enabled;
  doc.getElementById("copy-aria2").disabled = !enabled;
}

export async function initPopup({
  doc = document,
  storageArea = chrome.storage.local,
  clipboard = navigator.clipboard
} = {}) {
  const count = doc.getElementById("count");
  const copyWgetButton = doc.getElementById("copy-wget");
  const copyAria2Button = doc.getElementById("copy-aria2");
  const flushButton = doc.getElementById("flush");

  async function refresh() {
    const links = await getCapturedLinks(storageArea);
    count.textContent = `${links.length} links captured`;
    renderLinkList(doc, links);
    setExportButtonsEnabled(doc, links.length > 0);
    return links;
  }

  async function copySnippet(builder) {
    const links = await getCapturedLinks(storageArea);
    if (!links.length) {
      setStatus(doc, "No links captured yet.");
      return;
    }

    const text = builder(links.map((entry) => entry.url));
    await clipboard.writeText(text);
    setStatus(doc, "Snippet copied.");
  }

  copyWgetButton.addEventListener("click", () => {
    void copySnippet(buildWgetSnippet);
  });

  copyAria2Button.addEventListener("click", () => {
    void copySnippet(buildAria2Snippet);
  });

  flushButton.addEventListener("click", async () => {
    await flushCapturedLinks(storageArea);
    await refresh();
    setStatus(doc, "Captured links cleared.");
  });

  await refresh();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    void initPopup();
  });
}
