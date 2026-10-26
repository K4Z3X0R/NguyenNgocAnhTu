// Harness test spotify.js — giả lập engine proxy (Surge/QX/Loon style)
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "..", "Module", "js", "spotify.js"),
  "utf-8"
);

function run(requestUrl, responseBody, responseHeaders, extraReq) {
  let doneArg = null;
  const reqObj = Object.assign({ url: requestUrl }, extraReq || {});
  const resObj = responseBody !== null ? { body: responseBody, headers: responseHeaders || {} } : undefined;
  const sandbox = {
    $request: reqObj,
    $response: resObj,
    $done: (arg) => { doneArg = arg; },
    console,
  };
  // nạp script với globals đã mock
  const fn = new Function(
    "$request", "$response", "$done", "console",
    src
  );
  fn(sandbox.$request, sandbox.$response, sandbox.$done, console);
  return doneArg; // {body, headers} hoặc {}
}

function runQuanX(requestUrl, bodyBytes) {
  let doneArg = null;
  const sandbox = {
    $task: {},
    $request: { url: requestUrl },
    $response: { bodyBytes: bodyBytes, headers: {} },
    $done: (arg) => { doneArg = arg; },
    console,
  };
  const fn = new Function(
    "$request", "$response", "$done", "console", "$task",
    src
  );
  fn(sandbox.$request, sandbox.$response, sandbox.$done, console, sandbox.$task);
  return doneArg;
}

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log("  PASS  " + name); }
  else { fail++; console.log("  FAIL  " + name + (extra ? "  -> " + extra : "")); }
}

console.log("== spotify.js unit test ==");

// 1. Free /v1/me có restrictions -> premium + xoá restrictions + cache-bust
{
  const inBody = JSON.stringify({
    product: "free", type: "user",
    restrictions: [{ type: "podcast", catalogues: ["spotify"] }],
  });
  const out = run("https://api.spotify.com/v1/me", inBody, { ETag: "W/\"abc\"", "Content-Type": "application/json" });
  const b = JSON.parse(out.body);
  check("v1/me: product=premium", b.product === "premium", out.body);
  check("v1/me: type=premium", b.type === "premium", out.body);
  check("v1/me: restrictions cleared", Array.isArray(b.restrictions) && b.restrictions.length === 0, out.body);
  check("v1/me: Cache-Control=no-store", out.headers && out.headers["Cache-Control"] === "no-store");
  check("v1/me: ETag removed", out.headers && out.headers["ETag"] === undefined);
}

