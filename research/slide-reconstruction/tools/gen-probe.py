"""Generalization probes: fixed Tier-B geometry + swapped unrelated content.

Usage (cwd = worktree root):
  python3 research/slide-reconstruction/tools/gen-probe.py

Reads template case.json files, substitutes content strings only (geometry,
sizes, colors untouched), writes cases/<probe>/case.json. Fixed geometry is
deliberate: silent clipping under swapped content is a finding (grammar needs
a responsive rule), not a setup error.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CASES = ROOT / "research" / "slide-reconstruction" / "cases"

FOOT = "Generalization probe — synthetic content"


def build(template: str, probe: str, subs: dict[str, str], note: str) -> None:
    c = json.load(open(CASES / template / "case.json"))
    for b in c["blocks"]:
        if b["id"] in subs:
            b["content"] = subs[b["id"]]
    c["title"] = probe
    c["thesis"] = note
    c["notes"] = (
        "GENERALIZATION PROBE of " + template + ": fixed geometry, swapped content. " + note
    )
    out = CASES / probe
    out.mkdir(exist_ok=True)
    json.dump(c, open(out / "case.json", "w"), indent=1)
    print(probe, "ok")


# G1 monumental-numeral-cover probes (template: gapminder-tq2-p1) -------------
G1F = {"foot-l": "probe.example.org", "foot-c": FOOT, "foot-r": "Probe v1"}
build("gapminder-tq2-p1", "gen-g1-short-en", {
    "kicker": "FIELD NOTES", "number": "5", "title": "Oceans, Mapped",
    "url": "atlases.probe.example/5", **G1F},
    "G1 short-EN pitch cover.")
build("gapminder-tq2-p1", "gen-g1-long-en", {
    "kicker": "SPECIAL REPORT", "number": "12", "title": "Where the Night Trains Still Run on Time",
    "url": "dispatch.probe.example/night-trains", **G1F},
    "G1 long-EN editorial cover; title wrap expected (fixed box is the test).")
build("gapminder-tq2-p1", "gen-g1-med-ko", {
    "kicker": "기획 특집", "number": "3", "title": "한반도의 새",
    "url": "www.probe.example/ko-birds", **G1F},
    "G1 medium-KO report cover.")
build("gapminder-tq2-p1", "gen-g1-metric", {
    "kicker": "Q3 RELIABILITY", "number": "98%", "title": "Uptime, Last Quarter",
    "url": "status.probe.example/q3", **G1F},
    "G1 purpose-swap: metric content in numeral-cover geometry (width overflow is the test).")

# G3 starred-explainer-columns probes (template: gapminder-tle-p5) ------------
G3F = {"foot-l": "probe.example.org", "foot-c": FOOT, "foot-r": "Probe v1"}
build("gapminder-tle-p5", "gen-g3-short-en", {
    "run-l": "CHANGELOG: RELEASE 4.2", "run-r": "C4.2", "headline": "WHY NOW?",
    "lede": "Three small fixes ship together because they share one root cause. Here is what changed and why it matters.",
    "sub1": "Faster sync", "body1": "Sync now batches writes. Large folders finish in one pass.",
    "sub2": "Quieter retries", "body2": "Retries back off instead of hammering. Logs stay readable.",
    "sub3": "Honest errors", "body3": "Failures name the file and the fix. No more code 0x17.",
    "closing": "Update from the usual place. Nothing else moves.", **G3F},
    "G3 short-EN changelog explainer; expects airy/empty lower boxes.")
build("gapminder-tle-p5", "gen-g3-long-en", {
    "run-l": "POLICY BRIEF: HARBOR LEVY", "run-r": "P7.3", "headline": "WHY THE LEVY FAILED",
    "lede": "The harbor levy failed twice: once at the ballot box and once more in committee, and the two failures have different causes that are usually conflated in press coverage. Understanding each separately is the only way to draft a third attempt that survives contact with the harbor board, the fishing cooperatives, and the state auditors.",
    "sub1": "A coalition that never met",
    "body1": "The levy needed dockworkers and merchants to campaign together. They never shared a room: the merchants met downtown on Tuesdays while the dockworkers met at the hall on Thursdays, and neither group trusted the consultants who carried messages between them. Turnout collapsed in exactly the precincts the levy needed most.",
    "sub2": "Numbers that moved",
    "body2": "Revenue projections changed three times during the campaign as fuel prices swung. Each revision gave opponents a fresh headline, and the final estimate landed the week before the vote, too late to explain. Voters remembered the revisions, not the reasons.",
    "sub3": "The audit nobody read",
    "body3": "A favorable state audit arrived in August and sat unread while the committee debated procedure. By the time anyone quoted it, the narrative had hardened. Timing beat substance.",
    "closing": "The next draft should lock projections early, meet jointly, and publish the audit summary on page one. Details: harbor.probe.example/levy-postmortem", **G3F},
    "G3 long-EN policy explainer; fixed boxes are the test (clip risk).")
build("gapminder-tle-p5", "gen-g3-med-ko", {
    "run-l": "자료 해설: 기대 수명", "run-r": "Q3.1", "headline": "왜 무지인가?",
    "lede": "세계 기대 수명에 대한 질문에 많은 사람이 오답을 고른다. 그 이유를 이해하는 일은 생각보다 어렵다. 같은 오답 패턴이 여러 나라에서 반복되기 때문이다.",
    "sub1": "오래된 사실", "body1": "세계 보건이 크게 나아졌다는 사실은 잘 알려져 있지 않다. 전환에는 수십 년이 걸렸다.",
    "sub2": "보도되지 않는 추세", "body2": "기대 수명의 증가는 너무 느리게 일어나 뉴스가 되지 못한다. 수십 년 이어지지만 대중은 모른다.",
    "sub3": "극단의 과장", "body3": "다수가 여전히 극빈층이라는 오해가 오답을 낳는다. 실제로는 수십억 명이 중간 소득 국가에 산다.",
    "closing": "자세한 내용은 자료실에서 확인할 수 있다: probe.example/ko-longevity", **G3F},
    "G3 medium-KO explainer; multiscript hierarchy test.")
build("gapminder-tle-p5", "gen-g3-faq", {
    "run-l": "HELP CENTER: SYNC", "run-r": "H2.0", "headline": "QUESTIONS, ANSWERED",
    "lede": "The four questions support hears most about sync, answered in one place. Start here before opening a ticket.",
    "sub1": "Where are my files?",
    "body1": "In the Sync folder, exactly where you left them. The app never moves originals.",
    "sub2": "Why is the first sync slow?",
    "body2": "First sync uploads everything. Later syncs send only changes.",
    "sub3": "What do the icons mean?",
    "body3": "A check means synced. A clock means queued. A warning names the problem file.",
    "closing": "Still stuck? Write to help@probe.example with the warning text.", **G3F},
    "G3 purpose-swap: FAQ content in explainer geometry.")
