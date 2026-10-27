#!/usr/bin/env bash
# ==============================================================================
# 👑 Anh Tú • Apex VPS Server One-Click Updater
# Tác giả: Nguyễn Ngọc Anh Tú (@z3rokaze / K4Z3X0R)
# Tự động cập nhật: Locket Full Filters, Weather Overlays, Mic Flags, Ad-Block
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "🚀 ĐANG CẬP NHẬT MÁY CHỦ APEX DNS & MOCK SUITE (ANH TÚ VIP)"
echo "=========================================================="

SERVICE_FILE="/etc/systemd/system/apex-dns.service"
if [ -f "${SERVICE_FILE}" ]; then
    WORKDIR=$(grep "WorkingDirectory=" "${SERVICE_FILE}" | cut -d'=' -f2 | tr -d '"')
else
    WORKDIR="/root/apex_dns_suite"
fi

mkdir -p "${WORKDIR}"
cd "${WORKDIR}"
echo "📂 Thư mục làm việc: ${WORKDIR}"

BASE_URL="https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/.github/scripts"

echo "📦 Đang tải file server.py mới nhất..."
curl -sSL -o server.py "${BASE_URL}/server.py"

echo "📦 Đang tải file locket_full_firebase.json (Full Filters, Weather, Mic)..."
curl -sSL -o locket_full_firebase.json "${BASE_URL}/locket_full_firebase.json"

echo "🔄 Khởi động lại dịch vụ apex-dns..."
if systemctl is-active --quiet apex-dns; then
    systemctl restart apex-dns
elif [ -f "${SERVICE_FILE}" ]; then
    systemctl daemon-reload
    systemctl enable apex-dns
    systemctl restart apex-dns
else
    pkill -f "python3.*server.py" || true
    nohup /usr/bin/python3 "${WORKDIR}/server.py" > /var/log/apex-dns.log 2>&1 &
fi

echo "=========================================================="
echo "🎉 CẬP NHẬT HOÀN TẤT THÀNH CÔNG 100%!"
echo "✨ Đã kích hoạt toàn bộ:"
echo "   - 19 danh mục nhãn VIP & Thời Tiết (⛅ Thời Tiết & Nhiệt Độ VIP)"
echo "   - Toàn bộ bộ lọc máy ảnh (Camera Filters & Filter Packs)"
echo "   - Micrô & Ghi âm (Microphone & Audio Captions)"
echo "   - Video 45s HD 60FPS & Locket Gold 2099"
echo "=========================================================="
