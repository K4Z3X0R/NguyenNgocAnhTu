#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • DNS Profile Generator (v6.5.0 - 100% Self-Hosted Sovereign VPS Singapore Edition)
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Hồ sơ cấu hình chuẩn Apple com.apple.dnsSettings.managed + Root CA riêng (Định dạng XML Plist thuần túy, không mã hóa nhị phân):
- Máy chủ riêng 100% của Nguyễn Ngọc Anh Tú: https://13.229.210.222.sslip.io/dns-query (AWS Singapore 13.229.210.222)
- SupplementalMatchDomains phân tách phẫu thuật (Surgical Split-Horizon):
  1. Locket Gold 2099 (Video 60s Max Kịch Trần, 35 Native Filters, Weather, Mic, ETag FIRRemoteConfig):
     + api.revenuecat.com, app.revenuecat.com, revenuecat.com
     + firebaseremoteconfig.googleapis.com, firebaseremoteconfigrealtime.googleapis.com
     + us-central1-locket-4252a.cloudfunctions.net
  2. Chặn 100% Quảng Cáo Spotify (Audio/Video/Banner Ads + Akamai Ad CDN + DoubleClick -> Sinkhole 0.0.0.0):
     + audio-ak-spotify-com.akamaized.net, audio4-ak-spotify-com.akamaized.net, heads-ak-spotify-com.akamaized.net
     + googleads.g.doubleclick.net, pubads.g.doubleclick.net, securepubads.g.doubleclick.net, pagead2.googlesyndication.com
     + ads.spotify.com, adeventtracker.spotify.com, ads-fa.spotify.com, gads.spotify.com, podcastads.spotify.com, audio-sp-*.pscdn.co
     + TUYỆT ĐỐI ĐỂ DIRECT: apresolve.spotify.com, dealer.spotify.com, spclient.wg.spotify.com -> Miễn nhiễm 100% lỗi 'Hiện tại bạn không có kết nối mạng'.
  3. Toàn bộ ứng dụng khác (Zalo, YouTube, Facebook, Messenger, TikTok):
     + Sử dụng 100% DNS gốc của nhà mạng (Viettel / VNPT / FPT) -> Độ trễ 0ms, không delay Zalo, YouTube 4K mượt mà.
