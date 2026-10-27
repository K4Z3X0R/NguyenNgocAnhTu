#!/usr/bin/env python3
"""
Tự động đồng bộ và lọc trùng quy tắc tên miền từ upstream cho bộ Rules của NguyenNgocAnhTu.
Hỗ trợ chạy định kỳ qua GitHub Actions hoặc chạy cục bộ.
"""

from __future__ import annotations
import argparse
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RULES_DIR = ROOT / "Rules"

SOURCES = [
    ("HostVN_Threat", "https://raw.githubusercontent.com/bigdargon/hostsVN/master/extensions/threat/domain.txt"),
]

def fetch_domains(url: str, timeout: int = 15) -> set[str]:
    print(f"📥 Đang tải dữ liệu từ {url}...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
            domains = set()
            for line in content.splitlines():
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split()
                domain = parts[-1].lower()
                if "." in domain and not domain.startswith("*.") and not domain.endswith("."):
                    domains.add(domain)
            print(f"  ✓ Đã trích xuất {len(domains)} tên miền hợp lệ.")
            return domains
    except Exception as e:
        print(f"  ⚠️ Không thể tải {url}: {e}")
        return set()

def sync_rules(dry_run: bool = False) -> int:
    ads_file = RULES_DIR / "Ads.list"
    if not ads_file.exists():
        print("❌ Không tìm thấy Rules/Ads.list")
        return 1

    current_lines = ads_file.read_text(encoding="utf-8").splitlines()
    existing_domains = set()
    for line in current_lines:
        line_clean = line.strip()
        if line_clean.startswith("DOMAIN-SUFFIX,"):
            existing_domains.add(line_clean.replace("DOMAIN-SUFFIX,", "").strip().lower())
        elif line_clean.startswith("DOMAIN,"):
            existing_domains.add(line_clean.replace("DOMAIN,", "").strip().lower())

    print(f"📊 Hiện tại có {len(existing_domains)} tên miền trong Rules/Ads.list.")

    all_new_domains = set()
    for name, url in SOURCES:
        upstream_domains = fetch_domains(url)
        new_for_src = upstream_domains - existing_domains
        print(f"  → Nguồn {name}: {len(new_for_src)} tên miền mới chưa có trong Rules.")
        all_new_domains.update(new_for_src)

    if not all_new_domains:
        print("✅ Rules/Ads.list đã hoàn toàn đồng bộ với upstream. Không có thay đổi.")
        return 0

    print(f"🚀 Tổng cộng phát hiện {len(all_new_domains)} tên miền mới.")

    if dry_run:
        print("ℹ️ Chế độ Dry-Run: Không ghi thay đổi vào file.")
        return 0

    # Lấy mẫu 20 domain rủi ro cao nhất hoặc bổ sung có giới hạn
    sample_to_add = sorted(list(all_new_domains))[:30]
    new_entries = [f"DOMAIN-SUFFIX,{d}" for d in sample_to_add]

    with open(ads_file, "a", encoding="utf-8") as f:
        f.write("\n# --- Auto-Synced Upstream Threat & Ad Domains ---\n")
        for entry in new_entries:
            f.write(entry + "\n")

    print(f"✅ Đã ghi thành công {len(new_entries)} quy tắc mới vào {ads_file.name}.")
    return 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Auto-sync upstream rules")
    parser.add_argument("--dry-run", action="store_true", help="Chỉ kiểm tra, không sửa file")
    args = parser.parse_args()
    sys.exit(sync_rules(dry_run=args.dry_run))
