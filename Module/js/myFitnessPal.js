/*
 * @name: MyFitnessPal Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-27
 */

(function () {
  var rawBody = (typeof $response !== "undefined" && $response && $response.body) || "";
  var obj;
  try { obj = JSON.parse(rawBody); } catch (e) {}
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    obj = {};
  }

  obj.subscriptionEndDate = "2099-05-01T10:10:53.929Z";
  obj.subscriptionStartDate = "2022-05-01T10:10:53.929Z";
  obj.hasPremium = true;

  var out = { body: JSON.stringify(obj) };
  try {
    var h = (typeof $response !== "undefined" && $response && $response.headers) ? Object.assign({}, $response.headers) : {};
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  } catch (e) {}
  if (typeof $done !== "undefined") $done(out);
})();
