/*
 * @name: AccuWeather Premium Unlock
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

  Object.assign(obj, {
    isValid: true,
    autoRenewalStatus: 1,
    productId: "com.accuweather.annual.subscription",
    expiryDateEpoch: 4102444800000,
    expirationDate: "2099-12-31T23:59:59+00:00",
    expirationIntent: null,
    expirationRetry: null,
    purchaseDateEpoch: 1650809915000,
    isTrial: false,
    isIntro: false,
    status: 0,
    usedTrial: ["com.accuweather.annual.subscription"],
    usedIntro: null,
    isRetryable: null
  });

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
