#!/usr/bin/env python3
"""
Optional page assembler for simanpower.

The deployed site is plain static HTML in the project root — you do NOT need
this script to host or serve it. It exists so shared chrome (head, header,
mobile menu, footer, icon sprite) lives in ONE file instead of seven.

    python3 build.py          # regenerate every page in the root

Sources:  _src/layout.html   — the page shell
          _src/partials/*.html
          _src/pages/*.html  — per-page front matter + body
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "_src")

FM = re.compile(r"^\s*<!--\s*front-matter\s*(.*?)-->", re.S)


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def load_partials():
    d = os.path.join(SRC, "partials")
    return {
        os.path.splitext(f)[0]: read(os.path.join(d, f))
        for f in sorted(os.listdir(d))
        if f.endswith(".html")
    }


def parse_page(text):
    m = FM.match(text)
    meta, body = {}, text
    if m:
        for line in m.group(1).strip().splitlines():
            line = line.strip()
            if not line or ":" not in line:
                continue
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
        body = text[m.end():]
    return meta, body.strip()


def render(tpl, ctx):
    # repeat until stable so partials can themselves contain {{tokens}}
    for _ in range(6):
        new = re.sub(r"\{\{\s*([A-Za-z0-9_]+)\s*\}\}", lambda m: str(ctx.get(m.group(1), "")), tpl)
        if new == tpl:
            break
        tpl = new
    return tpl


def main():
    layout = read(os.path.join(SRC, "layout.html"))
    partials = load_partials()
    pages_dir = os.path.join(SRC, "pages")
    written = []

    for fname in sorted(os.listdir(pages_dir)):
        if not fname.endswith(".html"):
            continue
        meta, body = parse_page(read(os.path.join(pages_dir, fname)))
        slug = meta.get("slug", os.path.splitext(fname)[0])
        ctx = dict(partials)
        ctx.update(meta)
        ctx["BODY"] = body
        ctx["PAGE"] = slug
        # aria-current markers, one per nav item
        for key in ("home", "about", "services", "sectors", "employers", "candidates", "contact"):
            ctx["CUR_" + key.upper()] = ' aria-current="page"' if slug == key else ""
        out = render(layout, ctx)
        dest = os.path.join(ROOT, meta.get("file", os.path.splitext(fname)[0] + ".html"))
        with open(dest, "w", encoding="utf-8") as fh:
            fh.write(out)
        written.append(os.path.basename(dest))

    print("built %d pages: %s" % (len(written), ", ".join(written)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
