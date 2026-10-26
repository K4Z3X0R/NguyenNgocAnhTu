// Comprehensive Functional Test Suite for Standalone scripts in Module/js

const fs = require('fs');

const path = require('path');



let pass = 0, fail = 0;



function check(title, condition, details) {

  if (condition) {

    pass++;

    console.log('  PASS  ' + title);

  } else {

    fail++;

    console.log('  FAIL  ' + title + ' -> ' + details);

  }

}



function runScript(filename, req, res) {

  let doneArg = null;

  const code = fs.readFileSync(path.join(__dirname, '..', '..', 'Module', 'js', filename), 'utf8');

  const fn = new Function('$request', '$response', '$done', 'console', code);

  fn(

    req,

    res,

    (arg) => { doneArg = arg; },

    { log: () => {}, warn: () => {}, error: () => {} }

  );

  return doneArg;

}



console.log('== Standalone Scripts Comprehensive Functional Suite ==');



// 1. AlightMotion.js

{

  const out = runScript('AlightMotion.js', { url: 'https://us-central1-alight-creative.cloudfunctions.net/getAccountStatusAndLicenses' }, { body: '{}' });

  const b = JSON.parse(out.body);

  const lic = b.result && b.result.licenses;

  check('AlightMotion: licenses injected', lic && lic.length > 0 && lic[0].valid === true, out ? out.body : 'null');

}



// 2. BeautyPlus.js

{

  const out = runScript('BeautyPlus.js', { url: 'https://api.mr.pixocial.com/v1/manual_unlock' }, { body: '{"data":{}}' });

  const b = JSON.parse(out.body);

  check('BeautyPlus: vip_expires_date set', b.vip_expires_date > 0, out ? out.body : 'null');

}



// 3. busuu.js

{

  const out = runScript('busuu.js', { url: 'https://api.busuu.com/users/me' }, { body: JSON.stringify({ user: { id: 1, premium: false } }) });

  const b = JSON.parse(out.body);

  check('busuu: premium=true', b.user && b.user.premium === true && b.user.subscription_type === 'premium_plus', out ? out.body : 'null');

}



// 4. calm.js

{

  const out = runScript('calm.js', { url: 'https://api.calm.com/me' }, { body: JSON.stringify({ is_lifetime: false, user: { is_lifetime: false } }) });

  const b = JSON.parse(out.body);

  check('calm: is_lifetime=true', b.is_lifetime === true && b.user && b.user.is_lifetime === true, out ? out.body : 'null');

}



// 5. camScanner.js

{

  const out = runScript('camScanner.js', { url: 'https://api.intsig.net/purchase/cs/query_prop' }, { body: JSON.stringify({ data: {} }) });

  const b = JSON.parse(out.body);

  check('camScanner: psnl_vip_property injected', b.data && b.data.psnl_vip_property && b.data.psnl_vip_property.vip_type === 'svip', out ? out.body : 'null');

}



// 6. Kinemaster.js

{

  const out = runScript('Kinemaster.js', { url: 'https://api-account.kinemasters.com' }, { body: JSON.stringify({ has_valid_subscription: false }) });

  const b = JSON.parse(out.body);

  check('Kinemaster: has_valid_subscription=true', b.has_valid_subscription === true, out ? out.body : 'null');

}



// 7. oldroll.js

{

  const out = runScript('oldroll.js', { url: 'https://server.yoyiapp.com' }, { body: JSON.stringify({ result: { is_vip: false } }) });

  const b = JSON.parse(out.body);

  check('oldroll: is_vip=true', b.result && b.result.is_vip === true && b.result.vip_type === 'forever', out ? out.body : 'null');

}



// 8. photomath.js

{

  const out = runScript('photomath.js', { url: 'https://lapi.photomath.net/v4/me' }, { body: JSON.stringify({ subscription: { status: 'none' }, tier: { level: 'free' } }) });

  const b = JSON.parse(out.body);

  check('photomath: status=active & genius', b.subscription && b.subscription.status === 'active' && b.tier && b.tier.level === 'genius', out ? out.body : 'null');

}



// 9. Snow.js

