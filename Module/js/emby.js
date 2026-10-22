/*
 * @name: Emby Premiere Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-05-09
 */

var rawBody = ($response && $response.body) || "";
var objc;
try { objc = JSON.parse(rawBody); } catch (e) {}

if (objc && typeof objc === "object") {
    objc.cacheExpirationDays = 999;
    objc.message = "Device is valid";
    objc.resultCode = "GOOD";
} else {
    objc = {
        "cacheExpirationDays": 999,
        "message": "Device is valid",
        "resultCode": "GOOD"
    };
}

$done({ body: JSON.stringify(objc) });
