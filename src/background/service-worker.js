import { isTakeoutDownloadUrl, createCapturedEntry } from "../lib/takeout.js";
import { getCapturedLinks, setCapturedLinks } from "../lib/storage.js";

const URL_FILTERS = {
  urls: ["https://takeout-download.usercontent.google.com/download/*"]
};

export async function handleBeforeRequest(
  details,
  storageArea = chrome.storage.local
) {
  if (!details || details.method !== "GET") return;
  if (!isTakeoutDownloadUrl(details.url)) return;

  const capturedLinks = await getCapturedLinks(storageArea);
  if (capturedLinks.some((entry) => entry.url === details.url)) return;

  const next = [...capturedLinks, createCapturedEntry(details.url)];
  await setCapturedLinks(next, storageArea);
}

export function registerRequestListener(chromeApi = chrome) {
  chromeApi.webRequest.onBeforeRequest.addListener(
    (details) => {
      void handleBeforeRequest(details, chromeApi.storage.local);
    },
    URL_FILTERS
  );
}

if (typeof chrome !== "undefined" && chrome.webRequest?.onBeforeRequest) {
  registerRequestListener(chrome);
}
