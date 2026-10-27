#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • Apex DNS & Mock Suite: Unified DoH + HTTPS Interceptor Server
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Tính năng lõi:
1. RFC 8484 DoH Engine: Hỗ trợ GET /dns-query?dns=... và POST /dns-query.
2. Wire-format DNS Manipulation:
   - Spoof A record (Type 1) cho RevenueCat, Locket Firebase, Spotify về VPS IP.
   - Stripping Type 28 (AAAA - IPv6) -> Trả về NOERROR (0 Answer) bẻ gãy Happy Eyeballs của iOS.
   - Stripping Type 65 (HTTPS/SVCB) -> Trả về NOERROR (0 Answer) triệt tiêu ECH & HTTP/3.
   - Null-routing (0.0.0.0) quảng cáo & tracking.
   - Forwarding tên miền khác về Upstream DNS (1.1.1.1 / 8.8.8.8).
3. Mock HTTPS Engine (Port 443):
   - RevenueCat: Mở khóa Locket Gold vĩnh viễn đến năm 2099.
   - Firebase Remote Config: Ép video duration 45 giây.
   - Spotify: Mở khóa Premium streaming.
   - Web Landing: Cung cấp nút tải 1-chạm profile .mobileconfig.
4. HTTP Server (Port 80): Cung cấp file .mobileconfig cho thiết bị chưa cài CA.
"""

from __future__ import annotations
import base64
import json
import os
import socket
import ssl
import struct
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from socketserver import ThreadingMixIn
from typing import Set, Tuple

BASE_DIR = Path(__file__).resolve().parent
CERTS_DIR = BASE_DIR / "certs"
MOBILECONFIG_PATH = BASE_DIR / "AnhTu_VIP.mobileconfig"

SERVER_IP = os.environ.get("SERVER_IP", "13.229.210.222")
UPSTREAM_DNS = os.environ.get("UPSTREAM_DNS", "1.1.1.1")
UPSTREAM_PORT = int(os.environ.get("UPSTREAM_PORT", "53"))
HTTPS_PORT = int(os.environ.get("HTTPS_PORT", "443"))
HTTP_PORT = int(os.environ.get("HTTP_PORT", "80"))

TARGET_DOMAINS: Set[str] = {
    "api.revenuecat.com",
    "app.revenuecat.com",
    "revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    "us-central1-locket-4252a.cloudfunctions.net"
}

AD_DOMAINS: Set[str] = {
    "googleads.g.doubleclick.net",
    "pagead2.googlesyndication.com",
    "pagead2.googleadservices.com",
    "pubads.g.doubleclick.net",
    "securepubads.g.doubleclick.net",
    "adservice.google.com",
    "ads.youtube.com",
    "s.youtube.com",
    "video-stats.l.google.com",
    "video-stats.youtube.com",
    "ads-fa.spotify.com",
    "gads.current.spotify.com",
    "podcastads.spotify.com",
    "audio-fa.scdn.co",
    "audio-ak-spotify-com.akamaized.net",
    "heads-ak-spotify-com.akamaized.net",
    "app-measurement.com",
    "in.appcenter.ms",
    "firebaselogging-pa.googleapis.com"
}

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
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(2.5)
    try:
        sock.sendto(query, (UPSTREAM_DNS, UPSTREAM_PORT))
        resp, _ = sock.recvfrom(4096)
        return resp
    except Exception:
        return build_empty_noerror_response(query)
    finally:
        sock.close()

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

def get_locket_gold_json() -> bytes:
    payload = {
        "request_date": "2026-10-27T15:00:00Z",
        "request_date_ms": 1793113200000,
        "subscriber": {
            "entitlements": {
                "Gold": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "grace_period_expires_date": None,
                    "product_identifier": "locket_gold_yearly",
                    "purchase_date": "2024-01-01T00:00:00Z"
                },
                "gold": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "grace_period_expires_date": None,
                    "product_identifier": "locket_gold_yearly",
                    "purchase_date": "2024-01-01T00:00:00Z"
                }
            },
            "first_seen": "2024-01-01T00:00:00Z",
            "last_seen": "2026-10-27T15:00:00Z",
            "management_url": "https://anhtu.vip",
            "non_subscriptions": {},
            "original_app_user_id": "anhtu_vip_user",
            "original_application_version": "1.0",
            "original_purchase_date": "2024-01-01T00:00:00Z",
            "other_purchases": {},
            "subscriptions": {
                "locket_gold_yearly": {
                    "auto_resume_date": None,
                    "billing_issues_detected_at": None,
                    "expires_date": "2099-12-31T23:59:59Z",
                    "grace_period_expires_date": None,
                    "is_sandbox": False,
                    "original_purchase_date": "2024-01-01T00:00:00Z",
                    "ownership_type": "PURCHASED",
                    "period_type": "normal",
                    "purchase_date": "2024-01-01T00:00:00Z",
                    "refunded_at": None,
                    "store": "app_store",
                    "store_transaction_id": "1000000999999999",
                    "unsubscribe_detected_at": None
                }
            }
        }
    }
    return json.dumps(payload, indent=2).encode("utf-8")

def get_firebase_config_json() -> bytes:
    fb_file = BASE_DIR / "locket_full_firebase.json"
    if fb_file.exists():
        return fb_file.read_bytes()
    payload = {
        "state": "UPDATE",
        "appName": "Locket",
        "templateVersion": "9999",
        "entries": {
            "video_duration": "45",
            "max_duration": "45.0",
            "gold_max_duration": "45.0",
            "video_max_duration": "45",
            "can_upload_video": "true",
            "upload_video_duration": "45",
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
            "state": "UPDATE"
        }
    }
    return json.dumps(payload, indent=2).encode("utf-8")

def get_landing_html() -> bytes:
    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anh Tu VIP • DNS Profile Installer</title>
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
        <div class="badge">Sovereign Apex v3.0.0</div>
        <h1>Locket Gold &amp; Spotify</h1>
        <p>Cấu hình DNS DoH &amp; Root CA mã hóa nguyên bản, mở khóa Gold 2099, Video 45s và triệt tiêu quảng cáo trên iOS.</p>
        <a href="/AnhTu_VIP.mobileconfig" class="btn">📲 Cài Đặt Profile iOS (1-Chạm)</a>
        <div class="steps">
            <strong>📋 Hướng dẫn kích hoạt iOS:</strong>
            <ol>
                <li>Nhấn nút cài đặt và chọn <strong>Cho phép (Allow)</strong> tải về.</li>
                <li>Vào <strong>Cài đặt &gt; Đã tải về hồ sơ</strong> &gt; Bấm <strong>Cài đặt</strong>.</li>
                <li>Vào <strong>Cài đặt &gt; Cài đặt chung &gt; Giới thiệu &gt; Cài đặt tin cậy chứng nhận</strong> &gt; Bật xanh cho <strong>Anh Tu VIP Root CA</strong>.</li>
            </ol>
        </div>
        <div class="footer">Nguyễn Ngọc Anh Tú • Apex DNS Suite</div>
    </div>
</body>
</html>"""
    return html.encode("utf-8")

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class UnifiedRequestHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        # 1. RFC 8484 DoH Query (/dns-query?dns=...)
        if "/dns-query" in self.path:
            dns_b64 = None
            if "?dns=" in self.path:
                dns_b64 = self.path.split("?dns=")[1].split("&")[0]
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

        # 2. RevenueCat Subscribers Endpoint
        if "/v1/subscribers" in self.path or "revenuecat" in self.headers.get("Host", ""):
            payload = get_locket_gold_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload)
            return

        # 3. Spotify Endpoints
        host = self.headers.get("Host", "").lower()
        if "spotify.com" in host or "/user-customization" in self.path or "/bootstrap" in self.path:
            payload = b'{"status":200,"is_premium":true,"license":"premium","customization":{"license":"premium"}}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        # 4. Profile Download
        if self.path.endswith(".mobileconfig") or self.path in ("/profile", "/download"):
            if MOBILECONFIG_PATH.exists():
                data = MOBILECONFIG_PATH.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "application/x-apple-aspen-config")
                self.send_header("Content-Disposition", 'attachment; filename="AnhTu_VIP.mobileconfig"')
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
            else:
                self.send_error(404, "Profile not found. Please run generate_ca_and_profile.py first.")
                return

        # 5. CA Root Cert Download
        if self.path in ("/ca.crt", "/ca.der"):
            fpath = CERTS_DIR / self.path.lstrip("/")
            if fpath.exists():
                data = fpath.read_bytes()
                ctype = "application/x-x509-ca-cert" if self.path.endswith(".crt") else "application/pkix-cert"
                self.send_response(200)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return

        # 6. Default Web Landing
        landing = get_landing_html()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(landing)))
        self.end_headers()
        self.wfile.write(landing)

    def do_POST(self):
        # 1. RFC 8484 DoH POST
        if "/dns-query" in self.path:
            length = int(self.headers.get("Content-Length", 0))
            query_bytes = self.rfile.read(length)
            resp = process_dns_query(query_bytes)
            self.send_response(200)
            self.send_header("Content-Type", "application/dns-message")
            self.send_header("Content-Length", str(len(resp)))
            self.send_header("Cache-Control", "max-age=60")
            self.end_headers()
            self.wfile.write(resp)
            return

        # 2. Firebase Remote Config Fetch
        host_header = self.headers.get("Host", "").lower()
        if ("remoteconfig" in self.path or "firebaseremoteconfig" in host_header) and "youtube" not in host_header:
            payload = get_firebase_config_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        # 3. RevenueCat Receipts / Subscribers POST
        if "/receipts" in self.path or "/subscribers" in self.path or "revenuecat" in self.headers.get("Host", ""):
            payload = get_locket_gold_json()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        # 4. Locket CloudFunctions
        if "cloudfunctions" in self.headers.get("Host", "") or "locket" in self.path:
            payload = b'{"status":"success","result":{"is_vip":true,"vip":true,"gold":true}}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status":"ok"}')

    def log_message(self, format, *args):
        pass

