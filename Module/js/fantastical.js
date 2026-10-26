/*
 * @name: Fantastical Calendar Flexibits Premium Unlock
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

  var url = (typeof $request !== "undefined" && $request && $request.url) ? $request.url : "";

  if (url.indexOf("v1/auth/device") !== -1) {
    obj.subscription = {
      autorenew: true,
      expiration: "2099-02-15T09:09:14Z",
      expires: "2099-02-15T09:09:14Z"
    };
  } else {
    obj.subscription = {
      autorenew: true,
      expiration: "2099-02-15T09:09:14.000000Z",
      uuid: "3c5927a6-4e3e-4773-b7af-62506e036dc7",
      subscription_type: "AppStore",
      is_expired: false,
      trial: false
    };
  }

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
