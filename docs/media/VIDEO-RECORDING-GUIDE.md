# TypoPPT demo video — recording guide (owner)

You record the footage. Everything else — placement, compression, upload
steps, README swap, thumbnail, playback checks — is prepared in
[VIDEO-INTEGRATION.md](VIDEO-INTEGRATION.md). This guide covers only what
happens in front of the camera.

Target: one 60–90 second screen recording proving TypoPPT is a working
product: real input → agent skill → real generation → design selection →
full deck → editable PPTX → Web Studio. No marketing effects, no staged
terminal output, no fake receipts.

## Honesty rules

- Show only real engine output. Every `.pptx` on screen must come from a
  command you actually ran in the take (or a committed file from
  [docs/showcase/](../showcase/README.md) reproduced by its documented
  command).
- HTML previews are labeled as previews. Final proof is always the
  `.pptx` opened in PowerPoint/Keynote.
- Keep the provider receipt visible (`provider: fallback …`). Never
  present fallback output as model inference.
- If a take hits GitHub rate-limiting, keep the honest typed-error take
  or switch to idea mode — never paste fake output.

## Prerequisites

```sh
git clone https://github.com/Hun-Bot2/Typodeck.git
cd Typodeck
npm ci
npm run build -w @typodeck/core
```

Verified inputs (match the committed showcase PNGs):

| Scene use | Input file | System | Expected deck |
|---|---|---|---|
| Skill invocation | `docs/showcase/ideas/swiss.txt` | swiss | 8 slides, 31 boxes, `validation: OK` |
| Repo workflow | `sindresorhus/is` (public repo) | swiss | ~10 slides, `validation: OK` |
| Design selection | `previews/html/{editorial,swiss,expressive}.html` | all three | same narrative, 6 slides each |
| Full deck | `docs/showcase/ideas/dense-technical.txt` | swiss | 10 slides, 39 boxes |

## Scene shot list

Total ≈ 82 seconds. Record in this order (dependencies first).

**Scene 1 — Problem + result (0:00–0:12).** Cold open on finished
decks, not setup. Full-screen each committed render for ~3s:
`docs/showcase/readme-editorial.slide1.png`,
`readme-swiss.slide1.png`, `readme-expressive.slide1.png`. Lower-third:
“You bring the content. TypoPPT handles the design. Real .pptx — every
character editable.” Then a 2s plain-type card: “AI decks fake charts,
ship uneditable pixels, invent numbers.”

**Scene 2 — Skill invocation (0:12–0:24).** Terminal + agent. You ask:
“Build a pitch deck from docs/showcase/ideas/swiss.txt”. The agent
announces the Skill pattern (“Following the TypoPPT Skill: idea mode,
editorial|swiss|expressive, provider fallback …”), then runs:

```sh
npm run --silent deck -- --idea-file docs/showcase/ideas/swiss.txt \
  --system swiss --purpose "Tool showcase: Ledgerline" --out /tmp/demo-swiss.pptx
```

Keep the real receipt lines on screen (provider/claims/deck/
validation: OK). Lower-third: “The Skill orchestrates the engine — it
never lays out slides itself.”

**Scene 3 — Repo-aware workflow (0:24–0:36).** Same terminal, repo mode:

```sh
npm run --silent deck -- --repo sindresorhus/is --system swiss --out /tmp/is.pptx
```

Show one claim line with file path + line ref. Overlay the bounded
contract: “public repos only · ≤20 files · ≤200 KB · 30s timeout”.
Lower-third: “Grounded, or labeled — verified / suggestion /
ungrounded.”

**Scene 4 — Design selection (0:36–0:48).** 3-up grid of the three
production systems from the SAME narrative
(`previews/html/editorial.html`, `swiss.html`, `expressive.html`).
Labels: “Editorial — asymmetric serif” / “Swiss — 4-column grid” /
“Expressive — centered hero”. Footer, small: “Previews are HTML; final
proof is the .pptx”. Lower-third: “Same facts, materially different
composition.” (The `document` system is experimental — exclude it.)

**Scene 5 — Full deck (0:48–1:00).** Slideshow through one full deck:
the Ledgerline swiss deck (8 slides) or the dense-technical deck (10
slides). Cover 3s, three interiors ~2.5s each, hold the numbers slide
longest (verbatim numbers + source refs visible). Lower-third: “5–12
slides · one thesis each · numbers copied verbatim, never computed.”

**Scene 6 — Editable PPTX (1:00–1:12).** Open `/tmp/demo-swiss.pptx`
in PowerPoint (primary). Click a title box, retype one word live.
Optional second angle: same file in Keynote or LibreOffice.
Lower-third: “Native text boxes only. Open it and rewrite any line.”

**Scene 7 — Web Studio (1:12–1:22).** Browser at
`http://localhost:3000` (after `npm run dev`). Click path: paste idea →
Inspect evidence → Generate (purpose preset + language) → all-systems
preview → Download `.pptx`. End card: “Two interfaces, one engine.”

## Browser + terminal setup

- Terminal scenes (2–3): fresh shell, font ≥18pt (Menlo/IBM Plex Mono),
  repo at the release baseline, `npm ci` + core build done before
  recording. Keep the first clean `validation: OK` take.
- Browser scene (7): 1920×1080 window, clean profile, extensions hidden,
  bookmarks bar off, zoom 100–125%. Rehearse the click path once
  off-camera.
- PPTX scene (6): PowerPoint desktop primary; same `/tmp/demo-swiss.pptx`.
- Stills (1/4/5): committed PNGs + `previews/html` in the browser — no
  live rendering needed.

## Capture spec

1920×1080, 30fps, 16:9 throughout (decks are 16:9 — letterbox rather
than crop for vertical formats). Do-Not-Disturb on. Burn in short
lower-thirds per scene (text above) and ship a `.srt` alongside.
Narration optional — the video must read silent (autoplay is muted).

## Sensitive data checklist

- Before recording: `env | grep -i 'MUSE\|GITHUB_TOKEN\|API_KEY'` must
  show nothing on screen. Use provider fallback (no credentials) for all
  takes — the Skill requires the Muse key never be logged.
- Use `/tmp/demo-*.pptx` paths; blur `$HOME` if a username leaks.
- If repo mode rate-limits on camera, keep the honest take.

## Edit + thumbnail

Hard cuts between scenes (no crossfades — matches the typographic
bluntness); 0.5s paper (`#FAF7F2`) slug between scenes 1→2 and 6→7;
scene-number lower-thirds (“01 Problem” … “07 Studio”). Runtime target
75–85s. Export H.264 MP4 1080p ≤25MB + 720p fallback.

Thumbnail: pull a still from the recorded footage (never use the brand
hero as the video thumbnail — identity ≠ engine output). Recommended
frame: the dense-technical numbers slide or the editorial cover.
1280×720, wordmark + “Real .pptx · 100% editable” strip.

## Acceptance checklist

- [ ] All receipts on screen are real (`validation: OK` visible).
- [ ] Repo-mode take shows a genuine file:line claim or an honest skip.
- [ ] Design-selection take labels HTML previews as previews.
- [ ] PowerPoint take edits a word live in the generated file.
- [ ] Studio take completes paste → download in one pass.
- [ ] No tokens, usernames, or notifications visible.
- [ ] Captions legible with sound off; runtime 75–85s.
