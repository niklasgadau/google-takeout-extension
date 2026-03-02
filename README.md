# Google Takeout Extension

Chrome extension to capture Google Takeout download URLs and export sequential shell snippets for `wget` or `aria2c`.

## Features

- Captures Takeout download requests from `takeout-download.usercontent.google.com`
- Stores unique `.tgz` URLs in `chrome.storage.local`
- Exports copy-ready shell snippets for sequential download
- Flush button to clear previously captured links
- Automated tests for core logic, background capture, and popup behavior

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```

3. Load extension in Chrome:

- Open `chrome://extensions`
- Enable Developer mode
- Click "Load unpacked"
- Select this repository folder

## Usage

1. Open Google Takeout and trigger one or more archive downloads.
2. Open the extension popup to see captured links.
3. Click `Copy wget snippet` or `Copy aria2c snippet`.
4. Paste the snippet in a shell on your NAS or server.
5. Use `Flush` to clear old links.
