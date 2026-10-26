/*
 * @name: WPS Office Super VIP Unlock (Shadowrocket)
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
    obj.result = "ok";
    obj.level = 88;
    obj.vip = {
        "name": "超级会员",
        "has_ad": 0,
        "enabled": [
            {"id": 12, "name": "稻壳会员", "expire_time": 32662137600},
            {"id": 20, "name": "WPS会员", "expire_time": 32662137600},
            {"id": 40, "name": "超级会员", "expire_time": 32662137600}
        ]
    };
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
