import { describe, expect, it } from "vitest";
import {
  buildAria2Snippet,
  buildWgetSnippet
} from "../../src/lib/export-snippet.js";

describe("export snippet helpers", () => {
  const urls = [
    "https://takeout-download.usercontent.google.com/download/one.tgz?j=1",
    "https://takeout-download.usercontent.google.com/download/two.tgz?j=2"
  ];

  it("builds wget snippet with heredoc", () => {
    const snippet = buildWgetSnippet(urls);
    expect(snippet).toContain("cat > takeout_urls.txt <<'EOF'");
    expect(snippet).toContain(urls[0]);
    expect(snippet).toContain(urls[1]);
    expect(snippet).toContain(
      "wget --continue --content-disposition -i takeout_urls.txt"
    );
  });

  it("builds aria2 snippet with sequential flag", () => {
    const snippet = buildAria2Snippet(urls);
    expect(snippet).toContain("aria2c");
    expect(snippet).toContain("--max-concurrent-downloads=1");
    expect(snippet).toContain("--input-file=takeout_urls.txt");
  });
});
