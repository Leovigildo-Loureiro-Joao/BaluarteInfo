#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

CONTROLLERS = Path("api/src/main/java/com/igreja/api/controllers")
BALUARTE = Path("baluarte/src")
ADMIN_JAVA = Path("admin/src/main/java")

ABS_PREFIXES = ("/auth", "/admin", "/user", "/public", "/health")

MAPPING_RE = re.compile(r"@(Get|Post|Put|Delete)Mapping(?:\((.*?)\))?")
REQMAP_RE = re.compile(r"@RequestMapping\((.*?)\)")
QUOTED_RE = re.compile(r"\"([^\"]+)\"")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def extract_prefix(text: str) -> str:
    m = REQMAP_RE.search(text)
    if not m:
        return ""
    inner = m.group(1)
    pm = QUOTED_RE.search(inner)
    return pm.group(1) if pm else ""


def normalize_join(prefix: str, path: str) -> str:
    prefix = (prefix or "").strip()
    path = (path or "").strip()

    if not prefix and not path:
        return ""

    if path and path.startswith(ABS_PREFIXES):
        return path

    if not path:
        return prefix

    if prefix:
        if not prefix.startswith("/"):
            prefix = "/" + prefix
        if path.startswith("/"):
            joined = prefix.rstrip("/") + path
        else:
            joined = prefix.rstrip("/") + "/" + path
        return re.sub(r"//+", "/", joined)

    return path


def base_path(full_path: str) -> str:
    # Replace {id} with a placeholder to avoid double slashes
    base = re.sub(r"\{[^}]+\}", "X", full_path)
    return re.sub(r"/X", "/", base).rstrip("/")


def load_tree_text(root: Path, exts: set[str]) -> str:
    parts: list[str] = []
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        if "node_modules" in p.parts:
            continue
        if p.suffix not in exts:
            continue
        try:
            parts.append(read_text(p))
        except Exception:
            pass
    return "\n".join(parts)


def main() -> None:
    baluarte_text = load_tree_text(BALUARTE, exts={".ts", ".tsx", ".js", ".jsx"})
    admin_text = load_tree_text(ADMIN_JAVA, exts={".java"})

    rows: list[tuple[str, str, str, bool, bool]] = []

    for f in sorted(CONTROLLERS.glob("*.java")):
        text = read_text(f)
        prefix = extract_prefix(text)
        for line in text.splitlines():
            m = MAPPING_RE.search(line.strip())
            if not m:
                continue
            http = m.group(1).upper()
            inner = m.group(2) or ""
            path = ""
            if inner:
                pm = QUOTED_RE.search(inner)
                if pm:
                    path = pm.group(1)
            full = normalize_join(prefix, path)
            if not full:
                continue
            b = base_path(full)
            used_baluarte = b in baluarte_text
            used_admin = b in admin_text
            rows.append((full, http, f.name, used_baluarte, used_admin))

    seen: set[tuple[str, str]] = set()
    dedup: list[tuple[str, str, str, bool, bool]] = []
    for r in rows:
        key = (r[0], r[1])
        if key in seen:
            continue
        seen.add(key)
        dedup.append(r)

    def method_order(m: str) -> int:
        return {"GET": 0, "POST": 1, "PUT": 2, "DELETE": 3}.get(m, 9)

    dedup.sort(key=lambda r: (r[0], method_order(r[1])))

    missing_baluarte = [r for r in dedup if not r[3]]
    missing_admin = [r for r in dedup if not r[4]]

    print("# API Coverage (baluarte/admin)\n")
    print("Gerado automaticamente a partir de `api/src/main/java/com/igreja/api/controllers/*.java`.\n")
    print("Legenda: `✅` consumido / `❌` não consumido (por busca textual simples).\n")

    print("## Resumo\n")
    print(f"- Total de rotas detectadas: **{len(dedup)}**")
    print(f"- Sem uso em `baluarte/src`: **{len(missing_baluarte)}**")
    print(f"- Sem uso em `admin/src/main/java`: **{len(missing_admin)}**\n")

    print("## Tabela completa\n")
    print("| Método | Rota | Controller | baluarte | admin/java |")
    print("|---|---|---|---|---|")
    for full, http, ctrl, ub, ua in dedup:
        print(f"| `{http}` | `{full}` | `{ctrl}` | {'✅' if ub else '❌'} | {'✅' if ua else '❌'} |")


if __name__ == "__main__":
    main()

