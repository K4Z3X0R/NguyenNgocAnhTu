/*
 * @name: Peak Brain Training Pro Unlock
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

  obj.response = {
    bbuid: "jwDeFNKzxk",
    usedIntroOfferPeriod: false,
    class: "UserModuleBillingResponse",
    is_in_billing_retry: false,
    modules: [
      {
        class: "BillingModuleResponse",
        name: "com.brainbow.module.peak.PeakModule",
        subscription: {
          status: 0,
          statusdate: 0,
          source: {
            id: "com.brainbow.peak.arsub_1wtrial_12m3499",
            cancelable: false,
            provider: "itunes",
            type: "trial"
          },
          bbuid: "jwDeFNKzxk",
          endTime: 4070880000000,
          startTime: 1672502400000,
          pro: true
        }
      }
    ]
  };
  obj.metaResponse = { code: 0 };

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
