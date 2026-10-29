// scripts/verify_premium_locket.js
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🔍 KIỂM TOÁN CHUYÊN SÂU LOCKET 45S & PREMIUM MODULE');
console.log('====================================================\n');

// 1. Kiểm tra Module/NguyenNgocAnhTu_Premium.module
const premContent = fs.readFileSync('Module/NguyenNgocAnhTu_Premium.module', 'utf8');
const currentVer = (premContent.match(/(\d+\.\d+\.\d+)-(?:stable|apex)/) || [null, '3.2.5'])[1];

const checks = [
  { name: 'UDP QUIC REJECT firebaseremoteconfig', ok: premContent.includes('AND,((DOMAIN,firebaseremoteconfig.googleapis.com), (PROTOCOL,UDP)),REJECT') },
  { name: 'force-http-engine-hosts firebaseremoteconfig:443', ok: premContent.includes('firebaseremoteconfig.googleapis.com:443') },
  { name: 'force-http-engine-hosts api.revenuecat.com:443', ok: premContent.includes('api.revenuecat.com:443') },
  { name: 'header-del If-None-Match firebaseremoteconfig', ok: premContent.includes('^https?:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/.+ header-del If-None-Match') },
  { name: 'header-del If-Modified-Since firebaseremoteconfig', ok: premContent.includes('^https?:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/.+ header-del If-Modified-Since') },
  { name: `RC_DeleteHeader request interceptor (?v=${currentVer})`, ok: premContent.includes(`RC_DeleteHeader = type=http-request, pattern=^https:\\/\\/api\\.(revenuecat|rc-backup)\\.com\\/.+\\/(receipts|subscribers), script-path=https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/js/revenuecat_multi.js?v=${currentVer}`) || premContent.includes(`RC_DeleteHeader = type=http-request, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts|subscribers), script-path=https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/js/revenuecat_multi.js?v=${currentVer}`) },
  { name: `RevenueCat_Multi response interceptor (?v=${currentVer})`, ok: premContent.includes(`RevenueCat_Multi = type=http-response, pattern=^https:\\/\\/api\\.revenuecat\\.com\\/.+\\/(receipts$|subscribers\\/[^/]+$), script-path=https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/js/revenuecat_multi.js?v=${currentVer}`) },
  { name: `Locket_30s_Req request interceptor (?v=${currentVer})`, ok: premContent.includes(`Locket_30s_Req = type=http-request, pattern=^https?:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/.*, script-path=https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/js/Locket_30s.js?v=${currentVer}`) },
  { name: `Locket_30s response interceptor (?v=${currentVer})`, ok: premContent.includes(`Locket_30s = type=http-response, pattern=^https?:\\/\\/firebaseremoteconfig\\.googleapis\\.com\\/v1\\/projects\\/.*, script-path=https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/js/Locket_30s.js?v=${currentVer}`) },
  { name: 'MITM hostname firebaseremoteconfig.googleapis.com', ok: premContent.includes('firebaseremoteconfig.googleapis.com') },
  { name: 'MITM hostname api.revenuecat.com', ok: premContent.includes('api.revenuecat.com') }
];

let premPass = 0;
for (const c of checks) {
  if (c.ok) {
    premPass++;
    console.log(`  ✅ [PASS] ${c.name}`);
  } else {
    console.log(`  ❌ [FAIL] ${c.name}`);
  }
}
console.log(`\nKết quả Premium.module: ${premPass}/${checks.length} PASS\n`);

// 2. Chạy thực tế Locket_30s.js (Response Mode)
const locketCode = fs.readFileSync('Module/js/Locket_30s.js', 'utf8');
let locketDone = null;
const locketFn = new Function('$request', '$response', '$done', locketCode);
locketFn(
  { url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch?key=AIzaSy...', headers: { 'User-Agent': 'Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)' } },
  { status: 200, body: JSON.stringify({ state: 'UPDATE', entries: { video_duration: '5.0', camera: '{"max_duration":5.0}' } }) },
  (v) => { locketDone = v; }
);

const locketObj = JSON.parse(locketDone.body);
const cam = JSON.parse(locketObj.entries.camera);
const camRoll = JSON.parse(locketObj.entries.camera_roll);
const fg = JSON.parse(locketObj.entries.feature_gates);

