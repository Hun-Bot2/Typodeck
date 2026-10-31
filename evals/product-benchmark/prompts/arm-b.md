# Arm B — frozen Typodeck Skill invocation

Follow `skills/typodeck/SKILL.md` (Agent B revision) on the Agent C engine:

1. Announce: `Following the Typodeck Skill: local mode, swiss+editorial+
   expressive, provider fallback, pipeline baseline.`
2. Local analysis (`references/local-analysis.md`): bounded walk of
   `<FIXTURE_DIR>` (README.md head 8000 bytes + package.json + code
   excerpts capped at 10 KB/file, <=20 files, <=200 KB total, secrets
   skipped), assembled mechanically into idea text (100-20,000 chars),
   exactly like `examples/02-local-analysis.sh`.
3. Engine (`references/engine.md`), per production system
   `swiss|editorial|expressive` (seed 42, lang en, legacy arc):
   `npm run --silent deck -- --idea-file <idea> --system <sys> --out <fx>-<sys>.pptx`
   Ship only on `validation: OK`. Record provider/claims/quality/deck
   receipts verbatim.
4. HTML preview: lay out the SAME narrative per system and render the
   engine's own geometry to HTML (positions/sizes/fonts from the deck
   object, plus the engine's `OVERFLOW_PROBE_JS` for measurement).
5. Evidence report (`references/export.md`): provider, claim counts,
   quality verdict, deck/system, warnings verbatim, validation outcome.

Primary head-to-head: Arm A vs B-swiss. B-editorial/B-expressive measured
identically as additional columns. `document` excluded (experimental).
