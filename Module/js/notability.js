/*
 * @name: Notability Plus Subscription Unlock
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

  obj.data = {
    processAppleReceipt: {
      __typename: "SubscriptionResult",
      error: 0,
      subscription: {
        __typename: "AppStoreSubscription",
        status: "active",
        originalPurchaseDate: "2021-11-09T03:14:18.000Z",
        originalTransactionId: "710000869822929",
        expirationDate: "2099-12-31T03:14:17.000Z",
        productId: "com.gingerlabs.Notability.premium_subscription",
        tier: "premium",
        refundedDate: null,
        refundedReason: null,
        user: null
      }
    }
  };

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
