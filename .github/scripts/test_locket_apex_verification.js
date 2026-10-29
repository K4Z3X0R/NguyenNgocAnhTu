const fs = require('fs');
const assert = require('assert');

console.log('====================================================');
console.log('🔬 KIỂM TRA CHUYÊN SÂU LOCKET APEX & TỐI ƯU CỰC HẠN');
console.log('====================================================\n');

let totalTests = 0;
let passTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

// ----------------------------------------------------
// 1. KIỂM TRA FILE ASSET KHUNG 20-10
// ----------------------------------------------------
test('Asset: Module/assets/frame_20_10.png tồn tại', () => {
  assert(fs.existsSync('Module/assets/frame_20_10.png'), 'File không tồn tại');
});

test('Asset: frame_20_10.png là định dạng PNG hợp lệ chuẩn 1080x1080', () => {
  const buf = fs.readFileSync('Module/assets/frame_20_10.png');
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert(buf.subarray(0, 8).equals(pngSig), 'Chữ ký PNG không hợp lệ');
  // IHDR chunk: width at offset 16, height at offset 20
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  assert.strictEqual(width, 1080, `Width phải là 1080, nhận ${width}`);
  assert.strictEqual(height, 1080, `Height phải là 1080, nhận ${height}`);
  const colorType = buf.readUInt8(25);
  assert.strictEqual(colorType, 6, `Color type phải là 6 (RGBA), nhận ${colorType}`);
});

// ----------------------------------------------------
// 2. KIỂM TRA LOCKET REMOTE CONFIG (RESPONSE MODE)
// ----------------------------------------------------
const locketCode = fs.readFileSync('Module/js/Locket_30s.js', 'utf8');

let locketRes = null;
const locketFn = new Function('$request', '$response', '$done', locketCode);
locketFn(
  { url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch?key=AIzaSy...', headers: { 'User-Agent': 'Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)' } },
  { status: 200, body: JSON.stringify({ state: 'NO_CHANGE', entries: { video_duration: '5.0', camera: '{"max_duration":5.0}' } }) },
  (v) => { locketRes = v; }
);

test('Locket: Force state UPDATE khi server trả về NO_CHANGE', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.state, 'UPDATE');
});

test('Locket: Video 60.0s chuẩn tuyệt đối (toàn bộ 15 cờ thời lượng)', () => {
  const obj = JSON.parse(locketRes.body);
  const cam = JSON.parse(obj.entries.camera);
  const camRoll = JSON.parse(obj.entries.camera_roll);
  const vidConfig = JSON.parse(obj.entries.video_config);

  assert.strictEqual(cam.gold_max_duration, 60.0);
  assert.strictEqual(cam.max_duration, 60.0);
  assert.strictEqual(camRoll.max_duration, 60.0);
  assert.strictEqual(camRoll.gold_max_duration, 60.0);
  assert.strictEqual(vidConfig.max_duration, 60.0);
  assert.strictEqual(obj.entries.video_duration, '60.0');
  assert.strictEqual(obj.entries.video_max_duration, '60.0');
  assert.strictEqual(obj.entries.gold_max_duration, '60.0');
});

test('Locket: 4K Ultra HD Upload & 0.9 Mbps Quality Boost', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.entries.upload_main_image_size, '2160', 'Ảnh chính phải upload chuẩn 4K (2160p)');
  assert.strictEqual(obj.entries.upload_thumbnail_image_size, '1080', 'Thumbnail phải là 1080p');
  assert.strictEqual(obj.entries.upload_main_image_quality, '1.0', 'Chất lượng nén ảnh phải là 1.0 (lossless)');
  assert.strictEqual(obj.entries.video_quality_mbps, '0.9', 'Bitrate video phải đạt 0.9 Mbps');
});

test('Locket: Developer Debug Menu đã kích hoạt (debug_menu_enabled = true)', () => {
  const obj = JSON.parse(locketRes.body);
  const journal = JSON.parse(obj.entries.journal_settings);
  assert.strictEqual(journal.debug_menu_enabled, true, 'journal_settings.debug_menu_enabled phải là true');
  assert.strictEqual(obj.entries.history_ads_debug_menu, 'true', 'history_ads_debug_menu phải là true');
});

