/*
 * @name: Xmind Premium Unlock
 * @desc: Unlock Xmind mind-map subscription until year 2099
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

(function () {
let rawBody = ($response && $response.body) || "";
let obj;
try { obj = JSON.parse(rawBody); } catch (e) {}

if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    $done({});
} else {
    obj.license = obj.license || {};
    obj.license.status = "sub";
    obj.license.expireTime = 4071600000000; // 2099-01-01 ms
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
