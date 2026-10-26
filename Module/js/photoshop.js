/*
 * @name: Photoshop Express Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}

objc = {
    "mobileProfile": {
        "profileStatus": "PROFILE_AVAILABLE",
        "relationshipProfile": {
            "commerce": {
                "subscriptions": [
                    {
                        "productArrangement": "INDIVIDUAL",
                        "productName": "PHOTOSHOP_EXPRESS_PREMIUM",
                        "status": "ACTIVE",
                        "store": "APPLE_APPSTORE",
                        "contractId": "z3rokaze_premium_2024"
                    }
                ]
            }
        }
    }
};

var out = { body: JSON.stringify(objc) };
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