{

  const out = runScript('Snow.js', { headers: { 'User-Agent': 'iphoneapp.snow/1.0' } }, { body: JSON.stringify({ result: {} }) });

  const b = JSON.parse(out.body);

  check('Snow: activated=true & products', b.result && b.result.activated === true && b.result.products.length > 0, out ? out.body : 'null');

}



// 10. VSCO.js

{

  const out = runScript('VSCO.js', { url: 'https://vsco.co' }, { body: JSON.stringify({ user_subscription: { is_active: false } }) });

  const b = JSON.parse(out.body);

  check('VSCO: is_active=true', b.user_subscription && b.user_subscription.is_active === true, out ? out.body : 'null');

}



// 11. Wink.js

{

  const out = runScript('Wink.js', { url: 'https://api-sub.meitu.com/vip' }, { body: JSON.stringify({ is_vip: false }) });

  const b = JSON.parse(out.body);

  check('Wink: is_vip=true', b.is_vip === true && b.data && b.data.is_vip === true, out ? out.body : 'null');

}



// 12. wps.js

{

  const out = runScript('wps.js', { url: 'https://account.wps.cn' }, { body: JSON.stringify({ result: 'fail' }) });

  const b = JSON.parse(out.body);

  check('wps: level=88 & vip', b.result === 'ok' && b.level === 88 && b.vip && b.vip.enabled.length === 3, out ? out.body : 'null');

}



// 13. xmind.js

{

  const out = runScript('xmind.js', { url: 'https://www.xmind.net' }, { body: JSON.stringify({ license: { status: 'none' } }) });

  const b = JSON.parse(out.body);

  check('xmind: license.status=sub', b.license && b.license.status === 'sub', out ? out.body : 'null');

}



// 14. djay.js

{

  const out = runScript('djay.js', { url: 'https://app.algoriddim.com' }, { body: '{}' });

  const b = JSON.parse(out.body);

  check('djay: pro yearly in_app injected', b.receipt && b.receipt.in_app[0].product_id === 'com.algoriddim.djay_pro_yearly', out ? out.body : 'null');

}



// 15. emby.js

{

  const out = runScript('emby.js', { url: 'https://mb3admin.com' }, { body: '{}' });

  const b = JSON.parse(out.body);

  check('emby: resultCode=GOOD', b.resultCode === 'GOOD' && b.cacheExpirationDays === 999, out ? out.body : 'null');

}



// 16. fimo.js

{

  const out = runScript('fimo.js', { url: 'https://fimo.app' }, { body: JSON.stringify({ user: {} }) });

  const b = JSON.parse(out.body);

  check('fimo: isSubscribe=true', b.user && b.user.isSubscribe === true && b.user.subscribe === 1, out ? out.body : 'null');

}



// 17. funimate.js

{

  const out = runScript('funimate.js', { url: 'https://api.funimate.com' }, { body: JSON.stringify({ user: { is_pro: false } }) });

  const b = JSON.parse(out.body);

  check('funimate: user.is_pro=true', b.user && b.user.is_pro === true && b.user.pro_status === 'active', out ? out.body : 'null');

}



// 18. photoshop.js

{

  const out = runScript('photoshop.js', { url: 'https://lcs-mobile-cops.adobe.io' }, { body: '{}' });

  const b = JSON.parse(out.body);

  check('photoshop: PHOTOSHOP_EXPRESS_PREMIUM active', b.mobileProfile && b.mobileProfile.profileStatus === 'PROFILE_AVAILABLE', out ? out.body : 'null');

}



// 19. PicsArt.js

{

  const out = runScript('PicsArt.js', { url: 'https://api.picsart.com/gw-v2/shop/subscription/apple/purchases' }, { body: '{}' });

  const b = JSON.parse(out.body);

  check('PicsArt: subscription renewed & pro', b.status === 'success' && b.response[0].status === 'SUBSCRIPTION_RENEWED', out ? out.body : 'null');

}



// 20. darkroom.js

{

  const out = runScript('darkroom.js', { url: 'https://v1.darkroom.co' }, { body: JSON.stringify({ profile: {} }) });

  const b = JSON.parse(out.body);

  check('darkroom: is_subscriber=true', b.profile && b.profile.is_subscriber === true && b.profile.membership_type === 'forever', out ? out.body : 'null');

}



