/*
 * @name: Adobe Scan & Acrobat Plus Unlock
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

  obj.subscriptions = [
    {
      subscription_name: "AcrobatPlus",
      subscription_level: "Plus",
      subscription_state: "ACTIVE",
      sub_ref: "",
      biz_source: "CCC",
      billing_term: null
    },
    {
      subscription_name: "ESign",
      subscription_level: "Basic",
      subscription_state: "ACTIVE",
      sub_ref: "",
      biz_source: "CCC",
      billing_term: null
    },
    {
      subscription_name: "PDFPack",
      subscription_level: "Plus",
      subscription_state: "ACTIVE",
      sub_ref: "",
      biz_source: "",
      billing_term: null
    },
    {
      subscription_name: "CreatePDF",
      subscription_level: "Basic",
      subscription_state: "ACTIVE",
      sub_ref: "",
      biz_source: "CCC",
      billing_term: null
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
