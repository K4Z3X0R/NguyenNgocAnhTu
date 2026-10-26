/*
 * @name: Snow / Epik AI Premium Unlock
 * @desc: Hỗ trợ cả 2 app: Snow (ảnh chụp AI) & Epik-AI (chỉnh sửa ảnh/video)
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

(function () {
var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}
const reqHeaders = ($request && $request.headers) || {};
const ua = reqHeaders["User-Agent"] || reqHeaders["user-agent"] || "";
const times = Date.now();

const list = {
    "iphoneapp.epik": { id: "com.snowcorp.epik.subscribe.plan.oneyear" },   // Epik-AI Chỉnh sửa ảnh và video
    "iphoneapp.snow": { id: "com.campmobile.snow.subscribe.oneyear" }       // SNOW-AI ảnh chụp
};

if (!objc || typeof objc !== "object" || Array.isArray(objc)) {
    $done({});
} else {
    let targetKey = "iphoneapp.snow";
    if (/epik/i.test(ua)) {
        targetKey = "iphoneapp.epik";
    } else if (/snow/i.test(ua)) {
        targetKey = "iphoneapp.snow";
    }
    const targetItem = list[targetKey] || list["iphoneapp.snow"];

    objc.result = Object.assign({}, objc.result, {
        "products": [
            {
                "managed": true,
                "status": "ACTIVE",
                "startDate": times,
                "productId": targetItem.id,
                "expireDate": 32662137600000
            }
        ],
        "tickets": [
            {
                "managed": true,
                "status": "ACTIVE",
                "startDate": times,
                "productId": targetItem.id,
                "expireDate": 32662137600000
            }
        ],
        "activated": true
    });
    console.log("✅ Unlock thành công — z3rokaze (" + targetKey + ")");
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
}
})();
