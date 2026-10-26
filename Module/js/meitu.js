/*
 * @name: Meitu XiuXiu Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}

const vip = {
    "vip_type": "svip",
    "vip_status": 1,
    "in_trial": 0,
    "expiry": 32662137600,
    "level_info": {
        "level": 10,
        "days": 9999,
        "end_days": 9999
    },
    "is_auto_renew": true,
    "product_id": "com.meitu.xiuxiu.vip.yearly",
    "purchase_date": "2024-01-09T02:00:00Z",
    "original_purchase_date": "2024-01-09T02:00:00Z",
    "store": "apple"
};

if (!objc || typeof objc !== "object" || Array.isArray(objc)) {
    $done({});
} else if (objc.data) {
    objc.data.vip_info = vip;
    objc.data.is_vip = true;
    objc.data.vip_type = "svip";
    var out = { body: JSON.stringify(objc) };
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
    objc.vip_info = vip;
    objc.is_vip = true;
    objc.vip_type = "svip";
    var out = { body: JSON.stringify(objc) };
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
