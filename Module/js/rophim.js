/*
 * @name: Rophim VIP & TCoin Unlocked
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-27
 */

(function () {
  var url = (typeof $request !== "undefined" && $request && $request.url) ? $request.url : "";
  var rawBody = (typeof $response !== "undefined" && $response && $response.body) ? $response.body : "";
  var objc;

  try {
    objc = JSON.parse(rawBody);
  } catch (e) {
    objc = null;
  }

  var VIP_EXPIRY_TIMESTAMP = 4087113600; // 2099-07-18
  var VIP_EXPIRY_ISO = "2099-07-18T00:00:00.000Z";
  var COIN_BALANCE = 999999999;

  function patchRophim(data, reqUrl) {
    if (!data || typeof data !== "object") return data;

    if (Array.isArray(data)) {
      return data;
    }

    if (reqUrl && reqUrl.indexOf("/tcoin/me") !== -1) {
      data.thungBalance = COIN_BALANCE;
      data.balance = COIN_BALANCE;
      data.coin_balance = COIN_BALANCE;
      data.total = COIN_BALANCE;
      return data;
    }

    var recurse = function (obj) {
      if (!obj || typeof obj !== "object") return;
      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          recurse(obj[i]);
        }
        return;
      }
      if ("is_vip" in obj || "vip_expires_at" in obj || "coin_balance" in obj || "thungBalance" in obj) {
        obj.is_vip = true;
        obj.vip_expires_at = VIP_EXPIRY_TIMESTAMP;
        obj.coin_balance = COIN_BALANCE;
        obj.thungBalance = COIN_BALANCE;
      }
      if (obj.result) recurse(obj.result);
      if (obj.user) recurse(obj.user);
      if (obj.data) recurse(obj.data);
    };

    recurse(data);

    if (reqUrl && (reqUrl.indexOf("/api/auth/session") !== -1 || reqUrl.indexOf("/user/profile") !== -1 || reqUrl.indexOf("/user/info") !== -1 || reqUrl.indexOf("/user/") !== -1)) {
      if (!data.user || typeof data.user !== "object") data.user = {};
      data.user.is_vip = true;
      data.user.vip_expires_at = VIP_EXPIRY_TIMESTAMP;
      data.user.thungBalance = COIN_BALANCE;
      data.user.coin_balance = COIN_BALANCE;
      data.user.role = "VIP";
      data.expires = VIP_EXPIRY_ISO;
      if (data.data && typeof data.data === "object") {
        data.data.is_vip = true;
        data.data.vip_expires_at = VIP_EXPIRY_TIMESTAMP;
        data.data.role = "VIP";
      }
      return data;
    }

    if (!data.user && !data.data && !data.result) {
      data.is_vip = true;
      data.vip_expires_at = VIP_EXPIRY_TIMESTAMP;
      data.thungBalance = COIN_BALANCE;
      data.coin_balance = COIN_BALANCE;
    }

    return data;
  }

  if (objc && typeof objc === "object") {
    objc = patchRophim(objc, url);
  } else {
    if (url && (url.indexOf("/api/auth/session") !== -1 || url.indexOf("/user/") !== -1)) {
      objc = {
        user: {
          is_vip: true,
          vip_expires_at: VIP_EXPIRY_TIMESTAMP,
          thungBalance: COIN_BALANCE,
          coin_balance: COIN_BALANCE,
          role: "VIP"
        },
        expires: VIP_EXPIRY_ISO
      };
    } else {
      objc = {
        is_vip: true,
        vip_expires_at: VIP_EXPIRY_TIMESTAMP,
        thungBalance: COIN_BALANCE,
        coin_balance: COIN_BALANCE
      };
    }
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
