#!/usr/bin/env python3
"""CSV (Notion export) -> vocab-data.js"""
import csv
import json
import sys
from pathlib import Path

CSV_PATH = Path(__file__).parent / "ExportBlock-67ceab2a-0abd-475c-b391-235734f22aa0-Part-1" / "Vocabulary Book 13fcae0f0ebd811ea126d64bd07ce533_all.csv"
OUT_PATH = Path(__file__).parent / "vocab-data.js"


def to_bool(v: str) -> bool:
    return (v or "").strip().lower() in ("yes", "true", "__yes__", "1")


def main():
    if not CSV_PATH.exists():
        print(f"CSV not found: {CSV_PATH}", file=sys.stderr)
        sys.exit(1)

    rows = []
    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            english = (row.get("English") or "").strip()
            japanese = (row.get("日本語訳") or "").strip()
            note = (row.get("メモ") or "").strip()
            if not english or not japanese:
                continue
            rows.append({
                "id": f"w{i:04d}",
                "english": english,
                "japanese": japanese,
                "note": note,
                "notionCheck1": to_bool(row.get("Check 1", "")),
                "notionCheck2": to_bool(row.get("Check 2", "")),
                "notionCheck3": to_bool(row.get("Check 3", "")),
            })

    body = json.dumps(rows, ensure_ascii=False, indent=2)
    OUT_PATH.write_text(f"window.VOCAB_DATA = {body};\n", encoding="utf-8")
    print(f"Wrote {len(rows)} entries -> {OUT_PATH}")


if __name__ == "__main__":
    main()
