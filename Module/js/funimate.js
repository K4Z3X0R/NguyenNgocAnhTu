/*
 * @name: Funimate Pro Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}

if (!objc || typeof objc !== "object" || Array.isArray(objc)) {
    $done({});
} else {
    if (objc.user) {
        objc.user.is_pro = true;
        objc.user.pro_status = "active";
        objc.user.pro_expires_at = "2099-12-31T23:59:59.000Z";
        objc.user.subscription_type = "yearly";
    }
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
