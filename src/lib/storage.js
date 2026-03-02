import { STORAGE_KEY } from "./constants.js";
import { dedupeByUrl } from "./takeout.js";

export async function getCapturedLinks(storageArea = chrome.storage.local) {
  const result = await storageArea.get(STORAGE_KEY);
  const links = result[STORAGE_KEY];
  if (!Array.isArray(links)) return [];
  return dedupeByUrl(links);
}

export async function setCapturedLinks(
  links,
  storageArea = chrome.storage.local
) {
  await storageArea.set({ [STORAGE_KEY]: dedupeByUrl(links) });
}

export async function flushCapturedLinks(storageArea = chrome.storage.local) {
  await storageArea.set({ [STORAGE_KEY]: [] });
}
