// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { initPopup } from "../../src/popup/popup.js";

function createStorageArea(initialLinks = []) {
  const state = { capturedLinks: [...initialLinks] };
  return {
    async get(key) {
      return { [key]: state[key] };
    },
    async set(values) {
      Object.assign(state, values);
    },
    state
  };
}

function buildDocument() {
  document.body.innerHTML = `
    <main>
      <p id="count"></p>
      <p id="status"></p>
      <button id="copy-wget" type="button"></button>
      <button id="copy-aria2" type="button"></button>
      <button id="flush" type="button"></button>
      <ul id="link-list"></ul>
    </main>
  `;
  return document;
}

async function waitForUi() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("popup", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state and disables export buttons", async () => {
    const storageArea = createStorageArea([]);
    const clipboard = { writeText: vi.fn() };
    const doc = buildDocument();

    await initPopup({ doc, storageArea, clipboard });

    expect(doc.getElementById("count").textContent).toBe("0 links captured");
    expect(doc.getElementById("copy-wget").disabled).toBe(true);
    expect(doc.getElementById("copy-aria2").disabled).toBe(true);
  });

  it("copies wget snippet and flushes links", async () => {
    const storageArea = createStorageArea([
      {
        url: "https://takeout-download.usercontent.google.com/download/one.tgz?j=1",
        filename: "one.tgz",
        capturedAt: "2026-03-02T12:00:00.000Z",
        headers: { cookie: "SID=abc" }
      }
    ]);
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    const doc = buildDocument();

    await initPopup({ doc, storageArea, clipboard });

    doc.getElementById("copy-wget").click();
    await waitForUi();

    expect(clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(clipboard.writeText.mock.calls[0][0]).toContain(
      "wget -c -t 0 --retry-connrefused"
    );

    doc.getElementById("flush").click();
    await waitForUi();

    expect(storageArea.state.capturedLinks).toEqual([]);
    expect(doc.getElementById("count").textContent).toBe("0 links captured");
  });
});
