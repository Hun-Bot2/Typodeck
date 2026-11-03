# TypoPPT demo video — integration guide

Takes the owner's recording from camera to README. Do not upload,
publish, or host anything without the owner's explicit approval.

## 1. Placement

- Master files (staying out of git unless small): keep the editing
  master (ProRes/MOV) outside the repo.
- In-repo files (only if the owner accepts the weight): everything
  video-related lives in `docs/media/`:
  `demo-1080p.mp4`, `demo-720p.mp4`, `demo.srt`,
  `thumbnail-demo.png` (1280×720, pulled from footage).
- README placement: the “Demo video” section, replacing the
  `TYPOPPT-VIDEO` marker block. The four-deck PNG proof table stays —
  video supplements it, never replaces it. GitHub READMEs do not
  autoplay; the pattern is a clickable thumbnail linked to the video.

## 2. Compression

```sh
# 1080p master for the web (target ≤25MB for in-repo or release asset)
ffmpeg -i master.mov -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 128k docs/media/demo-1080p.mp4
# 720p fallback
ffmpeg -i master.mov -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
  -vf scale=1280:720 -movflags +faststart -c:a aac -b:a 128k docs/media/demo-720p.mp4
```

Keep each MP4 ≤25MB and total `docs/media/` ≤60MB in-repo. If the
master cannot compress under budget, prefer the release-asset or
YouTube hosting option below over committing a heavy file.

## 3. Upload

Pick one (owner decision):

- **Option A — GitHub Release asset (recommended).** Versioned, no repo
  bloat, stable URL:
  ```sh
  gh release create v0.1.0-demo --title "Demo video" --notes "Owner-recorded walkthrough"
  gh release upload v0.1.0-demo docs/media/demo-1080p.mp4 docs/media/demo-720p.mp4
  ```
  Capture the asset URLs from the release page.
- **Option B — In-repo file.** Only if ≤25MB and the owner accepts the
  clone weight. Commit under `docs/media/`; link relatively.
- **Option C — YouTube (unlisted).** Best streaming + mobile playback.
  Upload unlisted, capture the watch URL, link the README thumbnail to it.

## 4. README swap

Replace the `TYPOPPT-VIDEO` marker block in the “Demo video” section
with (example for Option A/C):

```html
<a href="https://github.com/<owner>/<repo>/releases/download/v0.1.0-demo/demo-1080p.mp4">
  <img src="docs/media/thumbnail-demo.png" alt="TypoPPT demo: agent skill invocation, design selection, full deck, and live PowerPoint edit (1:22)" width="880" />
</a>
```

Alt text must describe what the video proves and its runtime. Keep
width ≤880 (GitHub content cap). For Option B, link to the relative
`docs/media/demo-1080p.mp4` path instead.

## 5. Link verification

```sh
curl -sI <video-url> | head -3        # expect 200 + video/mp4 (A/B) or 200 text/html (C)
curl -sI <thumbnail-url> | head -3    # expect 200 + image/png
```

Then fresh-clone render check: clone to a temp dir, open the README
(the file, and the GitHub page after push), confirm the thumbnail
renders and the link plays.

## 6. Thumbnail from footage

```sh
# Grab the frame (replace TIMESTAMP, e.g. 00:00:54 for the numbers slide)
ffmpeg -ss TIMESTAMP -i docs/media/demo-1080p.mp4 -frames:v 1 -vf scale=1280:720 docs/media/thumbnail-demo.png
```

Add the wordmark + “Real .pptx · 100% editable” strip in any editor,
re-export ≤500KB. Never use `brand/` hero art as the thumbnail.

## 7. Desktop + mobile playback check

| Surface | Check |
|---|---|
| Desktop Chrome / Safari / Firefox | Thumbnail renders, link opens, video plays with captions |
| iOS Safari (390px) | Thumbnail fits, tap-to-play works, captions legible |
| Android Chrome (360px) | Same as iOS |

Record PASS/FAIL per row in the release notes. Captions must be legible
muted at phone widths — re-export the thumbnail with larger type if not.
