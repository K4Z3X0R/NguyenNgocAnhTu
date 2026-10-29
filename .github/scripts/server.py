#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • Apex DNS & Mock Suite: Unified DoH + HTTPS Interceptor Server (v5.0.0)
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Tính năng lõi:
1. RFC 8484 DoH Engine: Hỗ trợ GET /dns-query?dns=... và POST /dns-query.
2. Wire-format DNS Manipulation:
   - Spoof A record (Type 1) cho RevenueCat & Locket Firebase Remote Config về VPS IP.
   - Stripping Type 28 (AAAA - IPv6) -> Trả về NOERROR (0 Answer) bẻ gãy Happy Eyeballs của iOS.
   - Stripping Type 65 (HTTPS/SVCB) -> Trả về NOERROR (0 Answer) triệt tiêu ECH & HTTP/3.
   - Null-routing (0.0.0.0) quảng cáo & tracking.
   - Forwarding tên miền khác về Upstream DNS (1.1.1.1 / 8.8.8.8) với độ trễ siêu thấp.
3. Mock HTTPS Engine (Port 443):
   - RevenueCat: Mở khóa Locket Gold vĩnh viễn đến năm 2099 (cả GET & POST).
   - Firebase Remote Config: Ép video duration 45s, kích hoạt toàn bộ 28 danh mục bộ lọc (Hello Kitty, Shin, Aesthetic), Thời tiết & Mic ghi âm.
   - Tự động kiểm tra và sinh/trích xuất chứng chỉ SSL (Self-Healing Certs) nếu thiếu.
