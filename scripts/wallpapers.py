#!/usr/bin/env python3
"""Photos of Vietnam for CaramOS's daily wallpaper: build public/wallpapers/ from wallpapers/curated.json.

    python3 scripts/wallpapers.py [--copy-to <caramos-ota>/usr/share/caramos-ota/daily-wallpaper/photos.json]

wallpapers/curated.json lists the photos in the order of the days. An entry is either
- {"commons": "File:….jpg", "title": "Tràng An, Ninh Bình"}: a Wikimedia Commons file. Its author, licence and page
  are read from Commons, and its 1920 px wide thumbnail is downloaded once into public/wallpapers/; or
- {"file": "ha-long.jpg", "title": "…", "author": "…", "license": "…", "source": "https://…"}: a photo the team may
  share, put in public/wallpapers/ by hand.
wallpapers/lock.json remembers what was downloaded, so a second run downloads nothing new.

It writes public/wallpapers/photos.json, the list every CaramOS computer reads once a day
(https://caramos.vietnamlinuxfamily.net/wallpapers/photos.json; caramos_daily_wallpaper in caramos-ota), with each
photo's address and SHA-256, and public/wallpapers/index.html, a page showing the photos and their credits. A picture
in public/wallpapers/ that the list no longer names is deleted. `yarn deploy` publishes them. With --copy-to, the list
is also written where caramos-ota keeps the copy it uses when the website cannot be reached.

Wikimedia asks automated clients for a User-Agent with contact details, so the project's address is in it.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import re
import shutil
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CURATED = ROOT / "wallpapers/curated.json"
LOCK = ROOT / "wallpapers/lock.json"
OUT = ROOT / "public/wallpapers"
SITE = "https://caramos.vietnamlinuxfamily.net/wallpapers/"
API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "CaramOS-wallpapers/1.0 (+https://caramos.vietnamlinuxfamily.net)"
WIDTH = 1920
LICENCES = re.compile(r"^(CC BY(-SA)? [0-9.]+|CC0( 1\.0)?|Public domain)$")
PICTURES = (".jpg", ".jpeg", ".png", ".webp")


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response:
        return response.read()


def plain(markup: str | None) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", markup or ""))).strip()


def author_of(markup: str | None) -> str:
    """The author's name from Commons' Artist field, without "talk" links, addresses, the "from <place>" of Flickr
    imports, or a message after it ("Name. Feel free to use…"); an initial ("Dennis G. Jarvis") is kept."""

    text = plain(markup)
    text = re.sub(r"\(?\s*talk\s*\)?|,?\s*https?://\S+", "", text, flags=re.I)
    text = re.sub(r"^This Photo was taken by\s+", "", text, flags=re.I)
    text = re.split(r"(?<!\b[A-Z])\.\s|\s\(", text, maxsplit=1)[0]
    text = re.sub(r"\s+from\s+[^,]+(,[^,]+)?$", "", text)
    return re.sub(r"[\[\]]", "", text).strip(" ,.:") or "Wikimedia Commons"


def slug(text: str) -> str:
    folded = unicodedata.normalize("NFKD", text.replace("đ", "d").replace("Đ", "D"))
    ascii_text = "".join(char for char in folded if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")[:48] or "anh"


def commons_info(titles: list[str]) -> dict[str, dict]:
    info: dict[str, dict] = {}
    for start in range(0, len(titles), 40):
        params = {"action": "query", "format": "json", "formatversion": "2", "prop": "imageinfo",
                  "iiprop": "url|extmetadata", "iiurlwidth": str(WIDTH), "titles": "|".join(titles[start:start + 40])}
        data = json.loads(get(API + "?" + urllib.parse.urlencode(params)))
        for page in data["query"]["pages"]:
            info[page["title"]] = (page.get("imageinfo") or [{}])[0]
        time.sleep(1)
    return info


def refresh_credits(lock: dict) -> None:
    """Read the author, licence and page of the photos already downloaded again (the pictures stay as they are)."""

    info = commons_info(sorted(lock))
    for title, known in lock.items():
        meta = info.get(title, {}).get("extmetadata", {})
        if meta:
            known["author"] = author_of(meta.get("Artist", {}).get("value"))
            known["license"] = plain(meta.get("LicenseShortName", {}).get("value")) or known["license"]


def build(copy_to: Path | None, refresh: bool = False) -> int:
    curated = json.loads(CURATED.read_text(encoding="utf-8"))["photos"]
    lock = json.loads(LOCK.read_text(encoding="utf-8")) if LOCK.exists() else {}
    if refresh and lock:
        refresh_credits(lock)
    OUT.mkdir(parents=True, exist_ok=True)
    missing = [entry["commons"] for entry in curated if "commons" in entry and entry["commons"] not in lock]
    info = commons_info(missing) if missing else {}
    photos, problems = [], 0
    for entry in curated:
        if "commons" in entry:
            title = entry["commons"]
            if title not in lock:
                image = info.get(title, {})
                meta = image.get("extmetadata", {})
                licence = plain(meta.get("LicenseShortName", {}).get("value"))
                if not image.get("thumburl") or not LICENCES.match(licence) \
                        or plain(meta.get("Restrictions", {}).get("value")):
                    print(f"skip {title}: licence {licence!r}, restrictions or no thumbnail", file=sys.stderr)
                    problems += 1
                    continue
                data = get(image["thumburl"])
                digest = hashlib.sha256(data).hexdigest()
                name = f"{slug(entry['title'])}-{digest[:8]}.jpg"
                (OUT / name).write_bytes(data)
                lock[title] = {"file": name, "sha256": digest, "license": licence, "source": image["descriptionurl"],
                               "author": author_of(meta.get("Artist", {}).get("value"))}
                print(f"downloaded {name} ({len(data) // 1024} KiB)")
                time.sleep(1)
            known = lock[title]
            name, licence, source = known["file"], known["license"], known["source"]
            author = entry.get("author") or known["author"]
        else:
            name, licence, source, author = entry["file"], entry["license"], entry.get("source", ""), entry["author"]
        path = OUT / name
        if not path.is_file() or path.suffix.lower() not in PICTURES:
            print(f"skip {name}: not a picture in {OUT}", file=sys.stderr)
            problems += 1
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        photos.append({"id": path.stem, "url": SITE + urllib.parse.quote(name), "sha256": digest,
                       "title": entry["title"], "author": author, "license": licence, "source": source})
    listed = {Path(urllib.parse.unquote(photo["url"])).name for photo in photos}
    for stale in OUT.iterdir():
        if stale.suffix.lower() in PICTURES and stale.name not in listed:
            stale.unlink()
            print(f"deleted {stale.name}: no longer in the list")
    lock = {title: known for title, known in lock.items() if known["file"] in listed}
    LOCK.write_text(json.dumps(lock, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    manifest = {"version": 1, "updated": dt.date.today().isoformat(), "photos": photos}
    text = json.dumps(manifest, ensure_ascii=False, indent=1) + "\n"
    (OUT / "photos.json").write_text(text, encoding="utf-8")
    (OUT / "index.html").write_text(gallery(photos), encoding="utf-8")
    if copy_to:
        copy_to.write_text(text, encoding="utf-8")
        print(f"copied the list to {copy_to}")
    print(f"{len(photos)} photos in {OUT / 'photos.json'}")
    return 1 if problems else 0


def gallery(photos: list[dict]) -> str:
    cards = []
    for index, photo in enumerate(photos, 1):
        name = Path(urllib.parse.unquote(photo["url"])).name
        source = (f' · <a href="{html.escape(photo["source"])}">nguồn</a>' if photo["source"] else "")
        cards.append(
            f'<figure><img src="{html.escape(urllib.parse.quote(name))}" alt="{html.escape(photo["title"])}" '
            f'loading="lazy"><figcaption><b>{index}. {html.escape(photo["title"])}</b>'
            f'<span>Ảnh: {html.escape(photo["author"])} · {html.escape(photo["license"])}{source}</span>'
            f'</figcaption></figure>')
    return f"""<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hình nền Việt Nam mỗi ngày · CaramOS</title>
