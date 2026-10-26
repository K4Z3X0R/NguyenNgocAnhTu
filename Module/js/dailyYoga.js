/*
 * @name: Daily Yoga Super VIP Unlock
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
  if (!obj.result || typeof obj.result !== "object" || Array.isArray(obj.result)) {
    obj.result = {};
  }

  obj.result.memberType = 12;
  obj.result.StartTime = "2022-04-23 16:20:35";
  obj.result.EndTime = "2099-12-31 23:59:59";
  obj.result.isSuperVip = 3;
  obj.result.superStartTime = "2022-04-23 16:20:35";
  obj.result.superEndTime = "2099-12-31 23:59:59";
  obj.result.oldSuperStartTime = "2022-04-23 16:20:35";
  obj.result.oldSuperEndTime = "2099-12-31 23:59:59";
  obj.result.pro_center_data = {
    pro_type: 2,
    pro_type_title: "Super VIP",
    pro_service_title: "",
    pro_start_date: "",
    pro_end_date: "2099-12-31",
    day_left: "",
    is_pro_center_red_dot: 0
  };
  obj.result.specialRight = {
    isBaseData: 1,
    isSuperVideo: 1,
    isAllSession: 0,
    isAllProgram: 1,
    isAllKol: 1,
    isAllMusicService: 1,
    isCusterProgram: 1,
    isCusterProgramDays: 1,
    isSuperData: 1,
    isPoseLibrary: 1,
    isPoseLibraryDays: 1,
    isQa: 1,
    isKillAd: 1,
    isKillAdDays: 1,
    isMessage: 1,
    isMessageLevel: 0,
    isMessageImg: 0,
    isMessageImgLevel: 0,
    isUserZone: 0,
    isUserZoneLevel: 3,
    isYomi: 1,
    isYomiLevel: 3,
    isAllMusic: 1,
    isAllMusicDays: 0,
    isMirror: 0,
    isMirrorLevel: 11,
    isSingleMusic: 0,
    isShareCommunity: 1,
    isShareCommunityLevel: 0,
    isSmartCoachTrial: 0,
    isSmartCoachOpen: 0
  };

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
