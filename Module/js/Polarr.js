/*
 * @name: Polarr Studio Unlock
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

  if (url.indexOf("v1/payments/appleiap/receipts/confirmation") !== -1) {
    Object.assign(obj, {
      app: "PPE",
      planType: "yearly",
      planTier: "studio",
      isUnlimited: true,
      membershipExpiryDate: "2099-08-17T19:38:37.000Z"
    });
  } else {
    Object.assign(obj, {
      isSubscribed: true,
      planId: "co.polarr.ppe.premium.studio.yearly",
      subscriptionProduct: "yearly",
      isTrial: false,
      app: "PPE",
      isUnlimited: true,
      expiryDate: "2099-08-17T19:38:37.000Z",
      planType: "yearly",
      planTier: "studio",
      startDate: "2023-08-17T19:38:37.000Z",
      subscriptionTier: "studio",
      paymentChannel: "AppleIapSubscription",
      membershipExpiryDate: "2099-08-17T19:38:37.000Z"
    });
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