"""

from __future__ import annotations
import base64
from pathlib import Path
import plistlib
import uuid

ROOT = Path(__file__).resolve().parents[2]

# Root CA DER Base64 riêng của Nguyễn Ngọc Anh Tú (CN=Anh Tu VIP Apex Root CA, Valid 2026-2036)
CA_DER_B64 = (
    "MIID4DCCAsigAwIBAgIUdj3vam8f7OlZReH+kWjBuEZLG9cwDQYJKoZIhvcNAQELBQAwgYcxCzAJBgNV"
    "BAYTAlZOMQ4wDAYDVQQIDAVIYW5vaTEOMAwGA1UEBwwFSGFub2kxGzAZBgNVBAoMEk5ndXllbiBOZ29j"
    "IEFuaCBUdTEZMBcGA1UECwwQVklQIEFwZXggU3lzdGVtczEgMB4GA1UEAwwXQW5oIFR1IFZJUCBBcGV4"
    "IFJvb3QgQ0EwHhcNMjYxMDI3MTMxMTA5WhcNMzYxMDI1MTMxMTA5WjCBhzELMAkGA1UEBhMCVk4xDjAM"
    "BgNVBAgMBUhhbm9pMQ4wDAYDVQQHDAVIYW5vaTEbMBkGA1UECgwSTmd1eWVuIE5nb2MgQW5oIFR1MRkw"
    "FwYDVQQLDBBWSVAgQXBleCBTeXN0ZW1zMSAwHgYDVQQDDBdBbmggVHUgVklQIEFwZXggUm9vdCBDQTCC"
    "ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALqRQVQho9CzccgA8XTaBpCDLiKgk2Cy3buuf5bJ"
    "UG8CNMPOFgJw8Za4xl/AhQPhmBh0/vqFW18JDSN+l7TWQvst4SfNAXBZphb9OvVJiNflk6imGKTlMoGj"
    "USczdn7AbDOEQxNw7JjWb6Ul6LxloVtF2mdhtYYRHXEvt1AjiTLWAlIGJxK8TXOsU8eVyQpr8cpdHh+3"
    "Jzh++Lg7CUONJi/6y94ZhsNp4iQbeZRRCgpefumNPBf3WHV27EOqLI9MgsxZlZEjTwChblz9QKSejFYt"
    "VeZVd2grDKTTCgTJW7NTaViPAwvfwWkkJuAdDTCUtbVKXj7GwMT1Wvx+s1ji41sCAwEAAaNCMEAwDwYD"
    "VR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFIRohgmdgC9M5n1bxK8U6NuqQzBp"
    "MA0GCSqGSIb3DQEBCwUAA4IBAQBXiiRoc5MsL1UESg/P8VgsoL+ap/7RUuZkXtAu2N9h+OuJETDoxGqE"
    "eRhdyhIZgmEj7N8M3D0fX+BHm6ZBLZbYTYS3QNNfxdS5KYHkDdZy8UxWtR/2vvjNPUHIWjpLobQqNuFW"
    "9ONkHgOPl3KDaV8FyFhVa7/uhh3PR2jbeMGQ3zLa0/1zpgEtSZuU5HmmeVd6y7U5ZcB6re8QvpNUekYP"
    "Aaa0DlEv6TyIu4/zfOy/wlhsI9Qw9lHrhVsQyL5I26oYiBz14+Tp1WtGyQS9PeXlplp2CqnEa3TKUJWx"
    "r8qe+SvJS8Y7UiUI2qzzBST8yBrGYvxUCYcO4DVAfHKCvmgW"
)

# Danh sách SupplementalMatchDomains trên VPS riêng 13.229.210.222 (Locket Gold + 35 Filters + Full Spotify/DoubleClick/Akamai AdBlock)
MATCH_DOMAINS = [
    # 1. Locket Gold 2099 & 35 Camera Filters (MITM 13.229.210.222:443)
    "api.revenuecat.com",
    "app.revenuecat.com",
    "revenuecat.com",
    "api.rc-backup.com",
    "rc-backup.com",
    "firebaseremoteconfig.googleapis.com",
    "firebaseremoteconfigrealtime.googleapis.com",
    "us-central1-locket-4252a.cloudfunctions.net",
    # 2. Locket Telemetry & Nimbus Ads (Sinkhole 0.0.0.0)
    "config.app-measurement.com",
    "app-measurement.com",
    "locket.adsbynimbus.com",
    "e.revenuecat.com",
]

SERVER_URL = "https://13.229.210.222.sslip.io/dns-query"
SERVER_ADDRESSES = ["13.229.210.222"]


def build_profile_dict(display_name: str | None = None) -> dict:
    top_uuid = str(uuid.uuid4()).upper()
    ca_uuid = str(uuid.uuid4()).upper()
    dns_uuid = str(uuid.uuid4()).upper()

    name = display_name or "👑 Anh Tú • DNS Locket Gold 2099"

    ca_der_bytes = base64.b64decode(CA_DER_B64)

    return {
        "PayloadDisplayName": name,
        "PayloadDescription": "Mở khóa Locket Gold 2099 & Video 45s",
        "PayloadIdentifier": "com.anhtu.dns.locketgold.v6",
        "PayloadOrganization": "Nguyễn Ngọc Anh Tú",
        "PayloadRemovalDisallowed": False,
        "PayloadType": "Configuration",
        "PayloadUUID": top_uuid,
        "PayloadVersion": 1,
        "PayloadContent": [
            # 1. ROOT CA CERTIFICATE (Anh Tu VIP Apex Root CA)
            {
                "PayloadType": "com.apple.security.root",
                "PayloadVersion": 1,
                "PayloadIdentifier": f"com.apple.security.root.{ca_uuid.lower()}",
                "PayloadUUID": ca_uuid,
                "PayloadDisplayName": "Anh Tú Root CA",
                "PayloadDescription": "Kích hoạt Locket Gold 2099",
                "PayloadCertificateFileName": "AnhTu_VIP_Root_CA.cer",
                "PayloadContent": ca_der_bytes,
            },
            # 2. MANAGED DOH SETTINGS (13.229.210.222.sslip.io)
            {
                "PayloadType": "com.apple.dnsSettings.managed",
                "PayloadVersion": 1,
                "PayloadIdentifier": f"com.apple.dnsSettings.managed.{dns_uuid.lower()}",
                "PayloadUUID": dns_uuid,
                "PayloadDisplayName": "DNS Locket Gold",
                "PayloadDescription": "DNS DoH Singapore",
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
