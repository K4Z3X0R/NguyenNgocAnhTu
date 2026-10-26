#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • DNS 3-in-1 Profile Generator (v4.5.0)
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Hồ sơ cấu hình chuẩn Apple com.apple.dnsSettings.managed + Root CA:
- Sử dụng SupplementalMatchDomains: CHỈ định tuyến các domain cần can thiệp:
  + Locket Gold: api.revenuecat.com, app.revenuecat.com, firebaseremoteconfig.googleapis.com
  + Spotify Ads: ads-fa.spotify.com, gads.current.spotify.com, podcastads.spotify.com, audio-fa.scdn.co
  + YouTube Ads: pagead2.googlesyndication.com, doubleclick.net, googleads.g.doubleclick.net, pubads.g.doubleclick.net
  + Telemetry: in.appcenter.ms, app-measurement.com, firebaselogging-pa.googleapis.com, mixpanel.com
- Toàn bộ kết nối khác (youtube.com, spotify.com, locket.camera, google...) chạy 100% qua DNS gốc của mạng,
  hoàn toàn MIỄN NHIỄM lỗi rớt mạng, lỗi login hay nghẽn băng thông.
- Máy chủ DoH Singapore: https://13.229.210.222.sslip.io/dns-query (Chứng chỉ Let's Encrypt công khai).
"""

import uuid
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Embedded Anh Tu VIP Apex Root CA DER Base64 (Valid 2026-2036)
CA_DER_B64 = (
    "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"
    "56ErJF2b0D6JIAfDlSRsnzulas9h5uM="
)

MATCH_DOMAINS = [
    "revenuecat.com",
    "api.revenuecat.com",
    "app.revenuecat.com",
    "firebaseremoteconfig.googleapis.com",
    "ads-fa.spotify.com",
    "gads.current.spotify.com",
    "podcastads.spotify.com",
    "audio-ak-spotify-com.akamaized.net",
    "heads-ak-spotify-com.akamaized.net",
    "audio-fa.scdn.co",
    "crashdump.spotify.com",
    "log.spotify.com",
    "doubleclick.net",
    "googlesyndication.com",
    "googleadservices.com",
    "pagead2.googlesyndication.com",
    "pagead2.googleadservices.com",
    "adservice.google.com",
    "googleads.g.doubleclick.net",
    "pubads.g.doubleclick.net",
    "securepubads.g.doubleclick.net",
    "ads.youtube.com",
    "s.youtube.com",
    "video-stats.l.google.com",
    "in.appcenter.ms",
    "app-measurement.com",
    "firebaselogging-pa.googleapis.com",
    "mixpanel.com",
    "api.mixpanel.com"
]

def generate_mobileconfig(output_path: Path) -> None:
    top_uuid = str(uuid.uuid4()).upper()
    ca_uuid = str(uuid.uuid4()).upper()
    dns_uuid = str(uuid.uuid4()).upper()

    match_entries = "\n".join(f"                    <string>{d}</string>" for d in MATCH_DOMAINS)

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>👑 Anh Tú • DNS 3-in-1: Locket Gold + Spotify + YouTube</string>
    <key>PayloadDescription</key>
    <string>Mở khóa Locket Gold Vĩnh Viễn 2099 (Video 45s) + Chặn 100% Ads Spotify &amp; YouTube • Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze)</string>
    <key>PayloadIdentifier</key>
    <string>com.anhtu.dns.3in1.v4</string>
    <key>PayloadOrganization</key>
    <string>Nguyễn Ngọc Anh Tú (K4Z3X0R)</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>{top_uuid}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <!-- 1. ROOT CA CERTIFICATE (Cho phép giải mã kích hoạt Locket Gold 2099) -->
        <dict>
            <key>PayloadType</key>
            <string>com.apple.security.root</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.anhtu.rootca</string>
            <key>PayloadUUID</key>
            <string>{ca_uuid}</string>
            <key>PayloadDisplayName</key>
            <string>Anh Tú VIP Apex Root CA</string>
            <key>PayloadDescription</key>
            <string>Chứng chỉ gốc bảo mật kích hoạt Locket Gold VIP 2099 - Nguyễn Ngọc Anh Tú</string>
            <key>PayloadContent</key>
            <data>{CA_DER_B64}</data>
        </dict>
        
        <!-- 2. DNS-OVER-HTTPS PROFILE CHUẨN APPLE VỚI SupplementalMatchDomains -->
        <dict>
            <key>PayloadType</key>
            <string>com.apple.dnsSettings.managed</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.anhtu.dns.managed</string>
            <key>PayloadUUID</key>
            <string>{dns_uuid}</string>
            <key>PayloadDisplayName</key>
            <string>⚡ Anh Tú Apex DoH (Singapore)</string>
            <key>PayloadDescription</key>
            <string>Mã hóa DNS-over-HTTPS tốc độ cao qua máy chủ VPS Singapore của Tú</string>
            <key>DNSSettings</key>
            <dict>
                <key>DNSProtocol</key>
                <string>HTTPS</string>
                <key>ServerURL</key>
                <string>https://13.229.210.222.sslip.io/dns-query</string>
                <key>ServerAddresses</key>
                <array>
                    <string>13.229.210.222</string>
                </array>
                <key>SupplementalMatchDomains</key>
                <array>
{match_entries}
                </array>
            </dict>
            <key>OnDemandRules</key>
            <array>
                <dict>
                    <key>Action</key>
                    <string>Connect</string>
                </dict>
            </array>
        </dict>
    </array>
</dict>
</plist>
"""
    output_path.write_text(xml_content, encoding="utf-8")
    print(f"✅ Đã tạo cấu hình thành công: {output_path}")

    # Kiểm tra tính hợp lệ XML
    ET.fromstring(xml_content)
    print("✅ Kiểm định XML Parse: Hợp lệ 100%")

if __name__ == "__main__":
    out_file = ROOT / "DNS.mobileconfig"
    generate_mobileconfig(out_file)
    module_out = ROOT / "Module" / "Spotify_YouTube_DNS.mobileconfig"
    generate_mobileconfig(module_out)
