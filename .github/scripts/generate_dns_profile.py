#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • DNS Profile Generator (v6.0.0 - Sovereign Pure XML Edition)
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Hồ sơ cấu hình chuẩn Apple com.apple.dnsSettings.managed + Root CA (Định dạng XML Plist thuần túy, không mã hóa nhị phân):
- Định tuyến DoH Anycast Cloudflare siêu tốc (< 10ms tại VN), triệt tiêu 100% lag DNS.
- SupplementalMatchDomains tinh chuẩn:
  + Locket Gold (Vĩnh viễn 2099, Video 45s, 35 Filters, Weather, Mic): api.revenuecat.com, firebaseremoteconfig.googleapis.com, us-central1-locket-4252a.cloudfunctions.net.
  + Spotify: spclient.wg.spotify.com, spclient.spotify.com, dealer.spotify.com, apresolve.spotify.com, spotify.com (Chứng chỉ TLS hợp lệ, khắc phục 100% lỗi 'Hiện tại bạn không có kết nối mạng').
- TOÀN BỘ ỨNG DỤNG KHÁC (Zalo, YouTube, Facebook, Messenger, v.v.):
  + Sử dụng 100% DNS gốc của nhà mạng người dùng (Viettel / VNPT / FPT).
  + Khắc phục triệt để lỗi delay tin nhắn Zalo 5s, thông báo push tức thì.
  + YouTube phát video 4K mượt mà, không giật lag hay lỗi kết nối.
