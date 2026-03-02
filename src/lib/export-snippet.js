function buildUrlFileBlock(urls) {
  return `cat > takeout_urls.txt <<'EOF'\n${urls.join("\n")}\nEOF`;
}

export function buildWgetSnippet(urls) {
  return `${buildUrlFileBlock(urls)}\n\nwget --continue --content-disposition -i takeout_urls.txt`;
}

export function buildAria2Snippet(urls) {
  return `${buildUrlFileBlock(urls)}\n\naria2c --continue=true --max-concurrent-downloads=1 --input-file=takeout_urls.txt`;
}
