/*
 * @name: Alight Motion Pro Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-04-21
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}

var amResult = {
        "result": "success",
        "msTime": Date.now(),
        "accountCreatedMillis": null,
        "licenses": [
        {
            "benefits": [
                "RemoveWatermark",
                "MemberEffects",
                "ProjectPackageSharing",
                "FutureMemberFeatures",
                "AdvancedEasing",
                "CameraObjects",
                "LayerParenting",
                "CloudStorageLowTier"
            ],
            "type": "subscription",
            "store": "apple_app_store",
            "autoRenewing": true,
            "orderNumber": "300001752007005",
            "productId": "alightcreative.motion.1y_t60_1w",
            "period": "1y",
            "label": null,
            "details": null,
            "expires": 32662137600000,
            "valid": true,
            "linkStatus": "linked-current"
        }
        ],
        "warnings": []
};

if (objc && typeof objc === "object" && !Array.isArray(objc)) {
    objc.result = amResult;
} else {
    objc = { "result": amResult };
}

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
