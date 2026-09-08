#!/usr/bin/env python3
"""Build a 4-tab xlsx mirroring the CMO plan sheet, with a filled Status column."""
import zipfile
from xml.sax.saxutils import escape

BASE = "https://finanshels.com"
DONE_301 = "DONE - 301 live to pillar, page unpublished (verified 24 Aug 2026)"
DONE_NOIDX = "DONE - live (HTTP 200), noindex + nofollow meta present (verified 24 Aug 2026)"

industry_rows = [
    "accounting-firm-for-ecommerce-in-uae",
    "accounting-firm-for-restaurants-in-uae",
    "accounting-firm-for-smes-in-uae",
    "accounting-firm-for-startups-in-uae",
    "hire-an-accountant-in-uae",
]

loc_map = []
with open("prune-map.tsv") as f:
    for line in f:
        path, target = line.rstrip("\n").split("\t")
        if path.startswith("/locations/"):
            loc_map.append((path, target))

landing = [l.strip() for l in open("landing-pages.txt") if l.strip()]

def sheet_industry():
    rows = [["#", "Industry page (prune)", "301 redirect to pillar", "Action", "Status (24 Aug 2026)"]]
    for i, slug in enumerate(industry_rows, 1):
        rows.append([str(i), f"{BASE}/services/{slug}", f"{BASE}/bookkeeping-services-uae",
                     "301 redirect to pillar, then unpublish the page", DONE_301])
    return rows

def sheet_locations():
    rows = [["#", "Location page (thin/programmatic)", "Recommended 301 to pillar", "Status (24 Aug 2026)"]]
    for i, (path, target) in enumerate(loc_map, 1):
        rows.append([str(i), BASE + path, BASE + target, DONE_301])
    return rows

def sheet_landing():
    rows = [["#", "Landing page (paid - keep live)", "Action", "Status (24 Aug 2026)"]]
    for i, path in enumerate(landing, 1):
        status = DONE_NOIDX
        if "tax-consultation-with-gautam" in path:
            status = ("BLOCKED - a redirect rule sends this URL to /landing-pages/free-financial-model-assessment "
                      "which is 404. Page itself is published + noindexed. Fix: delete the redirect rule in Webflow "
                      "Site Settings > Publishing > 301 Redirects (or publish the target page).")
        elif "uaes-top-accountants-handle-your-books" in path:
            status = ("STAGED - noindex toggle already live; the 'noindex, nofollow' custom head tag was added "
                      "24 Aug and goes live on the next site publish.")
        rows.append([str(i), BASE + path,
                     "Add meta robots: noindex, nofollow (keep page live for ads)", status])
    return rows

def sheet_tasks():
    return [
        ["Task", "Mechanism", "Notes", "Status (24 Aug 2026)"],
        ["Industry & location page redirects",
         "Webflow > Site Settings > Publishing > 301 Redirects",
         "Add old path > pillar path. Then unpublish the old page.",
         "DONE - all 34 redirect rules live, all 34 pages set to draft. Verified by live HTTP checks: 34/34 single-hop 301s to the correct pillar."],
        ["Noindex the 44 paid landing pages",
         "Per page: Settings > 'Disable search-engine indexing' + noindex,nofollow custom head code",
         "robots.txt does NOT noindex - it only blocks crawl. Use the meta robots tag.",
         "DONE (43/44 verified live; 1 staged) - see Landing pages tab rows 39-40 for the two exceptions."],
        ["Do NOT block landing pages in robots.txt", "-",
         "If you both noindex AND robots.txt-disallow, Google can't read the noindex tag.",
         "VERIFIED - robots.txt does not disallow /landing-pages/; pages remain crawlable so noindex is readable."],
        ["Optional supporting step", "Remove paid landing pages from sitemap",
         "Reduces discovery, but is NOT a substitute for the noindex meta tag.",
         "NO ACTION NEEDED - sitemap.xml (751 URLs) already contains zero /landing-pages/, /locations/, or pruned /services/ URLs."],
    ]

sheets = [
    ("Industry pages (5)", sheet_industry()),
    ("Location pages (29)", sheet_locations()),
    ("Landing pages (44)", sheet_landing()),
    ("Tasks summary", sheet_tasks()),
]

def col_letter(n):
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s

def sheet_xml(rows):
    out = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
           '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>']
    for r, row in enumerate(rows, 1):
        out.append(f'<row r="{r}">')
        for c, val in enumerate(row, 1):
            ref = f"{col_letter(c)}{r}"
            out.append(f'<c r="{ref}" t="inlineStr"><is><t xml:space="preserve">{escape(val)}</t></is></c>')
        out.append('</row>')
    out.append('</sheetData></worksheet>')
    return "".join(out)

ct = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
      '<Default Extension="xml" ContentType="application/xml"/>',
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>']
for i in range(1, len(sheets) + 1):
    ct.append(f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
ct.append('</Types>')

rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        '</Relationships>')

wb_sheets, wb_rels = [], []
for i, (name, _) in enumerate(sheets, 1):
    wb_sheets.append(f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>')
    wb_rels.append(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>')

workbook = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            f'<sheets>{"".join(wb_sheets)}</sheets></workbook>')

workbook_rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                 f'{"".join(wb_rels)}</Relationships>')

with zipfile.ZipFile("seo-consolidation-status.xlsx", "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", "".join(ct))
    z.writestr("_rels/.rels", rels)
    z.writestr("xl/workbook.xml", workbook)
    z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
    for i, (_, rows) in enumerate(sheets, 1):
        z.writestr(f"xl/worksheets/sheet{i}.xml", sheet_xml(rows))

print("wrote seo-consolidation-status.xlsx",
      "| tabs:", [f"{n}:{len(r)-1} rows" for n, r in sheets])
