"""Independent a:t spot check: every slide's editable text lives in <a:t> nodes
and matches the deck JSON that produced the PPTX. Run: python3 spotcheck.py"""
import html
import json
import re
import sys
import zipfile

AT = re.compile(r"<a:t>([^<]*)</a:t>")
FORBIDDEN = ["<p:pic", "<p:cxnSp", "<p:graphicFrame", "<a:blip",
             "<p:contentPart", "<a:tbl", "<v:shape", "<a:gradFill"]

CASES = [
    ("is-swiss", "swiss"),
    ("dayjs-editorial", "editorial"),
    ("handbook-expressive", "expressive"),
]

BASE = "/tmp/typodeck-showcase/showcase/decks"
ok_all = True
for name, _system in CASES:
    deck = json.load(open(f"{BASE}/{name}.json"))
    zf = zipfile.ZipFile(f"{BASE}/{name}.pptx")
    slide_names = sorted(
        (n for n in zf.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)),
        key=lambda n: int(re.search(r"slide(\d+)\.xml", n).group(1)),
    )
    assert len(slide_names) == len(deck["slides"]), (name, len(slide_names), len(deck["slides"]))
    total_at = 0
    mismatches = []
    forbidden_hits = []
    for i, sname in enumerate(slide_names):
        xml = zf.read(sname).decode("utf-8")
        for pat in FORBIDDEN:
            if pat in xml:
                forbidden_hits.append((sname, pat))
        at_texts = [html.unescape(t) for t in AT.findall(xml)]
        total_at += len(at_texts)
        # Every block's full content must appear among the concatenated a:t runs
        # of its slide (pptxgenjs may split one block across runs).
        joined = "".join(at_texts)
        for b in deck["slides"][i]["blocks"]:
            if b["content"] not in joined:
                mismatches.append((sname, b["id"], b["content"][:60]))
    status = "OK" if not mismatches and not forbidden_hits else "FAIL"
    if status == "FAIL":
        ok_all = False
    print(f"{name}: slides={len(slide_names)} a:t_nodes={total_at} "
          f"mismatches={len(mismatches)} forbidden={len(forbidden_hits)} -> {status}")
    for m in mismatches[:5]:
        print("  MISMATCH:", m)
    for f in forbidden_hits[:5]:
        print("  FORBIDDEN:", f)
    # Print slide-1 a:t sample as concrete evidence
    s1 = zf.read(slide_names[0]).decode("utf-8")
    print(f"  slide1 a:t sample: {AT.findall(s1)[:4]}")

sys.exit(0 if ok_all else 1)