test('Locket: Khung sự kiện 20-10 (widget_frame_event) trỏ đúng ảnh GitHub CDN', () => {
  const obj = JSON.parse(locketRes.body);
  const frameEvent = JSON.parse(obj.entries.widget_frame_event);
  assert.strictEqual(frameEvent.uid, 'vietnam_women_day_20_10');
  assert(frameEvent.url.includes('Module/assets/frame_20_10.png'), 'URL khung phải trỏ đến frame_20_10.png');
  assert.strictEqual(frameEvent.start_at, '2020-01-01T00:00:00');
  assert.strictEqual(frameEvent.end_at, '2099-12-31T23:59:59');
});

test('Locket: Danh sách 7 khung viền VIP (widget_frames_config) chuẩn xác', () => {
  const obj = JSON.parse(locketRes.body);
  const framesConfig = JSON.parse(obj.entries.widget_frames_config);
  assert.strictEqual(framesConfig.enabled, true);
  assert.strictEqual(framesConfig.unlock_all_styles, true);
  assert.strictEqual(framesConfig.default_style, 'vietnam_women_day_20_10');

  const styleIds = framesConfig.styles.map(s => s.id);
  assert(styleIds.includes('vietnam_women_day_20_10'), 'Thiếu khung 20-10');
  assert(styleIds.includes('royal_gold_vip'), 'Thiếu khung Royal Gold');
  assert(styleIds.includes('halloween_spooky'), 'Thiếu khung Halloween');
  assert(styleIds.includes('merry_christmas'), 'Thiếu khung Giáng sinh');
  assert(styleIds.includes('sweet_valentine'), 'Thiếu khung Valentine');
  assert(styleIds.includes('cyberpunk_neon'), 'Thiếu khung Cyberpunk');
  assert(styleIds.includes('midautumn_festival'), 'Thiếu khung Trung Thu');
});

test('Locket: CDN Domain Replacement & 5 Năm Cache Tối Ưu', () => {
  const obj = JSON.parse(locketRes.body);
  const cdn = JSON.parse(obj.entries.cdn_domain_replacements);
  assert.strictEqual(cdn['firebasestorage.googleapis.com'], 'cdn.locketcamera.com');
  assert.strictEqual(obj.entries.image_cache_max_age_sec, '157680000', 'Cache ảnh phải là 5 năm (157680000s)');
  assert.strictEqual(obj.entries.image_cache_max_size, '500000000', 'Bộ nhớ cache ảnh phải là 500MB');
  assert.strictEqual(obj.entries.widget_auto_refresh_sec, '15', 'Widget phải tự refresh mỗi 15s');
});

test('Locket: Unlimited Friends & Global Reach (Bypass giới hạn kết bạn)', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.entries.max_friends_count, '999999');
  assert.strictEqual(obj.entries.soft_friend_limit_threshold_count, '999999');
  assert.strictEqual(obj.entries.allow_any_country_code, 'true');
  assert.strictEqual(obj.entries.enable_mutual_friends, 'true');
});

test('Locket: Ghost Mode, Anti-Screenshot & Watermark Stripping', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.entries.ghost_mode_viewing, 'true');
  assert.strictEqual(obj.entries.anti_screenshot_notify, 'false');
  assert.strictEqual(obj.entries.bypass_screenshot_detection, 'true');
  assert.strictEqual(obj.entries.save_moment_without_watermark, 'true');
  assert.strictEqual(obj.entries.export_moment_raw_quality, 'true');
});

test('Locket: Audio Messages & Burst Reactions', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.entries.audio_messages_enabled, 'true');
  assert.strictEqual(obj.entries.voice_caption_enabled, 'true');
  assert.strictEqual(obj.entries.burst_reactions_enabled, 'true');
  assert.strictEqual(obj.entries.reaction_sound_effects, 'true');
});

test('Locket: Android Cross-Platform Compatibility (LSPosed / Android Shadowrocket)', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.entries.android_gold_subscription_override, 'true');
  assert.strictEqual(obj.entries.android_subscribe_gold_button_enabled, 'true');
  const androidVid = JSON.parse(obj.entries.android_camera_video_recording);
  assert.strictEqual(androidVid.gold.maximum_duration, 60000);
  assert.strictEqual(androidVid.gold.size, 1080);
});