<meta name="description" content="Ảnh Việt Nam có giấy phép tự do mà CaramOS dùng làm hình nền, mỗi ngày một ảnh.">
<style>
:root {{ --ink: #1f2a22; --muted: #657064; --paper: #fffdf7; --cream: #f7f3e9; --green: #1f4f32; --line: #e3dfd1; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--cream); color: var(--ink); font: 16px/1.6 system-ui, sans-serif; }}
main {{ max-width: 1180px; margin: 0 auto; padding: 32px 16px 64px; }}
h1 {{ margin: 0 0 8px; color: var(--green); font-size: clamp(28px, 4vw, 40px); }}
p {{ margin: 0 0 8px; color: var(--muted); max-width: 760px; }}
a {{ color: var(--green); }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 24px; }}
figure {{ margin: 0; background: var(--paper); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }}
img {{ display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; }}
figcaption {{ padding: 10px 14px 12px; display: grid; gap: 2px; }}
figcaption span {{ color: var(--muted); font-size: 14px; }}
</style>
</head>
<body>
<main>
<h1>Hình nền Việt Nam mỗi ngày</h1>
<p>CaramOS đổi hình nền mỗi ngày bằng một ảnh dưới đây, khi bạn chọn thư mục <b>Việt Nam mỗi ngày</b> trong Cài đặt hệ thống &gt; Hình nền.
Các ảnh có giấy phép tự do; bấm "nguồn" để xem trang gốc của ảnh và giấy phép đầy đủ.</p>
<p><a href="/">← CaramOS</a> · <a href="photos.json">photos.json</a></p>
<div class="grid">
{chr(10).join(cards)}
</div>
</main>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--copy-to", type=Path, help="also write the list to this file (caramos-ota's copy)")
    parser.add_argument("--refresh-credits", action="store_true",
                        help="read the authors and licences of the downloaded photos from Commons again")
    args = parser.parse_args()
    return build(args.copy_to, refresh=args.refresh_credits)


if __name__ == "__main__":
    raise SystemExit(main())
