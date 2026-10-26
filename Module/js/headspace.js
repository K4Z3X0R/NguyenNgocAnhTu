/*
 * @name: Headspace Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}

if (!objc || typeof objc !== "object" || Array.isArray(objc)) {
    // Non-JSON / lỗi / 304 -> để nguyên response
    $done({});
} else {
    objc.subscriptions = [
        {
            "sku": "com.headspace.annual",
            "status": "active",
            "store": "apple",
            "is_trial": false,
            "expires_at": "2099-12-31T23:59:59.000Z",
            "started_at": "2024-01-09T02:00:00Z",
            "product_id": "com.headspace.annual"
        }
    ];
    objc.has_subscription = true;
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
