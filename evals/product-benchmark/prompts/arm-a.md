# Arm A — frozen generic prompt (no Typodeck)

> Analyze the repository at `<FIXTURE_DIR>` (start with README.md, then
> package.json, then at most 2 source files; stay under 200 KB total).
> Then create ONE self-contained HTML file presenting the project as an
> investor/demo-day pitch: 6 to 10 slides, 16:9, keyboard/click navigation,
> no external assets. Use real numbers from the repo only — never invent
> metrics. Give every slide an action title stating its claim, keep body
> copy short, and put a small source note on slides that cite numbers.

Replay: `arms/baseline-a.mjs` implements one competent reading of this
prompt deterministically (heading/number extraction + generic template).
The prompt above is what a generic coding agent receives; the script is
the frozen, inspectable replay. No Typodeck code, Skill, tokens, or
fonts are used in Arm A.
