/**
 * REALITY PROOF TEST SUITE — NGUYEN NGOC ANH TU (ekaznyra)
 * Kiểm tra tính chân thực 100% của toàn bộ hệ thống (Real Runtime Execution, Not Virtual).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exit(1);
    }
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
}

function runScript(scriptPath, requestObj, responseObj) {
    const code = fs.readFileSync(scriptPath, 'utf8');
    let doneResult = null;
    let notifyResult = null;

    const sandbox = {
        $request: requestObj,
        $response: responseObj,
        $done: (val) => { doneResult = val; },
        $notification: { post: (...args) => { notifyResult = args; } },
        console: { log: () => {}, error: () => {}, warn: () => {} },
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        JSON: JSON,
        Math: Math,
        Date: Date,
        RegExp: RegExp,
        Array: Array,
        Object: Object,
        String: String,
        Number: Number,
        Boolean: Boolean,
    };

    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { timeout: 3000 });
    return doneResult;
}

console.log('============================================================');
console.log('⚡ STARTING REALITY PROOF: RUNNING LIVE SCRIPT ENGINES');
console.log('============================================================\n');

// 1. LOCKET GOLD 45S VIDEO & REMOTE CONFIG REWRITE
console.log('--- 1. LOCKET GOLD 45S VIDEO & REMOTE CONFIG ---');
{
    const originalFirebaseConfig = {
        entries: {
            video_duration: "5.0",
            max_file_size: "10485760",
            max_upload_bytes: "10485760",
            quality_mbps: "0.2",
            can_use_captions: "false",
            can_use_frames: "false"
        }
    };
    const req = { url: "https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch" };
    const res = { status: 200, body: JSON.stringify(originalFirebaseConfig) };
    const output = runScript(path.join(__dirname, '../Module/js/Locket_30s.js'), req, res);
    
    assert(output && output.body, "Locket_30s returned a modified body");
    const parsed = JSON.parse(output.body);
    assert(parsed.entries.video_duration === "45" && parsed.entries.video_max_duration === "45", "Video duration strictly upgraded to 45s (video_duration=45, video_max_duration=45)");
    assert(parsed.entries.max_file_size === "104857600", "File limit strictly upgraded to 100MB (104857600)");
    const cameraRoll = JSON.parse(parsed.entries.camera_roll);
    assert(cameraRoll.quality_mbps === 0.6, "Bitrate upgraded to 0.6 Mbps in camera_roll config");
    assert(parsed.entries.captions_enabled === "true", "Feature gate captions_enabled = true");
    assert(parsed.entries.music_caption_enabled === "true", "Feature gate music_caption_enabled = true");
    assert(parsed.entries.widget_frames_config.includes("royal_gold_vip"), "Injected Royal Gold VIP frame");
    assert(parsed.entries.overlay_items.includes("caption:z3rokaze"), "Injected author caption:z3rokaze");
    assert(parsed.entries.overlay_items.includes("caption:deadline_ruot"), "Injected Vietnamese Gen Z captions");
}

// 2. REVENUECAT MULTI-APP UNLOCKER (LOCKET GOLD & 70+ APPS)
console.log('\n--- 2. REVENUECAT REAL MULTI-APP INJECTION ---');
{
    const originalSubscriber = {
        request_date: "2026-10-22T03:00:00Z",
        request_date_ms: 1792638000000,
        subscriber: {
            original_app_user_id: "test_anon_id",
            original_application_version: "1.0",
            original_purchase_date: "2026-10-22T03:00:00Z",
            management_url: null,
            subscriptions: {},
            entitlements: {},
            other_purchases: {}
        }
    };
    const req = {
        url: "https://api.revenuecat.com/v1/subscribers/$RCAnonymousID%3A123456789",
        headers: { "User-Agent": "Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)", "X-RevenueCat-ETag": "abc123etag", "If-None-Match": "abc123etag" }
    };

    // Test Request phase (ETag Stripping)
    const reqOut = runScript(path.join(__dirname, '../Module/js/revenuecat_multi.js'), req, null);
    assert(reqOut && reqOut.headers, "RevenueCat Request interceptor returned headers");
    assert(!reqOut.headers['x-revenuecat-etag'], "ETag header deleted from request");
    assert(!reqOut.headers['if-none-match'], "If-None-Match header deleted from request");

    // Test Response phase (Entitlement Injection)
    const res = { status: 200, body: JSON.stringify(originalSubscriber) };
    const resOut = runScript(path.join(__dirname, '../Module/js/revenuecat_multi.js'), req, res);
    assert(resOut && resOut.body, "RevenueCat Response interceptor returned body");
    const parsed = JSON.parse(resOut.body);
    assert(parsed.subscriber.entitlements.Gold !== undefined, "Locket 'Gold' entitlement injected");
    assert(parsed.subscriber.entitlements.Gold.expires_date.startsWith("2099-"), "Locket Gold expires in 2099");
    assert(parsed.subscriber.subscriptions["locket_1600_1y"] !== undefined, "Locket yearly subscription (locket_1600_1y) injected");
    assert(parsed.subscriber.subscriptions["locket_1600_1y"].ownership_type === "PURCHASED", "Ownership type is PURCHASED");
    assert(parsed.subscriber.subscriptions["locket_1600_1y"].store === "app_store", "Store is app_store");
}

// 3. SPOTIFY PREMIUM REAL UNLOCK
console.log('\n--- 3. SPOTIFY PREMIUM ATTRIBUTES & LICENSING ---');
{
    const originalAttrs = { values: { type: "free", shuffle: "1" } };
    const req = { url: "https://spclient.wg.spotify.com/user-attributes/v1/attributes" };
    const res = { status: 200, body: JSON.stringify(originalAttrs) };
    const output = runScript(path.join(__dirname, '../Module/js/spotify.js'), req, res);
    assert(output && output.body, "Spotify script returned modified body");
    const parsed = JSON.parse(output.body);
    assert(parsed.values.type === "premium", "Spotify account type changed from free to premium");
}

// 4. DUOLINGO SUPER & MAX REAL UNLOCK
console.log('\n--- 4. DUOLINGO SUPER & MAX REAL UNLOCK ---');
{
    const originalUser = { id: 12345, hasPlus: false, hasSuper: false, health: { maxHearts: 5, currentHearts: 1 } };
    const req = { url: "https://api.duolingo.com/2017-06-30/users/12345" };
    const res = { status: 200, body: JSON.stringify(originalUser) };
    const output = runScript(path.join(__dirname, '../Module/js/duolingo.js'), req, res);
    assert(output && output.body, "Duolingo script returned body");
    const parsed = JSON.parse(output.body);
    assert(parsed.hasPlus === true, "Duolingo Plus enabled");
    assert(parsed.hasSuper === true, "Duolingo Super enabled");
    assert(parsed.health.unlimited === true, "Duolingo Unlimited Hearts enabled");
}

// 5. CAKE ENGLISH PLUS REAL UNLOCK
console.log('\n--- 5. CAKE ENGLISH PLUS REAL UNLOCK ---');
{
    const originalCake = { id: "cake_user", membership: null };
    const req = { url: "https://api.mycake.me/v1/users/me" };
    const res = { status: 200, body: JSON.stringify(originalCake) };
    const output = runScript(path.join(__dirname, '../Module/js/cake.js'), req, res);
    assert(output && output.body, "Cake script returned body");
    const parsed = JSON.parse(output.body);
    assert(parsed.membership.type === "PLUS", "Cake membership type = PLUS");
    assert(parsed.membership.status === "ACTIVE", "Cake membership status = ACTIVE");
}

// 6. QUIZLET PLUS REAL UNLOCK
console.log('\n--- 6. QUIZLET PLUS REAL UNLOCK ---');
{
    const originalQuizlet = { responses: [{ models: { user: [{ is_plus: false, is_premium: false }] } }] };
    const req = { url: "https://quizlet.com/webapi/3.4/users/123" };
    const res = { status: 200, body: JSON.stringify(originalQuizlet) };
    const output = runScript(path.join(__dirname, '../Module/js/quizlet.js'), req, res);
    assert(output && output.body, "Quizlet script returned body");
    const parsed = JSON.parse(output.body);
    assert(parsed.responses[0].models.user[0].is_plus === true, "Quizlet is_plus = true");
    assert(parsed.responses[0].models.user[0].is_premium === true, "Quizlet is_premium = true");
}

// 7. PICSART GOLD & CLOUD STORAGE 100GB
console.log('\n--- 7. PICSART GOLD & 100GB STORAGE REAL UNLOCK ---');
{
    const reqPurchases = { url: "https://api.picsart.com/gw-v2/shop/subscription/apple/purchases" };
    const outPurchases = runScript(path.join(__dirname, '../Module/js/PicsArt.js'), reqPurchases, { status: 200, body: "{}" });
    const parsedPurchases = JSON.parse(outPurchases.body);
    assert(parsedPurchases.status === "success", "PicsArt purchases status = success");
    assert(parsedPurchases.response[0].status === "SUBSCRIPTION_RENEWED", "PicsArt subscription renewed");
    assert(parsedPurchases.response[0].plan_meta.tier_id === "pro", "PicsArt tier = pro");

    const reqStorage = { url: "https://api.picsart.com/gw-v2/cloud-storage/v1/me/storages" };
    const outStorage = runScript(path.join(__dirname, '../Module/js/PicsArt.js'), reqStorage, { status: 200, body: "{}" });
    const parsedStorage = JSON.parse(outStorage.body);
    assert(parsedStorage.response.storages[0].storage_limit_in_mb === 102400, "PicsArt 100GB cloud storage granted (102400 MB)");
}

// 8. CAMSCANNER HD OCR REAL UNLOCK
console.log('\n--- 8. CAMSCANNER HD OCR & VIP PROPERTY ---');
{
    const req = { url: "https://api.intsig.net/purchase/cs/query_property" };
    const res = { status: 200, body: JSON.stringify({ data: { psnl_vip_property: null } }) };
    const output = runScript(path.join(__dirname, '../Module/js/camScanner.js'), req, res);
    assert(output && output.body, "CamScanner script returned body");
    const parsed = JSON.parse(output.body);
    assert(parsed.data.psnl_vip_property.expiry > 4000000000, "CamScanner VIP expiry set to 2099");
    assert(parsed.data.psnl_vip_property.svip === 1, "CamScanner svip = 1 (Super VIP)");
}

// 9. WPS OFFICE SUPER VIP
console.log('\n--- 9. WPS OFFICE SUPER VIP ---');
{
    const req = { url: "https://account.wps.com/api/users/12345/overview" };
    const res = { status: 200, body: JSON.stringify({ total_buy: 0, privilege: [] }) };
    const output = runScript(path.join(__dirname, '../Module/js/wps.js'), req, res);
    assert(output && output.body, "WPS script returned body");
    const parsed = JSON.parse(output.body);
    assert(parsed.level === 88, "WPS Super VIP level = 88");
    assert(parsed.vip && parsed.vip.enabled.length === 3, "WPS 3 VIP packages enabled (Super VIP, Docer, WPS)");
}

console.log('\n============================================================');
console.log(`🎉 ALL REALITY TESTS COMPLETED: ${passedTests}/${totalTests} ASSERTIONS VERIFIED!`);
console.log('KHẲNG ĐỊNH 100%: TẤT CẢ CODE ĐỀU CHẠY THẬT, BIẾN ĐỔI THẬT, KHÔNG HỀ CÓ ẢO!');
console.log('============================================================\n');
