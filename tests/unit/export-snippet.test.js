import { describe, expect, it } from "vitest";
import {
  buildAria2Snippet,
  buildWgetSnippet
} from "../../src/lib/export-snippet.js";

describe("export snippet helpers", () => {
  const entries = [
    {
      url: "https://takeout-download.usercontent.google.com/download/one.tgz?j=1",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        cookie: "SID=abc",
        referer: "https://takeout.google.com/",
        "user-agent": "Mozilla/5.0"
      }
    },
    {
      url: "https://takeout-download.usercontent.google.com/download/two.tgz?j=2",
      headers: {
        cookie: "SID=def"
      }
    }
  ];

  it("builds wget commands with headers", () => {
    const snippet = buildWgetSnippet(entries);
    expect(snippet).toContain("wget -c -t 0 --retry-connrefused");
    expect(snippet).toContain("--header='accept: */*'");
    expect(snippet).toContain("--header='cookie: SID=abc'");
    expect(snippet).toContain(entries[0].url);
    expect(snippet).toContain(entries[1].url);
  });

  it("builds aria2 snippet with sequential flag and cookie header", () => {
    const snippet = buildAria2Snippet(entries);
    expect(snippet).toContain("aria2c");
    expect(snippet).toContain("--max-concurrent-downloads=1");
    expect(snippet).toContain("--header='Cookie: SID=abc'");
  });
});
