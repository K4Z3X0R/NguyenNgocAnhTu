/*
 * @name: Boom Bass Booster & Equalizer Lifetime Unlock
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

  var item = {
    quantity: "1",
    purchase_date_ms: "1555474256000",
    expires_date: "2099-04-17 04:10:56 Etc/GMT",
    expires_date_pst: "2099-04-16 21:10:56 America/Los_Angeles",
    is_in_intro_offer_period: "false",
    transaction_id: "470000445785125",
    is_trial_period: "false",
    original_transaction_id: "470000445785125",
    purchase_date: "2019-04-17 04:10:56 Etc/GMT",
    product_id: "com.globaldelight.iBoom.LifetimeDiscountPack",
    original_purchase_date_pst: "2019-04-16 21:10:59 America/Los_Angeles",
    original_purchase_date_ms: "1555474259000",
    web_order_line_item_id: "470000137081235",
    expires_date_ms: "4080082256000",
    purchase_date_pst: "2019-04-16 21:10:56 America/Los_Angeles",
    original_purchase_date: "2019-04-17 04:10:59 Etc/GMT"
  };

  obj.status = "0";
  obj["receipt-data"] = {
    status: 0,
    environment: "Production",
    receipt: {
      receipt_type: "Production",
      app_item_id: 1065511007,
      receipt_creation_date: "2019-10-30 16:52:23 Etc/GMT",
      bundle_id: "com.globaldelight.iBoom",
      original_purchase_date: "2019-04-17 04:07:39 Etc/GMT",
      in_app: [item],
      adam_id: 1065511007,
      receipt_creation_date_pst: "2019-10-30 09:52:23 America/Los_Angeles",
      request_date: "2019-10-30 16:52:29 Etc/GMT",
      request_date_pst: "2019-10-30 09:52:29 America/Los_Angeles",
      version_external_identifier: 832251566,
      request_date_ms: "1572454349573",
      original_purchase_date_pst: "2019-04-16 21:07:39 America/Los_Angeles",
      application_version: "1.4.70002",
      original_purchase_date_ms: "1555474059000",
      receipt_creation_date_ms: "1572454343000",
      original_application_version: "1.4.10008",
      download_id: 87042883772350
    },
    latest_receipt_info: [Object.assign({ subscription_group_identifier: "20461753" }, item)],
    pending_renewal_info: [
      {
        product_id: "com.globaldelight.iBoom.LifetimeDiscountPack",
        original_transaction_id: "470000445785125",
        auto_renew_product_id: "com.globaldelight.iBoom.LifetimeDiscountPack",
        auto_renew_status: "0"
      }
    ]
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
