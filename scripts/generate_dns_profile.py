#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Spotify & YouTube Ultra DNS Profile Generator (v2.9.5)
Tác giả: Nguyễn Ngọc Anh Tú (z3rokaze)

Hỗ trợ tạo hồ sơ cấu hình Apple .mobileconfig:
- Chặn 100% Audio Ads, Podcast Ads & Telemetry Spotify
- Chặn Video Ads, DoubleClick, Ptracking, QOE Stats của YouTube
- Bảo lưu Locket Gold vĩnh viễn (OnDemand NeverConnect)
- Upstream DoH AdGuard Anycast mã hóa TLS
"""

import sys
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SPOTIFY_DOMAINS = [
    "audio-ak-spotify-com.akamaized.net",
    "audio4-ak-spotify-com.akamaized.net",
    "heads-ak-spotify-com.akamaized.net",
    "heads4-ak-spotify-com.akamaized.net",
    "audio-sp-sto.pscdn.co",
    "audio-sp-ash.pscdn.co",
    "audio-sp-dca.pscdn.co",
    "audio-sp-lon.pscdn.co",
    "podcastads.spotify.com",
    "ads-fa.spotify.com",
    "gads.current.spotify.com",
    "creativeservice-production.scdn.co",
    "analytics.spotify.com",
    "adeventtracker.spotify.com",
    "log.spotify.com",
]

YOUTUBE_DOMAINS = [
    "pagead2.googlesyndication.com",
    "pagead2.googleadservices.com",
    "adservice.google.com",
    "afs.googlesyndication.com",
    "doubleclick.net",
    "googleads.g.doubleclick.net",
    "pubads.g.doubleclick.net",
    "securepubads.g.doubleclick.net",
    "static.doubleclick.net",
    "s.youtube.com",
    "video-stats.l.google.com",
    "youtube-ui.l.google.com",
    "ads.youtube.com",
    "yt-ad-events.l.google.com",
]

LOCKET_DOMAINS = [
    "api.revenuecat.com",
    "api-production.revenuecat.com",
    "api-staging.revenuecat.com",
    "api.rc-backup.com",
]

def generate_mobileconfig(output_path: Path) -> None:
    all_blocked = SPOTIFY_DOMAINS + YOUTUBE_DOMAINS + LOCKET_DOMAINS
    blocked_xml_entries = "\n".join(f"                                <string>{d}</string>" for d in all_blocked)

    payload_uuid = str(uuid.uuid4()).upper()
    top_uuid = str(uuid.uuid4()).upper()

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>DNSSettings</key>
            <dict>
                <key>DNSProtocol</key>
                <string>HTTPS</string>
                <key>ServerAddresses</key>
                <array>
                    <string>94.140.14.14</string>
                    <string>94.140.15.15</string>
                    <string>2a10:50c0::ad1:ff</string>
                    <string>2a10:50c0::ad2:ff</string>
                </array>
                <key>ServerURL</key>
                <string>https://dns.adguard-dns.com/dns-query</string>
            </dict>
            <key>OnDemandRules</key>
            <array>
                <dict>
                    <key>Action</key>
                    <string>EvaluateConnection</string>
                    <key>ActionParameters</key>
                    <array>
                        <dict>
                            <key>DomainAction</key>
                            <string>NeverConnect</string>
                            <key>Domains</key>
                            <array>
{blocked_xml_entries}
                            </array>
                        </dict>
                    </array>
                </dict>
                <dict>
                    <key>Action</key>
                    <string>Connect</string>
                </dict>
            </array>
            <key>PayloadDescription</key>
            <string>Chặn 100% quảng cáo Spotify Audio/Podcast, YouTube Ads &amp; Giữ Locket Gold • Mã hóa DoH Anycast AdGuard tốc độ cao • Không tốn pin • Bảo toàn thông báo đẩy</string>
            <key>PayloadDisplayName</key>
            <string>⚡ Spotify &amp; YouTube Ultra Clean DNS 🎵▶️</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.dnsSettings.managed.spotify.youtube.clean.v4</string>
            <key>PayloadType</key>
            <string>com.apple.dnsSettings.managed</string>
            <key>PayloadUUID</key>
            <string>{payload_uuid}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>ProhibitDisablement</key>
            <false/>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>✨ Cấu hình DNS Chuyên Dụng: Triệt hạ hoàn toàn Audio Ads Spotify, Video Ads YouTube &amp; Bảo lưu Locket Gold • Nền tảng Apple OnDemand NeverConnect Layer-4 • Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze)</string>
    <key>PayloadDisplayName</key>
    <string>👑 Anh Tú • Spotify &amp; YouTube Ultra DNS 🎵▶️</string>
    <key>PayloadIdentifier</key>
    <string>com.z3rokaze.profile.spotify.youtube.dns.v4</string>
    <key>PayloadOrganization</key>
    <string>Nguyễn Ngọc Anh Tú (z3rokaze)</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>{top_uuid}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
"""
    output_path.write_text(xml_content, encoding="utf-8")
    print(f"✅ Đã tạo cấu hình thành công: {output_path}")

    # Kiểm tra tính hợp lệ XML
    ET.fromstring(xml_content)
    print(f"✅ Kiểm định XML Parse: Hợp lệ 100% ({len(all_blocked)} rules OnDemand)")

if __name__ == "__main__":
    out_file = ROOT / "DNS.mobileconfig"
    generate_mobileconfig(out_file)
    module_out = ROOT / "Module" / "Spotify_YouTube_DNS.mobileconfig"
    generate_mobileconfig(module_out)
