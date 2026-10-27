#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
👑 Anh Tú • Apex DNS Suite: Bộ Tạo Root CA, Chứng Chỉ TLS & Apple Profile .mobileconfig
Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)

Tự động sinh:
1. Root CA X.509 tự ký (RSA 2048-bit, thời hạn 10 năm 2026-2036).
2. Server Certificate đa miền (SAN) bao phủ RevenueCat, Google CloudFunctions, Spotify, DoH Gateway.
3. Apple Configuration Profile chuẩn 1-chạm (.mobileconfig) với cấu trúc và logic y hệt locket_com.
"""

from __future__ import annotations
import base64
import datetime
import os
import uuid
from pathlib import Path
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID, ExtensionOID

BASE_DIR = Path(__file__).resolve().parent
CERTS_DIR = BASE_DIR / "certs"
CERTS_DIR.mkdir(parents=True, exist_ok=True)

def generate_root_ca() -> Tuple[rsa.RSAPrivateKey, x509.Certificate, bytes]:
    print("🔐 Đang tạo Root CA: 'Anh Tu VIP Root CA'...")
    ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048, backend=default_backend())

    now = datetime.datetime.now(datetime.timezone.utc)
    ca_name = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "VN"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "NguyenNgocAnhTu"),
        x509.NameAttribute(NameOID.COMMON_NAME, "Anh Tu VIP Root CA"),
    ])

    ca_cert = (
        x509.CertificateBuilder()
        .subject_name(ca_name)
        .issuer_name(ca_name)
        .public_key(ca_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - datetime.timedelta(days=1))
        .not_valid_after(now + datetime.timedelta(days=3650)) # 10 năm
        .add_extension(x509.BasicConstraints(ca=True, path_length=None), critical=True)
        .add_extension(
            x509.KeyUsage(
                digital_signature=True,
                key_encipherment=False,
                key_cert_sign=True,
                crl_sign=True,
                content_commitment=False,
                data_encipherment=False,
                key_agreement=False,
                encipher_only=False,
                decipher_only=False
            ),
            critical=True
        )
        .add_extension(x509.SubjectKeyIdentifier.from_public_key(ca_key.public_key()), critical=False)
        .sign(ca_key, hashes.SHA256(), default_backend())
    )

    ca_der = ca_cert.public_bytes(serialization.Encoding.DER)
    ca_pem = ca_cert.public_bytes(serialization.Encoding.PEM)
    ca_key_pem = ca_key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.TraditionalOpenSSL,
        serialization.NoEncryption()
    )

    (CERTS_DIR / "ca.crt").write_bytes(ca_pem)
    (CERTS_DIR / "ca.key").write_bytes(ca_key_pem)
    (CERTS_DIR / "ca.der").write_bytes(ca_der)
    print("  ✓ Đã lưu certs/ca.crt và certs/ca.key thành công.")
    return ca_key, ca_cert, ca_der

def generate_server_cert(ca_key: rsa.RSAPrivateKey, ca_cert: x509.Certificate, server_host: str = "13.229.210.222") -> None:
    print(f"🔒 Đang ký Server Certificate đa miền cho '{server_host}'...")
    server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048, backend=default_backend())

    now = datetime.datetime.now(datetime.timezone.utc)
    server_name = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "VN"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "NguyenNgocAnhTu"),
        x509.NameAttribute(NameOID.COMMON_NAME, "*.revenuecat.com"),
    ])

    san_domains = [
        "api.revenuecat.com",
        "*.revenuecat.com",
        "revenuecat.com",
        "app.revenuecat.com",
        "firebaseremoteconfig.googleapis.com",
        "us-central1-locket-4252a.cloudfunctions.net",
        "spclient.wg.spotify.com",
        "spclient.spotify.com",
        "dealer.spotify.com",
        "apresolve.spotify.com",
        "spotify.com",
        "*.spotify.com",
        "doh.anhtu.vip",
        f"{server_host}.sslip.io",
        server_host
    ]

    san_list: List[x509.GeneralName] = []
    for d in san_domains:
        try:
            import ipaddress
            san_list.append(x509.IPAddress(ipaddress.ip_address(d)))
        except ValueError:
            san_list.append(x509.DNSName(d))

    server_cert = (
        x509.CertificateBuilder()
        .subject_name(server_name)
        .issuer_name(ca_cert.subject)
        .public_key(server_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - datetime.timedelta(days=1))
        .not_valid_after(now + datetime.timedelta(days=1825)) # 5 năm
        .add_extension(x509.BasicConstraints(ca=False, path_length=None), critical=True)
        .add_extension(x509.SubjectAlternativeName(san_list), critical=False)
        .sign(ca_key, hashes.SHA256(), default_backend())
    )

    server_pem = server_cert.public_bytes(serialization.Encoding.PEM)
    server_key_pem = server_key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.TraditionalOpenSSL,
        serialization.NoEncryption()
    )

    (CERTS_DIR / "server.crt").write_bytes(server_pem)
    (CERTS_DIR / "server.key").write_bytes(server_key_pem)
    print("  ✓ Đã lưu certs/server.crt và certs/server.key thành công.")

def generate_mobileconfig(ca_der: bytes, server_host: str = "13.229.210.222", output_path: Path = None) -> None:
    if output_path is None:
        output_path = BASE_DIR / "AnhTu_VIP.mobileconfig"

    ca_b64 = base64.b64encode(ca_der).decode("utf-8")
    top_uuid = str(uuid.uuid4())
    ca_uuid = str(uuid.uuid4())
    dns_uuid = str(uuid.uuid4())

    server_url = f"https://{server_host}.sslip.io/dns-query/common"

    # Cấu trúc XML chuẩn 100% y hệt locket_com 1.mobileconfig
    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadCertificateFileName</key>
            <string>Anh Tu VIP Root CA</string>
            <key>PayloadContent</key>
            <data>{ca_b64}</data>
            <key>PayloadDescription</key>
            <string>Adds a CA root certificate</string>
            <key>PayloadDisplayName</key>
            <string>Anh Tu VIP CA</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.security.root.{ca_uuid}</string>
            <key>PayloadType</key>
            <string>com.apple.security.root</string>
            <key>PayloadUUID</key>
            <string>{ca_uuid}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
        </dict>
        <dict>
            <key>DNSSettings</key>
            <dict>
                <key>DNSProtocol</key>
                <string>HTTPS</string>
                <key>ServerURL</key>
                <string>{server_url}</string>
                <key>ServerAddresses</key>
                <array>
                    <string>{server_host}</string>
                </array>
                <key>SupplementalMatchDomains</key>
                <array>
                    <string>api.revenuecat.com</string>
                    <string>firebaseremoteconfig.googleapis.com</string>
                    <string>us-central1-locket-4252a.cloudfunctions.net</string>
                    <string>spclient.wg.spotify.com</string>
                    <string>spclient.spotify.com</string>
                    <string>dealer.spotify.com</string>
                    <string>apresolve.spotify.com</string>
                    <string>spotify.com</string>
                </array>
            </dict>
            <key>PayloadDescription</key>
            <string>DNS-over-HTTPS via Anh Tu VIP Apex</string>
            <key>PayloadDisplayName</key>
            <string>Anh Tu VIP DNS</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.dnsSettings.managed.{dns_uuid}</string>
            <key>PayloadType</key>
            <string>com.apple.dnsSettings.managed</string>
            <key>PayloadUUID</key>
            <string>{dns_uuid}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Anh Tu VIP Apex • Locket Gold 2099 &amp; Spotify Premium</string>
    <key>PayloadDisplayName</key>
    <string>anhtu.vip</string>
    <key>PayloadIdentifier</key>
    <string>com.camsitup.locket.dns_profile.k4z3x0r</string>
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
    print(f"📱 Đã xuất cấu hình iOS thành công: {output_path}")

if __name__ == "__main__":
    host = os.environ.get("SERVER_IP", "13.229.210.222")
    ca_k, ca_c, ca_d = generate_root_ca()
    generate_server_cert(ca_k, ca_c, host)
    generate_mobileconfig(ca_d, host)
