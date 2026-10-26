/*
 * @name: KineMaster Pro Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-04-21
 */

(function () {
var rawBody = ($response && $response.body) || "";
var obj;
try { obj = JSON.parse(rawBody); } catch (e) {}

if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    obj.is_valid_device = true;
    obj.has_valid_subscription = true;
    obj.expiration_date_ms = 4071600000000;
    obj.is_table_resettable = true;
    obj.subscription_product_id = "com.kinemaster.sub.annual.ia2";
    obj.state_code = 0;
} else {
    obj = {
        "is_valid_device": true,
        "has_valid_subscription": true,
        "expiration_date_ms": 4071600000000,
        "is_table_resettable": true,
        "subscription_product_id": "com.kinemaster.sub.annual.ia2",
        "state_code": 0
    };
}

var out = { body: JSON.stringify(obj) };
try {
  if (typeof $response !== "undefined" && $response && $response.headers) {
    var h = Object.assign({}, $response.headers);
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  }
} catch (e) {}
$done(out);
})();
