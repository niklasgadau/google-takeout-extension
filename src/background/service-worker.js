import {
  isTakeoutDownloadUrl,
  createCapturedEntryFromRequest
} from "../lib/takeout.js";
import { getCapturedLinks, setCapturedLinks } from "../lib/storage.js";

const URL_FILTERS = {
  urls: ["https://takeout-download.usercontent.google.com/download/*"]
};

export async function handleBeforeSendHeaders(
  details,
  storageArea = chrome.storage.local
) {
  if (!details || details.method !== "GET") return;
  if (!isTakeoutDownloadUrl(details.url)) return;

  const capturedLinks = await getCapturedLinks(storageArea);
  const nextEntry = createCapturedEntryFromRequest(details);
  const existingIndex = capturedLinks.findIndex((entry) => entry.url === details.url);

  if (existingIndex >= 0) {
    capturedLinks[existingIndex] = {
      ...capturedLinks[existingIndex],
      ...nextEntry
    };
    await setCapturedLinks(capturedLinks, storageArea);
    return;
  }

  const next = [...capturedLinks, nextEntry];
  await setCapturedLinks(next, storageArea);
}

export function registerRequestListener(chromeApi = chrome) {
  chromeApi.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      void handleBeforeSendHeaders(details, chromeApi.storage.local);
    },
    URL_FILTERS,
    ["requestHeaders", "extraHeaders"]
  );
}

if (typeof chrome !== "undefined" && chrome.webRequest?.onBeforeSendHeaders) {
  registerRequestListener(chrome);
}
