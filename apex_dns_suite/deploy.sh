#!/usr/bin/env bash
# ==============================================================================
# 👑 Anh Tú • Apex DNS Suite: One-Click VPS Singapore Deployment
# Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "🚀 BẮT ĐẦU TRIỂN KHAI APEX DNS & MOCK SUITE TRÊN VPS"
echo "=========================================================="

# 1. Phát hiện IP công khai của VPS
PUBLIC_IP=$(curl -s https://api.ipify.org || curl -s https://ifconfig.me || echo "13.229.210.222")
echo "👉 Địa chỉ Public IP của VPS: ${PUBLIC_IP}"

# 2. Cài đặt Python3, pip và cryptography nếu chưa có
echo "📦 Đang cài đặt thư viện phụ thuộc..."
if command -v apt-get &> /dev/null; then
    apt-get update -qq && apt-get install -y -qq python3 python3-pip python3-cryptography curl
elif command -v yum &> /dev/null; then
    yum install -y python3 python3-pip curl
fi

pip3 install --quiet --upgrade cryptography || pip install --quiet --upgrade cryptography

# 3. Sinh Root CA, Server Cert và file .mobileconfig
echo "🔐 Đang khởi tạo Root CA và Mobileconfig cho IP ${PUBLIC_IP}..."
SERVER_IP="${PUBLIC_IP}" python3 generate_ca_and_profile.py

# 4. Kiểm tra port 80 và 443
echo "🔍 Kiểm tra xung đột cổng 80/443..."
if command -v fuser &> /dev/null; then
    fuser -k 80/tcp 2>/dev/null || true
    fuser -k 443/tcp 2>/dev/null || true
fi

# 5. Khởi chạy dưới dạng Systemd Daemon hoặc chạy nền
echo "⚙️ Thiết lập Systemd Service tự khởi động cùng VPS..."
SERVICE_FILE="/etc/systemd/system/apex-dns.service"
WORKDIR="$(pwd)"

cat <<EOF > "${SERVICE_FILE}"
[Unit]
Description=Anh Tu Apex DoH & Mock Interceptor Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${WORKDIR}
Environment="SERVER_IP=${PUBLIC_IP}"
Environment="UPSTREAM_DNS=1.1.1.1"
Environment="HTTPS_PORT=443"
Environment="HTTP_PORT=80"
ExecStart=/usr/bin/python3 ${WORKDIR}/server.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable apex-dns
systemctl restart apex-dns

echo "=========================================================="
echo "🎉 TRIỂN KHAI HOÀN TẤT THÀNH CÔNG 100%!"
echo "=========================================================="
echo "📲 Link tải và cài đặt Profile 1-chạm trên iPhone:"
echo "👉 http://${PUBLIC_IP}/"
echo "👉 http://${PUBLIC_IP}/AnhTu_VIP.mobileconfig"
echo "👉 https://${PUBLIC_IP}.sslip.io/"
echo ""
echo "📋 HƯỚNG DẪN DÀNH CHO IPHONE:"
echo "1. Mở Safari trên iPhone, truy cập: http://${PUBLIC_IP}/"
echo "2. Bấm 'Cài Đặt Profile iOS' -> Chọn Cho phép (Allow)."
echo "3. Vào Cài đặt > Đã tải về hồ sơ > Bấm Cài đặt."
echo "4. Vào Cài đặt > Cài đặt chung > Giới thiệu > Cài đặt tin cậy chứng nhận > Bật xanh 'Anh Tu VIP Root CA'."
echo "5. Mở Locket -> Đã có Locket Gold vĩnh viễn đến năm 2099 & Video 45s!"
echo "=========================================================="
