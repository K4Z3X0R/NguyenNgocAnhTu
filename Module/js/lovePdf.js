/*
 * @name: iLovePDF Premium Unlock
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

  obj.limits = {
    merge: { mb: 4000, files: 500 },
    split: { mb: 4000, files: 1 },
    compress: { mb: 4000, files: 10 },
    officepdf: { mb: 4000, files: 10 },
    wordpdf: { mb: 4000, files: 10 },
    powerpointpdf: { mb: 4000, files: 10 },
    excelpdf: { mb: 4000, files: 10 },
    pdfword: { mb: 4000, files: 10 },
    pdfpowerpoint: { mb: 4000, files: 10 },
    pdfexcel: { mb: 4000, files: 10, pages: 400 },
    pdfoffice: { mb: 4000, files: 10 },
    pdfjpg: { mb: 4000, files: 10 },
    imagepdf: { mb: 4000, files: 80 },
    pagenumber: { mb: 4000, files: 10 },
    watermark: { mb: 4000, files: 10 },
    rotate: { mb: 4000, files: 80 },
    unlock: { mb: 4000, files: 10 },
    protect: { mb: 4000, files: 80 },
    pdfa: { mb: 4000, files: 10 },
    repair: { mb: 4000, files: 10 },
    organize: { mb: 4000, files: 20 },
    resizeimage: { mb: 4000, files: 120 },
    compressimage: { mb: 4000, files: 120 },
    cropimage: { mb: 4000, files: 1 },
    converttojpg: { mb: 4000, files: 120 },
    convertfromjpg: { mb: 4000, files: 120 },
    rotateimage: { mb: 4000, files: 120 },
    watermarkimage: { mb: 4000, files: 120 },
    memeimage: { mb: 4000, files: 1 },
    editimage: { mb: 50, files: 1 },
    editpdf: { mb: 100, files: 1 },
    sign: { mb: 50, files: 5 }
  };
  obj.premium = true;
  obj.sus_rbt = true;

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
