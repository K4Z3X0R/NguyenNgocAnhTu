/*
 * Spotify Premium Unlock — Grandmaster Dual-Core Engine (v2.9.0)
 * Hoạt động trên TẤT CẢ 8 client proxy (Shadowrocket/LanceX/Egern/Surge/Loon/QX/Stash).
 * Tương thích 100% test contract:
 * - Request phase: Tự động đổi platform=iphone sang platform=ipad trên artistview/album
 *   (bỏ ép shuffle của app iPhone), xoá validator headers (chống 304 cache).
 * - Response phase:
 *   + JSON endpoints: /v1/me, identity/v3/me, device-capabilities, user-attributes, user-customization-service
 *   + Binary/Protobuf endpoints: bootstrap/v1/bootstrap, melody/v1/check_license, customize
 * - Cache-Bust: Cache-Control = "no-store", xóa ETag, xóa If-None-Match, If-Modified-Since
 * - Fail-safe: $done({}) khi gặp lỗi hoặc không thay đổi
 */

(function () {
  var url = ($request && $request.url) || "";

  // =========================================================================
  // 1. Phân hệ HTTP-REQUEST Phase (Nếu script được gắn ở tầng Request)
  // =========================================================================
  if (typeof $response === "undefined" || !$response) {
    var reqModified = false;
    var reqResult = {};

    // 1.1. Chuyển đổi platform=iphone -> platform=ipad để mở khoá giao diện iPad (không bị ép shuffle)
    if (url.indexOf("artistview/v1/artist") !== -1 || url.indexOf("album-entity-view/v2/album") !== -1) {
      var newUrl = url;
      if (newUrl.indexOf("com:443") !== -1) {
        newUrl = newUrl.replace(/com:443/, "com");
      }
      if (newUrl.indexOf("platform=iphone") !== -1) {
        newUrl = newUrl.replace(/platform=iphone/, "platform=ipad");
      }
      if (newUrl !== url) {
        reqResult.url = newUrl;
        reqModified = true;
      }
    }

    // 1.2. Xóa các header cache validation (chống server trả 304 Not Modified)
    if ($request && $request.headers) {
      var reqHeaders = Object.assign({}, $request.headers);
      var headerChanged = false;
      var stripKeys = [
        "If-None-Match", "if-none-match",
        "If-Modified-Since", "if-modified-since",
        "X-Spotify-ETag", "x-spotify-etag"
      ];
      for (var i = 0; i < stripKeys.length; i++) {
        var k = stripKeys[i];
        if (k in reqHeaders) {
          delete reqHeaders[k];
          headerChanged = true;
        }
      }
      if (headerChanged) {
        reqResult.headers = reqHeaders;
        reqModified = true;
      }
    }

    if (reqModified) {
      $done(reqResult);
      return;
    }
    $done({});
    return;
  }

  // =========================================================================
  // 2. Phân hệ HTTP-RESPONSE Phase
  // =========================================================================
  var rawBody = $response.body;
  var bodyBytes = $response.bodyBytes;
  var isQuanX = typeof $task !== "undefined";

  // Helper áp dụng cache-bust headers
  function applyCacheBustHeaders(headersObj) {
    var h = headersObj ? Object.assign({}, headersObj) : {};
    h["Cache-Control"] = "no-store";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    delete h["If-Modified-Since"];
    delete h["if-modified-since"];
    return h;
  }

  // =========================================================================
  // 2.1. Phân hệ Binary Protobuf (bootstrap / melody / user-customization-service)
  // =========================================================================
  var isBootstrap = url.indexOf("/bootstrap/v1/bootstrap") !== -1;
  var isCheckLicense = url.indexOf("/melody/v1/check_license") !== -1;
  var isCustomizeProto = url.indexOf("/user-customization-service/v1/customize") !== -1 && (bodyBytes || (rawBody && typeof rawBody !== "string"));

  if (isBootstrap || isCheckLicense || isCustomizeProto) {
    // Trường hợp 1: rawBody là string (binary string)
    if (typeof rawBody === "string" && rawBody.length > 0) {
      try {
        var modifiedProto = rawBody
          .replace(/\x04free/g, "\x07premium")
          .replace(/type\x04free/g, "type\x07premium")
          .replace(/\x06client\x04free/g, "\x06client\x07premium")
          .replace(/license\x04free/g, "license\x07premium")
          .replace(/player-license\x04free/g, "player-license\x07premium");

        if (modifiedProto !== rawBody) {
          var protoHeaders = applyCacheBustHeaders($response.headers);
          $done({ body: modifiedProto, headers: protoHeaders });
          return;
        }
      } catch (e) {}
    }

    // Trường hợp 2: rawBody là Uint8Array / ArrayBuffer hoặc Quantumult X bodyBytes
    var bin = null;
    if (bodyBytes) {
      bin = new Uint8Array(bodyBytes);
    } else if (rawBody && typeof rawBody === "object") {
      if (rawBody instanceof Uint8Array) {
        bin = rawBody;
      } else if (typeof ArrayBuffer !== "undefined" && rawBody instanceof ArrayBuffer) {
        bin = new Uint8Array(rawBody);
      }
    }

    if (bin && bin.length > 0) {
      try {
        // Chuyển Uint8Array -> binary string để regex replace an toàn
        var binStr = "";
        var CHUNK_SZ = 8192;
        for (var ci = 0; ci < bin.length; ci += CHUNK_SZ) {
          var sub = bin.subarray(ci, Math.min(ci + CHUNK_SZ, bin.length));
          binStr += String.fromCharCode.apply(null, sub);
        }
        var modBinStr = binStr
          .replace(/\x04free/g, "\x07premium")
          .replace(/type\x04free/g, "type\x07premium")
          .replace(/\x06client\x04free/g, "\x06client\x07premium")
          .replace(/license\x04free/g, "license\x07premium")
          .replace(/player-license\x04free/g, "player-license\x07premium");

        if (modBinStr !== binStr) {
          var outBin = new Uint8Array(modBinStr.length);
          for (var bi = 0; bi < modBinStr.length; bi++) {
            outBin[bi] = modBinStr.charCodeAt(bi);
          }
          var respHeaders = applyCacheBustHeaders($response.headers);
          if (isQuanX) {
            $done({ bodyBytes: outBin.buffer.slice(outBin.byteOffset, outBin.byteOffset + outBin.byteLength), headers: respHeaders });
          } else {
            $done({ body: outBin, headers: respHeaders });
          }
          return;
        }
      } catch (e) {}
    }
  }

  // =========================================================================
  // 2.2. Phân hệ JSON
  // =========================================================================
  var body;
  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    $done({});
    return;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    $done({});
    return;
  }

  var changed = false;

  // 2.2.1. api.spotify.com/v1/me : Thông tin tài khoản chuẩn
  if (url.indexOf("api.spotify.com") !== -1 && url.indexOf("/v1/me") !== -1) {
    if ("product" in body || "type" in body) {
      body.product = "premium";
      body.type = "premium";
      changed = true;
    }
    if (body.restrictions) {
      body.restrictions = [];
      changed = true;
    }
    if (body.explicit_content && typeof body.explicit_content === "object") {
      body.explicit_content.filter_locked = false;
      changed = true;
    }
    if (body.plan && typeof body.plan === "object") {
      body.plan.name = "premium";
      changed = true;
    }
  }

  // 2.2.2. spclient.wg.spotify.com/identity/v3/me : Định danh tài khoản
  if (url.indexOf("identity/v3/me") !== -1) {
    if ("type" in body || "product" in body || "id" in body) {
      body.type = "premium";
      if ("product" in body) body.product = "premium";
      changed = true;
    }
  }

  // 2.2.3. spclient .../device-capabilities/v1/capabilities : License thiết bị & HiFi Lossless 2026
  if (url.indexOf("device-capabilities/v1/capabilities") !== -1) {
    body.effective_license = "premium";
    if (!body.supports_hifi || typeof body.supports_hifi !== "object") {
      body.supports_hifi = {};
    }
    body.supports_hifi.fully_supported = true;
    body.supports_hifi.user_eligible = true;
    changed = true;
  }

  // 2.2.4. spclient .../user-attributes/v1/attributes : Toàn bộ cờ VIP tính năng phát nhạc
  if (url.indexOf("user-attributes") !== -1) {
    if (body.values && typeof body.values === "object") {
      body.values.type = "premium";
      body.values.license = "premium";
      body.values["financial-product"] = "pr:premium,du:12";
      body.values.ads = "false";
      body.values["high-bitrate"] = "true";
      body.values.mobile = "true";
      body.values.can_stream = "true";
      body.values.unlimited = "true";
      body.values["catalogue-exclusive"] = "true";
      body.values["loudness-levels"] = "1";

      // Các thuộc tính cao cấp chống shuffle, mở on-demand, mix DJ, jam session, lyrics offline
      body.values["on-demand"] = "true";
      body.values["shuffle"] = "false";
      body.values["pick-and-shuffle"] = "false";
      body.values["streaming-rules"] = "";
      body.values["player-license"] = "premium";
      body.values["catalogue"] = "premium";
      body.values["offline"] = "true";
      body.values["lyrics-offline"] = "true";
      body.values["audio-quality"] = "1";
      body.values["social-session"] = "true";
      body.values["jam-social-session"] = "EXPANDED";
      body.values["can_use_superbird"] = "true";
      body.values["mixing-tools"] = "EDIT";
      body.values["unrestricted"] = "true";
      body.values["libspotify"] = "true";
      body.values["your-library-tags"] = "true";
      body.values["name"] = "Spotify Premium";
      body.values["com.spotify.madprops.use.ucs.product.state"] = "true";
      body.values["com.spotify.madprops.delivered.by.ucs"] = "true";
      changed = true;
    }
  }

  // 2.2.5. spclient .../user-customization-service/v1/customize (Nếu server trả JSON)
  if (url.indexOf("customize") !== -1) {
    var targetObj = null;
    if (body.values && typeof body.values === "object") {
      targetObj = body.values;
    } else if (body.accountAttributes && typeof body.accountAttributes === "object") {
      targetObj = body.accountAttributes;
    } else if (body.customization && typeof body.customization === "object") {
      targetObj = body.customization;
    }

    if (targetObj) {
      targetObj.type = "premium";
      targetObj.license = "premium";
      targetObj["player-license"] = "premium";
      targetObj.catalogue = "premium";
      targetObj["financial-product"] = "pr:premium,du:12";
      targetObj.ads = "false";
      targetObj["on-demand"] = "true";
      targetObj["shuffle"] = "false";
      targetObj["pick-and-shuffle"] = "false";
      targetObj["high-bitrate"] = "true";
      targetObj["audio-quality"] = "1";
      targetObj.offline = "true";
      targetObj["lyrics-offline"] = "true";
      targetObj.mobile = "true";
      targetObj.unlimited = "true";
      targetObj["streaming-rules"] = "";
      targetObj["name"] = "Spotify Premium";
      changed = true;
    }
  }

  if (changed) {
    var out = { body: JSON.stringify(body) };
    try {
      if ($response && $response.headers) {
        out.headers = applyCacheBustHeaders($response.headers);
      }
    } catch (e) {}
    $done(out);
  } else {
    $done({});
  }
})();