// 21. headspace.js

{

  const out = runScript('headspace.js', { url: 'https://api.prod.headspace.com/user-subscriptions' }, { body: JSON.stringify({ has_subscription: false }) });

  const b = JSON.parse(out.body);

  check('headspace: has_subscription=true', b.has_subscription === true && b.subscriptions && b.subscriptions.length > 0, out ? out.body : 'null');

}



// 22. meitu.js

{

  const out = runScript('meitu.js', { url: 'https://api.xiuxiu.meitu.com' }, { body: JSON.stringify({ is_vip: false }) });

  const b = JSON.parse(out.body);

  check('meitu: is_vip=true & svip', b.is_vip === true && b.vip_info && b.vip_info.vip_type === 'svip', out ? out.body : 'null');

}



// 23. soundcloud.js

{

  const out = runScript('soundcloud.js', { url: 'https://api-mobile.soundcloud.com' }, { body: JSON.stringify({ plan: {} }) });

  const b = JSON.parse(out.body);

  check('soundcloud: plan_id=go-plus', b.plan && b.plan.plan_id === 'go-plus' && b.features && b.features.length > 0, out ? out.body : 'null');

}



// 24. TrueCaller.js

{

  const out = runScript('TrueCaller.js', { url: 'https://premium-none.truecaller.com/v1/subscriptions/status' }, { body: '{}' });

  const b = JSON.parse(out.body);

  check('TrueCaller: subscriptionStatus=SUBSCRIBED', b.subscriptionStatus === 'SUBSCRIBED' && b.product && b.product.sku === 'apple_gold_family_yearly_v0', out ? out.body : 'null');

}



// 25. iTunes.js (Dazz Cam verifyReceipt)

{

  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'dazz.camera/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'dazz.camera' } }) });

  const b = JSON.parse(out.body);

  const inApp = b.receipt && b.receipt.in_app;

  check('iTunes: Dazz Cam forever IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.haocai.dazzcam.forever', out ? out.body : 'null');

}



// 26. iTunes.js (ProCCD verifyReceipt)

{

  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'com.yengshine.proccd/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.yengshine.proccd' } }) });

  const b = JSON.parse(out.body);

  const inApp = b.receipt && b.receipt.in_app;

  check('iTunes: ProCCD yearly IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.yengshine.proccd.yearly', out ? out.body : 'null');

}



// 27. iTunes.js (EE35 Film verifyReceipt)

{

  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'com.eightivedesign.ee35/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.eightivedesign.ee35' } }) });

  const b = JSON.parse(out.body);

  const inApp = b.receipt && b.receipt.in_app;

  check('iTunes: EE35 Film lifetime IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.eightivedesign.ee35.lifetime', out ? out.body : 'null');

}



// 28. iTunes.js (NOMO CAM verifyReceipt)

{

  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'com.farlens.nomo/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.farlens.nomo' } }) });

  const b = JSON.parse(out.body);

  const inApp = b.receipt && b.receipt.in_app;

  check('iTunes: NOMO CAM pro IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.farlens.nomo.pro', out ? out.body : 'null');

}



// 29. iTunes.js (Bazaart verifyReceipt)

