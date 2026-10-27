/*
 * @name: Mobile Cinema Webfilm Injector & Anti-StreamGuard
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-27
 */

(function () {
  var url = (typeof $request !== "undefined" && $request && $request.url) ? $request.url : "";
  var rawBody = (typeof $response !== "undefined" && $response && $response.body) ? $response.body : "";
  var headers = (typeof $response !== "undefined" && $response && $response.headers) ? $response.headers : {};

  // Cache-Control anti-304 invariant check
  if (headers && typeof headers === "object") {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    delete headers["ETag"];
    delete headers["etag"];
  }

  if (!rawBody || typeof rawBody !== "string") {
    if (typeof $done !== "undefined") {
      $done({ headers: headers });
    }
    return;
  }

  // Chỉ can thiệp vào các tài liệu HTML
  if (rawBody.indexOf("<html") === -1 && rawBody.indexOf("<body") === -1 && rawBody.indexOf("<!DOCTYPE") === -1) {
    if (typeof $done !== "undefined") {
      $done({ body: rawBody, headers: headers });
    }
    return;
  }

  var injectionPayload = [
    '<script>',
    '(function() {',
    '  try {',
    '    // 1. Triệt tiêu anti-adblock pause qua Call Stack Inspection (bypass-webfilm)',
    '    if (window.HTMLMediaElement && window.HTMLMediaElement.prototype) {',
    '      var origPause = window.HTMLMediaElement.prototype.pause;',
    '      window.HTMLMediaElement.prototype.pause = function() {',
    '        var stack = (new Error().stack || "").toLowerCase();',
    '        if (stack.indexOf("guard") !== -1 || stack.indexOf("stopplayback") !== -1 ||',
    '            stack.indexOf("aderror") !== -1 || stack.indexOf("stream-guard") !== -1 ||',
    '            stack.indexOf("checkad") !== -1 || stack.indexOf("onpausead") !== -1) {',
    '          return;',
    '        }',
    '        return origPause.apply(this, arguments);',
    '      };',
    '    }',
    '    // 2. Chặn Popunder & Clickjacking Window.open',
    '    var origOpen = window.open;',
    '    window.open = function(url) {',
    '      if (typeof url === "string") {',
    '        var u = url.toLowerCase();',
    '        if (u.indexOf("ad") !== -1 || u.indexOf("click") !== -1 || u.indexOf("pop") !== -1 ||',
    '            u.indexOf("traffic") !== -1 || u.indexOf("bet") !== -1 || u.indexOf("casino") !== -1) {',
    '          return null;',
    '        }',
    '      }',
    '      return origOpen ? origOpen.apply(this, arguments) : null;',
    '    };',
    '    // 3. Tự động dọn dẹp quảng cáo che mờ video khi trang tải xong',
    '    document.addEventListener("DOMContentLoaded", function() {',
    '      var style = document.createElement("style");',
    '      style.textContent = "#overlay, .ads-overlay, .banner-floating, iframe[src*=\'ad\'], div[id*=\'banner\'] { display: none !important; pointer-events: none !important; }";',
    '      (document.head || document.documentElement).appendChild(style);',
    '    });',
    '  } catch(e) {}',
    '})();',
    '</script>'
  ].join('\n');

  var modifiedBody = rawBody;
  if (modifiedBody.indexOf("<head>") !== -1) {
    modifiedBody = modifiedBody.replace("<head>", "<head>\n" + injectionPayload);
  } else if (modifiedBody.indexOf("<head ") !== -1) {
    modifiedBody = modifiedBody.replace(/(<head[^>]*>)/i, "$1\n" + injectionPayload);
  } else if (modifiedBody.indexOf("<body>") !== -1) {
    modifiedBody = modifiedBody.replace("<body>", "<body>\n" + injectionPayload);
  } else {
    modifiedBody = injectionPayload + "\n" + modifiedBody;
  }

  if (typeof $done !== "undefined") {
    $done({ body: modifiedBody, headers: headers });
  }
})();