def run_http_server(port: int = HTTP_PORT):
    try:
        httpd = ThreadedHTTPServer(("", port), UnifiedRequestHandler)
        print(f"🌍 HTTP Server đang chạy tại cổng {port} (Web landing & Profile download)...")
        httpd.serve_forever()
    except Exception as e:
        print(f"⚠️ Không thể khởi động HTTP port {port}: {e}")

def run_https_server(port: int = HTTPS_PORT):
    cert_file = CERTS_DIR / "server.crt"
    key_file = CERTS_DIR / "server.key"
    if not cert_file.exists() or not key_file.exists():
        print("❌ Chưa tìm thấy SSL certs! Vui lòng chạy generate_ca_and_profile.py trước.")
        return

    httpd = ThreadedHTTPServer(("", port), UnifiedRequestHandler)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=str(cert_file), keyfile=str(key_file))
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    print(f"🔒 HTTPS & DoH Server đang chạy tại cổng {port}...")
    print(f"👉 VPS IP: {SERVER_IP}")
    print(f"👉 Upstream DNS: {UPSTREAM_DNS}:{UPSTREAM_PORT}")
    try:
        httpd.serve_forever()
    except Exception as e:
        print(f"⚠️ Lỗi HTTPS Server: {e}")

if __name__ == "__main__":
    t_http = threading.Thread(target=run_http_server, args=(HTTP_PORT,), daemon=True)
    t_http.start()
    run_https_server(HTTPS_PORT)