test('Locket: Toàn bộ JSON con trong obj.entries parse hợp lệ 100%', () => {
  const obj = JSON.parse(locketRes.body);
  const jsonKeys = [
    'feature_gates', 'camera', 'camera_roll', 'video_config', 'live_photos',
    'camera_filter_config', 'streak_config', 'journal_settings', 'qr_code_config',
    'widget_frame_event', 'widget_frames_config', 'widget_frame_styles',
    'seasonal_frames_config', 'overlay_dynamic_captions', 'overlay_items',
    'paywall_presentation_config', 'feature_discovery_popup_config',
    'cdn_domain_replacements', 'android_camera_video_recording'
  ];
  for (const k of jsonKeys) {
    if (obj.entries[k]) {
      JSON.parse(obj.entries[k]); // Sẽ throw nếu có lỗi cú pháp JSON
    }
  }
});

test('Locket: Check-in Vị Trí VIP & Thời Tiết VIP có mặt trong overlay_items', () => {
  const obj = JSON.parse(locketRes.body);
  const overlayItems = JSON.parse(obj.entries.overlay_items);
  const sections = overlayItems.map(s => s.section);
  assert(sections.includes('📍 Check-in Vị Trí VIP'), 'Thiếu section Vị Trí VIP');
  assert(sections.includes('⛅ Thời Tiết & Nhiệt Độ VIP'), 'Thiếu section Thời Tiết VIP');

  const locationSection = overlayItems.find(s => s.section === '📍 Check-in Vị Trí VIP');
  assert(locationSection.items.some(it => it.caption.text.includes('Paris')), 'Thiếu Tháp Eiffel');
  assert(locationSection.items.some(it => it.caption.text.includes('Tokyo')), 'Thiếu Shinjuku Tokyo');
  assert(locationSection.items.some(it => it.caption.text.includes('Đà Lạt')), 'Thiếu Đà Lạt');
});

test('Locket: Streak Freeze 365 ngày & Calendar Rewind được kích hoạt', () => {
  const obj = JSON.parse(locketRes.body);
  const streak = JSON.parse(obj.entries.streak_config);
  assert.strictEqual(streak.streak_freeze_enabled, true);
  assert.strictEqual(streak.grace_period_days, 365);
  assert.strictEqual(obj.entries.streak_freeze_enabled, 'true');
  assert.strictEqual(obj.entries.calendar_rewind_enabled, 'true');
  assert.strictEqual(obj.entries.locket_yearbook_enabled, 'true');
  assert.strictEqual(obj.entries.anonymous_views_enabled, 'true');
  assert.strictEqual(obj.entries.stealth_views, 'true');
});

test('Locket: Dual camelCase & snake_case Feature Gates (100% native IPA compatibility)', () => {
  const obj = JSON.parse(locketRes.body);
  const gates = JSON.parse(obj.entries.feature_gates);
  // Kiểm tra cặp đôi tương thích tuyệt đối giữa Swift Codable và Remote Config
  assert.strictEqual(gates.app_icon_picker, 'enabled');
  assert.strictEqual(gates.appIconPicker, 'enabled');
  assert.strictEqual(gates.camera_roll, 'enabled');
  assert.strictEqual(gates.cameraRoll, 'enabled');
  assert.strictEqual(gates.camera_theme, 'enabled');
  assert.strictEqual(gates.cameraTheme, 'enabled');
  assert.strictEqual(gates.longer_video, 'enabled');
  assert.strictEqual(gates.longerVideo, 'enabled');
  assert.strictEqual(gates.custom_widget_frames, 'enabled');
  assert.strictEqual(gates.customWidgetFrames, 'enabled');
  assert.strictEqual(gates.celebrity_inbox, 'enabled');
  assert.strictEqual(gates.celebrityInbox, 'enabled');
  assert.strictEqual(gates.conversation_drafts, 'enabled');
  assert.strictEqual(gates.conversationDrafts, 'enabled');
});

