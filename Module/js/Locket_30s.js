/***********************************************
> Locket Gold 30s Video & Remote Config Unlocker
> Cho phép quay video 30s, tải lên video 30s từ thư viện, cắt ghép 30s & mở khóa tính năng Gold
> Tác giả: Nguyễn Ngọc Anh Tú (z3rokaze)
> Cập nhật: 2026-10-15
***********************************************/

var req = typeof $request !== "undefined" && $request ? $request : null;
var res = typeof $response !== "undefined" && $response ? $response : null;
var reqHeaders = (req && req.headers) || {};
var ua = (reqHeaders["User-Agent"] || reqHeaders["user-agent"] || "");

var rawBody = (res && res.body) || "";
var obj = null;

try {
  obj = JSON.parse(rawBody);
} catch (e) {
  obj = null;
}

if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
  $done({});
} else {
  obj.entries = obj.entries || {};

  // 1. Feature Gates & Quyền Gold
  var featureGates = {};
  try {
    if (obj.entries.feature_gates) featureGates = JSON.parse(obj.entries.feature_gates);
  } catch (e) {}

  Object.assign(featureGates, {
    app_icon_picker: "enabled",
    camera_roll: "enabled",
    camera_theme: "enabled",
    locket_views: "enabled",
    long_captions: "enabled",
    longer_video: "enabled",
    longer_videos: "enabled",
    video_recording: "enabled",
    video_upload: "enabled",
    camera_roll_video: "enabled",
    camera_roll_video_picker: "enabled",
    gallery_video_picker: "enabled",
    unlimited_friends: "enabled",
    priority_support: "enabled",
    profile_badge: "enabled",
    remove_ads: "enabled",
    video: "enabled",
    custom_widget_frames: "enabled",
    streak_recovery: "enabled"
  });
  obj.entries.feature_gates = JSON.stringify(featureGates);

  // 2. Camera Config: Tối đa thời lượng quay video lên 30s
  var cameraConfig = {};
  try {
    if (obj.entries.camera) cameraConfig = JSON.parse(obj.entries.camera);
  } catch (e) {}
  Object.assign(cameraConfig, {
    gold_max_duration: 30.0,
    goldMaxDuration: 30.0,
    max_duration: 30.0,
    maxDuration: 30.0,
    video_max_duration: 30.0,
    ultra_wide: true,
    ultraWide: true,
    volume_button: true,
    volumeButton: true,
    flash_button: true,
    telephoto: true,
    srgb: true,
    lanczos: true,
    quality_mbps: 0.9,
    qualityMbps: 0.9
  });
  obj.entries.camera = JSON.stringify(cameraConfig);

  // 3. Camera Roll Config: Cho phép chọn & upload video từ thư viện lên 30s
  var cameraRollConfig = {};
  try {
    if (obj.entries.camera_roll) cameraRollConfig = JSON.parse(obj.entries.camera_roll);
  } catch (e) {}
  Object.assign(cameraRollConfig, {
    gold_max_duration: 30.0,
    goldMaxDuration: 30.0,
    video_max_duration: 30.0,
    videoMaxDuration: 30.0,
    max_duration: 30.0,
    maxDuration: 30.0,
    trim_max_duration: 30.0,
    trimMaxDuration: 30.0,
    camera_roll_max_duration: 30.0,
    quality_mbps: 0.9,
    qualityMbps: 0.9,
    flash_button: true
  });
  obj.entries.camera_roll = JSON.stringify(cameraRollConfig);

  // 4. Video Config Object
  obj.entries.video_config = JSON.stringify({
    enabled: true,
    max_duration: 30,
    recording_duration: 30,
    longer_videos_duration: 30,
    camera_roll_enabled: true,
    max_length: 30
  });

  // 5. Toàn bộ cờ thời lượng 30s trực tiếp (chuẩn hóa tương thích đa phiên bản Locket)
  obj.entries.gold_max_duration = "30.0";
  obj.entries.goldMaxDuration = "30.0";
  obj.entries.max_video_duration = "30.0";
  obj.entries.video_max_duration = "30.0";
  obj.entries.video_duration = "30";
  obj.entries.video_record_max_duration = "30";
  obj.entries.video_record_duration = "30";
  obj.entries.max_recorded_duration = "30";
  obj.entries.longer_videos_duration = "30";
  obj.entries.longer_videos_max_duration = "30";
  obj.entries.camera_roll_video_max_duration = "30.0";
  obj.entries.camera_roll_max_duration = "30.0";
  obj.entries.camera_roll_duration = "30.0";
  obj.entries.video_trim_max_duration = "30.0";
  obj.entries.trim_max_duration = "30.0";

  // 6. Cờ cho phép upload video từ Camera Roll & âm thanh video
  obj.entries.camera_roll_preview_enabled = "true";
  obj.entries.camera_roll_video_enabled = "true";
  obj.entries.camera_roll_video_upload_enabled = "true";
  obj.entries.internal_camera_roll_video_upload_enabled = "true";
  obj.entries.longer_camera_roll_videos_enabled = "true";
  obj.entries.camera_roll_video_picker = "true";
  obj.entries.video_upload_enabled = "true";
  obj.entries.video_sound_enabled = "true";
  obj.entries.microphone_enabled = "true";
  obj.entries.camera_microphone_enabled = "true";
  obj.entries.audio_session_deactivation_enabled = "true";

  // 7. Chặn quảng cáo & tracking trong Locket
  obj.entries.history_ads_mode = "off";
  obj.entries.history_ads_prefetch_count = "0";
  obj.entries.history_ads_prefetch_immediate = "false";
  obj.entries.history_ads_floor_price = "0";
  obj.entries.sentry_sample_rate = "0";
  obj.entries.profile_badge_visible = "true";

  var out = { body: JSON.stringify(obj) };
  try {
    if (res && res.headers) {
      var h = Object.assign({}, res.headers);
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
}
