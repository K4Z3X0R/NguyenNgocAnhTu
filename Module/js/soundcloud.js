/*
 * @name: SoundCloud Go+ Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

(function () {
var body = ($response && $response.body) || null; 
var obj;
try { obj = JSON.parse(body); } catch (e) {}

if (obj && typeof obj === "object" && !Array.isArray(obj)) {
  obj.plan = {
    "vendor": "apple",
    "id": "high_tier",
    "manageable": true,
    "plan_upsells": [],
    "plan_id": "go-plus",
    "upsells": [],
    "plan_name": "SoundCloud Go+"
  };

  obj.features = [
    { "name": "offline_sync", "enabled": true },
    { "name": "no_ads", "enabled": true },
    { "name": "high_quality_audio", "enabled": true },
    { "name": "unlimited_tracks", "enabled": true }
  ];

  var out = { body: JSON.stringify(obj) };
  try {
    if (typeof $response !== "undefined" && $response && $response.headers) {
      var h = Object.assign({}, $response.headers);
      h["Cache-Control"] = "no-store, no-cache, must-revalidate";
      h["Pragma"] = "no-cache";
      delete h["ETag"];
      delete h["etag"];
      delete h["If-None-Match"];
      delete h["if-none-match"];
      out.headers = h;
    }
  } catch (e) {}
  $done(out);
} else {
  $done({});
}
})();