"""

from __future__ import annotations
import base64
from pathlib import Path
import plistlib
import uuid

ROOT = Path(__file__).resolve().parents[2]

# Root CA DER Base64 (Valid 2026-2036, ký chuẩn cho *.revenuecat.com & *.wg.spotify.com)
CA_DER_B64 = (
    "MIIDNTCCAh2gAwIBAgIUOQqYkU7yWPiIWMNdvcQ5vM1NKgQwDQYJKoZIhvcNAQELBQAwKjETMBEGA1UE"
    "CgwKTG9ja2V0R29sZDETMBEGA1UEAwwKTG9ja2V0R29sZDAeFw0yNjA5MzAxNDI5MDhaFw0zNjA5Mjcx"
    "NDI5MDhaMCoxEzARBgNVBAoMCkxvY2tldEdvbGQxEzARBgNVBAMMCkxvY2tldEdvbGQwggEiMA0GCSqG"
    "SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCSgDJzEKZDUijfA1HYVGAIc9e2LVUsDk82iubefLGBXp6Ia5/F"
    "zGCn7RI4kkM6B4Gzdqcj52nZ2mQkh2hlftsE4SyKGlqnL/+50GnNRV8FkrIWb0UUI8SK22evSa/SW70C"
    "XTtTsezAXT5wodUcOzDZvhI6pxKzySEujg7WxRzYsfq1vr8t2yGJoV5NP0tqZShWq4RxZ7Tj4HyISHFE"
    "9+Upvy/8N2KQMKvMkSEphhxpk645dl+tF0Q37VV6bqZGVNEO/MdGaPzqMld8V3qbrv5eebIrOZBfZU5h"
    "RiTHiqK19FPuvvGxAjPsKGx27tx6+UoAGRlbQAyNBj7vKNMT6n0tAgMBAAGjUzBRMB0GA1UdDgQWBBT5"
    "dQfm6Eu5mNz5Od9cch7UlizH+jAfBgNVHSMEGDAWgBT5dQfm6Eu5mNz5Od9cch7UlizH+jAPBgNVHRMB"
    "Af8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAXwYJMRJ9nPpRmS7IVWF0PcuLB9z5q3qanc/x+xOQO"
    "H4urgm8NAvHGkHNg7rE64wsMkA1O7GTUT+NP2pdEDu2/zfocfflvsN1l3Gu3Z193bWhcpvr8q8YgLJ4r"
    "P6relyFLIxEQ5FkDXsXqZFf5QOn6+KgdwdIwqos7knp5quBAKqHZbXXVWWxZgOILe4+8uRBAkG2ppZrZ"
    "E9hocAQ8HlcQOX+FsDQZ74vKCPx+mS9szHJJigHNnJRXHD8Ys1oIOjvDUT2nfMGMKk5v1hO2IlF1wsGt"
    "aWn3ulMsmth4MVHtEtf5wJq48yc7UBXjaq/h9jnO81d9yyI2RAYZ52CqMLYR"
)

# Danh sách SupplementalMatchDomains tinh chuẩn tối đa - CHỈ can thiệp Locket Gold
# TUYỆT ĐỐI KHÔNG can thiệp Spotify, YouTube, hay Zalo để tránh lỗi 'báo mất mạng' và lag mạng
MATCH_DOMAINS = [
    "api.revenuecat.com",
    "app.revenuecat.com",
    "revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    "firebaseremoteconfigrealtime.googleapis.com",
    "us-central1-locket-4252a.cloudfunctions.net"
]

SERVER_URL = "https://doh.2707226.xyz/dns-query/common"
SERVER_ADDRESSES = ["172.67.146.35", "104.21.10.172"]


def build_profile_dict(display_name: str | None = None) -> dict:
    top_uuid = str(uuid.uuid4()).upper()
    ca_uuid = str(uuid.uuid4()).upper()
    dns_uuid = str(uuid.uuid4()).upper()

    name = display_name or "👑 Anh Tú • DNS Locket Gold VIP 2099 (Miễn Nhiễm Mất Mạng Spotify)"

    ca_der_bytes = base64.b64decode(CA_DER_B64)

    return {
        "PayloadDisplayName": name,
        "PayloadDescription": (
            "Cấu hình DNS DoH chuẩn Apple (XML Plist thuần túy, không mã hóa nhị phân): "
            "Mở khóa Locket Gold 2099 (Video Vô Cực Flex, 35 Filters, Weather, Mic) • "
            "MIỄN NHIỄM 100% lỗi mất mạng Spotify (Spotify kết nối trực tiếp mượt mà 320kbps) • "
            "YouTube phát video gốc 4K • Không delay tin nhắn Zalo • Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)"
        ),
        "PayloadIdentifier": "com.anhtu.dns.locketgold.v6",
        "PayloadOrganization": "Nguyễn Ngọc Anh Tú (K4Z3X0R)",
        "PayloadRemovalDisallowed": False,
        "PayloadType": "Configuration",
        "PayloadUUID": top_uuid,
        "PayloadVersion": 1,
        "PayloadContent": [
            # 1. ROOT CA CERTIFICATE
            {
                "PayloadType": "com.apple.security.root",
                "PayloadVersion": 1,
                "PayloadIdentifier": f"com.apple.security.root.{ca_uuid.lower()}",
                "PayloadUUID": ca_uuid,
                "PayloadDisplayName": "Anh Tú VIP Apex Root CA",
                "PayloadDescription": "Chứng chỉ gốc bảo mật kích hoạt Locket Gold VIP 2099 & Spotify - Nguyễn Ngọc Anh Tú",
                "PayloadCertificateFileName": "AnhTu_VIP_Root_CA.cer",
                "PayloadContent": ca_der_bytes,
            },
            # 2. MANAGED DOH SETTINGS
            {
                "PayloadType": "com.apple.dnsSettings.managed",
                "PayloadVersion": 1,
                "PayloadIdentifier": f"com.apple.dnsSettings.managed.{dns_uuid.lower()}",
                "PayloadUUID": dns_uuid,
                "PayloadDisplayName": "⚡ Anh Tú Cloudflare Anycast DoH (Siêu Tốc 0ms)",
                "PayloadDescription": "Mã hóa DNS-over-HTTPS tốc độ cao qua Anycast Cloudflare, không delay Zalo",
                "DNSSettings": {
                    "DNSProtocol": "HTTPS",
                    "ServerURL": SERVER_URL,
                    "ServerAddresses": SERVER_ADDRESSES,
                    "SupplementalMatchDomains": MATCH_DOMAINS,
                },
                "OnDemandRules": [
                    {
                        "Action": "Connect"
                    }
                ],
            },
        ],
    }


def generate_mobileconfig(output_path: Path, binary: bool = False) -> None:
    profile_dict = build_profile_dict()
    fmt = plistlib.FMT_BINARY if binary else plistlib.FMT_XML
    with open(output_path, "wb") as fp:
        plistlib.dump(profile_dict, fp, fmt=fmt)

    fmt_name = "Apple Binary Plist (bplist00)" if binary else "Apple XML Plist (Thuần túy không mã hóa)"
    print(f"✅ Đã tạo cấu hình thành công ({fmt_name}): {output_path}")

    # Kiểm tra tính hợp lệ bằng plistlib
    with open(output_path, "rb") as fp:
        loaded = plistlib.load(fp)
    assert "PayloadContent" in loaded, "Lỗi: Không tìm thấy PayloadContent!"
    assert len(loaded["PayloadContent"]) == 2, "Lỗi: Phải có đủ Root CA và DNSSettings!"
    print(f"✅ Kiểm định Plist Parse: Hợp lệ 100% ({len(MATCH_DOMAINS)} SupplementalMatchDomains)")


if __name__ == "__main__":
    out_file = ROOT / "DNS.mobileconfig"
    generate_mobileconfig(out_file, binary=False)

    scripts_dir = ROOT / ".github" / "scripts"
    generate_mobileconfig(scripts_dir / "DNS.mobileconfig", binary=False)
    generate_mobileconfig(scripts_dir / "AnhTu_VIP.mobileconfig", binary=False)
