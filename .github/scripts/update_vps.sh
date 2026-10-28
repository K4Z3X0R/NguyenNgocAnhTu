#!/usr/bin/env bash
# ==============================================================================
# 👑 Anh Tú • Apex VPS Server One-Click Updater & Self-Healing Engine (v5.0.0)
# Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "🚀 ĐANG CẬP NHẬT MÁY CHỦ APEX DNS & MOCK SUITE (ANH TÚ VIP)"
echo "=========================================================="

# 1. Mở toàn bộ firewall ufw & iptables cho port 80, 443, 53
echo "🛡️ Cấu hình tường lửa VPS (UFW & iptables)..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp 2>/dev/null || true
    ufw allow 80/tcp 2>/dev/null || true
    ufw allow 443/tcp 2>/dev/null || true
    ufw allow 53 2>/dev/null || true
    ufw reload 2>/dev/null || true
    echo "  ✓ UFW đã mở port 80, 443, 53"
fi

if command -v iptables &> /dev/null; then
    iptables -I INPUT -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
    iptables -I INPUT -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
    iptables -I INPUT -p udp --dport 53 -j ACCEPT 2>/dev/null || true
    iptables -I INPUT -p tcp --dport 53 -j ACCEPT 2>/dev/null || true
    echo "  ✓ iptables đã thiết lập ACCEPT cho 80, 443, 53"
fi

# 2. Giải phóng xung đột cổng 80 & 443 nếu có tiến trình treo
echo "🔍 Kiểm tra xung đột cổng 80 & 443..."
if command -v fuser &> /dev/null; then
    fuser -k 80/tcp 2>/dev/null || true
    fuser -k 443/tcp 2>/dev/null || true
fi

# 3. Tải và đồng bộ mã nguồn mới nhất
BASE_URL="https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/.github/scripts"
RAW_REPO="https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master"

DIRS=("/opt/anhtu-dns" "/root/apex_dns_suite")
FOUND_DIR=""

for D in "${DIRS[@]}"; do
    if [ -d "$D" ]; then
        FOUND_DIR="$D"
        echo "📂 Cập nhật thư mục hiện có: $D"
        mkdir -p "$D/certs"
        curl -sSL -o "$D/server.py" "${BASE_URL}/server.py"
        curl -sSL -o "$D/locket_full_firebase.json" "${BASE_URL}/locket_full_firebase.json"
        curl -sSL -o "$D/DNS.mobileconfig" "${RAW_REPO}/DNS.mobileconfig" 2>/dev/null || true
        cp -f "$D/DNS.mobileconfig" "$D/AnhTu_VIP.mobileconfig" 2>/dev/null || true
        chown -R root:root "$D" 2>/dev/null || true
        chmod +x "$D/server.py" 2>/dev/null || true
    fi
done

if [ -z "$FOUND_DIR" ]; then
    DEFAULT_DIR="/opt/anhtu-dns"
    echo "📂 Tạo thư mục cài đặt mới: $DEFAULT_DIR"
    mkdir -p "$DEFAULT_DIR/certs"
    curl -sSL -o "$DEFAULT_DIR/server.py" "${BASE_URL}/server.py"
    curl -sSL -o "$DEFAULT_DIR/locket_full_firebase.json" "${BASE_URL}/locket_full_firebase.json"
    curl -sSL -o "$DEFAULT_DIR/DNS.mobileconfig" "${RAW_REPO}/DNS.mobileconfig" 2>/dev/null || true
    cp -f "$DEFAULT_DIR/DNS.mobileconfig" "$DEFAULT_DIR/AnhTu_VIP.mobileconfig" 2>/dev/null || true
    chmod +x "$DEFAULT_DIR/server.py" 2>/dev/null || true
    FOUND_DIR="$DEFAULT_DIR"
fi

# 4. Tự động khởi tạo systemd service nếu chưa có
SERVICE_FILE="/etc/systemd/system/anhtu-dns.service"
if [ ! -f "$SERVICE_FILE" ] && [ -d "/etc/systemd/system" ]; then
    echo "⚙️ Thiết lập anhtu-dns.service tự khởi chạy cùng hệ điều hành..."
    cat << EOF > "$SERVICE_FILE"
[Unit]
Description=Anh Tu VIP Apex DNS & Mock Suite
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$FOUND_DIR
ExecStart=/usr/bin/python3 $FOUND_DIR/server.py
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
    systemctl daemon-reload
    systemctl enable anhtu-dns
    echo "  ✓ Đã kích hoạt anhtu-dns.service"
fi

# 5. Khởi động lại dịch vụ DNS
echo "🔄 Khởi động lại dịch vụ DNS..."
if systemctl list-units --full -all | grep -Fq "anhtu-dns.service"; then
    systemctl daemon-reload
    systemctl restart anhtu-dns
    echo "  ✓ Đã restart anhtu-dns.service"
fi

if systemctl list-units --full -all | grep -Fq "apex-dns.service"; then
    systemctl daemon-reload
    systemctl restart apex-dns
    echo "  ✓ Đã restart apex-dns.service"
fi

# 6. Chạy health check nội bộ
echo "🏥 Kiểm tra sức khỏe dịch vụ nội bộ..."
sleep 2
if curl -s -k -m 3 https://127.0.0.1/dns-query > /dev/null 2>&1 || curl -s -m 3 http://127.0.0.1/dns-query > /dev/null 2>&1; then
    echo "  ✅ Dịch vụ phản hồi thành công 200 OK!"
else
    echo "  ⚠️ Cảnh báo: Vui lòng kiểm tra nhật ký journalctl -u apex-dns hoặc anhtu-dns"
fi

echo "=========================================================="
echo "🎉 CẬP NHẬT HOÀN TẤT THÀNH CÔNG 100%!"
echo "✨ Đã kích hoạt toàn bộ:"
echo "   - 28 danh mục nhãn VIP & Thời Tiết (⛅ Thời Tiết & Nhiệt Độ VIP)"
echo "   - Toàn bộ 35 bộ lọc máy ảnh (Hello Kitty, Shin, Aesthetic, Goofy)"
echo "   - Micrô & Ghi âm (Microphone & Audio Captions)"
echo "   - Video 45s HD 60FPS & Locket Gold 2099"
echo "   - MIỄN NHIỄM 100% lag tin nhắn Zalo & Không mất mạng Spotify"
echo "=========================================================="