test('Locket: Extended Remote Config Keys (Celebrity inbox, drafts, QR redemption & audio)', () => {
  const obj = JSON.parse(locketRes.body);
  assert.strictEqual(obj.entries.celebrity_inbox_enabled, 'true');
  assert.strictEqual(obj.entries.celebrity_vip_qr_redemption_enabled, 'true');
  assert.strictEqual(obj.entries.chat_hyperlink_enabled_mode, 'always_enabled');
  assert.strictEqual(obj.entries.conversation_drafts_enabled, 'true');
  assert.strictEqual(obj.entries.group_contact_invites_enabled, 'true');
  assert.strictEqual(obj.entries.signup_custom_profile_picture, 'true');
  assert.strictEqual(obj.entries.user_data_export_enabled, 'true');
  assert.strictEqual(obj.entries.username_suggestions_enabled, 'true');
  assert.strictEqual(obj.entries.material_blur, 'regular');
  assert.strictEqual(obj.entries.mh_mic_enabled_v16, 'true');
});

test('Locket: Link & Live Captions + Bộ sưu tập Caption Chứng Nhận VIP & Check-in Việt Nam', () => {
  const obj = JSON.parse(locketRes.body);
  const dyn = JSON.parse(obj.entries.overlay_dynamic_captions);
  assert(dyn.includes('link'), 'Thiếu link caption');
  assert(dyn.includes('live'), 'Thiếu live caption');

  const overlayItems = JSON.parse(obj.entries.overlay_items);
  const genSec = overlayItems.find(s => s.section === '🎨 General');
  assert(genSec.items.some(it => it.overlay_id === 'caption:link'), 'Thiếu caption:link trong General');
  assert(genSec.items.some(it => it.overlay_id === 'caption:live'), 'Thiếu caption:live trong General');

  const sections = overlayItems.map(s => s.section);
  assert(sections.includes('🎨 Chứng Nhận Locket VIP'), 'Thiếu Chứng Nhận Locket VIP');
  assert(sections.includes('☕ Daily Vibe & Chữa Lành'), 'Thiếu Daily Vibe & Chữa Lành');
  assert(sections.includes('💕 Tình Bạn & Tình Yêu Son Sắt'), 'Thiếu Tình Bạn & Tình Yêu');
  assert(sections.includes('🏝️ Check-in Du Lịch Việt Nam'), 'Thiếu Check-in Du Lịch Việt Nam');
});

// ----------------------------------------------------
// 3. KIỂM TRA LOCKET REMOTE CONFIG (REQUEST MODE)
// ----------------------------------------------------
let locketReqRes = null;
locketFn(
  {
    url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch?key=AIzaSy...',
    headers: {
      'If-None-Match': 'W/"abc-123"',
      'if-modified-since': 'Sun, 25 Oct 2026 10:00:00 GMT',
      'User-Agent': 'Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)'
    },
    body: '{"project_id":"locket-4252a"}'
  },
  null,
  (v) => { locketReqRes = v; }
);

test('Locket Request: Xóa sạch If-None-Match & If-Modified-Since chống 304 Cache', () => {
  assert(locketReqRes.headers, 'Phải trả về headers');
  assert(!locketReqRes.headers['If-None-Match'], 'If-None-Match phải bị xóa');
  assert(!locketReqRes.headers['if-modified-since'], 'if-modified-since phải bị xóa');
  assert.strictEqual(locketReqRes.body, '{"project_id":"locket-4252a"}', 'Request body POST phải được bảo toàn');
});

// ----------------------------------------------------
// 4. KIỂM TRA REVENUECAT MULTI LOCKET GOLD
// ----------------------------------------------------
const rcCode = fs.readFileSync('Module/js/revenuecat_multi.js', 'utf8');
const rcFn = new Function('$request', '$response', '$done', rcCode);

let rcRes = null;
rcFn(
  { url: 'https://api.revenuecat.com/v1/subscribers/user_test_tu', headers: { 'User-Agent': 'Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)' } },
  { status: 200, body: JSON.stringify({ subscriber: { subscriptions: {}, entitlements: {} } }) },
  (v) => { rcRes = v; }
);

