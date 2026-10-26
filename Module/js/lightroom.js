/*
 * @name: Adobe Lightroom Premium & 1TB Cloud Storage Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-27
 */

(function () {
  var rawBody = (typeof $response !== "undefined" && $response && $response.body) || "";
  var cleaned = typeof rawBody === "string" ? rawBody.replace(/while.{7}\n/, "") : "";
  var obj;
  try { obj = JSON.parse(cleaned); } catch (e) {}
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    obj = {};
  }
  if (!obj.entitlement || typeof obj.entitlement !== "object" || Array.isArray(obj.entitlement)) {
    obj.entitlement = {};
  }
  if (!obj.avatar || typeof obj.avatar !== "object" || Array.isArray(obj.avatar)) {
    obj.avatar = {};
  }

  obj.entitlement.status = "subscriber";
  obj.current_subs = {
    product_id: "lightroom",
    store: "adobe",
    purchase_date: "2019-10-10T16:32:10.254954Z",
    sao: {
      inpkg_CCES: "0",
      inpkg_CCLE: "1",
      inpkg_CCSN: "0",
      inpkg_CCSV: "0",
      inpkg_LCCC: "0",
      inpkg_LPES: "0",
      inpkg_LRBRL: "0",
      inpkg_LRMAC: "0",
      inpkg_LRMC: "0",
      inpkg_LRMP: "0",
      inpkg_LRTB: "0",
      inpkg_PHLT: "0",
      inpkg_PHLT2: "0",
      inpkg_PLES: "0",
      storage_quota: "100"
    }
  };
  obj.entitlement.storage = {
    used: 0,
    limit: 1154487209165,
    display_limit: 1099511627776,
    warn: 992137445376
  };
  obj.avatar.placeholder = true;

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