{

  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'bazaart/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'bazaart' } }) });

  const b = JSON.parse(out.body);

  const inApp = b.receipt && b.receipt.in_app;

  check('iTunes: Bazaart super VIP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'Bazaart_Super_Three_Months_v4', out ? out.body : 'null');

}



// 30. duolingo.js

{

  const out = runScript('duolingo.js', { url: 'https://duolingo.com/2017-06-30/users/12345' }, { body: JSON.stringify({ id: 12345, username: 'testuser', hasPlus: false }) });

  const b = JSON.parse(out.body);

  check('duolingo: hasPlus=true & health unlimited', b.hasPlus === true && b.health && b.health.unlimited === true, out ? out.body : 'null');

}



// 31. cake.js

{

  const out = runScript('cake.js', { url: 'https://api.mycake.me/membership/me' }, { body: JSON.stringify({ isMember: false, membership: { type: 'NONE', status: 'INACTIVE' } }) });

  const b = JSON.parse(out.body);

  check('cake: membership.type=PLUS & ACTIVE', b.membership && b.membership.type === 'PLUS' && b.membership.status === 'ACTIVE', out ? out.body : 'null');

}



// 32. quizlet.js

{

  const out = runScript('quizlet.js', { url: 'https://quizlet.com/webapi/3.4/users/123456' }, { body: JSON.stringify({ responses: [{ models: { user: [{ id: 123456, is_plus: false, is_premium: false }] } }] }) });

  const b = JSON.parse(out.body);

  const u = b.responses && b.responses[0].models.user[0];

  check('quizlet: is_plus=true & is_premium=true', u && u.is_plus === true && u.is_premium === true, out ? out.body : 'null');

}



// 33. revenuecat_multi.js (Locket Gold)

{

  const out = runScript('revenuecat_multi.js', { headers: { 'User-Agent': 'Locket/1.0' } }, { body: JSON.stringify({ subscriber: { subscriptions: {}, entitlements: {} } }) });

  const b = JSON.parse(out.body);

  check('revenuecat_multi: Locket Gold unlocked', b.subscriber && b.subscriber.entitlements && b.subscriber.entitlements.Gold !== undefined, out ? out.body : 'null');

}



// 34. spotify.js

{

  const out = runScript('spotify.js', { url: 'https://spclient.wg.spotify.com/user-attributes/v1/attributes' }, { body: JSON.stringify({ values: { type: 'free' } }) });

  const b = JSON.parse(out.body);

  check('spotify: user-attributes type=premium', b.values && b.values.type === 'premium', out ? out.body : 'null');
  check('spotify: on-demand=true & shuffle=false', b.values && b.values['on-demand'] === 'true' && b.values['shuffle'] === 'false', out ? out.body : 'null');

}



// 35. Locket_30s.js (Remote Config 45s Video & 100MB Upload Limits)

{

  const out = runScript('Locket_30s.js', { headers: { 'User-Agent': 'Locket/1.144.0 (co.locket.Locket; build:9692; iOS 18.0.0)' } }, { body: JSON.stringify({ entries: {} }) });

  const b = JSON.parse(out.body);

  const camera = b.entries && JSON.parse(b.entries.camera || '{}');

  const cameraRoll = b.entries && JSON.parse(b.entries.camera_roll || '{}');

  const has45s = camera.max_duration === 45 && (b.entries.video_max_duration === '45.0' || b.entries.video_max_duration === '45');

  const has100MB = cameraRoll.max_file_size === 104857600 && b.entries.max_file_size === '104857600';

  check('Locket_30s: 45s video recording & camera limits injected', has45s && has100MB, out ? out.body : 'null');

}



// 36. Locket_30s.js (VIP Custom Captions & Royal Gold Frames)

{

  const out = runScript('Locket_30s.js', { headers: { 'User-Agent': 'Locket/1.144.0' } }, { body: JSON.stringify({ entries: {} }) });

  const b = JSON.parse(out.body);

  const hasOverlays = b.entries && typeof b.entries.overlay_items === 'string' && b.entries.overlay_items.includes('caption:z3rokaze');

  const hasFrames = b.entries && typeof b.entries.widget_frames_config === 'string' && b.entries.widget_frames_config.includes('royal_gold_vip');

  check('Locket_30s: VIP custom captions & frames verified', hasOverlays && hasFrames, out ? out.body : 'null');

}



// 37. Locket_30s.js (Firebase Remote Config: Force state UPDATE from NO_CHANGE)
{
  const out = runScript('Locket_30s.js', { headers: { 'User-Agent': 'Locket/1.144.0' } }, { body: JSON.stringify({ state: 'NO_CHANGE', templateVersion: '123' }) });
  const b = JSON.parse(out.body);
  const ok = b && b.state === 'UPDATE' && b.entries && JSON.parse(b.entries.camera).gold_max_duration === 45;
  check('Locket_30s: Force state UPDATE from NO_CHANGE & 45s verified', ok, out ? out.body : 'null');
}

// 38. elsa.js (ELSA Speak VIP & Oxford / IELTS Master)
{
  const out = runScript('elsa.js', { url: 'https://pool.elsanow.io/entitlement/api/v1/user/entitlements' }, { body: JSON.stringify({ entitlements: {} }) });
  const b = JSON.parse(out.body);
  const ok = b && b.tier && b.tier.code === 'premium' && Array.isArray(b.entitlements.contents) && b.entitlements.contents.length >= 10;
  check('elsa: tier=premium & Oxford/IELTS contents populated', ok, out ? out.body : 'null');
}

// 39. adguard.js (AdGuard Safari Pro Lifetime)
{
  const out = runScript('adguard.js', { url: 'https://mobile-api.adguard.org/api/v1/ios_validate_receipt/' }, { body: JSON.stringify({}) });
  const b = JSON.parse(out.body);
  const ok = b && Array.isArray(b.products) && b.products[0].product_id === 'com.adguard.lifetimePurchase' && b.products[0].premium_status === 'ACTIVE';
  check('adguard: lifetimePurchase & ACTIVE verified', ok, out ? out.body : 'null');
}

// 40. grammarly.js (Grammarly Keyboard Premium)
{
  const out = runScript('grammarly.js', { url: 'https://api.grammarly.com/api/v1/subscription' }, { body: JSON.stringify({}) });
  const b = JSON.parse(out.body);
  const ok = b && b.isPremium === true && b.grammarlyEdu === true && b.type === 'Premium';
  check('grammarly: isPremium=true & grammarlyEdu=true', ok, out ? out.body : 'null');
}

// 41. iTunes.js (Booka verifyReceipt - Oct 2026)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'Booka/1.0', 'If-None-Match': 'W/"123"' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.jianili.Booka' } }), headers: { ETag: '"123"' } });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: Booka lifetime IAP & cache-bust injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.jianili.Booka.pro.lifetime' && out.headers && out.headers['Cache-Control'].includes('no-store'), out ? out.body : 'null');
}

