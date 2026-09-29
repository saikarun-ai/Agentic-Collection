from __future__ import annotations

import html
import json
import os
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

# Public source registry. Agent-Reach uses these sitemaps first, then the free
# search fallback. A source is only shown in results when its page was fetched.
SOURCES = {
    "Devpost": ["https://devpost.com/hackathons/sitemap.xml"],
    "Devfolio": ["https://devfolio.co/sitemap.xml"],
    "Unstop": ["https://unstop.com/sitemap.xml"],
    "MLH": ["https://mlh.io/sitemap.xml"],
    "TAIKAI": ["https://taikai.network/sitemap.xml"],
    "Hackathon.com": ["https://www.hackathon.com/sitemap.xml"],
    "Kaggle": ["https://www.kaggle.com/sitemap.xml"],
    "Lablab.ai": ["https://lablab.ai/sitemap.xml"],
    "Open Hackathons": ["https://www.openhackathons.org/sitemap.xml"],
    "DrivenData": ["https://www.drivendata.org/sitemap.xml"],
    "AIcrowd": ["https://www.aicrowd.com/sitemap.xml"],
    "HackerEarth": ["https://www.hackerearth.com/sitemap.xml"],
    "HackerRank": ["https://www.hackerrank.com/sitemap.xml"],
    "CodeChef": ["https://www.codechef.com/sitemap.xml"],
    "Topcoder": ["https://www.topcoder.com/sitemap.xml"],
    "AtCoder": ["https://atcoder.jp/sitemap.xml"],
    "Codeforces": ["https://codeforces.com/sitemap.xml"],
    "Hackaday.io": ["https://hackaday.io/sitemap.xml"],
    "HeroX": ["https://www.herox.com/sitemap.xml"],
    "Agorize": ["https://www.agorize.com/sitemap.xml"],
}

# MAS profile inspired by the public You-AI architecture. It keeps source
# retrieval deterministic while making the research stages explicit and auditable.
MAS_CONFIG = {
    "name": "PBSC Live Research Swarm",
    "reference": "https://you-ai-project.netlify.app",
    "agents": ["orchestrator", "researcher", "analyst", "critic", "synthesizer"],
    "policy": "official-source-only; student eligibility must be verified on the source page",
}
USER_AGENT = "PBSC-Hackathon-Search-Aggregator/1.0"


def fetch(url: str, timeout: int = 6) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/xml,text/html,text/plain"})
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
        # Some providers publish hundreds of sitemap shards. Inspect every shard
        # at the first level, but cap recursive expansion to keep requests bounded.
        for location in locations[:40]:
            result.extend(sitemap_urls(location, depth + 1))
        return result
    return locations


def read_page(url: str) -> str:
    # Agent-Reach-compatible zero-key reader route for pages that block simple requests.
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
    return {"id": f"{source.lower()}-{index}", "name": title[:160], "organizer": source, "date": date[:120], "location": location[:120], "themes": themes or ["Technology"], "description": f"Live listing discovered from the {source}. Verify eligibility, dates, and rules on the official page.", "link": url, "prizePool": "See official site"}


def free_web_search(query: str, location: str) -> list[dict]:
    search = "hackathon competition challenge student " + (query or "") + " " + (location or "")
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(search)
    try:
        page = fetch(url, timeout=15).decode("utf-8", errors="ignore")
    except OSError:
        return []
    results: list[dict] = []
    for index, match in enumerate(re.finditer(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', page, re.I | re.S)):
        link = html.unescape(match.group(1))
        title = re.sub(r"<[^>]+>", "", html.unescape(match.group(2))).strip()
        parsed = urllib.parse.parse_qs(urllib.parse.urlparse(link).query).get("uddg")
        if parsed:
            link = parsed[0]
        if not link.startswith(("http://", "https://")) or not title:
            continue
        host = urllib.parse.urlparse(link).netloc.removeprefix("www.")
        results.append({"id": f"web-search-{index}", "name": title[:160], "organizer": host, "date": "Open official page for current dates", "location": "See official listing", "themes": ["Technology"], "description": "Discovered through the free DuckDuckGo HTML web search fallback. Confirm student eligibility and deadlines on the official page.", "link": link, "prizePool": "See official site"})
        if len(results) >= 20:
            break
    return results


def collect(payload: dict) -> tuple[list[dict], str]:
    query = str(payload.get("query", "")).lower().strip()
    location = str(payload.get("location", "")).lower().strip()
    requested_sources = {str(source) for source in payload.get("sources", []) if isinstance(source, str)}
    # The UI includes display-only values such as "All Hackathons" and some
    # platforms do not yet have a configured sitemap. Never let those values make
    # the collector silently return an empty catalog.
    selected_sources = set(SOURCES) if not requested_sources or "All Hackathons" in requested_sources else (set(SOURCES) & requested_sources)
    if not selected_sources:
        selected_sources = set(SOURCES)

    def source_candidates(source_and_sitemaps: tuple[str, list[str]]) -> tuple[str, list[str]]:
        source, sitemaps = source_and_sitemaps
        urls: list[str] = []
        for sitemap in sitemaps:
            urls.extend(sitemap_urls(sitemap))
        candidates = [url for url in dict.fromkeys(urls) if any(token in url.lower() for token in ("hackathon", "competition", "challenge", "contest"))]
        return source, candidates[:8]

    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        sitemap_jobs = [pool.submit(source_candidates, (source, SOURCES[source])) for source in selected_sources]
        for job in as_completed(sitemap_jobs):
            source, candidates = job.result()
            page_jobs = {pool.submit(read_page, url): url for url in candidates}
            for index, page_job in enumerate(as_completed(page_jobs)):
                url = page_jobs[page_job]
                page = page_job.result()
                # A sitemap URL without readable page content is not useful to a
                # student, so omit it instead of presenting an unverified listing.
                if not page.strip():
                    continue
                results.append(make_record(url, source, page, len(results)))
                if len(results) >= 100:
                    return results, "agent-reach-sitemap"
    if results:
        return results, "agent-reach-sitemap"
    fallback = free_web_search(query, location)
    return fallback, "duckduckgo-html-fallback"


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
            self._send(200, {"ok": True, "service": "PBSC Hackathon Search Aggregator", "sitemapSources": list(SOURCES), "fallback": "DuckDuckGo HTML"})
        else:
            self._send(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/api/hackathons":
            self._send(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            results, source = collect(payload)
            self._send(200, {
                "hackathons": results,
                "generatedAt": datetime.now(timezone.utc).isoformat(),
                "source": source,
                "sources": list(SOURCES),
                "mas": MAS_CONFIG,
                "live": True,
            })
        except (ValueError, json.JSONDecodeError) as error:
            self._send(400, {"error": str(error)})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8787"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()


# Agent-Reach source: https://github.com/Panniantong/agent-reach
# Install separately with: pip install "git+https://github.com/Panniantong/agent-reach.git"
# The collector uses public sitemap parsing plus its documented zero-key reader route.
        
