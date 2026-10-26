/*
 * @name: Smallpdf Pro Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-27
 */

(function () {
  var rawBody = (typeof $response !== "undefined" && $response && $response.body) || "";
  var obj;
  try { obj = JSON.parse(rawBody); } catch (e) {}
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    obj = {};
  }

  obj.success = true;
  obj.data = Object.assign({}, obj.data, {
    identities: [
      {
        connection: "Username-Password-Authentication",
        provider: "smallpdf",
        isSocial: false
      }
    ],
    email_verified: true,
    created_at: "2022-04-12T15:36:31Z",
    app_metadata: {
      mobile_user: true,
      is_in_free_trial_period: true,
      expirationDate: "2099-04-16",
      signedUp: true,
      canceled: true,
      app_store: {
        plan_id: "desktop-monthly-usd",
        country_geoip: "CN"
      },
      free_trial_series_sent_at: "2022-04-10T08:46:56",
      free_trial_series: "email_trial_original",
      subscription_platform: "ios",
      free_trial_user: true,
      trial_duration: "1000",
      grace_period: 16,
      has_business_email: true,
      lock: "0001-01-01T00:00:00Z",
      is_migrated_keycloak: true,
      disputes: {},
      subscription: {
        previous_platforms: {}
      }
    },
    user_metadata: {
      language: "en"
    }
  });

  var out = { body: JSON.stringify(obj) };
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