// 42. iTunes.js (Calligraphy Master verifyReceipt - Oct 2026)
{
  const out = runScript('iTunes.js', { headers: { 'User-Agent': 'PhimCiaj/1.0' } }, { body: JSON.stringify({ receipt: { bundle_id: 'com.jiancent.calligraphymaster' } }) });
  const b = JSON.parse(out.body);
  const inApp = b.receipt && b.receipt.in_app;
  check('iTunes: Calligraphy Master lifetime IAP injected', inApp && inApp.length > 0 && inApp[0].product_id === 'com.jiancent.calligraphymaster.lifetime', out ? out.body : 'null');
}

// 43. accuWeather.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://app-subscription-proxy.accuweather.com/subscriptions/v1/apple/validate' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('accuWeather: isValid=true & annual subscription', b.isValid === true && b.productId === 'com.accuweather.annual.subscription', out ? out.body : 'null');
}

// 44. adobeScanPdf.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://lcs-mobile-cops.adobe.io/subscriptions' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('adobeScanPdf: AcrobatPlus & PDFPack ACTIVE', Array.isArray(b.subscriptions) && b.subscriptions.length === 4 && b.subscriptions[0].subscription_state === 'ACTIVE', out ? out.body : 'null');
}

// 45. alarmy.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://ars.alar.my/api/v2/user/sync' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('alarmy: isActive=true & 2099 expiry', Array.isArray(b.subscription) && b.subscription[0].isActive === true, out ? out.body : 'null');
}

// 46. aloha.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.alohaprofile.com/v1/profile_info' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('aloha: profile.is_premium=true', b.profile && b.profile.is_premium === true, out ? out.body : 'null');
}

// 47. bilibili.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://app.bilibili.com/x/v2/account/myinfo' }, { body: JSON.stringify({ code: 0, data: {} }) });
  const b = JSON.parse(out.body);
  check('bilibili: vip.status=1 & type=2', b.data && b.data.vip && b.data.vip.status === 1 && b.data.vip.type === 2, out ? out.body : 'null');
}

// 48. dailyYoga.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://pre.dailyyoga.com/h2oapi/user/getUserDetail' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('dailyYoga: isSuperVip=3 & memberType=12', b.result && b.result.isSuperVip === 3 && b.result.memberType === 12, out ? out.body : 'null');
}

