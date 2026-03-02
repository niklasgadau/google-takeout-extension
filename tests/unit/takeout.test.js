import { describe, expect, it } from "vitest";
import {
  extractFilename,
  isTakeoutDownloadUrl,
  dedupeByUrl,
  createCapturedEntry
} from "../../src/lib/takeout.js";

describe("takeout url helpers", () => {
  it("accepts valid takeout tgz url", () => {
    const url =
      "https://takeout-download.usercontent.google.com/download/takeout-20260301T214707Z-3-001.tgz?j=abc";
    expect(isTakeoutDownloadUrl(url)).toBe(true);
  });

  it("rejects non tgz downloads", () => {
    const url =
      "https://takeout-download.usercontent.google.com/download/takeout-20260301T214707Z-3-001.zip?j=abc";
    expect(isTakeoutDownloadUrl(url)).toBe(false);
  });

  it("rejects other hosts", () => {
    const url = "https://example.com/download/takeout-20260301T214707Z-3-001.tgz";
    expect(isTakeoutDownloadUrl(url)).toBe(false);
  });

  it("extracts filename from url", () => {
    const url =
      "https://takeout-download.usercontent.google.com/download/takeout-20260301T214707Z-3-001.tgz?j=abc";
    expect(extractFilename(url)).toBe("takeout-20260301T214707Z-3-001.tgz");
  });

  it("deduplicates by full url", () => {
    const one = { url: "https://host/file-1.tgz", filename: "file-1.tgz" };
    const two = { url: "https://host/file-2.tgz", filename: "file-2.tgz" };
    const result = dedupeByUrl([one, one, two]);
    expect(result).toEqual([one, two]);
  });

  it("creates captured entry with timestamp", () => {
    const now = new Date("2026-03-02T15:00:00.000Z");
    const entry = createCapturedEntry(
      "https://takeout-download.usercontent.google.com/download/a.tgz",
      now
    );

    expect(entry).toEqual({
      url: "https://takeout-download.usercontent.google.com/download/a.tgz",
      filename: "a.tgz",
      capturedAt: "2026-03-02T15:00:00.000Z"
    });
  });
});
