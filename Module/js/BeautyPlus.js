/*
 * @name: BeautyPlus Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-04-21
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) { objc = null; }

var url = ($request && $request.url) || "";
if (/newbeee-api\.beautyplus\.com\/api\/v1\/asset\/balance/.test(url)) {
    // Endpoint asset/balance: chỉ ép điểm/số dư, giữ nguyên gid/created_at server cấp
    if (!objc || typeof objc !== "object" || Array.isArray(objc)) objc = { "message": "success", "data": {} };
    if (!objc.data || typeof objc.data !== "object") objc.data = {};
    objc.data.points = 999999999;
    objc.data.balance = 999999999;
    objc.data.next_claim = 1;
} else {
    // Endpoint manual_unlock / VIP
    if (!objc || typeof objc !== "object" || Array.isArray(objc)) objc = { "message": "success", "data": {} };
    objc.message = "success";
    objc.vip_expires_date = 4071600000;
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
})();
