/*
 * @name: Darkroom Pro Unlock (Shadowrocket)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-07-25
 */

(function () {
var rawBody = ($response && $response.body) || "";
var obj;
try { obj = JSON.parse(rawBody); } catch (e) {}

if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    $done({});
} else {
    obj.profile = Object.assign({}, obj.profile || {}, {
        "membership_type": "forever",
        "is_subscriber": true,
        "is_active": true,
        "subscription_expiration_date": 32662137600000
    });
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
}
})();