console.log('--- 1. CẤU HÌNH CAMERA & VIDEO DURATION ---');
console.log(`  camera.gold_max_duration: ${cam.gold_max_duration}s`);
console.log(`  camera.max_duration:      ${cam.max_duration}s`);
console.log(`  camera.video_duration:    ${cam.video_duration}s`);
console.log(`  camera_roll.max_duration: ${camRoll.max_duration}s`);
console.log(`  camera_roll.gold_max_duration: ${camRoll.gold_max_duration}s`);
console.log(`  entries.video_duration:   ${locketObj.entries.video_duration}s`);
console.log(`  entries.video_max_duration: ${locketObj.entries.video_max_duration}s`);
console.log(`  entries.max_video_duration: ${locketObj.entries.max_video_duration}s`);
console.log(`  entries.gold_max_duration:  ${locketObj.entries.gold_max_duration}s`);

console.log('\n--- 2. CẤU HÌNH FEATURE GATES (TÍNH NĂNG GOLD) ---');
console.log(`  feature_gates.longer_video:     ${fg.longer_video}`);
console.log(`  feature_gates.longer_videos:    ${fg.longer_videos}`);
console.log(`  feature_gates.video_recording:  ${fg.video_recording}`);
console.log(`  feature_gates.camera_roll:      ${fg.camera_roll}`);
console.log(`  feature_gates.camera_roll_video:${fg.camera_roll_video}`);
console.log(`  feature_gates.custom_widget_frames:${fg.custom_widget_frames}`);
console.log(`  state:                          ${locketObj.state}`);

// 3. Chạy thực tế revenuecat_multi.js (Locket Gold)
const rcCode = fs.readFileSync('Module/js/revenuecat_multi.js', 'utf8');
let rcDone = null;
const rcFn = new Function('$request', '$response', '$done', rcCode);
rcFn(
  { url: 'https://api.revenuecat.com/v1/subscribers/test_id', headers: { 'User-Agent': 'Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)' } },
  { status: 200, body: JSON.stringify({ subscriber: { subscriptions: {}, entitlements: {} } }) },
  (v) => { rcDone = v; }
);

const rcObj = JSON.parse(rcDone.body);
const goldEnt = rcObj.subscriber.entitlements.Gold;
const goldSub = rcObj.subscriber.subscriptions['locket_1600_1y'];

console.log('\n--- 3. REVENUECAT LOCKET GOLD ENTITLEMENT & SUBSCRIPTION ---');
console.log(`  first_seen:             ${rcObj.subscriber.first_seen}`);
console.log(`  entitlement Gold:       ${goldEnt ? 'EXISTS' : 'MISSING'}`);
console.log(`  Gold ownership_type:    ${goldEnt.ownership_type}`);
console.log(`  Gold store:             ${goldEnt.store}`);
console.log(`  Gold expires_date:      ${goldEnt.expires_date}`);
console.log(`  Gold product_plan_id:   ${goldEnt.product_plan_identifier}`);
console.log(`  Subscription is_sandbox:${goldSub.is_sandbox}`);
console.log(`  Subscription store:     ${goldSub.store}`);
console.log(`  All Subscriptions:      ${Object.keys(rcObj.subscriber.subscriptions).join(', ')}`);
console.log(`  locket_gold_badge:      ${rcObj.subscriber.subscriber_attributes?.locket_gold_badge?.value}`);
console.log(`  locket_gold_since:      ${rcObj.subscriber.subscriber_attributes?.locket_gold_since?.value}`);

// Assertions
const hasBadges = rcObj.subscriber.subscriber_attributes?.locket_gold_badge?.value === 'true' &&
                  rcObj.subscriber.subscriber_attributes?.locket_gold_since?.value !== undefined;
const is45s = cam.gold_max_duration === 60.0 &&
              cam.max_duration === 60.0 &&
              camRoll.max_duration === 60.0 &&
              locketObj.entries.video_duration === '60.0' &&
              locketObj.entries.video_max_duration === '60.0' &&
              fg.longer_video === 'enabled' &&
              goldEnt.ownership_type === 'PURCHASED' &&
              goldSub.is_sandbox === false &&
              hasBadges;

if (is45s && premPass === checks.length) {
  console.log('\n====================================================');
  console.log('🎯 KẾT LUẬN: ĐÃ LÊN 45S VÀ HOÀN TOÀN CHUẨN XÁC 100%!');
  console.log('====================================================');
} else {
  console.error('\n❌ KẾT LUẬN: CÓ LỖI CHƯA ĐẠT 45S!');
  process.exit(1);
}