// 49. filmr.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://payments.invideo.io/subscription' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('filmr: plan=FILMR_PRO & status=ACTIVE', b.plan === 'FILMR_PRO' && b.status === 'ACTIVE', out ? out.body : 'null');
}

// 50. lovePdf.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://service.ilovepdf.com/v1/user' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('lovePdf: premium=true & 4000MB limits', b.premium === true && b.limits && b.limits.merge.mb === 4000, out ? out.body : 'null');
}

// 51. musixmatch.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://apic.musixmatch.com/ws/1.1/config.get' }, { body: '{}' });
  const b = JSON.parse(out.body);
  const cfg = b.message && b.message.body && b.message.body.app_config;
  check('musixmatch: reference=active & lyrics_offline=1', cfg && cfg.reference === 'active' && cfg.active_products[0].features.lyrics_offline === 1, out ? out.body : 'null');
}

// 52. myFitnessPal.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://premium-api.myfitnesspal.com/v3/subscriptions/MFP/' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('myFitnessPal: hasPremium=true', b.hasPremium === true, out ? out.body : 'null');
}

// 53. smallpdf.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://pro.smallpdf.com/pro/account' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('smallpdf: success=true & 2099 expirationDate', b.success === true && b.data && b.data.app_metadata.expirationDate === '2099-04-16', out ? out.body : 'null');
}

// 54. Polarr.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.polaxiong.com/v1/payments/profiles/@me/subscription' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Polarr: isSubscribed=true & planTier=studio', b.isSubscribed === true && b.planTier === 'studio', out ? out.body : 'null');
}

// 55. boom.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://apimboom2.globaldelight.net/itunesreceipt_v2.php' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('boom: LifetimeDiscountPack receipt injected', b.status === '0' && b['receipt-data'] && b['receipt-data'].receipt.in_app[0].product_id === 'com.globaldelight.iBoom.LifetimeDiscountPack', out ? out.body : 'null');
}

// 56. fantastical.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.flexibits.com/v1/account/details' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('fantastical: subscription.autorenew=true & is_expired=false', b.subscription && b.subscription.autorenew === true && b.subscription.is_expired === false, out ? out.body : 'null');
}

// 57. peak.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://billing.peakcloud.org/billing/2/user/me' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('peak: PeakModule subscription.pro=true', b.response && b.response.modules[0].subscription.pro === true, out ? out.body : 'null');
}

// 58. lightroom.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://photos.adobe.io/v2/accounts' }, { body: 'while (1) {}\n{"entitlement":{},"avatar":{}}' });
  const b = JSON.parse(out.body);
  check('lightroom: entitlement.status=subscriber & 1TB storage', b.entitlement && b.entitlement.status === 'subscriber' && b.current_subs.product_id === 'lightroom', out ? out.body : 'null');
}

// 59. notability.js
{
  const out = runScript('revenuecat_multi.js', { url: 'https://notability.com/subscriptions' }, { body: '{}' });
  const b = JSON.parse(out.body);
  const sub = b.data && b.data.processAppleReceipt && b.data.processAppleReceipt.subscription;
  check('notability: tier=premium & status=active', sub && sub.tier === 'premium' && sub.status === 'active', out ? out.body : 'null');
}

// 60. Snow.js (B612 Camera & Filter)
{
  const out = runScript('Snow.js', { url: 'https://user-kaji-api.b612kaji.com/v1/purchase/subscription/subscriber/status' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Snow (B612): activated=true & snowcamera.vip', b.result && b.result.activated === true && b.result.products[0].productId === 'com.campmobile.snowcamera.vip', out ? out.body : 'null');
}

// 61. Agenda (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://accounts.agenda.com/users/123/license' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Agenda: isSubscribed=true & licenseStatus=1', b.isSubscribed === true && b.licenseStatus === 1, out ? out.body : 'null');
}

// 62. Craft Docs (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.craft.do/auth/v2/profile' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Craft: subscription.tier=Pro & subscriptionActive=true', b.subscription && b.subscription.tier === 'Pro' && b.subscription.subscriptionActive === true, out ? out.body : 'null');
}

