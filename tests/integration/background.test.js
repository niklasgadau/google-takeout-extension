import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "../../src/lib/constants.js";
import { createChromeMock } from "../mocks/chrome.js";

describe("service worker request capture", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("captures valid takeout tgz url once", async () => {
    const chromeMock = createChromeMock();
    globalThis.chrome = chromeMock;

    await import("../../src/background/service-worker.js");

    const url =
      "https://takeout-download.usercontent.google.com/download/takeout-20260301T214707Z-3-001.tgz?j=513";

    await chromeMock.__triggerBeforeRequest({ method: "GET", url });
    await chromeMock.__triggerBeforeRequest({ method: "GET", url });

    const stored = chromeMock.__getState()[STORAGE_KEY];
    expect(stored).toHaveLength(1);
    expect(stored[0].url).toBe(url);
  });

  it("ignores non matching requests", async () => {
    const chromeMock = createChromeMock();
    globalThis.chrome = chromeMock;

    await import("../../src/background/service-worker.js");

    await chromeMock.__triggerBeforeRequest({
      method: "GET",
      url: "https://example.com/download/file.tgz"
    });

    const stored = chromeMock.__getState()[STORAGE_KEY];
    expect(stored).toHaveLength(0);
  });
});