// 2. /v1/me premium sẵn, không restrictions -> giữ premium, vẫn cache-bust
{
  const inBody = JSON.stringify({ product: "premium", type: "premium" });
  const out = run("https://api.spotify.com/v1/me", inBody, { ETag: "W/\"x\"" });
  const b = JSON.parse(out.body);
  check("v1/me(premium): không đổi product", b.product === "premium");
  check("v1/me(premium): có cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 3. /v1/me không có product/type/restrictions -> fail-safe giữ nguyên
{
  const inBody = JSON.stringify({ id: "user123", display_name: "Test" });
  const out = run("https://api.spotify.com/v1/me", inBody, {});
  check("v1/me(fail-safe): pass-through $done({})", Object.keys(out).length === 0, JSON.stringify(out));
}

// 4. identity/v3/me -> type=premium
{
  const inBody = JSON.stringify({ type: "user", id: "abc" });
  const out = run("https://spclient.wg.spotify.com/identity/v3/me", inBody, { ETag: "W/\"y\"" });
  const b = JSON.parse(out.body);
  check("identity/v3/me: type=premium", b.type === "premium", out.body);
  check("identity/v3/me: cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 5. URL không phải spotify -> fail-safe (không đổi dù có product)
{
  const inBody = JSON.stringify({ product: "free", type: "user" });
  const out = run("https://api.example.com/v1/me", inBody, {});
  check("non-spotify: pass-through $done({})", Object.keys(out).length === 0, JSON.stringify(out));
}

// 6. JSON hỏng -> không crash, $done({})
{
  const out = run("https://api.spotify.com/v1/me", "{not json", {});
  check("malformed JSON: không crash", out !== null && Object.keys(out).length === 0, JSON.stringify(out));
}

// 7. body không phải object (array) -> fail-safe
{
  const out = run("https://api.spotify.com/v1/me", "[1,2,3]", {});
  check("non-object body: fail-safe", out !== null && Object.keys(out).length === 0, JSON.stringify(out));
}

// 8. device-capabilities/v1/capabilities -> effective_license=premium + supports_hifi (2026 update)
{
  const inBody = JSON.stringify({
    effective_license: "free",
    supports_hifi: { fully_supported: false, user_eligible: false }
  });
  const out = run("https://spclient.wg.spotify.com/device-capabilities/v1/capabilities", inBody, { ETag: "W/\"cap\"" });
  const b = JSON.parse(out.body);
  check("device-capabilities: effective_license=premium", b.effective_license === "premium", out.body);
  check("device-capabilities: supports_hifi=true", b.supports_hifi && b.supports_hifi.fully_supported === true && b.supports_hifi.user_eligible === true, out.body);
  check("device-capabilities: cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 9. user-attributes/v1/attributes -> type=premium, high-bitrate=true, ads=false
{
  const inBody = JSON.stringify({
    values: {
      type: "free",
      ads: "true",
      "high-bitrate": "false"
    }
  });
  const out = run("https://spclient.wg.spotify.com/user-attributes/v1/attributes", inBody, { ETag: "W/\"attr\"" });
  const b = JSON.parse(out.body);
  check("user-attributes: type=premium", b.values && b.values.type === "premium", out.body);
  check("user-attributes: high-bitrate=true", b.values && b.values["high-bitrate"] === "true", out.body);
  check("user-attributes: ads=false", b.values && b.values.ads === "false", out.body);
  check("user-attributes: cache-bust", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 10. /v1/me explicit_content filter_locked unlocked
{
  const inBody = JSON.stringify({
    product: "free",
    type: "user",
    explicit_content: { filter_enabled: false, filter_locked: true }
  });
  const out = run("https://api.spotify.com/v1/me", inBody, {});
  const b = JSON.parse(out.body);
  check("v1/me: explicit_content filter_locked=false", b.explicit_content && b.explicit_content.filter_locked === false, out.body);
}

// 11. user-attributes: on-demand=true & shuffle=false (v2.9.0)
{
  const inBody = JSON.stringify({
    values: {
      type: "free",
      shuffle: "true",
      "on-demand": "false"
    }
  });
  const out = run("https://spclient.wg.spotify.com/user-attributes/v1/attributes", inBody, {});
  const b = JSON.parse(out.body);
  check("user-attributes: on-demand=true & shuffle=false", b.values && b.values["on-demand"] === "true" && b.values["shuffle"] === "false", out.body);
}

// 12. user-attributes: offline=true & lyrics-offline=true (v2.9.0)
{
  const inBody = JSON.stringify({ values: { type: "free" } });
  const out = run("https://spclient.wg.spotify.com/user-attributes/v1/attributes", inBody, {});
  const b = JSON.parse(out.body);
  check("user-attributes: offline=true & lyrics-offline=true", b.values && b.values.offline === "true" && b.values["lyrics-offline"] === "true", out.body);
}

// 13. user-customization-service/v1/customize (JSON mode v2.9.0)
{
  const inBody = JSON.stringify({
    accountAttributes: {
      type: "free",
      shuffle: "1"
    }
  });
  const out = run("https://spclient.wg.spotify.com/user-customization-service/v1/customize", inBody, { ETag: "W/\"ucs\"" });
  const b = JSON.parse(out.body);
  check("customize: accountAttributes.type=premium", b.accountAttributes && b.accountAttributes.type === "premium", out.body);
  check("customize: accountAttributes.shuffle=false", b.accountAttributes && b.accountAttributes.shuffle === "false", out.body);
  check("customize: cache-bust headers", out.headers && out.headers["Cache-Control"] === "no-store");
}

// 14. HTTP-Request phase: URL rewriting platform=iphone -> platform=ipad (v2.9.0)
{
  const out = run("https://spclient.wg.spotify.com/artistview/v1/artist/12345?platform=iphone", null, null, {});
  check("request: artistview platform=iphone rewritten to platform=ipad", out && out.url && out.url.includes("platform=ipad"), JSON.stringify(out));
}

// 15. HTTP-Request phase: strip If-None-Match & If-Modified-Since (chống 304 v2.9.0)
{
  const reqHeaders = {
    "User-Agent": "Spotify/8.9.0 iOS",
    "If-None-Match": "W/\"old-etag\"",
    "If-Modified-Since": "Sat, 24 Oct 2026 12:00:00 GMT"
  };
  const out = run("https://api.spotify.com/v1/me", null, null, { headers: reqHeaders });
  check("request: validation headers stripped", out && out.headers && out.headers["If-None-Match"] === undefined && out.headers["If-Modified-Since"] === undefined, JSON.stringify(out));
}

// 16. Protobuf Binary string: melody/v1/check_license (v2.9.0)
{
  const dummyProto = "prefix\x04freesuffix";
  const out = run("https://spclient.wg.spotify.com/melody/v1/check_license", dummyProto, { ETag: "W/\"bin\"" });
  check("proto string: license check replaced free with premium", out && out.body && out.body.indexOf("\x07premium") !== -1, JSON.stringify(out));
  check("proto string: cache-bust applied", out && out.headers && out.headers["Cache-Control"] === "no-store");
}

// 17. Protobuf Binary Uint8Array: melody/v1/check_license (v2.9.0)
{
  const dummyStr = "prefix\x04freesuffix";
  const u8 = new Uint8Array(dummyStr.length);
  for (let i = 0; i < dummyStr.length; i++) u8[i] = dummyStr.charCodeAt(i);
  const out = run("https://spclient.wg.spotify.com/melody/v1/check_license", u8, {});
  const outStr = out && out.body instanceof Uint8Array ? Buffer.from(out.body).toString("binary") : "";
  check("proto Uint8Array: license check replaced free with premium", outStr.indexOf("\x07premium") !== -1, outStr);
}

// 18. Quantumult X Protobuf bodyBytes: bootstrap/v1/bootstrap (v2.9.0)
{
  const dummyStr = "header\x06client\x04freefooter";
  const u8 = new Uint8Array(dummyStr.length);
  for (let i = 0; i < dummyStr.length; i++) u8[i] = dummyStr.charCodeAt(i);
  const out = runQuanX("https://spclient.wg.spotify.com/bootstrap/v1/bootstrap", u8.buffer);
  const outStr = out && out.bodyBytes ? Buffer.from(out.bodyBytes).toString("binary") : "";
  check("proto QuanX bodyBytes: replaced free with premium", outStr.indexOf("\x06client\x07premium") !== -1, outStr);
}

// 19. Kiểm tra định tuyến Spotify Audio CDN (audio-ak-spotify-com.akamaized.net) trên 8 module
{
  const moduleDir = path.join(__dirname, "..", "Module");
  const moduleFiles = fs.readdirSync(moduleDir).filter(f => f.startsWith("NguyenNgocAnhTu_"));
  let allDirect = true;
  for (const mf of moduleFiles) {
    const content = fs.readFileSync(path.join(moduleDir, mf), "utf-8");
    if (content.includes("audio-ak-spotify-com.akamaized.net")) {
      const isReject = /audio-ak-spotify-com\.akamaized\.net\s*,\s*(?:REJECT|reject)/i.test(content) ||
                       /match:\s*"audio-ak-spotify-com\.akamaized\.net"\s*\n\s*policy:\s*REJECT/i.test(content);
      const isDirect = /audio-ak-spotify-com\.akamaized\.net\s*,\s*(?:DIRECT|direct)/i.test(content) ||
                       /match:\s*"audio-ak-spotify-com\.akamaized\.net"\s*\n\s*policy:\s*DIRECT/i.test(content);
      if (isReject || !isDirect) {
        allDirect = false;
        console.log("    -> " + mf + " fails Spotify audio CDN direct routing");
      }
    }
  }
  check("routing: 8/8 modules route audio-ak Akamai CDN to DIRECT", allDirect && moduleFiles.length >= 7);
}

// 20. Kiểm tra Rules/Ads.list không chặn audio-ak và Rules/Direct.list chứa audio-ak
{
  const adsList = fs.readFileSync(path.join(__dirname, "..", "Rules", "Ads.list"), "utf-8");
  const directList = fs.readFileSync(path.join(__dirname, "..", "Rules", "Direct.list"), "utf-8");
  const adsNotBlocking = !adsList.includes("audio-ak-spotify-com.akamaized.net");
  const directHasAkamai = directList.includes("audio-ak-spotify-com.akamaized.net");
  check("rules: Ads.list unblocks and Direct.list includes audio-ak CDN", adsNotBlocking && directHasAkamai);
}

console.log("\n== KẾT QUẢ: " + pass + " PASS / " + fail + " FAIL ==");
process.exit(fail === 0 ? 0 : 1);
