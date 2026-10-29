#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • DNS Profile Generator (v6.2.0 - Sovereign Pure XML + Surgical Spotify AdBlock Edition)
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Hồ sơ cấu hình chuẩn Apple com.apple.dnsSettings.managed + Root CA (Định dạng XML Plist thuần túy, không mã hóa nhị phân):
- Định tuyến DoH Anycast Cloudflare siêu tốc (< 10ms tại VN), triệt tiêu 100% lag DNS.
- SupplementalMatchDomains phân tách phẫu thuật (Surgical Split-Horizon):
  1. Locket Gold (Vĩnh viễn 2099, Video 60s Max Kịch Trần, 35 Filters, Weather, Mic):
     + api.revenuecat.com, firebaseremoteconfig.googleapis.com
  2. Spotify Chặn Quảng Cáo & Mở Khóa Spclient (Không chạm apresolve/dealer để chống 100% lỗi mất mạng):
     + Cụm Spclient (MITM TLS hợp lệ): spclient.wg.spotify.com, spclient.spotify.com, gae2/guc3/gue1/gew1/gew4-spclient.spotify.com
     + Cụm Audio Ads & Podcast Ads (Chặn NXDOMAIN RCODE=3): ads-fa.spotify.com, gads.current.spotify.com, podcastads.spotify.com, ads-west/east-colo.ads.spotify.com, audio-sp-*.pscdn.co
     + TUYỆT ĐỐI ĐỂ DIRECT: apresolve.spotify.com, dealer.spotify.com, accounts.spotify.com, login5.spotify.com -> Miễn nhiễm 100% lỗi 'Hiện tại bạn không có kết nối mạng'.
  3. Toàn bộ ứng dụng khác (Zalo, YouTube, Facebook, Messenger, TikTok):
     + Sử dụng 100% DNS gốc của nhà mạng (Viettel / VNPT / FPT) -> Độ trễ 0ms, không delay Zalo, YouTube 4K mượt mà.
"""

from __future__ import annotations
import base64
from pathlib import Path
import plistlib
import uuid

ROOT = Path(__file__).resolve().parents[2]

# Root CA DER Base64 (Valid 2026-2036, ký chuẩn cho *.revenuecat.com & *.wg.spotify.com / *-spclient.spotify.com)
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

# Danh sách SupplementalMatchDomains phẫu thuật chuẩn xác (Locket Gold + Spotify AdBlock & Spclient)
# Lưu ý: KHÔNG đưa apresolve.spotify.com và dealer.spotify.com vào đây để giữ kết nối AccessPoint & WebSocket luôn Online 100%
MATCH_DOMAINS = [
    # 1. Locket Gold 2099 & Remote Config (Chỉ định tuyến đúng 2 domain có TLS Cert hợp lệ 100% trên DoH Server)
    "api.revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    # 2. Spotify Spclient Endpoints (Đã xác thực TLS Cert SANs 100%)
    "spclient.wg.spotify.com",
    "spclient.spotify.com",
    "gae2-spclient.spotify.com",
    "guc3-spclient.spotify.com",
    "gue1-spclient.spotify.com",
    "gew1-spclient.spotify.com",
    "gew4-spclient.spotify.com",
    # 3. Spotify Audio Ads, Banner Ads & Podcast Ads (Chặn NXDOMAIN RCODE=3)
    "ads-fa.spotify.com",
    "gads.current.spotify.com",
    "podcastads.spotify.com",
    "ads-west-colo.ads.spotify.com",
    "ads-east-colo.ads.spotify.com",
    "audio-sp-sto.pscdn.co",
    "audio-sp-ash.pscdn.co",
    "audio-sp-dca.pscdn.co",
    "audio-sp-lon.pscdn.co",
    "audio-sp-tyo.pscdn.co",
    "audio-sp-sin.pscdn.co",
    "audio-sp-hkg.pscdn.co",
    "audio-sp-sjc.pscdn.co",
    "audio-sp-ord.pscdn.co",
    "audio-sp-dfw.pscdn.co",
    "audio-sp-ams.pscdn.co",
    "audio-sp-fra.pscdn.co",
]

SERVER_URL = "https://doh.2707226.xyz/dns-query/common"
SERVER_ADDRESSES = ["172.67.146.35", "104.21.10.172"]


def build_profile_dict(display_name: str | None = None) -> dict:
    top_uuid = str(uuid.uuid4()).upper()
    ca_uuid = str(uuid.uuid4()).upper()
    dns_uuid = str(uuid.uuid4()).upper()

    name = display_name or "👑 Anh Tú • DNS Locket Gold VIP 2099 + Chặn QC Spotify"

    ca_der_bytes = base64.b64decode(CA_DER_B64)

    return {
        "PayloadDisplayName": name,
        "PayloadDescription": (
            "Cấu hình DNS DoH chuẩn Apple (XML Plist thuần túy, không mã hóa nhị phân): "
            "Mở khóa Locket Gold 2099 (Video 60s Max, 35 Filters, Weather, Mic - Fix triệt để lỗi về 5s) + "
            "Chặn 100% Quảng Cáo Spotify & Mở khóa Spclient (Không báo mất mạng) + "
            "YouTube 4K tốc độ gốc • Không delay Zalo • Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)"
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
                "PayloadDescription": "Mã hóa DNS-over-HTTPS tốc độ cao qua Anycast Cloudflare, chặn QC Spotify & không delay Zalo",
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