4. HTTP Server (Port 80): Cung cấp file .mobileconfig và CA root cert cho thiết bị.
5. MIỄN NHIỄM 100% delay Zalo 5s & KHÔNG động chạm Spotify (Spotify kết nối trực tiếp, mượt mà).
"""

from __future__ import annotations
import base64
import json
import os
from pathlib import Path
import plistlib
import socket
import ssl
import struct
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from typing import Set, Tuple
import urllib.parse
import uuid

BASE_DIR = Path(__file__).resolve().parent
CERTS_DIR = BASE_DIR / "certs"

SERVER_IP = os.environ.get("SERVER_IP", "13.229.210.222")
UPSTREAM_DNS_LIST = [os.environ.get("UPSTREAM_DNS", "1.1.1.1"), "8.8.8.8", "9.9.9.9"]
UPSTREAM_PORT = int(os.environ.get("UPSTREAM_PORT", "53"))
HTTPS_PORT = int(os.environ.get("HTTPS_PORT", "443"))
HTTP_PORT = int(os.environ.get("HTTP_PORT", "80"))

# Embedded Anh Tu VIP Apex Root CA DER Base64 (Valid 2026-2036)
EMBEDDED_CA_DER_B64 = "MIID4DCCAsigAwIBAgIUdj3vam8f7OlZReH+kWjBuEZLG9cwDQYJKoZIhvcNAQELBQAwgYcxCzAJBgNVBAYTAlZOMQ4wDAYDVQQIDAVIYW5vaTEOMAwGA1UEBwwFSGFub2kxGzAZBgNVBAoMEk5ndXllbiBOZ29jIEFuaCBUdTEZMBcGA1UECwwQVklQIEFwZXggU3lzdGVtczEgMB4GA1UEAwwXQW5oIFR1IFZJUCBBcGV4IFJvb3QgQ0EwHhcNMjYxMDI3MTMxMTA5WhcNMzYxMDI1MTMxMTA5WjCBhzELMAkGA1UEBhMCVk4xDjAMBgNVBAgMBUhhbm9pMQ4wDAYDVQQHDAVIYW5vaTEbMBkGA1UECgwSTmd1eWVuIE5nb2MgQW5oIFR1MRkwFwYDVQQLDBBWSVAgQXBleCBTeXN0ZW1zMSAwHgYDVQQDDBdBbmggVHUgVklQIEFwZXggUm9vdCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALqRQVQho9CzccgA8XTaBpCDLiKgk2Cy3buuf5bJUG8CNMPOFgJw8Za4xl/AhQPhmBh0/vqFW18JDSN+l7TWQvst4SfNAXBZphb9OvVJiNflk6imGKTlMoGjUSczdn7AbDOEQxNw7JjWb6Ul6LxloVtF2mdhtYYRHXEvt1AjiTLWAlIGJxK8TXOsU8eVyQpr8cpdHh+3Jzh++Lg7CUONJi/6y94ZhsNp4iQbeZRRCgpefumNPBf3WHV27EOqLI9MgsxZlZEjTwChblz9QKSejFYtVeZVd2grDKTTCgTJW7NTaViPAwvfwWkkJuAdDTCUtbVKXj7GwMT1Wvx+s1ji41sCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFIRohgmdgC9M5n1bxK8U6NuqQzBpMA0GCSqGSIb3DQEBCwUAA4IBAQBXiiRoc5MsL1UESg/P8VgsoL+ap/7RUuZkXtAu2N9h+OuJETDoxGqEeRhdyhIZgmEj7N8M3D0fX+BHm6ZBLZbYTYS3QNNfxdS5KYHkDdZy8UxWtR/2vvjNPUHIWjpLobQqNuFW9ONkHgOPl3KDaV8FyFhVa7/uhh3PR2jbeMGQ3zLa0/1zpgEtSZuU5HmmeVd6y7U5ZcB6re8QvpNUekYPAaa0DlEv6TyIu4/zfOy/wlhsI9Qw9lHrhVsQyL5I26oYiBz14+Tp1WtGyQS9PeXlplp2CqnEa3TKUJWxr8qe+SvJS8Y7UiUI2qzzBST8yBrGYvxUCYcO4DVAfHKCvmgW"

EMBEDDED_CA_CRT = """-----BEGIN CERTIFICATE-----
MIID4DCCAsigAwIBAgIUdj3vam8f7OlZReH+kWjBuEZLG9cwDQYJKoZIhvcNAQEL
BQAwgYcxCzAJBgNVBAYTAlZOMQ4wDAYDVQQIDAVIYW5vaTEOMAwGA1UEBwwFSGFu
b2kxGzAZBgNVBAoMEk5ndXllbiBOZ29jIEFuaCBUdTEZMBcGA1UECwwQVklQIEFw
ZXggU3lzdGVtczEgMB4GA1UEAwwXQW5oIFR1IFZJUCBBcGV4IFJvb3QgQ0EwHhcN
MjYxMDI3MTMxMTA5WhcNMzYxMDI1MTMxMTA5WjCBhzELMAkGA1UEBhMCVk4xDjAM
BgNVBAgMBUhhbm9pMQ4wDAYDVQQHDAVIYW5vaTEbMBkGA1UECgwSTmd1eWVuIE5n
b2MgQW5oIFR1MRkwFwYDVQQLDBBWSVAgQXBleCBTeXN0ZW1zMSAwHgYDVQQDDBdB
bmggVHUgVklQIEFwZXggUm9vdCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBALqRQVQho9CzccgA8XTaBpCDLiKgk2Cy3buuf5bJUG8CNMPOFgJw8Za4
xl/AhQPhmBh0/vqFW18JDSN+l7TWQvst4SfNAXBZphb9OvVJiNflk6imGKTlMoGj
USczdn7AbDOEQxNw7JjWb6Ul6LxloVtF2mdhtYYRHXEvt1AjiTLWAlIGJxK8TXOs
U8eVyQpr8cpdHh+3Jzh++Lg7CUONJi/6y94ZhsNp4iQbeZRRCgpefumNPBf3WHV2
7EOqLI9MgsxZlZEjTwChblz9QKSejFYtVeZVd2grDKTTCgTJW7NTaViPAwvfwWkk
JuAdDTCUtbVKXj7GwMT1Wvx+s1ji41sCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB
/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFIRohgmdgC9M5n1bxK8U6NuqQzBp
MA0GCSqGSIb3DQEBCwUAA4IBAQBXiiRoc5MsL1UESg/P8VgsoL+ap/7RUuZkXtAu
2N9h+OuJETDoxGqEeRhdyhIZgmEj7N8M3D0fX+BHm6ZBLZbYTYS3QNNfxdS5KYHk
DdZy8UxWtR/2vvjNPUHIWjpLobQqNuFW9ONkHgOPl3KDaV8FyFhVa7/uhh3PR2jb
eMGQ3zLa0/1zpgEtSZuU5HmmeVd6y7U5ZcB6re8QvpNUekYPAaa0DlEv6TyIu4/z
fOy/wlhsI9Qw9lHrhVsQyL5I26oYiBz14+Tp1WtGyQS9PeXlplp2CqnEa3TKUJWx
r8qe+SvJS8Y7UiUI2qzzBST8yBrGYvxUCYcO4DVAfHKCvmgW
-----END CERTIFICATE-----
"""

EMBEDDED_SERVER_CRT = """-----BEGIN CERTIFICATE-----
MIIEyDCCA7CgAwIBAgIUEooCdx3J/EZZP7ZzXM3Jqzk4GsYwDQYJKoZIhvcNAQEL
BQAwgYcxCzAJBgNVBAYTAlZOMQ4wDAYDVQQIDAVIYW5vaTEOMAwGA1UEBwwFSGFu
b2kxGzAZBgNVBAoMEk5ndXllbiBOZ29jIEFuaCBUdTEZMBcGA1UECwwQVklQIEFw
ZXggU3lzdGVtczEgMB4GA1UEAwwXQW5oIFR1IFZJUCBBcGV4IFJvb3QgQ0EwHhcN
MjYxMDI3MTMxMTA5WhcNMzYxMDI1MTMxMTA5WjBgMQswCQYDVQQGEwJWTjEbMBkG
A1UECgwSTmd1eWVuIE5nb2MgQW5oIFR1MRkwFwYDVQQLDBBWSVAgQXBleCBTeXN0
ZW1zMRkwFwYDVQQDDBAqLnJldmVudWVjYXQuY29tMIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEA1/CDnqdI9wKDWrVvCopwfqmxmUwLCqViG4EptP/DTAIc
4mFPL1TQ2DVAhodPR7f2qM7HDpG3/iYCITGnXZXcLQ8YlrG3vBl+EnTeBc8Rt/oF
K+FoXc2U0kDDrVQ41mjSX+2+2w3g55nMQDnsCOirNTWU6ohuzmnX+LrJzAqovZzx
tRIoIAHuwntH41yAWVfheZec0VT2vg54ZEHczl0csgLxuy4R0n3z/TVaMFXqz1gl
8OMou3m9woGLzN5RjoZkUqd1I0jLmSLRHA64/Hx6H2r7KUP2cSnMtxwReHw3xfcH
P1ObQy3qPeYXXyEhU2qahDXSnidOZ37xBvI3KK4oVQIDAQABo4IBUDCCAUwwDAYD
VR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwEw
ggEVBgNVHREEggEMMIIBCIISYXBpLnJldmVudWVjYXQuY29tghAqLnJldmVudWVj
YXQuY29tgg5yZXZlbnVlY2F0LmNvbYISYXBwLnJldmVudWVjYXQuY29tgiNmaXJl
YmFzZXJlbW90ZWNvbmZpZy5nb29nbGVhcGlzLmNvbYIrZmlyZWJhc2VyZW1vdGVj
b25maWdyZWFsdGltZS5nb29nbGVhcGlzLmNvbYIrdXMtY2VudHJhbDEtbG9ja2V0
LTQyNTJhLmNsb3VkZnVuY3Rpb25zLm5ldIINZG9oLmFuaHR1LnZpcIIXMTMuMjI5
LjIxMC4yMjIuc3NsaXAuaW+HBA3l0t6CCWxvY2FsaG9zdIcEfwAAATANBgkqhkiG
9w0BAQsFAAOCAQEATzhan70pQ3r8OK22y/QOS+RrlLxIH8m3F0jzlxFdkKv3eLZQ
5J719U5l5q1WfTYmoKG5ds3J0KzQITaDvZolQVrsfLrRaNrjvSZJNOFfT+XYAbwf
gJU+Ed39pnoWImbwPlNKfFprnW35J28cK9dNHlBpV3ZvC903m/YOcDeMjFOjRqal
qjjfYEE3o0IxuSIjM6iQB0AzJFkl1I8dOBNwGmPCWqfCz0F1YAAs7zP8Ku2uEIjs
INW0XzLrQbRbS70FEZIY65vNTs9jrz0eNMEmonAFv3nVtCHjRWfH8c/78tUSppEx
f0LlHniKMc1OEeET8XH3rUR/LDR9DO/jGD/w4w==
-----END CERTIFICATE-----
"""

EMBEDDED_SERVER_KEY = """-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA1/CDnqdI9wKDWrVvCopwfqmxmUwLCqViG4EptP/DTAIc4mFP
L1TQ2DVAhodPR7f2qM7HDpG3/iYCITGnXZXcLQ8YlrG3vBl+EnTeBc8Rt/oFK+Fo
Xc2U0kDDrVQ41mjSX+2+2w3g55nMQDnsCOirNTWU6ohuzmnX+LrJzAqovZzxtRIo
IAHuwntH41yAWVfheZec0VT2vg54ZEHczl0csgLxuy4R0n3z/TVaMFXqz1gl8OMo
u3m9woGLzN5RjoZkUqd1I0jLmSLRHA64/Hx6H2r7KUP2cSnMtxwReHw3xfcHP1Ob
Qy3qPeYXXyEhU2qahDXSnidOZ37xBvI3KK4oVQIDAQABAoIBABrI0XqfY1SIMkTR
FmnnTBbZ85aBMSlr5CRnPAYgZ1gJNw35ZfoH+jOnP06wf+v0bJr5swUinADhNAhs
AUeBbCMGqVUfzBt/yfx+FIAB9D+uum978RcZhekicWMRfE9UByww8Ch5qzjvAb/B
r35XZc0ezU7eB2iBBnHqsVcmx1FlaNlCGfvnhBCF6rCr7YQ5IK7mqb1VJSZMyT03
gzfkAs7R6GidpmrA0hHImo3B25Fl5qL7Jwe92Ky9bYDkkEOYLKTA3TaORDaytCcY
5r4NkqOs3j6ijM26Wp9ftXl0J8rnOElMEe1M4qrVTRs2oX49UaZBFzlyxrNkDdfX
7Aww0Q0CgYEA8Q7s0VALolXWdRMjSp+dW0DiNhISUL0Seg/Ay1ziIyqVUMkhJn+8
jApYWPuA0TlB6LSym18gh3Dw74Rm0B3O9EkgVcjv1VOep9ardLIRr5K8lJCviAAg
v9wLBwSAIZlgGlNslqvScsOu3/JxLx9wBw+oxZyS38iFEmUobxavBmcCgYEA5VMC
D2tcPV6xghSS1KltRuPLdQtxjn8k4oW7+e/6LmDT6HqxdwKJk3OtOG6rrW8dw8YB
kMPmEEoA52nQn6Lmuz4qsacEEPpg5QijO4F8sD7pOw7W5cnGfwYC7+ZoUUh9wdr6
2dg8syn5fmRJguHaZPx6vSAAUdT2HV4eb5rtzeMCgYEA1+zWlGdvBGp/Pz91TVLM
UQE9n9FwNoImGtAhkggRSA7M0SBYYXPqIEbj/FDMgp0XPKsfka0UJj40k1e2AJWy
237lR/JFYoEUjKLt0gnvbaWy5iD0Go6Cx1kDR7XwUChivTIdApnGWKaP7mnsmJlA
cBLGyrwFlA65pFCYd2mKPeECgYEAxRN2BMxN48u6HsERgkLsT2y6T6b6+uvXRfiK
F/wc87hwxCyU0GLU2mwh5Apv7Uc9vB4xADjqQPtoFXfBOz9irG17gVq3yuNxW8L1
jND11/zosMFK+wVRWZ5P7d0Drz7uHCfVRltnps0exXjoF9uCtSCpVljnDWxH6esV
mvH5BeMCgYEAgKbuklCxMsyUNBVk4LWQaiwrweuEwn5pM6RC7F6GX6SpMReS0Xpi
s/Fcy+FGFRAlFKUmmyN6C7ZGKe2jr6KZ85HbDqKWsksTrIAYztOV3tyEglQb4HxR
DxJVV0j8xrqBLuVOQilYKz8XYPi1w5sqCUla15Vh6XCYS2GN25kG5vw=
-----END RSA PRIVATE KEY-----
"""

# CHỈ định tuyến các domain can thiệp Locket Gold (Tuyệt đối không can thiệp Spotify hay Google Auth/Storage)
TARGET_DOMAINS: Set[str] = {
    "api.revenuecat.com",
    "app.revenuecat.com",
    "revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    "firebaseremoteconfigrealtime.googleapis.com",
    "us-central1-locket-4252a.cloudfunctions.net"
}

# Tên miền quảng cáo & fallback bypass chặn sạch 100% (Spotify Audio/Video/Banner Ads + DoubleClick + Akamai Ad CDN + Locket Nimbus Ads)
AD_DOMAINS: Set[str] = {
    "api.rc-backup.com",
    "rc-backup.com",
    "e.revenuecat.com",
    "config.app-measurement.com",
    "app-measurement.com",
    "locket.adsbynimbus.com",
    "api.adsbynimbus.com",
    "adsbynimbus.com",
    "e.crashlytics.com",
    "settings.crashlytics.com",
    "firebase-settings.crashlytics.com",
    "in.appcenter.ms",
    "firebaselogging-pa.googleapis.com",
    "ads.spotify.com",
    "ads-fa.spotify.com",
    "ads-fa.scdn.co",
    "adeventtracker.spotify.com",
    "analytics.spotify.com",
    "crashdump.spotify.com",
    "log.spotify.com",
    "log2.spotify.com",
    "ads-east-colo.spotify.com",
    "ads-west-colo.spotify.com",
    "ads-east-colo.ads.spotify.com",
    "ads-west-colo.ads.spotify.com",
    "gads.spotify.com",
    "gads.current.spotify.com",
    "podcastads.spotify.com",
    "audio-ak-spotify-com.akamaized.net",
    "audio4-ak-spotify-com.akamaized.net",
    "heads-ak-spotify-com.akamaized.net",
    "audio-akp-spotify-com.akamaized.net",
    "audio-ak.spotify.com",
    "audio4-ak.spotify.com",
    "audio-akp.spotify.com",
    "audio4-akp.spotify.com",
    "audio-fa.spotify.com",
    "audio4-fa.spotify.com",
    "audio-sp.spotify.com",
    "audio4-sp.spotify.com",
    "audio-ec.spotify.com",
    "audio4-ec.spotify.com",
    "audio-cf.spotify.com",
    "audio4-cf.spotify.com",
    "heads-ak.spotify.com",
    "heads4-ak.spotify.com",
    "heads-akp.spotify.com",
    "heads4-akp.spotify.com",
    "heads-fa.spotify.com",
    "heads4-fa.spotify.com",
    "heads-cf.spotify.com",
    "heads4-cf.spotify.com",
    "heads-ec.spotify.com",
    "heads4-ec.spotify.com",
    "prod.spotify-heads.map.fastly.net",
    "weblb-wg.gslb.spotify.com",
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
    "audio-sp-bom.pscdn.co",
    "audio-sp-syd.pscdn.co",
    "audio-sp-gru.pscdn.co",
    "audio-sp-iad.pscdn.co",
    "audio-sp-sea.pscdn.co",
    "audio-sp-lax.pscdn.co",
    "audio-sp-mad.pscdn.co",
    "audio-sp-mil.pscdn.co",
    "audio-sp-cdg.pscdn.co",
    "audio-sp-waw.pscdn.co",
    "audio-sp-arn.pscdn.co",
    "googleads.g.doubleclick.net",
    "pubads.g.doubleclick.net",
    "securepubads.g.doubleclick.net",
    "adclick.g.doubleclick.net",
    "ad.doubleclick.net",
    "pagead2.googlesyndication.com",
    "pagead2.googleadservices.com",
    "tpc.googlesyndication.com",
    "adservice.google.com",
    "adservice.google.com.vn",
    "ads.pubmatic.com",
    "bs.serving-sys.com",
    "ds.serving-sys.com",
    "v.jwpcdn.com",
    "z.moatads.com",
    "px.moatads.com",
    "ads.youtube.com",
    "s.youtube.com",
    "video-stats.l.google.com",
    "video-stats.youtube.com"
}


def ensure_certs() -> None:
    """Tự động đảm bảo các file SSL certs tồn tại, không bao giờ để crash server HTTPS."""
    CERTS_DIR.mkdir(parents=True, exist_ok=True)
    server_crt = CERTS_DIR / "server.crt"
    server_key = CERTS_DIR / "server.key"
    ca_crt = CERTS_DIR / "ca.crt"
    ca_der = CERTS_DIR / "ca.der"

    if not server_crt.exists() or server_crt.stat().st_size == 0:
        server_crt.write_text(EMBEDDED_SERVER_CRT.strip() + "\n", encoding="utf-8")
        print("  ✓ Đã tự động khởi tạo certs/server.crt")

    if not server_key.exists() or server_key.stat().st_size == 0:
        server_key.write_text(EMBEDDED_SERVER_KEY.strip() + "\n", encoding="utf-8")
        print("  ✓ Đã tự động khởi tạo certs/server.key")

    if not ca_crt.exists() or ca_crt.stat().st_size == 0:
        ca_crt.write_text(EMBEDDED_CA_CRT.strip() + "\n", encoding="utf-8")
        print("  ✓ Đã tự động khởi tạo certs/ca.crt")

    if not ca_der.exists() or ca_der.stat().st_size == 0:
        ca_der.write_bytes(base64.b64decode(EMBEDDED_CA_DER_B64))
        print("  ✓ Đã tự động khởi tạo certs/ca.der")


def parse_dns_qname(data: bytes, offset: int = 12) -> Tuple[str, int]:
    labels = []
    curr = offset
    while curr < len(data):
        length = data[curr]
        if length == 0:
            curr += 1
            break
        if length & 0xC0 == 0xC0:
            curr += 2
            break
        curr += 1
        labels.append(data[curr:curr + length].decode("utf-8", errors="ignore"))
        curr += length
    return ".".join(labels).lower(), curr


def build_a_response(query: bytes, ip_str: str, ttl: int = 60) -> bytes:
    tx_id = query[:2]
    flags = b"\x81\x80"
    qdcount = query[4:6]
    ancount = b"\x00\x01"
    nscount = b"\x00\x00"
    arcount = b"\x00\x00"

    _, end_qname = parse_dns_qname(query, 12)
    question_section = query[12:end_qname + 4]

    ans_name = b"\xc0\x0c"
    ans_type = b"\x00\x01"
    ans_class = b"\x00\x01"
    ans_ttl = struct.pack("!I", ttl)
    ans_rdlen = b"\x00\x04"
    ans_rdata = socket.inet_aton(ip_str)

    answer_section = ans_name + ans_type + ans_class + ans_ttl + ans_rdlen + ans_rdata
    return tx_id + flags + qdcount + ancount + nscount + arcount + question_section + answer_section


def build_empty_noerror_response(query: bytes) -> bytes:
    tx_id = query[:2]
    flags = b"\x81\x80"
    qdcount = query[4:6]
    ancount = b"\x00\x00"
    nscount = b"\x00\x00"
    arcount = b"\x00\x00"

    _, end_qname = parse_dns_qname(query, 12)
    question_section = query[12:end_qname + 4]
    return tx_id + flags + qdcount + ancount + nscount + arcount + question_section


def forward_upstream_dns(query: bytes) -> bytes:
    for dns_server in UPSTREAM_DNS_LIST:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(1.0)
        try:
            sock.sendto(query, (dns_server, UPSTREAM_PORT))
            resp, _ = sock.recvfrom(4096)
            sock.close()
            return resp
        except Exception:
            sock.close()
            continue
    return build_empty_noerror_response(query)


def process_dns_query(query_bytes: bytes) -> bytes:
    if len(query_bytes) < 12:
        return b""
    try:
        qname, end_qname = parse_dns_qname(query_bytes, 12)
        if end_qname + 4 > len(query_bytes):
            return forward_upstream_dns(query_bytes)

        qtype, _ = struct.unpack("!HH", query_bytes[end_qname:end_qname + 4])

        if qname in AD_DOMAINS or any(qname.endswith("." + d) for d in AD_DOMAINS):
            if qtype == 1:
                return build_a_response(query_bytes, "0.0.0.0", ttl=3600)
            return build_empty_noerror_response(query_bytes)

        is_target = qname in TARGET_DOMAINS or any(qname.endswith("." + d) for d in TARGET_DOMAINS)
        if is_target:
            if qtype == 1:
                return build_a_response(query_bytes, SERVER_IP, ttl=60)
            elif qtype in (28, 65):
                return build_empty_noerror_response(query_bytes)

        return forward_upstream_dns(query_bytes)
    except Exception:
        return forward_upstream_dns(query_bytes)


def extract_rc_user_id(path: str, post_data: bytes = b"") -> str:
    if "/subscribers/" in path:
        uid = urllib.parse.unquote(path.split("/subscribers/", 1)[1].split("/")[0].split("?")[0]).strip()
        if uid:
            return uid
    if post_data:
        try:
            body_obj = json.loads(post_data.decode("utf-8", errors="ignore"))
            if isinstance(body_obj, dict) and body_obj.get("app_user_id"):
                return str(body_obj["app_user_id"])
        except Exception:
            pass
    return "anhtu_vip_user_2099"


def get_locket_gold_json(app_user_id: str | None = None) -> bytes:
    # ponytail: Single static RC v5.2+ template for Locket Gold + FilterPack; upgrade to per-app UA routing if non-Locket RC apps are added to DoH.
    uid = app_user_id or "anhtu_vip_user_2099"
    import datetime
    now = datetime.datetime.now(datetime.timezone.utc)
    req_date = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    req_ms = int(now.timestamp() * 1000)
    purchased = "2005-07-18T10:10:14Z"
    expires = "2099-12-31T23:59:59Z"
    tx_id = "2000001108724193"

    base_sub = {
        "auto_resume_date": None,
        "billing_issues_detected_at": None,
        "display_name": "locket_1600_1y",
        "expires_date": expires,
        "grace_period_expires_date": None,
        "is_sandbox": False,
        "management_url": "https://apps.apple.com/account/subscriptions",
        "original_purchase_date": purchased,
        "ownership_type": "PURCHASED",
        "period_type": "normal",
        "price": {"amount": 399000.0, "currency": "VND"},
        "purchase_date": purchased,
        "refunded_at": None,
        "store": "app_store",
        "store_transaction_id": tx_id,
        "unsubscribe_detected_at": None,
    }

    base_ent = {
        "expires_date": expires,
        "grace_period_expires_date": None,
        "original_purchase_date": purchased,
        "ownership_type": "PURCHASED",
        "product_identifier": "locket_1600_1y",
        "product_plan_identifier": "locket_1600_1y",
        "purchase_date": purchased,
        "store": "app_store",
        "store_transaction_id": tx_id,
    }

    locket_prods = [
        "locket_1600_1y",
        "locket_3600_1y",
        "locket_gold_yearly",
        "locket_gold_monthly",
        "locket_199_1m",
        "com.locket.gold.premium.yearly",
    ]
    filter_prods = [
        "com.locket.Locket.FilterPack_10Photos_400",
        "com.locket.Locket.FilterPack_20Photos_500",
        "com.locket.Locket.FilterPack_10Photo",
        "com.locket.Locket.FilterPack_20Photo",
    ]

    subscriptions = {}
    for pid in locket_prods + filter_prods:
        subscriptions[pid] = {
            **base_sub,
            "display_name": pid,
            "product_identifier": pid,
            "product_plan_identifier": pid,
        }

    entitlements = {}
    for ekey in (
        "Gold", "gold", "locket_gold", "pro", "premium", "all_access",
        "holiday_effects", "holiday_filters", "holiday_moments", "view_holiday_moments",
        "can_view_holiday_effects", "camera_filter_holidays", "seasonal_effects",
        "seasonal_frames", "custom_frames", "frames", "widget_frames", "view_all_history",
        "view_history", "past_moments", "filters", "filter_pack", "effects",
        "effect_pack_10", "effect_pack_20", "filter_pack_10", "filter_pack_20",
        "yearbook", "recap", "calendar_rewind", "streak_freeze", "ghost_mode",
        "stealth_views", "music_preview"
    ):
        entitlements[ekey] = dict(base_ent)

    for fe in [
        "effect_pack_10", "effect_pack_20", "filter_pack_10", "filter_pack_20",
        "filters", "filter_pack", "effects", "holiday_effects", "holiday_filters",
        "holiday_moments", "view_holiday_moments", "can_view_holiday_effects",
        "seasonal_effects", "seasonal_frames", "custom_frames", "frames", "widget_frames",
        "view_all_history", "view_history", "past_moments", "camera_filter_holidays"
    ]:
        entitlements[fe] = {
            **base_ent,
            "product_identifier": "locket_1600_1y",
            "product_plan_identifier": "locket_1600_1y",
        }

    payload = {
        "request_date": req_date,
        "request_date_ms": req_ms,
        "subscriber": {
            "entitlements": entitlements,
            "first_seen": purchased,
            "last_seen": req_date,
            "management_url": "https://apps.apple.com/account/subscriptions",
            "non_subscriptions": {},
            "original_app_user_id": uid,
            "original_application_version": "1.0",
            "original_purchase_date": purchased,
            "other_purchases": {},
            "request_date": req_date,
            "request_date_ms": req_ms,
            "subscriptions": subscriptions,
            "subscriber_attributes": {
                "locket_gold_badge": {"value": "true", "updated_at_ms": req_ms},
                "locket_gold_badge_small": {"value": "true", "updated_at_ms": req_ms},
                "locket_gold_badge_text": {"value": "LOCKET GOLD SINCE 2005", "updated_at_ms": req_ms},
                "locket_gold_since": {"value": purchased, "updated_at_ms": req_ms},
                "locket_verified": {"value": "true", "updated_at_ms": req_ms},
                "verified": {"value": "true", "updated_at_ms": req_ms},
                "badge": {"value": "verified", "updated_at_ms": req_ms},
                "subscription_entitlement": {"value": "locket_gold", "updated_at_ms": req_ms},
                "is_gold": {"value": "true", "updated_at_ms": req_ms},
            },
        },
    }
    return json.dumps(payload, indent=2).encode("utf-8")


def get_product_entitlement_mapping_json() -> bytes:
    all_ents = [
        "Gold", "gold", "locket_gold", "pro", "premium", "all_access",
        "holiday_effects", "holiday_filters", "holiday_moments", "view_holiday_moments",
        "can_view_holiday_effects", "camera_filter_holidays", "seasonal_effects",
        "seasonal_frames", "custom_frames", "frames", "widget_frames", "view_all_history",
        "view_history", "past_moments", "filters", "filter_pack", "effects",
        "effect_pack_10", "effect_pack_20", "filter_pack_10", "filter_pack_20",
        "yearbook", "recap", "calendar_rewind", "streak_freeze", "ghost_mode",
        "stealth_views", "music_preview"
    ]
    prods = [
        "locket_1600_1y",
        "locket_3600_1y",
        "locket_gold_yearly",
        "locket_gold_monthly",
        "locket_199_1m",
        "com.locket.gold.premium.yearly",
        "com.locket.Locket.FilterPack_10Photos_400",
        "com.locket.Locket.FilterPack_20Photos_500",
        "com.locket.Locket.FilterPack_10Photo",
        "com.locket.Locket.FilterPack_20Photo",
    ]
    mapping = {}
    for p in prods:
        mapping[p] = {
            "product_identifier": p,
            "entitlements": all_ents,
        }
    payload = {"product_entitlement_mapping": mapping}
    return json.dumps(payload, indent=2).encode("utf-8")


def get_rc_offerings_json() -> bytes:
    payload = {
        "current_offering_id": "default",
        "offerings": [
            {
                "description": "Default Offering",
                "identifier": "default",
                "packages": [
                    {
                        "identifier": "$rc_annual",
                        "platform_product_identifier": "locket_1600_1y"
                    },
                    {
                        "identifier": "$rc_monthly",
                        "platform_product_identifier": "locket_199_1m"
                    }
                ]
            }
        ]
    }
    return json.dumps(payload, indent=2).encode("utf-8")


def get_firebase_config_json() -> bytes:
    candidates = [
        BASE_DIR / "locket_full_firebase.json",
        BASE_DIR.parent / "scripts" / "locket_full_firebase.json",
        ROOT / ".github" / "scripts" / "locket_full_firebase.json" if 'ROOT' in globals() else None,
        Path("/opt/anhtu-dns/locket_full_firebase.json"),
        Path("/root/apex_dns_suite/locket_full_firebase.json")
    ]
    for c in candidates:
        if c and c.exists() and c.stat().st_size > 1000:
            return c.read_bytes()

    # Fallback đầy đủ 100% bao gồm mọi Filter, Mic và Video 45s
    fallback_entries = {
        "video_duration": "60.0",
        "max_duration": "60.0",
        "gold_max_duration": "60.0",
        "video_max_duration": "60.0",
        "can_upload_video": "true",
        "upload_video_duration": "60.0",
        "microphone_enabled": "true",
        "camera_microphone_enabled": "true",
        "mh_mic_enabled_v16": "true",
        "voice_messages_enabled": "true",
        "audio_messages_enabled": "true",
        "voice_caption_enabled": "true",
        "longer_audio_captions": "true",
        "longer_video": "enabled",
        "longer_videos": "enabled",
        "video_recording": "enabled",
        "camera_roll_video": "enabled",
        "camera_config": "{\"gold_max_duration\":60.0,\"goldMaxDuration\":60.0,\"max_duration\":60.0,\"maxDuration\":60.0,\"video_max_duration\":60.0,\"videoMaxDuration\":60.0,\"video_duration\":60.0,\"videoDuration\":60.0,\"ultra_wide\":true,\"ultraWide\":true,\"volume_button\":true,\"volumeButton\":true,\"flash_button\":true,\"telephoto\":true,\"srgb\":true,\"lanczos\":true,\"hdr\":true,\"hdr_video\":true,\"stabilization\":true,\"fps_60\":true,\"quality_mbps\":0.6,\"qualityMbps\":0.6,\"filters\":true,\"effects\":true,\"microphone\":true,\"microphone_enabled\":true,\"sound_enabled\":true}",
        "camera_filter_config": "{\"allows_custom_filters\":true,\"show_filter_button\":true,\"sheet_enabled\":true,\"open_sheet_immediately\":true,\"sheet_filters\":[{\"title\":{\"en\":\"Goofy\"},\"filter_ids\":[\"okay_wig\",\"influencer\",\"looks_maxxing\",\"toothless\",\"bye_brows\"]},{\"title\":{\"en\":\"Looks\"},\"filter_ids\":[\"bowling_ball\",\"blonde_bleached\",\"beard\",\"bob_cut\",\"buns\",\"tatted\",\"mohawk\",\"braces\",\"bye_brows\"]},{\"title\":{\"en\":\"Celebrate\"},\"filter_ids\":[\"slimed\",\"princess\",\"disco_lights\",\"cash_money\",\"happy_birthday\"]},{\"title\":{\"en\":\"Cute\"},\"filter_ids\":[\"cutesy\",\"sticker_face\",\"flower_crown\",\"love_bug\"]},{\"title\":{\"en\":\"Costumes\"},\"filter_ids\":[\"wedding\",\"cowboy_cowgirl\",\"giraffe\",\"clown\"]},{\"title\":{\"en\":\"Holidays\"},\"filter_ids\":[\"easter_bunney_cutout\",\"easter_chick_cutout\",\"bearded\",\"leprechaun\",\"lucky_face\",\"sweet_hearts\",\"elf_cutout\",\"santa_cutout\",\"frosty\"]}],\"picker_filters\":[\"okay_wig\",\"influencer\",\"looks_maxxing\",\"toothless\",\"bye_brows\",\"bowling_ball\",\"blonde_bleached\",\"beard\",\"bob_cut\",\"buns\",\"tatted\",\"mohawk\",\"braces\",\"slimed\",\"princess\",\"disco_lights\",\"cash_money\",\"happy_birthday\",\"cutesy\",\"sticker_face\",\"flower_crown\",\"love_bug\",\"wedding\",\"cowboy_cowgirl\",\"giraffe\",\"clown\",\"easter_bunney_cutout\",\"easter_chick_cutout\",\"bearded\",\"leprechaun\",\"lucky_face\",\"sweet_hearts\",\"elf_cutout\",\"santa_cutout\",\"frosty\"]}",
        "overlay_dynamic_captions": json.dumps([
            "standard", "poll", "color_palette", "review", "music", "location", "weather",
            "time", "streak", "star_sign", "party_time", "locket_count", "good_morning",
            "goodnight", "ootd", "miss_you", "custom", "phunu_2010", "halloween_2026",
            "link", "live", "audio", "lyrics"
        ]),
        "feature_gates": json.dumps({
            "app_icon_picker": "enabled",
            "camera_roll": "enabled",
            "camera_theme": "enabled",
            "locket_views": "enabled",
            "long_captions": "enabled",
            "longer_video": "enabled",
            "unlimited_friends": "enabled",
            "priority_support": "enabled",
            "profile_badge": "enabled",
            "remove_ads": "enabled",
            "video": "enabled",
            "custom_widget_frames": "enabled",
            "streak_recovery": "enabled",
            "effects": "enabled",
            "filter_packs": "enabled",
            "holiday_effects": "enabled",
            "holiday_filters": "enabled",
            "holiday_moments": "enabled",
            "view_holiday_moments": "enabled",
            "can_view_holiday_effects": "enabled",
            "camera_filter_holidays": "enabled",
            "camera_filters": "enabled",
            "camera_filter_sheet": "enabled",
            "seasonal_effects": "enabled",
            "seasonal_frames": "enabled",
            "view_all_history": "enabled",
            "past_moments": "enabled",
            "gold_entitlement": "enabled"
        }),
        "feature_gates_override": json.dumps({
            "app_icon_picker": "enabled",
            "camera_roll": "enabled",
            "camera_theme": "enabled",
            "locket_views": "enabled",
            "long_captions": "enabled",
            "longer_video": "enabled",
            "unlimited_friends": "enabled",
            "priority_support": "enabled",
            "profile_badge": "enabled",
            "remove_ads": "enabled",
            "video": "enabled",
            "custom_widget_frames": "enabled",
            "streak_recovery": "enabled",
            "effects": "enabled",
            "filter_packs": "enabled",
            "holiday_effects": "enabled",
            "holiday_filters": "enabled",
            "holiday_moments": "enabled",
            "view_holiday_moments": "enabled",
            "can_view_holiday_effects": "enabled",
            "camera_filter_holidays": "enabled",
            "camera_filters": "enabled",
            "camera_filter_sheet": "enabled",
            "seasonal_effects": "enabled",
            "seasonal_frames": "enabled",
            "view_all_history": "enabled",
            "past_moments": "enabled",
            "gold_entitlement": "enabled"
        }),
        "upsell_features": json.dumps({
            "app_icon_picker": True,
            "camera_roll": True,
            "camera_theme": True,
            "locket_views": True,
            "remove_ads": True,
            "custom_widget_frames": True,
            "holiday_effects": False,
            "holiday_filters": False,
            "filters": False,
            "camera_filters": False
        }),
        "paywall_presentation_config": json.dumps({
            "uid": "paywall_testflight",
            "onboarding": False,
            "after_sent_moment": False,
            "on_foreground": False,
            "interval": 259200000,
            "profile_banner": False,
            "holiday_effects": False,
            "holiday_filters": False,
            "holiday_effect_gate": False,
            "view_moment_gate": False,
            "moment_gate": False,
            "view_history": False,
            "seasonal_frames": False,
            "camera_filters": False,
            "filters": False
        }),
        "history_gold_upsell_slot_config": json.dumps({
            "appearance_probability": 0,
            "uid": "disabled",
            "show_first_probability": 0,
            "first_slot_position": 999999,
            "interval": 999999
        }),
        "holiday_effects_enabled": "true",
        "holiday_filters_enabled": "true",
        "holiday_moments_enabled": "true",
        "camera_filter_holidays_enabled": "true",
        "can_view_holiday_effects": "true",
        "view_holiday_moments": "true",
        "camera_filters_enabled": "true",
        "camera_filter_sheet_enabled": "true",
        "allows_custom_filters": "true",
        "show_filter_button": "true",
        "android_subscribe_gold_button_enabled": "false",
        "share_history_prompt_enabled": "false",
        "state": "UPDATE"
    }

    payload = {
        "state": "UPDATE",
        "appName": "Locket",
        "templateVersion": "999999999",
        "entries": fallback_entries
    }
    return json.dumps(payload, indent=2).encode("utf-8")


def generate_profile_bytes(username: str | None = None) -> bytes:
    top_uuid = str(uuid.uuid4()).upper()
    ca_uuid = str(uuid.uuid4()).upper()
    dns_uuid = str(uuid.uuid4()).upper()

    display_name = f"👑 Anh Tú • DNS Locket Gold ({username})" if username else "👑 Anh Tú • DNS Locket Gold 2099"

    profile = {
        "PayloadDisplayName": display_name,
        "PayloadDescription": "Mở khóa Locket Gold 2099 & Video 45s • FB: fb.com/NguyenNgocAnhTu.VN • Zalo: 0332413262",
        "PayloadIdentifier": f"com.anhtu.dns.locketgold.{top_uuid[:8].lower()}",
        "PayloadOrganization": "Nguyễn Ngọc Anh Tú",
        "PayloadRemovalDisallowed": False,
        "PayloadType": "Configuration",
        "PayloadUUID": top_uuid,
        "PayloadVersion": 1,
        "PayloadContent": [
            {
                "PayloadType": "com.apple.security.root",
                "PayloadVersion": 1,
                "PayloadIdentifier": "com.anhtu.rootca",
                "PayloadUUID": ca_uuid,
                "PayloadDisplayName": "Anh Tú Root CA",
                "PayloadDescription": "Kích hoạt Locket Gold 2099",
                "PayloadContent": base64.b64decode(EMBEDDED_CA_DER_B64)
            },
            {
                "PayloadType": "com.apple.dnsSettings.managed",
                "PayloadVersion": 1,
                "PayloadIdentifier": "com.anhtu.dns.managed",
                "PayloadUUID": dns_uuid,
                "PayloadDisplayName": "DNS Locket Gold",
                "PayloadDescription": "DNS DoH Singapore • Zalo: 0332413262",
                "DNSSettings": {
                    "DNSProtocol": "HTTPS",
                    "ServerURL": f"https://{SERVER_IP}.sslip.io/dns-query",
                    "ServerAddresses": [SERVER_IP],
                    "SupplementalMatchDomains": sorted(list(TARGET_DOMAINS | {"api.rc-backup.com", "rc-backup.com", "config.app-measurement.com", "app-measurement.com", "locket.adsbynimbus.com", "e.revenuecat.com"}))
                },
                "OnDemandRules": [{"Action": "Connect"}]
            }
        ]
    }
    return plistlib.dumps(profile, fmt=plistlib.FMT_XML)


def get_landing_html() -> bytes:
    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anh Tú VIP • DNS Locket Gold Profile Installer</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }}
        .card {{ background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 28px; max-width: 440px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }}
        .badge {{ display: inline-block; background: #0284c7; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }}
        h1 {{ font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #38bdf8; }}
        p {{ font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }}
        .btn {{ display: block; width: 100%; background: linear-gradient(135deg, #0284c7, #2563eb); color: #fff; font-weight: 700; text-decoration: none; padding: 14px; border-radius: 12px; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.4); transition: transform 0.2s; }}
        .btn:hover {{ transform: scale(1.02); }}
        .steps {{ margin-top: 24px; text-align: left; background: #0f172a; border-radius: 12px; padding: 16px; font-size: 13px; color: #cbd5e1; }}
        .steps ol {{ padding-left: 20px; line-height: 1.8; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #64748b; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">Anh Tú VIP</div>
        <h1>Locket Gold 2099</h1>
        <p>Hồ sơ DNS DoH mở khóa Locket Gold 2099 &amp; Video 45s.</p>
        <a href="/DNS.mobileconfig" class="btn">📲 Cài Đặt Profile iOS (1-Chạm)</a>
        <div class="steps">
            <strong>📋 Hướng dẫn kích hoạt iOS:</strong>
            <ol>
                <li>Nhấn nút cài đặt và chọn <strong>Cho phép (Allow)</strong> tải về.</li>
                <li>Vào <strong>Cài đặt &gt; Đã tải về hồ sơ</strong> &gt; Bấm <strong>Cài đặt</strong>.</li>
                <li>Vào <strong>Cài đặt &gt; Cài đặt chung &gt; Giới thiệu &gt; Cài đặt tin cậy chứng nhận</strong> &gt; Bật xanh cho <strong>Anh Tú VIP Apex Root CA</strong>.</li>
                <li>Mở Locket: Đã có Locket Gold vĩnh viễn 2099 &amp; Video 45s!</li>
            </ol>
        </div>
        <div class="footer">
            Nguyễn Ngọc Anh Tú • Apex DNS Suite<br>
            <a href="https://www.facebook.com/NguyenNgocAnhTu.VN" target="_blank" style="color:#38bdf8;text-decoration:none;">Facebook</a> • 
            <a href="https://zalo.me/0332413262" target="_blank" style="color:#38bdf8;text-decoration:none;">Zalo: 0332413262</a>
        </div>
    </div>
</body>
</html>"""
    return html.encode("utf-8")


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class UnifiedRequestHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)
        host_header = self.headers.get("Host", "").lower()

        # 1. RFC 8484 DoH Query (/dns-query?dns=...)
        if "/dns-query" in path:
            dns_b64 = qs.get("dns", [None])[0]
            if dns_b64:
                dns_b64 += "=" * ((4 - len(dns_b64) % 4) % 4)
                try:
                    query_bytes = base64.urlsafe_b64decode(dns_b64)
                    resp = process_dns_query(query_bytes)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/dns-message")
                    self.send_header("Content-Length", str(len(resp)))
                    self.send_header("Cache-Control", "max-age=60")
                    self.end_headers()
                    self.wfile.write(resp)
                    return
                except Exception as e:
                    self.send_error(400, f"Malformed DNS: {e}")
                    return

        # 2. RevenueCat Endpoints (GET)
        if "product_entitlement_mapping" in path:
            payload = get_product_entitlement_mapping_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        if "offerings" in path:
            payload = get_rc_offerings_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        if "/v1/subscribers" in path or "/v1/receipts" in path or "revenuecat" in host_header:
            payload = get_locket_gold_json(extract_rc_user_id(path))
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        # 3. Firebase Remote Config Fetch (GET)
        if "remoteconfig" in path or "firebaseremoteconfig" in host_header or "firebase:fetch" in path:
            payload = get_firebase_config_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("ETag", f'"anhtu-v315-{len(payload)}"')
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        # 4. Locket CloudFunctions (GET)
        if "cloudfunctions" in host_header or "locket" in path:
            payload = b'{"status":"success","result":{"is_vip":true,"vip":true,"gold":true}}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        # 5. Profile Download (.mobileconfig, /profile, /download)
        if path.endswith(".mobileconfig") or path in ("/profile", "/download"):
            username = qs.get("username", [None])[0]
            # Ưu tiên sinh động theo tên người dùng nếu có yêu cầu
            if username:
                data = generate_profile_bytes(username)
            else:
                profile_candidates = [
                    BASE_DIR / "DNS.mobileconfig",
                    BASE_DIR / "AnhTu_VIP.mobileconfig",
                    ROOT / "DNS.mobileconfig" if 'ROOT' in globals() else None
                ]
                data = None
                for c in profile_candidates:
                    if c and c.exists() and c.stat().st_size > 100:
                        data = c.read_bytes()
                        break
                if not data:
                    data = generate_profile_bytes()

            filename = "DNS.mobileconfig"
            self.send_response(200)
            self.send_header("Content-Type", "application/x-apple-aspen-config")
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        # 6. CA Root Cert Download
        if path in ("/ca.crt", "/ca.der"):
            ensure_certs()
            fpath = CERTS_DIR / path.lstrip("/")
            if fpath.exists():
                data = fpath.read_bytes()
                ctype = "application/x-x509-ca-cert" if path.endswith(".crt") else "application/pkix-cert"
                self.send_response(200)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return

        # 7. Default Web Landing
        landing = get_landing_html()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(landing)))
        self.end_headers()
        self.wfile.write(landing)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(length) if length > 0 else b""
        host_header = self.headers.get("Host", "").lower()
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. RFC 8484 DoH POST
        if "/dns-query" in path:
            resp = process_dns_query(post_data)
            self.send_response(200)
            self.send_header("Content-Type", "application/dns-message")
            self.send_header("Content-Length", str(len(resp)))
            self.send_header("Cache-Control", "max-age=60")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(resp)
            return

        # 2. Firebase Remote Config Fetch (POST)
        if "remoteconfig" in path or "firebaseremoteconfig" in host_header or "firebase:fetch" in path:
            payload = get_firebase_config_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("ETag", f'"anhtu-v315-{len(payload)}"')
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        # 3. RevenueCat Receipts / Subscribers POST
        if "product_entitlement_mapping" in path:
            payload = get_product_entitlement_mapping_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        if "offerings" in path:
            payload = get_rc_offerings_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        if "/attributes" in path:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return

        if "/receipts" in path or "/subscribers" in path or "revenuecat" in host_header:
            payload = get_locket_gold_json(extract_rc_user_id(path, post_data))
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        # 4. Locket CloudFunctions
        if "cloudfunctions" in host_header or "locket" in path:
            payload = b'{"status":"success","result":{"is_vip":true,"vip":true,"gold":true}}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(payload)
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status":"ok"}')

    def log_message(self, format, *args):
        import sys
        sys.stderr.write("[%s] %s - - [%s] %s\n" % (
            self.headers.get("Host", "no-host"),
            self.client_address[0],
            self.log_date_time_string(),
            format % args
        ))
        sys.stderr.flush()


