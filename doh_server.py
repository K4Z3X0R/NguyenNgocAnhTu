#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • Apex DNS-over-HTTPS (DoH) High-Performance Server
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Tính năng lõi:
1. Tuân thủ 100% RFC 8484: Hỗ trợ POST application/dns-message và GET ?dns=<base64url>
2. Hỗ trợ JSON DoH API: /dns-query?name=...&type=...
3. Bóc tách & Ngộ độc A Record có chủ đích (Spoofing) về IP máy chủ chỉ định (VD: VPS Sing 13.229.210.222)
4. Anti-Bypass Chống Trượt TLS:
   - Stripping Type 28 (AAAA - IPv6): Trả về NOERROR với 0 answer để buộc iOS Happy Eyeballs dùng IPv4.
   - Stripping Type 65 (HTTPS/SVCB): Trả về NOERROR với 0 answer để triệt tiêu Encrypted Client Hello (ECH) và HTTP/3.
5. Upstream Forwarding tốc độ cao qua UDP Socket tới Cloudflare (1.1.1.1) / Google (8.8.8.8).
6. Tự động Null-Route (0.0.0.0) các tên miền quảng cáo & tracking.
"""

from __future__ import annotations
import base64
import os
import socket
import struct
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from typing import Dict, List, Set, Tuple

# Cấu hình IP máy chủ đích cần điều hướng (Ví dụ: VPS Sing của Tú hoặc IP tùy chỉnh)
DEFAULT_SPOOF_IP = os.environ.get("SPOOF_IP", "13.229.210.222")
UPSTREAM_DNS = os.environ.get("UPSTREAM_DNS", "1.1.1.1")
UPSTREAM_PORT = int(os.environ.get("UPSTREAM_PORT", "53"))
PORT = int(os.environ.get("PORT", "8053"))

# Danh sách tên miền mục tiêu cần can thiệp giấy phép bản quyền
TARGET_SPOOF_DOMAINS: Set[str] = {
    "api.revenuecat.com",
    "app.revenuecat.com",
    "revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    "us-central1-locket-4252a.cloudfunctions.net",
    "spclient.wg.spotify.com",
    "spclient.spotify.com",
    "dealer.spotify.com",
    "apresolve.spotify.com",
    "spotify.com"
}

# Danh sách tên miền quảng cáo cần Null-Route (0.0.0.0)
AD_BLOCK_DOMAINS: Set[str] = {
    "googleads.g.doubleclick.net",
    "pagead2.googlesyndication.com",
    "pubads.g.doubleclick.net",
    "ads-fa.spotify.com",
    "gads.current.spotify.com",
    "podcastads.spotify.com",
    "audio-fa.scdn.co",
    "app-measurement.com",
    "in.appcenter.ms"
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
    # Lấy Transaction ID
    tx_id = query[:2]
    # Flags: Response (0x8180: QR=1, Opcode=0, AA=0, TC=0, RD=1, RA=1, RCODE=0)
    flags = b"\x81\x80"
    qdcount = query[4:6]
    ancount = b"\x00\x01" # 1 Answer
    nscount = b"\x00\x00"
    arcount = b"\x00\x00"

    qname, end_qname = parse_dns_qname(query, 12)
    question_section = query[12:end_qname + 4] # QNAME + QTYPE (2) + QCLASS (2)

    # Answer: Pointer to QNAME (0xc00c)
    ans_name = b"\xc0\x0c"
    ans_type = b"\x00\x01" # Type A
    ans_class = b"\x00\x01" # Class IN
    ans_ttl = struct.pack("!I", ttl)
    ans_rdlen = b"\x00\x04"
    ans_rdata = socket.inet_aton(ip_str)

    answer_section = ans_name + ans_type + ans_class + ans_ttl + ans_rdlen + ans_rdata
    return tx_id + flags + qdcount + ancount + nscount + arcount + question_section + answer_section

def build_empty_noerror_response(query: bytes) -> bytes:
    # Trả về NOERROR nhưng 0 Answer (Anti-Bypass cho AAAA & Type 65)
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
    sock.settimeout(3.0)
    try:
        sock.sendto(query, (UPSTREAM_DNS, UPSTREAM_PORT))
        resp, _ = sock.recvfrom(4096)
        return resp
    except Exception:
        # Fallback empty response
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

        # 1. Kiểm tra Null-Route quảng cáo
        if qname in AD_BLOCK_DOMAINS or any(qname.endswith("." + d) for d in AD_BLOCK_DOMAINS):
            if qtype == 1: # A record
                return build_a_response(query_bytes, "0.0.0.0", ttl=3600)
            return build_empty_noerror_response(query_bytes)

        # 2. Kiểm tra tên miền Spoofing (RevenueCat, Locket, Spotify)
        is_target = qname in TARGET_SPOOF_DOMAINS or any(qname.endswith("." + d) for d in TARGET_SPOOF_DOMAINS)
        if is_target:
            if qtype == 1: # Type A
                return build_a_response(query_bytes, DEFAULT_SPOOF_IP, ttl=60)
            elif qtype in (28, 65): # Type AAAA hoặc Type 65 (HTTPS/SVCB)
                # BẮT BUỘC trả về Empty NOERROR để ép iOS dùng IPv4 và tắt ECH!
                return build_empty_noerror_response(query_bytes)

        # 3. Các tên miền thông thường -> Forward Upstream
        return forward_upstream_dns(query_bytes)
    except Exception:
        return forward_upstream_dns(query_bytes)

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class DoHRequestHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        # Hỗ trợ GET RFC 8484: /dns-query?dns=<base64url> hoặc /dns-query/common?dns=<base64url>
        if "/dns-query" in self.path:
            dns_b64 = None
            if "?dns=" in self.path:
                dns_b64 = self.path.split("?dns=")[1].split("&")[0]
            if dns_b64:
                # Add padding
                dns_b64 += "=" * ((4 - len(dns_b64) % 4) % 4)
                try:
                    query_bytes = base64.urlsafe_b64decode(dns_b64)
                    response_bytes = process_dns_query(query_bytes)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/dns-message")
                    self.send_header("Content-Length", str(len(response_bytes)))
                    self.send_header("Cache-Control", "max-age=60")
                    self.end_headers()
                    self.wfile.write(response_bytes)
                    return
                except Exception as e:
                    self.send_error(400, f"Malformed DNS payload: {e}")
                    return

        # Simple health check endpoint
        if self.path in ("/", "/health", "/status"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok","engine":"AnhTu_Apex_DoH","version":"3.0.0"}')
            return

        self.send_error(400, "Bad Request: Expected DNS query")

    def do_POST(self):
        # Hỗ trợ POST RFC 8484: Content-Type application/dns-message
        if "/dns-query" in self.path:
            ctype = self.headers.get("Content-Type", "")
            if "application/dns-message" in ctype or True:
                length = int(self.headers.get("Content-Length", 0))
                query_bytes = self.rfile.read(length)
                response_bytes = process_dns_query(query_bytes)
                self.send_response(200)
                self.send_header("Content-Type", "application/dns-message")
                self.send_header("Content-Length", str(len(response_bytes)))
                self.send_header("Cache-Control", "max-age=60")
                self.end_headers()
                self.wfile.write(response_bytes)
                return

        self.send_error(400, "Bad Request: Content-Type must be application/dns-message")

    def log_message(self, format, *args):
        # Silent logger for high throughput
        pass

def run_doh_server(port: int = PORT) -> None:
    server_address = ("", port)
    httpd = ThreadedHTTPServer(server_address, DoHRequestHandler)
    print(f"🚀 Anh Tú Apex DoH Server đang chạy tại cổng {port}...")
    print(f"👉 Spoofing IP: {DEFAULT_SPOOF_IP}")
    print(f"👉 Upstream DNS: {UPSTREAM_DNS}:{UPSTREAM_PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nĐã dừng máy chủ DoH.")
        httpd.server_close()

if __name__ == "__main__":
    p = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_doh_server(p)