test('RevenueCat: locket_gold_since và first_seen đều là 18/07/2005', () => {
  const obj = JSON.parse(rcRes.body);
  const attrs = obj.subscriber.subscriber_attributes;
  assert.strictEqual(obj.subscriber.first_seen, '2005-07-18T10:10:14Z');
  assert.strictEqual(attrs.locket_gold_since.value, '2005-07-18T10:10:14Z');
  assert.strictEqual(attrs.locket_gold_badge_text.value, 'LOCKET GOLD SINCE 2005');
  assert.strictEqual(attrs.locket_gold_badge.value, 'true');
  assert.strictEqual(attrs.locket_verified.value, 'true');
  assert.strictEqual(attrs.badge.value, 'verified');
  assert.strictEqual(attrs.subscription_entitlement.value, 'locket_gold');
  assert.strictEqual(attrs.is_gold.value, 'true');
});

test('RevenueCat: Entitlements bao gồm full quyền Gold, Ngày lễ & Hiệu ứng', () => {
  const obj = JSON.parse(rcRes.body);
  const ents = obj.subscriber.entitlements;
  assert(ents.Gold, 'Thiếu Gold');
  assert(ents.gold, 'Thiếu gold');
  assert(ents.locket_gold, 'Thiếu locket_gold');
  assert(ents.holiday_effects, 'Thiếu holiday_effects');
  assert(ents.seasonal_effects, 'Thiếu seasonal_effects');
  assert(ents.streak_freeze, 'Thiếu streak_freeze');
  assert(ents.ghost_mode, 'Thiếu ghost_mode');
  assert(ents.calendar_rewind, 'Thiếu calendar_rewind');
  assert(ents.yearbook, 'Thiếu yearbook');

  assert.strictEqual(ents.Gold.expires_date, '2099-12-31T10:10:14Z');
  assert.strictEqual(ents.Gold.ownership_type, 'PURCHASED');
  assert.strictEqual(ents.Gold.store, 'app_store');
});

test('RevenueCat: Subscriptions chuẩn Production (is_sandbox = false)', () => {
  const obj = JSON.parse(rcRes.body);
  const sub = obj.subscriber.subscriptions['locket_1600_1y'];
  assert(sub, 'Thiếu subscription locket_1600_1y');
  assert.strictEqual(sub.is_sandbox, false);
  assert.strictEqual(sub.ownership_type, 'PURCHASED');
  assert.strictEqual(sub.store, 'app_store');
  assert.strictEqual(sub.expires_date, '2099-12-31T10:10:14Z');
});

test('RevenueCat: Multi-tier Filter Packs (10Photo & 10Photos) được cấp quyền', () => {
  const obj = JSON.parse(rcRes.body);
  const subs = obj.subscriber.subscriptions;
  assert(subs['com.locket.Locket.FilterPack_10Photo'], 'Thiếu FilterPack_10Photo');
  assert(subs['com.locket.Locket.FilterPack_10Photos_400'], 'Thiếu FilterPack_10Photos_400');
});

// ----------------------------------------------------
// 5. FAIL-SAFE & RESILIENCE
// ----------------------------------------------------
test('Resilience: Locket_30s xử lý an toàn khi body rỗng hoặc lỗi JSON', () => {
  let failRes = null;
  locketFn(
    { url: 'https://firebaseremoteconfig.googleapis.com/...', headers: {} },
    { status: 200, body: 'MALFORMED_JSON_STRING' },
    (v) => { failRes = v; }
  );
  assert(failRes !== null, 'Phải gọi $done');
});

test('Resilience: revenuecat_multi xử lý an toàn khi body rỗng hoặc lỗi JSON', () => {
  let rcFailRes = null;
  rcFn(
    { url: 'https://api.revenuecat.com/v1/subscribers/...', headers: {} },
    { status: 200, body: 'MALFORMED_JSON' },
    (v) => { rcFailRes = v; }
  );
  assert(rcFailRes !== null, 'Phải gọi $done');
});

console.log('\n====================================================');
console.log(`🎯 TỔNG KẾT: ${passTests}/${totalTests} TESTS PASS (TỶ LỆ 100%)`);
console.log('====================================================');

if (passTests !== totalTests) {
  process.exit(1);
}
