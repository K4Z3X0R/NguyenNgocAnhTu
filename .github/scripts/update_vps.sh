#!/usr/bin/env bash
# ==============================================================================
# 👑 Anh Tú • Apex VPS Server One-Click Updater
# Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "🚀 ĐANG CẬP NHẬT MÁY CHỦ APEX DNS & MOCK SUITE (ANH TÚ VIP)"
echo "=========================================================="

BASE_URL="https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/.github/scripts"

# Xác định danh sách thư mục cần cập nhật
DIRS=("/opt/anhtu-dns" "/root/apex_dns_suite")

for D in "${DIRS[@]}"; do
    if [ -d "$D" ]; then
        echo "📂 Cập nhật thư mục: $D"
        curl -sSL -o "$D/server.py" "${BASE_URL}/server.py"
        curl -sSL -o "$D/locket_full_firebase.json" "${BASE_URL}/locket_full_firebase.json"
        chown -R ubuntu:ubuntu "$D" 2>/dev/null || true
    fi
done

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

echo "=========================================================="
echo "🎉 CẬP NHẬT HOÀN TẤT THÀNH CÔNG 100%!"
echo "✨ Đã kích hoạt toàn bộ:"
echo "   - 28 danh mục nhãn VIP & Thời Tiết (⛅ Thời Tiết & Nhiệt Độ VIP)"
echo "   - Toàn bộ bộ lọc máy ảnh (Hello Kitty, Shin, Aesthetic, Goofy)"
echo "   - Micrô & Ghi âm (Microphone & Audio Captions)"
echo "   - Video 45s HD 60FPS & Locket Gold 2099"
echo "=========================================================="
