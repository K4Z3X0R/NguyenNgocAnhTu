/*
 * @name: Musixmatch Premium Unlock
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
  if (!obj.message || typeof obj.message !== "object" || Array.isArray(obj.message)) {
    obj.message = {};
  }
  if (!obj.message.body || typeof obj.message.body !== "object" || Array.isArray(obj.message.body)) {
    obj.message.body = {};
  }
  if (!obj.message.body.app_config || typeof obj.message.body.app_config !== "object" || Array.isArray(obj.message.body.app_config)) {
    obj.message.body.app_config = {};
  }

  obj.message.body.app_config.reference = "active";
  obj.message.body.app_config.trial = false;
  obj.message.body.app_config.last_modified = "Sun Apr 24 2022 11:16:35 GMT+0000 (UTC)";
  obj.message.body.app_config.active_products = [
    {
      product_id: "com.musixmatch.offers.removeads.autorenewable.oneyear",
      start_date: "2022-03-27T16:27:38.000Z",
      creation_date: "2022-03-27T16:27:38.000Z",
      credits: 10,
      end_date: "2099-11-03T17:27:38.000Z",
      product_type: "subscription",
      features: {
        no_ads: 1,
        clean_metadata: 1,
        party_mode: 1,
        lyrics_offline: 1
      }
    }
  ];

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
