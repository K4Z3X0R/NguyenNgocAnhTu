/*
 * @name: Bilibili VIP & Ad Filter
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-27
 */

(function () {
  var rawBody = (typeof $response !== "undefined" && $response && $response.body) || "";
  var body;
  try { body = JSON.parse(rawBody); } catch (e) {}
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    if (typeof $done !== "undefined") $done({});
    return;
  }

  var url = (typeof $request !== "undefined" && $request && $request.url) ? $request.url : "";

  if (!body.data || typeof body.data !== "object") {
    body.data = {};
  }

  if (url.indexOf("/x/v2/account/myinfo") !== -1 || url.indexOf("/x/v2/account/mine") !== -1 || !url) {
    if (!Array.isArray(body.data)) {
      body.data.vip = Object.assign({}, body.data.vip, {
        type: 2,
        status: 1,
        vip_pay_type: 1,
        due_date: 4102444800000,
        role: 3
      });
    }
  }

  if (url.indexOf("/x/v2/view") !== -1 && body.code === 0 && body.data && Array.isArray(body.data.relates)) {
    body.data.relates = body.data.relates.filter(function (item) {
      return !(item && Object.prototype.hasOwnProperty.call(item, "is_ad"));
    });
  }

  if (url.indexOf("/x/v2/feed") !== -1 && body.code === 0 && body.data && Array.isArray(body.data.items)) {
    body.data.items = body.data.items.filter(function (item) {
      if (!item) return false;
      if (["ad_web_s", "ad_web", "live", "banner", "search_subscribe"].indexOf(item.card_goto) !== -1) {
        return false;
      }
      if (Object.prototype.hasOwnProperty.call(item, "ad_info")) {
        return false;
      }
      return true;
    });
  }

  if (url.indexOf("search/resource") !== -1 && body.code === 0) {
    body.data = [];
  }

  if (url.indexOf("/x/v2/reply/main") !== -1 && body.code === 0 && body.data && !Array.isArray(body.data)) {
    body.data.notice = {};
  }

  var out = { body: JSON.stringify(body) };
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