def run_http_server(port: int = HTTP_PORT):
    try:
        httpd = ThreadedHTTPServer(("", port), UnifiedRequestHandler)
        print(f"🌍 HTTP Server đang chạy tại cổng {port} (Web landing & Profile download)...")
        httpd.serve_forever()
    except Exception as e:
        print(f"⚠️ Lỗi HTTP Server port {port}: {e}")


def run_https_server(port: int = HTTPS_PORT):
    ensure_certs()
    cert_file = CERTS_DIR / "server.crt"
    key_file = CERTS_DIR / "server.key"

    try:
        httpd = ThreadedHTTPServer(("", port), UnifiedRequestHandler)
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(certfile=str(cert_file), keyfile=str(key_file))
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

        print(f"🔒 HTTPS & DoH Server đang chạy tại cổng {port}...")
        print(f"👉 VPS IP: {SERVER_IP}")
        print(f"👉 Upstream DNS: {UPSTREAM_DNS_LIST}:{UPSTREAM_PORT}")
        httpd.serve_forever()
    except Exception as e:
        print(f"⚠️ Lỗi HTTPS Server port {port}: {e}")


if __name__ == "__main__":
    ensure_certs()
    t_http = threading.Thread(target=run_http_server, args=(HTTP_PORT,), daemon=True)
    t_http.start()
    run_https_server(HTTPS_PORT)
