/*
 * @name: ELSA Speak VIP & Oxford/IELTS Master Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-26
 * @desc: Mở khóa trọn đời ELSA Speak Pro/Premium, toàn bộ giáo trình Oxford, luyện thi IELTS 6/7/9, TOEFL, TOEIC & 999 tín chỉ AI Speech Analyzer
 */

(function () {
  'use strict';

  var res = typeof $response !== 'undefined' ? $response : null;
  var req = typeof $request !== 'undefined' ? $request : null;
  var body = (res && res.body) ? res.body : '';

  if (!body || typeof body !== 'string') {
    if (typeof $done !== 'undefined') $done({});
    return;
  }

  var data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    if (typeof $done !== 'undefined') $done({});
    return;
  }

  if (!data || typeof data !== 'object') {
    if (typeof $done !== 'undefined') $done({});
    return;
  }

  var url = (req && req.url) ? req.url : '';
  var fixedExpireAt = 4092599349; // Năm 2099
  var startAt = Math.floor(Date.now() / 1000);
  var ownerId = (data.tier && data.tier.owner_id) ? data.tier.owner_id : "1Aaa2Bbb3Ccc4Ddd5Eee6Fff7Ggg8Hhh";

  function calculateDaysToEnd(expireTimestamp) {
    var nowSec = Date.now() / 1000;
    return Math.ceil((expireTimestamp - nowSec) / 86400);
  }

  function createProduct(contentObjectId) {
    return {
      "created_at": "20240909090909",
      "expire_at": fixedExpireAt,
      "content_object_id": contentObjectId,
      "store": "default",
      "content_object_type": "topic"
    };
  }

  function generateContents() {
    var template = {
      "expire_at": fixedExpireAt,
      "owner_id": ownerId,
      "application": "elsa_speak",
      "owner_type": "individual",
      "start_at": startAt
    };
    var topics = [
      "eiken",
      "english_for_ground_crew",
      "get_ready_for_ielts_by_harpercollins",
      "ielts_band_6",
      "ielts_band_7",
      "ielts_band_9",
      "oxford_advanced",
      "oxford_elementary",
      "oxford_intermediate",
      "oxford_pre_intermediate",
      "oxford_starter",
      "oxford_university_press_english_for_aviation_pilots_and_atc",
      "oxford_university_press_english_for_cabin_crew",
      "oxford_upper_intermediate",
      "pearson_pte_prep_b1",
      "pearson_pte_prep_b2",
      "speaking_for_ielts_by_harpercollins",
      "toefl_by_harpercollins",
      "toeic_by_harpercollins",
      "us_citizenship"
    ];

    return topics.map(function(topic) {
      return Object.assign({}, template, {
        "code": "elsa_speak.topic." + topic
      });
    });
  }

  // 1. Endpoint mua hàng (purchase)
  if (/purchase/.test(url)) {
    data.subscriptions = [
      {
        "expire_at": "20990909",
        "store": "ios",
        "subscription": "one_year_dc_premium_membership",
        "days_to_end": calculateDaysToEnd(fixedExpireAt),
        "created_at": "20240909090909"
      }
    ];
    data.one_time_products = [
      "273", "92", "323", "329", "330", "331", "263", "253", "260", "259", 
      "251", "80", "334", "261", "328", "321", "326", "322", "319", "344"
    ].map(createProduct);
  }

  // 2. Endpoint xác thực đặc quyền (entitlements)
  if (/entitlement\/api\/v\d\/user\/entitlements/.test(url) || (!/purchase/.test(url) && data.entitlements)) {
    data.entitlements = data.entitlements || {};
    data.entitlements.memberships = [
      {
        "credit_total": null,
        "start_at": startAt,
        "expire_at": fixedExpireAt,
        "code": "elsa_speak.membership.elsa_speak",
        "owner_type": "individual",
        "application": "elsa_speak",
        "owner_id": ownerId
      },
      {
        "credit_total": null,
        "start_at": startAt,
        "expire_at": fixedExpireAt,
        "code": "speech_analyzer.membership.speech_analyzer",
        "owner_type": "individual",
        "application": "speech_analyzer",
        "owner_id": ownerId
      }
    ];

    if (Array.isArray(data.entitlements.features)) {
      data.entitlements.features.forEach(function(item) {
        if ('credit_total' in item && 'start_at' in item && 'owner_id' in item) {
          item.credit_total = 999;
          item.start_at = startAt;
          item.owner_id = ownerId;
        }
      });
    }

    data.entitlements.contents = generateContents();

    data.tier = {
      "code": "premium",
      "expire_at": fixedExpireAt,
      "owner_id": ownerId,
      "owner_type": "individual",
      "start_at": startAt
    };

    data.transactions = [
      {
        "store": "ios",
        "order_id": "GPA.3381-5386-9184-26994",
        "interval": "subscription",
        "status": "granted",
        "created_at": startAt,
        "rf_id": "GPA.3381-5386-9184-26994",
        "duration": "one_year",
        "owner_type": "individual",
        "updated_at": startAt,
        "owner_id": ownerId,
        "catalog": "premium"
      }
    ];

    data.tiers = [
      {
        "code": "premium",
        "expire_at": fixedExpireAt,
        "owner_id": ownerId,
        "owner_type": "individual",
        "start_at": startAt
      }
    ];
  }

  var out = { body: JSON.stringify(data) };

  try {
    var h = (res && res.headers) ? Object.assign({}, res.headers) : {};
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  } catch (e) {}

  if (typeof $done !== 'undefined') $done(out);
})();
