/*
 * @name: Filmr Pro Unlock
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
    purchase_id: "480000515251249",
    purchase_date: "2022-04-16T11:27:44Z",
    next_renewal_date: "2099-04-19T11:27:43Z",
    title: "FILMR PRO",
    current_payment_source: "mobile",
    show_next_renewal_date: true,
    duration: "YEARLY",
    plan: "FILMR_PRO",
    upgrade_details: {
      action_available: true,
      action_title: "Upgrade to Desktop Plan",
      upgradeable_plan_ids: [1]
    },
    includes_access_to: ["Filmr Pro"],
    is_iap_linked: true,
    status: "ACTIVE",
    is_free_user: false
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
