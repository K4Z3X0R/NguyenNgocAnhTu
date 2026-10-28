#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • DNS Profile Generator (v5.0.0 - Sovereign Apex Edition)
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Hồ sơ cấu hình chuẩn Apple com.apple.dnsSettings.managed + Root CA:
- Sử dụng SupplementalMatchDomains: CHỈ định tuyến đúng các domain cần can thiệp cho Locket Gold:
  + Locket Gold Entitlement: api.revenuecat.com, app.revenuecat.com, revenuecat.com
  + Locket Remote Config (Video 45s, Camera Filters, Weather Overlays, Mic): firebaseremoteconfig.googleapis.com, firebaseremoteconfigrealtime.googleapis.com
  + Locket Cloud Functions: us-central1-locket-4252a.cloudfunctions.net
- TOÀN BỘ KẾT NỐI KHÁC (Zalo, Spotify, YouTube, Facebook, Google, v.v.):
  + Chạy 100% qua DNS gốc của mạng người dùng (ISP DNS / Viettel / VNPT / FPT).
  + MIỄN NHIỄM 100% lỗi delay tin nhắn Zalo 5s, thông báo push realtime tức thì.
  + MIỄN NHIỄM 100% lỗi Spotify "báo mất mạng", nghe nhạc streaming mượt mà.
  + Tải ảnh và xem ảnh Locket qua locket-img và Google Storage tốc độ tối đa không qua VPS.
