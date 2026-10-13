"""Public text safety gate; mock server loopback is not a household address."""
import re
import subprocess
from pathlib import Path

patterns = [r"\b(?:\d{1,3}\.){3}\d{1,3}\b", r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----",
    r"\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}", r"op://",
    r"(?i)(?:local_key|client_secret|access_token|password)\s*[=:]\s*['\"][^'\"]{6,}['\"]",
    r"(?i)nyx|yoolax|/config/\.storage/core\.config_entries"]
files = subprocess.check_output(["git", "ls-files", "-z"]).decode().split("\0")
for name in filter(None, files):
    if name == "scripts/check_public.py" or name.endswith(".png"):
        continue
    text = Path(name).read_text()
    if name == "tests/server.mjs":
        text = text.replace('"127.0.0.1"', '"synthetic_loopback"')
    if any(re.search(p, text) for p in patterns):
        raise SystemExit(f"{name}: sensitive-pattern match")
print("Public-file pattern check passed; manual fixture provenance review also required.")