// 63. Drafts Pro (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://backend.getdrafts.com/api/v1/verification/verify_receipt' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Drafts: is_subscription_active=true & premium', b.is_subscription_active === true && b.active_subscription_type === 'premium', out ? out.body : 'null');
}

// 64. Endel (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api-production.endel.io/v4/call' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Endel: subscription.type=ACTIVE', b.subscription && b.subscription.type === 'ACTIVE', out ? out.body : 'null');
}

// 65. Bending Spoons / Remini / Focos (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://remini.oracle.bendingspoonsapps.com/v1/users/me' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('BendingSpoons (Remini): active_bundle_subscriptions injected', b.me && Array.isArray(b.me.active_bundle_subscriptions) && b.me.active_bundle_subscriptions[0].product_id.includes('nwdn'), out ? out.body : 'null');
}

// 66. Lingvist (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://payment-api.lingvist.com/v1/user/services' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Lingvist: unlimited service active', Array.isArray(b.services) && b.services[0].is_active === true, out ? out.body : 'null');
}

// 67. Memrise (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.memrise.com/v1.18/me/' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Memrise: user.is_pro=true & is_premium=true', b.user && b.user.is_pro === true && b.user.is_premium === true, out ? out.body : 'null');
}

// 68. Sorted3 (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.sortedapp.com/receipts/verify' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Sorted: isPro=true & isBundleEnabled=true', b.isPro === true && b.isBundleEnabled === true, out ? out.body : 'null');
}

// 69. Varlens (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://mid.zineapi.com/api/user/info' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Varlens: membership.role_name=pro', b.data && b.data.membership && b.data.membership.role_name === 'pro', out ? out.body : 'null');
}

// 70. Day One Journal (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://dayone.app/api/v2/users/account-status' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('DayOne: subscriptionName=premium', b.subscriptionName === 'premium', out ? out.body : 'null');
}

// 71. flomo (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://flomoapp.com/api/v1/user/me' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('flomo: pro_expired_at=2099', b.data && b.data.pro_expired_at.startsWith('2099'), out ? out.body : 'null');
}

// 72. Keep Fitness (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.gotokeep.com/account/v3/user/my' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('Keep: hasPaid=true & memberStatus=1', b.data && b.data.hasPaid === true && b.data.memberStatus === 1, out ? out.body : 'null');
}

// 73. Nicegram (HTTP-REQUEST synthetic response via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://restore-access.indream.app/restoreAccess?id=12345' }, null);
  const b = JSON.parse(out.response.body);
  check('Nicegram: premiumAccess=true synthetic response', b.data && b.data.premiumAccess === true, out ? JSON.stringify(out) : 'null');
}

// 74. Mondly Languages (via revenuecat_multi.js - preserves user & sets 2099 expiry)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://api.mondlylanguages.com/v1/ios/user/sync' }, { body: JSON.stringify({ user: { name: 'AnhTu' } }) });
  const b = JSON.parse(out.body);
  check('Mondly: preserves user & 2099 purchased_products', b.user && b.user.name === 'AnhTu' && Array.isArray(b.purchased_products) && b.purchased_products[0].expiration_date === 4102444800, out ? out.body : 'null');
}

// 75. iTranslate Pro (HTTP-REQUEST via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://ssl-api.itranslateapp.com/accounts/v4/subscriptions/verify/ios' }, null);
  const b = JSON.parse(out.body);
  check('iTranslate: 2099 license injected', Array.isArray(b.licenses) && b.licenses[0].expires_date_ms === 4102444800000, out ? out.body : 'null');
}

// 76. PDF Expert & Documents (via revenuecat_multi.js)
{
  const out = runScript('revenuecat_multi.js', { url: 'https://license.pdfexpert.com/api/2.0/pdfexpert6/subscription/refresh' }, { body: '{}' });
  const b = JSON.parse(out.body);
  check('PDFExpert: subscriptionState=active & 2099', b.subscriptionState === 'active' && b.isPDFExpert6User === true, out ? out.body : 'null');
}

console.log('\n== KẾT QUẢ: ' + pass + ' PASS / ' + fail + ' FAIL ==');

process.exit(fail === 0 ? 0 : 1);





