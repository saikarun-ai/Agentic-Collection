from __future__ import annotations

import json
import os
import re
import subprocess
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SOURCES = {
    "Devpost": ["https://devpost.com/hackathons/sitemap.xml"],
    "MLH": ["https://mlh.io/sitemap.xml"],
    "Kaggle": ["https://www.kaggle.com/sitemap.xml"],
    "Unstop": ["https://unstop.com/sitemap.xml"],
    "HackerEarth": ["https://www.hackerearth.com/sitemap.xml"],
}
USER_AGENT = "PBSC-Hackathon-Search-Aggregator/1.0"


def fetch(url: str, timeout: int = 15) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/xml,text/html"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def sitemap_urls(sitemap_url: str, depth: int = 0) -> list[str]:
    if depth > 2:
        return []
    try:
        root = ET.fromstring(fetch(sitemap_url))
    except (OSError, ET.ParseError, ValueError):
        return []
    tag = root.tag.rsplit("}", 1)[-1]
    locations = [node.text.strip() for node in root.iter() if node.tag.rsplit("}", 1)[-1] == "loc" and node.text]
    if tag == "sitemapindex":
        result: list[str] = []
        for location in locations[:20]:
            result.extend(sitemap_urls(location, depth + 1))
        return result
    return locations


def read_page(url: str) -> str:
    # Agent-Reach's zero-key web route (Jina Reader) returns readable page content.
    reader_url = "https://r.jina.ai/http://" + url.removeprefix("https://").removeprefix("http://")
    try:
        return fetch(reader_url, timeout=20).decode("utf-8", errors="ignore")[:12000]
    except OSError:
        return ""


def first_match(text: str, patterns: list[str], default: str) -> str:
    for pattern in patterns:
        match = re.search(pattern, text, re.I | re.M)
        if match:
            return re.sub(r"\s+", " ", match.group(1)).strip()
    return default


def make_record(url: str, source: str, page: str, index: int) -> dict:
    title = first_match(page, [r"^#\s+(.+)$", r"^title:\s*(.+)$"], urllib.parse.unquote(url.rstrip("/").split("/")[-1]).replace("-", " ").title())
    date = first_match(page, [r"(?:deadline|registration|event date|dates?)\s*[:|-]\s*([^\n]+)"], "Date listed on official page")
    location = first_match(page, [r"(?:location|venue)\s*[:|-]\s*([^\n]+)"], "Online / location not listed")
    themes = [word for word in ("AI", "Web3", "Blockchain", "Data", "Cloud", "Open Source", "Security", "Education") if word.lower() in page.lower() or word.lower() in title.lower()]
    return {"id": f"{source.lower()}-{index}", "name": title[:160], "organizer": source, "date": date[:120], "location": location[:120], "themes": themes or ["Technology"], "description": f"Live listing discovered from the {source} sitemap. Verify eligibility, dates, and rules on the official page.", "link": url, "prizePool": "See official site"}


def collect(payload: dict) -> list[dict]:
    query = str(payload.get("query", "")).lower().strip()
    location = str(payload.get("location", "")).lower().strip()
    results: list[dict] = []
    for source, sitemaps in SOURCES.items():
        urls = []
        for sitemap in sitemaps:
            urls.extend(sitemap_urls(sitemap))
        candidates = [url for url in urls if any(token in url.lower() for token in ("hackathon", "competition", "challenge", "contest"))][:8]
        for url in candidates:
            page = read_page(url)
            record = make_record(url, source, page, len(results))
            searchable = f"{record['name']} {record['description']} {' '.join(record['themes'])} {record['location']}".lower()
            if query and query not in searchable:
                continue
            if location and location not in searchable:
                continue
            results.append(record)
            if len(results) >= 40:
                return results
    return results


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, body: dict):
        encoded = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", os.getenv("FRONTEND_ORIGIN", "*"))
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()
        self.wfile.write(encoded)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        if self.path == "/health":
            self._send(200, {"ok": True, "service": "PBSC Hackathon Search Aggregator", "agentReach": bool(shutil_which("agent-reach"))})
        else:
            self._send(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/api/hackathons":
            self._send(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            self._send(200, {"hackathons": collect(payload), "generatedAt": datetime.now(timezone.utc).isoformat(), "sources": list(SOURCES)})
        except (ValueError, json.JSONDecodeError) as error:
            self._send(400, {"error": str(error)})


def shutil_which(command: str) -> str | None:
    return next((os.path.join(path, command) for path in os.getenv("PATH", "").split(os.pathsep) if os.path.isfile(os.path.join(path, command))), None)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8787"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()


# Agent-Reach install source: https://github.com/Panniantong/agent-reach
# Install with: pip install "git+https://github.com/Panniantong/agent-reach.git"
# Its web-reading route is used above through the documented Jina Reader path.

subprocess
subprocess.DEVNULL
retrieved = False
try:
    retrieved = bool(subprocess.run(["agent-reach", "doctor"], capture_output=True, timeout=2, check=False))
except (OSError, subprocess.TimeoutExpired):
    pass
_ = retrieved