- Máy chủ DoH Singapore: https://13.229.210.222.sslip.io/dns-query
"""

from __future__ import annotations
import base64
from pathlib import Path
import plistlib
import uuid

ROOT = Path(__file__).resolve().parents[2]

# Embedded Anh Tu VIP Apex Root CA DER Base64 (Valid 2026-2036)
CA_DER_B64 = "MIID4DCCAsigAwIBAgIUdj3vam8f7OlZReH+kWjBuEZLG9cwDQYJKoZIhvcNAQELBQAwgYcxCzAJBgNVBAYTAlZOMQ4wDAYDVQQIDAVIYW5vaTEOMAwGA1UEBwwFSGFub2kxGzAZBgNVBAoMEk5ndXllbiBOZ29jIEFuaCBUdTEZMBcGA1UECwwQVklQIEFwZXggU3lzdGVtczEgMB4GA1UEAwwXQW5oIFR1IFZJUCBBcGV4IFJvb3QgQ0EwHhcNMjYxMDI3MTMxMTA5WhcNMzYxMDI1MTMxMTA5WjCBhzELMAkGA1UEBhMCVk4xDjAMBgNVBAgMBUhhbm9pMQ4wDAYDVQQHDAVIYW5vaTEbMBkGA1UECgwSTmd1eWVuIE5nb2MgQW5oIFR1MRkwFwYDVQQLDBBWSVAgQXBleCBTeXN0ZW1zMSAwHgYDVQQDDBdBbmggVHUgVklQIEFwZXggUm9vdCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALqRQVQho9CzccgA8XTaBpCDLiKgk2Cy3buuf5bJUG8CNMPOFgJw8Za4xl/AhQPhmBh0/vqFW18JDSN+l7TWQvst4SfNAXBZphb9OvVJiNflk6imGKTlMoGjUSczdn7AbDOEQxNw7JjWb6Ul6LxloVtF2mdhtYYRHXEvt1AjiTLWAlIGJxK8TXOsU8eVyQpr8cpdHh+3Jzh++Lg7CUONJi/6y94ZhsNp4iQbeZRRCgpefumNPBf3WHV27EOqLI9MgsxZlZEjTwChblz9QKSejFYtVeZVd2grDKTTCgTJW7NTaViPAwvfwWkkJuAdDTCUtbVKXj7GwMT1Wvx+s1ji41sCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFIRohgmdgC9M5n1bxK8U6NuqQzBpMA0GCSqGSIb3DQEBCwUAA4IBAQBXiiRoc5MsL1UESg/P8VgsoL+ap/7RUuZkXtAu2N9h+OuJETDoxGqEeRhdyhIZgmEj7N8M3D0fX+BHm6ZBLZbYTYS3QNNfxdS5KYHkDdZy8UxWtR/2vvjNPUHIWjpLobQqNuFW9ONkHgOPl3KDaV8FyFhVa7/uhh3PR2jbeMGQ3zLa0/1zpgEtSZuU5HmmeVd6y7U5ZcB6re8QvpNUekYPAaa0DlEv6TyIu4/zfOy/wlhsI9Qw9lHrhVsQyL5I26oYiBz14+Tp1WtGyQS9PeXlplp2CqnEa3TKUJWxr8qe+SvJS8Y7UiUI2qzzBST8yBrGYvxUCYcO4DVAfHKCvmgW"

# Danh sách SupplementalMatchDomains tinh giản tối đa - CHỈ can thiệp Locket Gold
# Tuyệt đối KHÔNG chứa Spotify, YouTube, hay Google Storage/Auth để tránh lỗi mạng và delay Zalo
MATCH_DOMAINS = [
    "api.revenuecat.com",
    "app.revenuecat.com",
    "revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    "firebaseremoteconfigrealtime.googleapis.com",
    "us-central1-locket-4252a.cloudfunctions.net"
]

SERVER_HOST = "13.229.210.222"
SERVER_URL = f"https://{SERVER_HOST}.sslip.io/dns-query"


def build_profile_dict(display_name: str | None = None) -> dict:
    top_uuid = str(uuid.uuid4()).upper()
    ca_uuid = str(uuid.uuid4()).upper()
    dns_uuid = str(uuid.uuid4()).upper()

    name = display_name or "👑 Anh Tú • DNS Locket Gold VIP 2099 (Video 45s + Full Filters & Mic)"

    ca_der_bytes = base64.b64decode(CA_DER_B64)

    return {
        "PayloadDisplayName": name,
        "PayloadDescription": (
            "Cấu hình DNS DoH Locket Gold 2099: Video 45s, Toàn bộ Camera Filters, "
            "Weather Overlays & Mic ghi âm • Không lag Zalo 5s, Không mất mạng Spotify • "
            "Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze)"
        ),
        "PayloadIdentifier": "com.anhtu.dns.locketgold.v5",
        "PayloadOrganization": "Nguyễn Ngọc Anh Tú (K4Z3X0R)",
        "PayloadRemovalDisallowed": False,
        "PayloadType": "Configuration",
        "PayloadUUID": top_uuid,
        "PayloadVersion": 1,
        "PayloadContent": [
            # 1. ROOT CA CERTIFICATE (Kích hoạt SSL Interception cho Locket Gold & Firebase Remote Config)
            {
                "PayloadType": "com.apple.security.root",
                "PayloadVersion": 1,
                "PayloadIdentifier": "com.anhtu.rootca",
                "PayloadUUID": ca_uuid,
                "PayloadDisplayName": "Anh Tú VIP Apex Root CA",
                "PayloadDescription": "Chứng chỉ gốc bảo mật kích hoạt Locket Gold VIP 2099 - Nguyễn Ngọc Anh Tú",
                "PayloadContent": ca_der_bytes,
            },
            # 2. DNS-OVER-HTTPS PROFILE CHUẨN APPLE VỚI SupplementalMatchDomains TINH GỌN
            {
                "PayloadType": "com.apple.dnsSettings.managed",
                "PayloadVersion": 1,
                "PayloadIdentifier": "com.anhtu.dns.managed",
                "PayloadUUID": dns_uuid,
                "PayloadDisplayName": "⚡ Anh Tú Apex DoH (Singapore)",
                "PayloadDescription": "Mã hóa DNS-over-HTTPS tốc độ cao qua máy chủ VPS Singapore của Tú",
                "DNSSettings": {
                    "DNSProtocol": "HTTPS",
                    "ServerURL": SERVER_URL,
                    "ServerAddresses": [SERVER_HOST],
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


def generate_mobileconfig(output_path: Path, binary: bool = True) -> None:
    profile_dict = build_profile_dict()
    fmt = plistlib.FMT_BINARY if binary else plistlib.FMT_XML
    with open(output_path, "wb") as fp:
        plistlib.dump(profile_dict, fp, fmt=fmt)

    fmt_name = "Apple Binary Plist (bplist00)" if binary else "Apple XML Plist"
    print(f"✅ Đã tạo cấu hình thành công ({fmt_name}): {output_path}")

    # Kiểm tra tính hợp lệ bằng plistlib
    with open(output_path, "rb") as fp:
        loaded = plistlib.load(fp)
    assert "PayloadContent" in loaded, "Lỗi: Không tìm thấy PayloadContent!"
    assert len(loaded["PayloadContent"]) == 2, "Lỗi: Phải có đủ Root CA và DNSSettings!"
    print(f"✅ Kiểm định Plist Parse: Hợp lệ 100% ({len(MATCH_DOMAINS)} SupplementalMatchDomains)")


if __name__ == "__main__":
    out_file = ROOT / "DNS.mobileconfig"
    generate_mobileconfig(out_file, binary=True)
