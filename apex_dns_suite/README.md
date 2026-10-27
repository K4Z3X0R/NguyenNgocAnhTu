# 👑 Anh Tú • Apex DNS & Mock Suite (Self-Hosted Locket Gold & Spotify Evasion)

Bộ giải pháp DoH Server và HTTPS Mock Server độc lập, tự vận hành 100% trên VPS cá nhân (Singapore / AWS / DigitalOcean / Vultr / Linode), tái tạo hoàn hảo logic từ DoH `doh.2707226.xyz` và cấu hình iOS profile `locket_com.mobileconfig`.

---

## ⚡ Kiến Trúc & Logic Hoạt Động

1. **Apple Configuration Profile (`AnhTu_VIP.mobileconfig`)**:
   - Nhúng chứng chỉ Root CA tự ký thời hạn 10 năm (`Anh Tu VIP Root CA`).
   - Cấu hình DoH `https://<VPS_IP>.sslip.io/dns-query/common`.
   - Giới hạn `SupplementalMatchDomains` chỉ tác động lên 8 tên miền mục tiêu:
     - `api.revenuecat.com`
     - `firebaseremoteconfig.googleapis.com`
     - `us-central1-locket-4252a.cloudfunctions.net`
     - `spclient.wg.spotify.com`, `spclient.spotify.com`, `dealer.spotify.com`, `apresolve.spotify.com`, `spotify.com`
   - Toàn bộ lưu lượng khác (Duyệt web, Zalo, Ngân hàng, Facebook) hoàn toàn đi qua DNS mặc định của mạng, an toàn 100%.

2. **Cơ Chế DNS Wire-Format Anti-Bypass**:
   - **Type A (IPv4)**: Trả về địa chỉ IP của VPS (`13.229.210.222`).
   - **Type 28 (AAAA - IPv6) Stripping**: Trả về `NOERROR` với 0 answer để bẻ gãy cơ chế Happy Eyeballs của iOS, buộc app kết nối qua IPv4.
   - **Type 65 (HTTPS/SVCB) Stripping**: Trả về `NOERROR` với 0 answer nhằm vô hiệu hóa Encrypted Client Hello (ECH) và Alt-Svc HTTP/3, ép dùng TCP 443 với SNI dạng rõ.
   - **Ad & Tracker Null-Routing**: Trả về `0.0.0.0` cho các mạng quảng cáo.

3. **HTTPS Mock Interceptor (Port 443 & Port 80)**:
   - Cung cấp chứng chỉ SSL đa miền được ký bởi Root CA.
   - Tự động phản hồi gói Locket Gold vĩnh viễn đến năm 2099 tại `/v1/subscribers/*` và `/v1/receipts`.
   - Tự động phản hồi video duration 45 giây cho Firebase Remote Config.
   - Cung cấp trang Web Installer tải 1-chạm tại cổng 80 & 443.

---

## 🚀 Triển Khai 1-Chạm Trên VPS (Singapore)

### Cách 1: Triển khai trực tiếp qua Shell Script (Khuyên dùng)
```bash
# Clone repo hoặc upload thư mục apex_dns_suite lên VPS
cd apex_dns_suite
chmod +x deploy.sh
sudo ./deploy.sh
```

### Cách 2: Triển khai qua Docker Compose
```bash
cd apex_dns_suite
python3 generate_ca_and_profile.py
docker compose up -d --build
```

---

## 📲 Hướng Dẫn Kích Hoạt Trên iPhone

1. Mở Safari trên iPhone, truy cập: `http://<IP_VPS>/` (Ví dụ: `http://13.229.210.222/`).
2. Bấm nút **📲 Cài Đặt Profile iOS (1-Chạm)** và chọn **Cho phép (Allow)**.
3. Mở **Cài đặt (Settings)** > **Đã tải về hồ sơ** > Bấm **Cài đặt**.
4. Mở **Cài đặt (Settings)** > **Cài đặt chung (General)** > **Giới thiệu (About)** > **Cài đặt tin cậy chứng nhận (Certificate Trust Settings)** > Gạt bật xanh cho **Anh Tu VIP Root CA**.
5. Mở Locket Widget -> Tận hưởng Locket Gold vĩnh viễn 2099 và thời lượng video 45 giây!
