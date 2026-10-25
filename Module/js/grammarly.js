/*
 * @name: Grammarly Keyboard Premium Unlock
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-10-26
 * @desc: Mở khóa Grammarly Premium trên iOS (sửa ngữ pháp nâng cao, viết lại câu thông minh, kiểm tra đạo văn)
 */

(function () {
  'use strict';

  var res = typeof $response !== 'undefined' ? $response : null;
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
    data = {};
  }

  data.isPremium = true;
  data.description = "1-year Grammarly Subscription";
  data.title = "Annual";
  data.type = "Premium";
  data.freemium = false;
  data.grammarlyEdu = true;
  data.free = false;
  data.institutionProofit = true;
  data.Proofit = true;
  data.isAppleSubscription = true;
  data.plagiarismOn = true;

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
