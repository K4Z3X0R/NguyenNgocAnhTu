/***********************************************
> Locket Gold 45s Video & Remote Config Unlocker
> Cho phép quay video 45s, tải lên video 45s từ thư viện, cắt ghép 45s & mở khóa tính năng Gold, Custom Captions & Frames
> Tác giả: Nguyễn Ngọc Anh Tú (z3rokaze)
> Cập nhật: 2026-10-30 (v3.2.3 - Apex Locket Gold 60s Video, 35 Camera Filters & Ultra HD Upload)
***********************************************/

(function () {
// HTTP-REQUEST mode: Xóa If-None-Match & If-Modified-Since và bảo toàn trọn vẹn request body cho Firebase POST
if (typeof $response === "undefined" || $response === null) {
  var reqHeaders = (typeof $request !== "undefined" && $request && $request.headers) ? Object.assign({}, $request.headers) : {};
  delete reqHeaders["If-None-Match"];
  delete reqHeaders["if-none-match"];
  delete reqHeaders["If-Modified-Since"];
  delete reqHeaders["if-modified-since"];
  var reqResult = { headers: reqHeaders };
  if (typeof $request !== "undefined" && $request && $request.body) {
    reqResult.body = $request.body;
  }
  $done(reqResult);
} else {
  var rawBody = ($response && $response.body) || "";
  var obj = null;

  try {
    obj = JSON.parse(rawBody);
  } catch (e) {
    obj = null;
  }

  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    obj = {
      state: "UPDATE",
      entries: {},
      appName: "Locket",
      templateVersion: Date.now().toString()
    };
  }

  // CRITICAL: Đánh dấu state UPDATE để ép Firebase SDK ghi đè toàn bộ cache offline trong ứng dụng
  obj.state = "UPDATE";
  obj.templateVersion = Date.now().toString();
  obj.entries = obj.entries || {};
  obj.Attention = "Bản quyền cấu hình Locket Gold 45s thuộc về Nguyễn Ngọc Anh Tú (z3rokaze) - https://github.com/K4Z3X0R/NguyenNgocAnhTu";

    // ============================================================

    // 1. CẤU HÌNH GOLD, FEATURE GATES & PAYWALL

    // ============================================================

    Object.assign(obj.entries, {

        feature_gates: JSON.stringify({
            app_icon_picker: "enabled",
            appIconPicker: "enabled",
            camera_roll: "enabled",
            cameraRoll: "enabled",
            camera_theme: "enabled",
            cameraTheme: "enabled",
            camera_filter_sheet: "enabled",
            cameraFilterSheet: "enabled",
            camera_filters: "enabled",
            cameraFilters: "enabled",
            custom_filters: "enabled",
            customFilters: "enabled",
            allows_custom_filters: "enabled",
            allowsCustomFilters: "enabled",
            custom_filter_generation: "enabled",
            customFilterGeneration: "enabled",
            ai_looks: "enabled",
            aiLooks: "enabled",
            ai_filters: "enabled",
            aiFilters: "enabled",
            ai_generation: "enabled",
            aiGeneration: "enabled",
            create_look: "enabled",
            createLook: "enabled",
            create_looks: "enabled",
            createLooks: "enabled",
            generative_filters: "enabled",
            generativeFilters: "enabled",
            generative_ai: "enabled",
            generativeAi: "enabled",
            prompt_filters: "enabled",
            promptFilters: "enabled",
            custom_appearance: "enabled",
            customAppearance: "enabled",
            makeover: "enabled",
            makeoverEnabled: "enabled",
            verified_badge: "enabled",
            verifiedBadge: "enabled",
            locket_views: "enabled",
            locketViews: "enabled",
            long_captions: "enabled",
            longCaptions: "enabled",
            longer_video: "enabled",
            longerVideo: "enabled",
            longer_videos: "enabled",
            longerVideos: "enabled",
            video_recording: "enabled",
            videoRecording: "enabled",
            video_upload: "enabled",
            videoUpload: "enabled",
            camera_roll_video: "enabled",
            cameraRollVideo: "enabled",
            unlimited_friends: "enabled",
            unlimitedFriends: "enabled",
            priority_support: "enabled",
            prioritySupport: "enabled",
            profile_badge: "enabled",
            profileBadge: "enabled",
            remove_ads: "enabled",
            removeAds: "enabled",
            video: "enabled",
            custom_widget_frames: "enabled",
            customWidgetFrames: "enabled",
            streak_recovery: "enabled",
            streakRecovery: "enabled",
            holiday_effects: "enabled",
            holidayEffects: "enabled",
            holiday_filters: "enabled",
            holidayFilters: "enabled",
            holiday_moments: "enabled",
            holidayMoments: "enabled",
            view_holiday_moments: "enabled",
            viewHolidayMoments: "enabled",
            can_view_holiday_effects: "enabled",
            canViewHolidayEffects: "enabled",
            seasonal_effects: "enabled",
            seasonalEffects: "enabled",
            seasonal_frames: "enabled",
            seasonalFrames: "enabled",
            view_all_history: "enabled",
            viewAllHistory: "enabled",
            past_moments: "enabled",
            pastMoments: "enabled",
            all_access: "enabled",
            allAccess: "enabled",
            gold_entitlement: "enabled",
            goldEntitlement: "enabled",
            camera_filter_holidays: "enabled",
            cameraFilterHolidays: "enabled",
            effects: "enabled",
            filter_packs: "enabled",
            filterPacks: "enabled",
            moment_effects: "enabled",
            momentEffects: "enabled",
            moment_reactions_effects: "enabled",
            momentReactionsEffects: "enabled",
            calendar_rewind: "enabled",
            calendarRewind: "enabled",
            locket_yearbook: "enabled",
            locketYearbook: "enabled",
            yearbook: "enabled",
            year_in_review: "enabled",
            yearInReview: "enabled",
            streak_freeze: "enabled",
            streakFreeze: "enabled",
            streak_shields: "enabled",
            streakShields: "enabled",
            unlimited_streak_restores: "enabled",
            unlimitedStreakRestores: "enabled",
            ghost_mode: "enabled",
            ghostMode: "enabled",
            stealth_views: "enabled",
            stealthViews: "enabled",
            incognito_views: "enabled",
            incognitoViews: "enabled",
            music_caption_full_preview: "enabled",
            musicCaptionFullPreview: "enabled",
            music_caption_lyrics: "enabled",
            musicCaptionLyrics: "enabled",
            camera_hdr: "enabled",
            cameraHdr: "enabled",
            camera_stabilization: "enabled",
            cameraStabilization: "enabled",
            fps_60: "enabled",
            fps60: "enabled",
            debug_menu: "enabled",
            debugMenu: "enabled",
            developer_mode: "enabled",
            developerMode: "enabled",
            celebrity_inbox: "enabled",
            celebrityInbox: "enabled",
            conversation_drafts: "enabled",
            conversationDrafts: "enabled",
            user_data_export: "enabled",
            userDataExport: "enabled",
            username_suggestions: "enabled",
            usernameSuggestions: "enabled"
        }),

        feature_gates_override: JSON.stringify({
            app_icon_picker: "enabled",
            appIconPicker: "enabled",
            camera_roll: "enabled",
            cameraRoll: "enabled",
            camera_theme: "enabled",
            cameraTheme: "enabled",
            camera_filter_sheet: "enabled",
            cameraFilterSheet: "enabled",
            camera_filters: "enabled",
            cameraFilters: "enabled",
            custom_filters: "enabled",
            customFilters: "enabled",
            allows_custom_filters: "enabled",
            allowsCustomFilters: "enabled",
            custom_filter_generation: "enabled",
            customFilterGeneration: "enabled",
            ai_looks: "enabled",
            aiLooks: "enabled",
            ai_filters: "enabled",
            aiFilters: "enabled",
            ai_generation: "enabled",
            aiGeneration: "enabled",
            create_look: "enabled",
            createLook: "enabled",
            create_looks: "enabled",
            createLooks: "enabled",
            generative_filters: "enabled",
            generativeFilters: "enabled",
            generative_ai: "enabled",
            generativeAi: "enabled",
            prompt_filters: "enabled",
            promptFilters: "enabled",
            custom_appearance: "enabled",
            customAppearance: "enabled",
            makeover: "enabled",
            makeoverEnabled: "enabled",
            verified_badge: "enabled",
            verifiedBadge: "enabled",
            locket_views: "enabled",
            locketViews: "enabled",
            long_captions: "enabled",
            longCaptions: "enabled",
            longer_video: "enabled",
            longerVideo: "enabled",
            longer_videos: "enabled",
            longerVideos: "enabled",
            video_recording: "enabled",
            videoRecording: "enabled",
            video_upload: "enabled",
            videoUpload: "enabled",
            camera_roll_video: "enabled",
            cameraRollVideo: "enabled",
            unlimited_friends: "enabled",
            unlimitedFriends: "enabled",
            priority_support: "enabled",
            prioritySupport: "enabled",
            profile_badge: "enabled",
            profileBadge: "enabled",
            remove_ads: "enabled",
            removeAds: "enabled",
            video: "enabled",
            custom_widget_frames: "enabled",
            customWidgetFrames: "enabled",
            streak_recovery: "enabled",
            streakRecovery: "enabled",
            holiday_effects: "enabled",
            holidayEffects: "enabled",
            holiday_filters: "enabled",
            holidayFilters: "enabled",
            holiday_moments: "enabled",
            holidayMoments: "enabled",
            view_holiday_moments: "enabled",
            viewHolidayMoments: "enabled",
            can_view_holiday_effects: "enabled",
            canViewHolidayEffects: "enabled",
            seasonal_effects: "enabled",
            seasonalEffects: "enabled",
            seasonal_frames: "enabled",
            seasonalFrames: "enabled",
            view_all_history: "enabled",
            viewAllHistory: "enabled",
            past_moments: "enabled",
            pastMoments: "enabled",
            all_access: "enabled",
            allAccess: "enabled",
            gold_entitlement: "enabled",
            goldEntitlement: "enabled",
            camera_filter_holidays: "enabled",
            cameraFilterHolidays: "enabled",
            effects: "enabled",
            filter_packs: "enabled",
            filterPacks: "enabled",
            moment_effects: "enabled",
            momentEffects: "enabled",
            moment_reactions_effects: "enabled",
            momentReactionsEffects: "enabled",
            calendar_rewind: "enabled",
            calendarRewind: "enabled",
            locket_yearbook: "enabled",
            locketYearbook: "enabled",
            yearbook: "enabled",
            year_in_review: "enabled",
            yearInReview: "enabled",
            streak_freeze: "enabled",
            streakFreeze: "enabled",
            streak_shields: "enabled",
            streakShields: "enabled",
            unlimited_streak_restores: "enabled",
            unlimitedStreakRestores: "enabled",
            ghost_mode: "enabled",
            ghostMode: "enabled",
            stealth_views: "enabled",
            stealthViews: "enabled",
            incognito_views: "enabled",
            incognitoViews: "enabled",
            music_caption_full_preview: "enabled",
            musicCaptionFullPreview: "enabled",
            music_caption_lyrics: "enabled",
            musicCaptionLyrics: "enabled",
            camera_hdr: "enabled",
            cameraHdr: "enabled",
            camera_stabilization: "enabled",
            cameraStabilization: "enabled",
            fps_60: "enabled",
            fps60: "enabled",
            debug_menu: "enabled",
            debugMenu: "enabled",
            developer_mode: "enabled",
            developerMode: "enabled",
            celebrity_inbox: "enabled",
            celebrityInbox: "enabled",
            conversation_drafts: "enabled",
            conversationDrafts: "enabled",
            user_data_export: "enabled",
            userDataExport: "enabled",
            username_suggestions: "enabled",
            usernameSuggestions: "enabled"
        }),

        upsell_features: JSON.stringify({
            app_icon_picker: true,
            camera_roll: true,
            camera_theme: true,
            locket_views: true,
            remove_ads: true,
            custom_widget_frames: true,
            holiday_effects: false,
            holiday_filters: false,
            filters: false,
            camera_filters: false
        }),

        paywall_presentation_config: JSON.stringify({
            uid: "paywall_testflight",
            onboarding: false,
            after_sent_moment: false,
            on_foreground: false,
            interval: 259200000,
            profile_banner: false
        }),

        history_gold_upsell_slot_config: JSON.stringify({
            appearance_probability: 0,
            uid: "disabled",
            show_first_probability: 0,
            first_slot_position: 999999,
            interval: 999999
        }),

        holiday_effects_enabled: "true",
        holiday_filters_enabled: "true",
        holiday_moments_enabled: "true",
        camera_filter_holidays_enabled: "true",
        can_view_holiday_effects: "true",
        view_holiday_moments: "true",
        camera_filters_enabled: "true",
        camera_filter_sheet_enabled: "true",
        allows_custom_filters: "true",
        show_filter_button: "true",
        custom_filters_enabled: "true",
        custom_filters_unlocked: "true",
        custom_filter_quota: "9999",
        custom_filters_max_per_day: "9999",
        unlimited_custom_filters: "true",
        ai_filters_enabled: "true",
        ai_looks_enabled: "true",
        create_look_enabled: "true",
        create_looks_enabled: "true",
        generative_filters_enabled: "true",
        makeover_enabled: "true",
        custom_appearance_enabled: "true",
        share_history_prompt_enabled: "false",

        feature_discovery_popup_config: JSON.stringify({

            tag: "LOCKET GOLD",

            tag_gradient: true,

            tag_style: "gold_gradient",

            title: "LOCKET GOLD 60S MAX VIP",

            feature_set: [

                {

                    title: "👑 Locket Gold 60s Max VIP",

                    body: "Đã kích hoạt Video 60s Kịch Trần, Custom Captions & Khung viền VIP | by Nguyễn Ngọc Anh Tú",

                    imageURL: "https://i.ibb.co/tPkjxLkt/1792636721373-274634644232052516-3575467034759724149-468456e99a1faab6b5ee65a7a369b8bb.jpg"

                }

            ],

            primary_button_title: "done",

            campaign: "locket_gold_welcome_v4_" + (function() {
                try {
                    return Date.now().toString();
                } catch (e) {
                    return "v4_active";
                }
            })(),

            start_at: "2020-01-01T00:00:00",

            end_at: "2099-12-31T23:59:59",

            use_local_time_zone: true

        }),

        android_subscribe_gold_button_enabled: "false",

        profile_badge_visible: "true",

        lunar_new_year_app_icon_enabled: "true",

        settings_instagram_url: "https://www.instagram.com/ekaz.nyra",

        settings_tiktok_url: "https://www.tiktok.com/@K4Z3X0R",

        celebrity_inbox_enabled: "true",
        celebrity_vip_qr_redemption_enabled: "true",
        chat_hyperlink_enabled_mode: "always_enabled",
        conversation_drafts_enabled: "true",
        group_contact_invites_enabled: "true",
        groups_onboarding_accept_invite_preview_enabled: "true",
        signup_custom_profile_picture: "true",
        user_data_export_enabled: "true",
        username_suggestions_enabled: "true",
        material_blur: "regular",
        mh_mic_enabled_v16: "true",
        cameraRollSecondaryFlashButtonEnabled: "true",
        qrCodeScanningEnabled: "true",
        longerVideosEnabled: "true",
        livePhotoCaptureEnabled: "true",
        LocketConfigBeta: "true"

    });

    // ============================================================

    // 2. CHẶN QUẢNG CÁO & TẮT TRACKING (SENTRY)

    // ============================================================

    Object.assign(obj.entries, {

        history_ads_mode: "off",

        history_ads_prefetch_count: "0",

        history_ads_prefetch_immediate: "false",

        history_ads_prefetch_reroute: "false",

        history_ads_dynamic_insertion: "false",

        history_ads_refresh_prefetch_on_foreground: "false",

        history_ads_floor_price: "0",

        history_ads_floor_price_att: "0",

        history_ad_log_displayed_on_background: "false",

        history_ads_debug_menu: "true",

        sentry_sample_rate: "0",

        sentry_network_tracing: "false",

        sentry_performance_tracking: "false",

        sentry_trace_sample_rate: "0",

        sentry_profiles_sample_rate: "0"

    });

    // ============================================================
    // 3. CAMERA, VIDEO, FILTERS & UPLOAD QUALITY (60.0s KỊCH TRẦN HỢP LỆ - CHỐNG FALLBACK VỀ 5S)
    // ============================================================
    var MY_VIDEO_DURATION = 60.0;
    var durationStr = "60.0";

    var cameraConfig = {
        gold_max_duration: MY_VIDEO_DURATION,
        goldMaxDuration: MY_VIDEO_DURATION,
        max_duration: MY_VIDEO_DURATION,
        maxDuration: MY_VIDEO_DURATION,
        video_max_duration: MY_VIDEO_DURATION,
        videoMaxDuration: MY_VIDEO_DURATION,
        video_duration: MY_VIDEO_DURATION,
        videoDuration: MY_VIDEO_DURATION,
        ultra_wide: true,
        ultraWide: true,
        volume_button: true,
        volumeButton: true,
        flash_button: true,
        telephoto: true,
        srgb: true,
        lanczos: true,
        hdr: true,
        hdr_video: true,
        stabilization: true,
        fps_60: true,
        filters: true,
        effects: true,
        microphone: true,
        microphone_enabled: true,
        sound_enabled: true,
        quality_mbps: 0.6,
        qualityMbps: 0.6
    };

    var cameraRollConfig = {
        gold_max_duration: MY_VIDEO_DURATION,
        goldMaxDuration: MY_VIDEO_DURATION,
        video_max_duration: MY_VIDEO_DURATION,
        videoMaxDuration: MY_VIDEO_DURATION,
        max_duration: MY_VIDEO_DURATION,
        maxDuration: MY_VIDEO_DURATION,
        trim_max_duration: MY_VIDEO_DURATION,
        trimMaxDuration: MY_VIDEO_DURATION,
        camera_roll_max_duration: MY_VIDEO_DURATION,
        camera_roll_video_max_duration: MY_VIDEO_DURATION,
        maximum_duration: MY_VIDEO_DURATION,
        maximumDuration: MY_VIDEO_DURATION,
        max_file_size: 104857600,
        max_upload_bytes: 104857600,
        max_size_bytes: 104857600,
        quality_mbps: 0.6,
        qualityMbps: 0.6,
        flash_button: true
    };

    obj.entries.camera = JSON.stringify(cameraConfig);
    obj.entries.camera_roll = JSON.stringify(cameraRollConfig);
    obj.entries.video_config = JSON.stringify({
        enabled: true,
        max_duration: 60.0,
        recording_duration: 60.0,
        longer_videos_duration: 60.0,
        camera_roll_enabled: true,
        max_length: 60.0
    });
    obj.entries.android_camera_video_recording = JSON.stringify({
        free: { maximum_duration: 60000, size: 720, file_type: "mp4", video_codec: "h265" },
        gold: { maximum_duration: 60000, size: 1080, file_type: "mp4", video_codec: "h265" }
    });

    Object.assign(obj.entries, {
        live_photos: JSON.stringify({
            capture: true,
            viewing: true,
            catch_up: true,
            widget_looping_mode: "never"
        }),
        camera_filter_config: JSON.stringify({
            allows_custom_filters: true,
            show_filter_button: true,
            sheet_enabled: true,
            open_sheet_immediately: true,
            custom_filters_enabled: true,
            custom_filters_unlocked: true,
            custom_filter_generation_enabled: true,
            allows_custom_prompts: true,
            unlimited_custom_filters: true,
            max_custom_filters: 9999,
            custom_filter_quota: 9999,
            ai_looks_enabled: true,
            ai_filters_enabled: true,
            generative_filters_enabled: true,
            is_gold_required: false,
            gold_required: false,
            requires_gold: false,
            is_free: true,
            sheet_filters: [
                { title: { en: "Goofy" }, filter_ids: ["okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows"] },
                { title: { en: "Looks" }, filter_ids: ["bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "bye_brows"] },
                { title: { en: "Celebrate" }, filter_ids: ["slimed", "princess", "disco_lights", "cash_money", "happy_birthday"] },
                { title: { en: "Cute" }, filter_ids: ["cutesy", "sticker_face", "flower_crown", "love_bug"] },
                { title: { en: "Costumes" }, filter_ids: ["wedding", "cowboy_cowgirl", "giraffe", "clown"] },
                { title: { en: "Holidays" }, filter_ids: ["easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"] }
            ],
            picker_filters: [
                "okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows",
                "bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns",
                "tatted", "mohawk", "braces", "slimed", "princess",
                "disco_lights", "cash_money", "happy_birthday", "cutesy", "sticker_face",
                "flower_crown", "love_bug", "wedding", "cowboy_cowgirl", "giraffe",
                "clown", "easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun",
                "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"
            ]
        }),
        camera_roll_preview_enabled: "true",
        camera_roll_video_enabled: "true",
        camera_roll_video_upload_enabled: "true",
        internal_camera_roll_video_upload_enabled: "true",
        longer_camera_roll_videos_enabled: "true",
        camera_roll_video_max_duration: durationStr,
        camera_roll_max_duration: durationStr,
        camera_roll_duration: durationStr,
        max_video_duration: durationStr,
        video_max_duration: durationStr,
        video_trim_max_duration: durationStr,
        trim_max_duration: durationStr,
        gold_max_duration: durationStr,
        goldMaxDuration: durationStr,
        longer_video_duration: durationStr,
        longer_videos_duration: durationStr,
        longer_video_max_duration: durationStr,
        longer_videos_max_duration: durationStr,
        video_duration: durationStr,
        video_record_max_duration: durationStr,
        video_record_duration: durationStr,
        max_recorded_duration: durationStr,
        recording_max_duration: durationStr,
        recording_duration: durationStr,
        maximum_duration: durationStr,
        video_maximum_duration: durationStr,
        camera_video_maximum_duration: durationStr,
        video_recording_maximum_duration: durationStr,
        max_file_size: "104857600",
        max_upload_bytes: "104857600",
        video_quality_mbps: "0.9",
        video_sound_enabled: "true",
        microphone_enabled: "true",
        camera_microphone_enabled: "true",
        audio_session_deactivation_enabled: "true",
        zoom_enabled: "true",
        upload_main: "false",
        upload_main_image_quality: "1.0",
        upload_main_image_size: "2160",
        upload_thumbnail_image_quality: "1.0",
        upload_thumbnail_image_size: "1080",
        camera_hdr_enabled: "true",
        camera_stabilization_enabled: "true",
        video_stabilization_enabled: "true",
        high_quality_video_playback: "true"
    });

    // ============================================================

    // 4. BẠN BÈ, GIỚI HẠN & ĐỀ XUẤT KẾT BẠN

    // ============================================================

    Object.assign(obj.entries, {

        max_friends_count: "999999",

        friend_limit_mode: "0",

        soft_friend_limit_threshold_count: "999999",

        show_friend_limit_on_cam: "false",

        signup_max_friends_count: "999999",

        celebrity_inbox_limit: "999999",

        friend_limit_geo_override: JSON.stringify({ experiments: {}, area_code_overrides: {} }),

        friends_sheet_locket_count_config: JSON.stringify({

            items: [

                { threshold: 0, icon_name: "heart" },

                { threshold: 1, icon_name: "heart.fill" },

                { threshold: 10, emoji: "🤍" },

                { threshold: 100, emoji: "💛" },

                { threshold: 500, emoji: "❤️‍🔥" },

                { threshold: 1000, emoji: "🌟🫶🌟" },

                { threshold: 2000, emoji: "✨💟✨" },

                { threshold: 5000, emoji: "⚡️😵‍💫⚡" },

                { threshold: 10000, emoji: "✨⚡️😱⚡✨" }

            ]

        }),

        friend_locket_count_config: JSON.stringify({

            items: [

                { threshold: 0, icon_name: "heart" },

                { threshold: 1, icon_name: "heart.fill" },

                { threshold: 10, emoji: "🤍" },

                { threshold: 100, emoji: "💛" },

                { threshold: 500, emoji: "❤️‍🔥" },

                { threshold: 1000, emoji: "✨💗✨" },

                { threshold: 2000, emoji: "✨️⭐️✨" },

                { threshold: 5000, emoji: "✨💎✨" },

                { threshold: 10000, emoji: "✨🔐💛✨" }

            ]

        }),

        new_friends_monitoring_enabled: "true",

        improved_friend_suggestions: "true",

        show_friend_suggestions_by_default: "true",

        emoji_friend_suggestions: "true",

        prompt_contact_permissions_on_search: "true",

        populate_phone_numbers_from_suggest_friends: "true",

        hide_friends_enabled: "true",

        hide_invite_links: "false",

        hide_skip_contacts: "true",

        show_all_contacts: "true",

        show_invite_suggestions: "true",

        show_no_friends_bottom_sheet: "false",

        signup_allow_skip_add_friends: "true",
        allow_any_country_code: "true",
        enable_friend_suggestions: "true",
        enable_mutual_friends: "true",
        allow_friend_requests_from_explore: "true"

    });

    // ============================================================

    // 5. MOMENTS, STREAK, CHAT & TƯƠNG TÁC

    // ============================================================

    try {

        var streak = JSON.parse(obj.entries.streak_config || "{}");

        streak.minimum_recovery_count = 0;

        streak.minimum_display_count = 0;
        streak.streak_freeze_enabled = true;
        streak.unlimited_streak_restores = true;
        streak.grace_period_days = 365;
        streak.recovery_window_days = 365;

        obj.entries.streak_config = JSON.stringify(streak);

    } catch (e) {}

    Object.assign(obj.entries, {

        moment_views_enabled: "true",

        moment_views_v2: "true",

        record_moment_views: "true",

        notify_moment_views: "true",

        get_moment_views_as_cloud_function: "true",

        moment_reactions_v2: "true",

        chat_reactions_enabled: "true",

        conversation_reactions: "true",

        typing_indicators_enabled: "true",

        unsend_message_enabled: "true",

        reply_prototype_enabled: "true",

        messages_integration: "true",

        conversations_enabled: "true",

        fetch_moments_in_conversation: "true",

        hide_chat_button: "false",

        groups_enabled: "true",

        send_to_self_only_mode: "always_enabled",

        time_travel_rewind_v2_enabled: "true",

        calendar_delete_moment_enabled: "true",

        calendar_rewind_enabled: "true",
        locket_yearbook_enabled: "true",
        yearbook_enabled: "true",
        year_in_review_enabled: "true",
        streak_freeze_enabled: "true",
        unlimited_streak_restores: "true",
        streak_grace_period_days: "365",
        streak_restore_without_gold: "true",
        anonymous_views_enabled: "true",
        stealth_views: "true",
        incognito_views_enabled: "true",
        hide_view_receipt: "true",
        music_caption_full_song_preview: "true",
        music_caption_lyrics_enabled: "true",
        audio_messages_enabled: "true",
        voice_messages_enabled: "true",
        voice_caption_enabled: "true",
        longer_audio_captions: "true",
        burst_reactions_enabled: "true",
        reaction_sound_effects: "true",
        custom_reactions_enabled: "true",
        ghost_mode_viewing: "true",
        read_receipts_disabled: "true",
        save_moment_without_watermark: "true",
        export_moment_raw_quality: "true",
        bypass_screenshot_detection: "true",
        stealth_screenshot_capture: "true",
        anti_screenshot_notify: "false",
        allow_screenshot_saving: "true",

        locket_yearbook_story_sharing_encouraged: "true",

        rollcall_enabled: "true",

        rollcall_comment_actions: "true",

        rollcall_profile_button: "true",

        rollcall_prompt_export_after_share: "true",

        rollcall_confirm_skip_tagging: "false",

        rollcall_tap_to_tag_enabled: "false"

    });

    // ============================================================
    // 6. WIDGET, THÔNG BÁO & GIAO DIỆN (JOURNAL / PROFILE / KHUNG VIP)
    // ============================================================
    Object.assign(obj.entries, {
        widget_frame_event_max_images: "10",
        android_widget_frame_event_enabled: "true",
        widget_badge_enabled: "true",
        widget_badge_v2: "true",
        widget_stale_state_enabled: "false",
        widget_last_sent_indicator: "false",
        widget_sync_token_reload_mode: "clearTokenNever",

        // Kích hoạt tính năng Custom Widget Frame trong Locket Gold
        custom_widget_frames: "enabled",
        custom_widget_frames_enabled: "true",

        // Khung sự kiện mặc định trỏ thẳng tới khung 20-10 thiết kế riêng cho anh Tú
        widget_frame_event: JSON.stringify({
            uid: "vietnam_women_day_20_10",
            url: "https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/assets/frame_20_10.png",
            use_local_time_zone: true,
            placement: "below",
            start_at: "2020-01-01T00:00:00",
            end_at: "2099-12-31T23:59:59"
        }),

        // Cấu hình kho khung tĩnh VIP Gold tùy chỉnh đỉnh cao
        widget_frames_config: JSON.stringify({
            enabled: true,
            allow_custom_frames: true,
            unlock_all_styles: true,
            default_style: "vietnam_women_day_20_10",
            styles: [
                {
                    id: "vietnam_women_day_20_10",
                    name: "🌸 20-10 Ngày Phụ Nữ Việt Nam",
                    border_style: "pink_floral_ribbon",
                    crown_badge: false,
                    badge_text: "20-10",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#FFB6C1",
                    overlay_asset: "vietnam_women_day_20_10",
                    url: "https://raw.githubusercontent.com/K4Z3X0R/NguyenNgocAnhTu/master/Module/assets/frame_20_10.png"
                },
                {
                    id: "royal_gold_vip",
                    name: "👑 VIP Royal Gold",
                    border_style: "ornate_gold",
                    crown_badge: true,
                    badge_text: "VIP",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#FFD700",
                    overlay_asset: "royal_crown_frame"
                },
                {
                    id: "halloween_spooky",
                    name: "🎃 Halloween Spooky Night",
                    border_style: "spooky_pumpkin_bat",
                    crown_badge: false,
                    badge_text: "Halloween",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#FF7518",
                    overlay_asset: "halloween_frame"
                },
                {
                    id: "merry_christmas",
                    name: "🎄 Giáng Sinh Tuyết Rơi",
                    border_style: "christmas_snow_pine",
                    crown_badge: false,
                    badge_text: "Noel",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#00FF7F",
                    overlay_asset: "christmas_frame"
                },
                {
                    id: "sweet_valentine",
                    name: "💖 Sweet Valentine Trái Tim",
                    border_style: "sweet_love_heart",
                    crown_badge: false,
                    badge_text: "Valentine",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#FF69B4",
                    overlay_asset: "valentine_frame"
                },
                {
                    id: "cyberpunk_neon",
                    name: "⚡ Cyberpunk Neon Dark",
                    border_style: "cyber_neon_glow",
                    crown_badge: false,
                    badge_text: "Cyber",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#00FFFF",
                    overlay_asset: "cyberpunk_frame"
                },
                {
                    id: "midautumn_festival",
                    name: "🥮 Tết Trung Thu Đoàn Viên",
                    border_style: "lantern_moon",
                    crown_badge: false,
                    badge_text: "Trung Thu",
                    corner_radius: 28.0,
                    glow_effect: true,
                    glow_color: "#FFA500",
                    overlay_asset: "midautumn_frame",
                    url: "https://hosting.photobucket.com/884f09fa-d52e-40c7-b848-0dc5b19d4288/0cb2a814-22fe-4037-9a0a-25c0fe2476f5.png"
                }
            ]
        }),

        // Danh sách ID khung đè vào menu chọn widget
        widget_frame_styles: JSON.stringify([
            "vietnam_women_day_20_10",
            "royal_gold_vip",
            "halloween_spooky",
            "merry_christmas",
            "sweet_valentine",
            "cyberpunk_neon",
            "midautumn_festival",
            "gold_luxury",
            "classic"
        ]),

        // Cấu hình sự kiện / Seasonal Frames đè
        seasonal_frames_config: JSON.stringify({
            enabled: true,
            auto_rotate: false,
            override_default: true,
            current_season_theme: "vietnam_women_day_20_10"
        }),

        live_activity_onboarding: "true",
        live_activity_onboarding_variant: "friending",
        register_live_activity_push_to_start_token: "true",
        live_activity_remove_stale_start_token: "true",
        notification_preferences_live_activities: "true",
        notification_preferences: "true",
        notification_reply_body_visible: "true",
        prompt_notification_permissions_after_friending: "true",
        activity_bar_enabled: "true",
        journal_activity_bar_enabled: "true",

        journal_settings: JSON.stringify({
            debug_menu_enabled: true,
            focus_animation: true,
            compact_header: true,
            friends_button: true,
            reverse_scroll_direction: false,
            streak_visualization: true,
            streak_visualization_style: "gradient",
            streak_header_minimum_count: 0,
            streak_visualization_minimum_count: 2,
            overlay_indicators: { location: true, music: true, static_content: true, weather: true }
        }),

        qr_code_config: JSON.stringify({ profile_enabled: true, scanning_enabled: true }),
        custom_profile_pics: "true",
        profile_menu_v2_enabled: "true"
    });

    // ============================================================
    // 7. HỆ THỐNG, CACHE & STORAGE CDN (TỐI ƯU CỰC HẠN & CROSS-PLATFORM)
    // ============================================================
    Object.assign(obj.entries, {
        cdn_domain_replacements: JSON.stringify({
            "firebasestorage.googleapis.com": "cdn.locketcamera.com"
        }),
        cdn_domain_replacements_video: "true",
        storage_bucket: "gs://locket-img",
        storage_bucket_video: "gs://locket-video",
        image_cache_max_age_sec: "157680000", // 5 năm cache
        image_cache_max_size: "500000000",    // 500 MB
        history_cache_age_days: "1000",
        user_cache_max_age_sec: "691200",
        friends_cache_max_age_sec: "2592000",
        image_fetch_cache: "true",
        image_cache_use_shared: "true",
        use_doc_dir_for_image_cache: "true",
        efficient_history_cache_invalidation: "true",
        timestamp_based_history_fetches: "true",
        get_latest_moment_v2: "true",
        fetch_users_from_cloud_function: "true",
        refresh_interval: "30",
        widget_auto_refresh_sec: "15",
        widget_background_fetch_interval: "15",
        fast_widget_update: "true",
        firestore_refresh_v2: "true",
        firestore_refresh_v3: "true",
        keychain_access_retries: "true",
        blocked_users_cached_sync_enabled: "true",
        beta_features_enabled: "true",
        join_testflight_enabled: "true",
        safety_center: "true",
        help_center: "true",
        support_v2: "true",
        privacy_choices_setting: "true",
        request_att_permission: "true",
        invite_link_preview_variant: "4",
        share_history_config: JSON.stringify({ prompt_enabled: false, fetching_enabled: true }),
        share_history_prompt_enabled: "false",
        use_thumbnails_for_sharing: "true",
        use_thumbnails_in_timeline: "true",
        persist_onboarding_step: "true",
        onboarding_contact_permission_step: "true",
        android_gold_subscription_override: "true",
        android_subscribe_gold_button_enabled: "true"
    });

    // ============================================================

    // 8. OVERLAY & CUSTOM CAPTIONS

    // ============================================================

    Object.assign(obj.entries, {

        overlay_navigator_enabled: "true",

        overlays_v2_config: JSON.stringify({ suggestions_enabled: true }),

        captions_enabled: "true",

        music_caption_enabled: "true",

        music_caption_song_preview_enabled: "true",

        link_caption_link_enabled: "true",

        overlay_dynamic_captions: JSON.stringify([

            "standard", "poll", "color_palette", "review", "music", "location",

            "weather", "time", "streak", "star_sign", "party_time", "locket_count",

            "good_morning", "goodnight", "ootd", "miss_you", "custom", "phunu_2010", "halloween_2026"

        ]),

        overlay_items: JSON.stringify([

            {

                section: "🎨 General",

                items: [

                    { overlay_id: "caption:standard", source: "local", caption: { type: "standard" } },

                    { overlay_id: "caption:review", source: "local", caption: { type: "review" } },

                    { overlay_id: "caption:music", source: "local", caption: { type: "music" } },

                    { overlay_id: "caption:location", source: "local", caption: { type: "location" } },

                    { overlay_id: "caption:weather", source: "local", caption: { type: "weather" } },

                    { overlay_id: "caption:time", source: "local", caption: { type: "time" } },

                    { overlay_id: "caption:streak", source: "local", caption: { type: "streak" } },

                    { overlay_id: "caption:star_sign", source: "local", caption: { type: "star_sign" } },

                    { overlay_id: "caption:poll", source: "local", caption: { type: "poll" } },

                    { overlay_id: "caption:color_palette", source: "local", caption: { type: "color_palette" } },

                    { overlay_id: "caption:locket_count", source: "local", caption: { type: "locket_count" } }

                ]

            },

            {

                section: "🎨 Holiday Caption",

                items: [

                    {

                        overlay_id: "caption:halloween_2026",

                        source: "remote",

                        caption: {

                            background: { colors: ["#150804", "#C8540D"] },

                            icon: { data: "🎃", type: "emoji" },

                            max_lines: 1,

                            text: "Halloween",

                            localized_text: { en: "Halloween", vn: "Halloween" },

                            text_color: "#FFB182",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:autumn_2026",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFE0A0", "#F6A53A"] },

                            icon: { data: "🍂", type: "emoji" },

                            max_lines: 1,

                            text: "Xin chào Mùa Thu",

                            localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" },

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:christmas_eve_2026",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2FA85F", "#176B3A"] },

                            icon: { data: "🕯️", type: "emoji" },

                            max_lines: 1,

                            text: "Giáng sinh an lành",

                            localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" },

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:christmas_day_2026",

                        source: "remote",

                        caption: {

                            background: { colors: ["#E53935", "#A81818"] },

                            icon: { data: "🎄", type: "emoji" },

                            max_lines: 1,

                            text: "Giáng sinh an lành",

                            localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" },

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:new_years_eve_2026",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFC64B", "#FFEDBF"] },

                            icon: { data: "🥂", type: "emoji" },

                            max_lines: 1,

                            text: "Xin chào 2027!",

                            localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" },

                            text_color: "#643F00",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:new_years_day_2027",

                        source: "remote",

                        caption: {

                            background: { colors: ["#3B00EC", "#823FFF"] },

                            icon: { data: "💫", type: "emoji" },

                            max_lines: 1,

                            text: "Xin chào 2027!",

                            localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" },

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:new_years_day_2027_alternate",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF0062", "#FF783F"] },

                            max_lines: 1,

                            text: "2027",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Decorative by Locket",

                items: [

                    {

                        overlay_id: "caption:party_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#5EFFF5", "#FCFF57"] },

                            icon: { data: "🪩", type: "emoji" },

                            max_lines: 1,

                            text: "Party Time!",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:good_morning",

                        source: "remote",

                        daily_start_hour: 5,

                        daily_end_hour: 10,

                        caption: {

                            background: { colors: ["#EF7402", "#EABF0F"] },

                            icon: { data: "☀️", type: "emoji" },

                            max_lines: 1,

                            text: "Good morning",

                            text_color: "#FFFFFFE5",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:goodnight",

                        source: "remote",

                        daily_start_hour: 19.5,

                        daily_end_hour: 24,

                        caption: {

                            background: { colors: ["#370C6F", "#575CD4"] },

                            icon: { data: "🌙", type: "emoji" },

                            max_lines: 1,

                            text: "Goodnight",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ootd",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFFFFF", "#DBDBDB"] },

                            icon: { data: "🕶", type: "emoji" },

                            max_lines: 1,

                            text: "OOTD",

                            text_color: "#101010E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:miss_you",

                        source: "remote",

                        caption: {

                            background: { colors: ["#EC0C00", "#FF493F"] },

                            icon: { data: "🥰", type: "emoji" },

                            max_lines: 1,

                            text: "Miss you",

                            text_color: "#FFFFFFDB",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Nguyễn Ngọc Anh Tú",

                items: [

                    {

                        overlay_id: "caption:z3rokaze",

                        source: "remote",

                        caption: {

                            background: { colors: ["#00F0FF", "#7000FF", "#FF007A"] },

                            icon: { data: "👑", type: "emoji" },

                            max_lines: 1,

                            text: "Nguyễn Ngọc Anh Tú",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:feeling_cute",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F8BBD0", "#E91E63"] },

                            icon: { data: "🌷", type: "emoji" },

                            max_lines: 1,

                            text: "Feeling Cute",

                            localized_text: { en: "Feeling Cute", vn: "Cảm thấy dthw" },

                            text_color: "#FFFFFFE5",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFD6A5", "#FFF1A8", "#FFC4D6"] },

                            max_lines: 1,

                            text: "Cu 🐎",

                            text_color: "#633B24",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:tuat",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2C1A0E", "#5D4037", "#D7A86E"] },

                            icon: { data: "🐕", type: "emoji" },

                            max_lines: 1,

                            text: "Tuất",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:wedding_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFE4E1", "#E73C7E"] },

                            icon: { data: "💍", type: "emoji" },

                            max_lines: 1,

                            text: "Wedding Time!",

                            localized_text: { en: "Wedding Time!", vn: "Đám cưới nè!" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cam_thay_hanh_phuc",

                        source: "remote",

                        caption: {

                            background: { colors: ["#EC407A", "#F8BBD0"] },

                            icon: { data: "🇻🇳", type: "emoji" },

                            max_lines: 1,

                            text: "Cảm thấy hạnh phúc",

                            localized_text: { en: "Feeling Happy", vn: "Cảm thấy hạnh phúc" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:coffee_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#4E342E", "#8D6E63"] },

                            icon: { data: "☕", type: "emoji" },

                            max_lines: 1,

                            text: "Coffee Time!",

                            localized_text: { en: "Coffee Time!", vn: "Giờ uống cà phê!" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:snake_vibes",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2E7D32", "#66BB6A"] },

                            icon: { data: "🐍", type: "emoji" },

                            max_lines: 1,

                            text: "Snake Vibes",

                            localized_text: { en: "Snake Vibes", vn: "Chất rắn" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:mixue_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFF9C4", "#F8BBD0"] },

                            icon: { data: "🍦", type: "emoji" },

                            max_lines: 1,

                            text: "Mixue Time!",

                            localized_text: { en: "Mixue Time!", vn: "Giờ Mixue!" },

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:locket_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#ECEFF1", "#B3E5FC"] },

                            icon: { data: "📷", type: "emoji" },

                            max_lines: 1,

                            text: "Locket Time!",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cinema_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1A237E", "#455A64"] },

                            icon: { data: "🎬", type: "emoji" },

                            max_lines: 1,

                            text: "Cinema Time!",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:dating_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#E91E63", "#F44336"] },

                            icon: { data: "💕", type: "emoji" },

                            max_lines: 1,

                            text: "Dating Time!",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:graduation_day",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1A237E", "#283593"] },

                            icon: { data: "🎓", type: "emoji" },

                            max_lines: 1,

                            text: "Happy Graduation Day!",

                            localized_text: { en: "Happy Graduation Day!", vn: "Chúc mừng tốt nghiệp!" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:shopping_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#B3E5FC", "#FFFFFF"] },

                            icon: { data: "🛍️", type: "emoji" },

                            max_lines: 1,

                            text: "Shopping Time!",

                            localized_text: { en: "Shopping Time!", vn: "Giờ mua sắm!" },

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:dinner_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFCCBC", "#FF8A80"] },

                            icon: { data: "🍽️", type: "emoji" },

                            max_lines: 1,

                            text: "Dinner Time!",

                            localized_text: { en: "Dinner Time!", vn: "Giờ ăn tối!" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:chilling_time",

                        source: "remote",

                        caption: {

                            background: { colors: ["#E1BEE7", "#F8BBD0"] },

                            icon: { data: "🌴", type: "emoji" },

                            max_lines: 1,

                            text: "Chilling Time!",

                            localized_text: { en: "Chilling Time!", vn: "Giờ thư giãn!" },

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Độc lạ",

                items: [

                    {

                        overlay_id: "caption:xin_vinh_biet_cu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#232526", "#414345"] },

                            icon: { data: "🕯️", type: "emoji" },

                            max_lines: 1,

                            text: "Xin vĩnh biệt cụ",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:chay_ngay_di",

                        source: "remote",

                        caption: {

                            background: { colors: ["#D31027", "#EA384D"] },

                            icon: { data: "🏃💨", type: "emoji" },

                            max_lines: 1,

                            text: "Chạy ngay đi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:luc_nao_co_tien_thi_moi_di_a",

                        source: "remote",

                        caption: {

                            background: { colors: ["#0F2027", "#203A43", "#2C5364"] },

                            icon: { data: "💸", type: "emoji" },

                            max_lines: 1,

                            text: "Lúc nào có tiền thì mới đi á",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cu_tu_tu_khoai_se_nhu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#56AB2F", "#A8E063"] },

                            icon: { data: "🥔", type: "emoji" },

                            max_lines: 1,

                            text: "Cứ từ từ khoai sẽ nhừ",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:kiem_tra_nhan_pham",

                        source: "remote",

                        caption: {

                            background: { colors: ["#654EA3", "#EAAFC8"] },

                            icon: { data: "🎲", type: "emoji" },

                            max_lines: 1,

                            text: "Kiểm tra nhân phẩm",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:doc_so_tai_khoan",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1E90FF", "#00D4FF"] },

                            icon: { data: "💳", type: "emoji" },

                            max_lines: 1,

                            text: "đọc số tài khoản",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ai_so_thi_di_ve",

                        source: "remote",

                        caption: {

                            background: { colors: ["#B71C1C", "#FF5722"] },

                            icon: { data: "🏃", type: "emoji" },

                            max_lines: 1,

                            text: "ai sợ thì đi về",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:con_cai_nit",

                        source: "remote",

                        caption: {

                            background: { colors: ["#D7CCC8", "#8D6E63"] },

                            icon: { data: "🧶", type: "emoji" },

                            max_lines: 1,

                            text: "còn cái nịt",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:canh_bao_co_hat",

                        source: "remote",

                        caption: {

                            background: { colors: ["#9C27B0", "#E91E63"] },

                            icon: { data: "🎤", type: "emoji" },

                            max_lines: 1,

                            text: "cảnh báo có hát",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:than_chua_ma_don",

                        source: "remote",

                        caption: {

                            background: { colors: ["#607D8B", "#37474F"] },

                            icon: { data: "😔", type: "emoji" },

                            max_lines: 1,

                            text: "Thân chưa mà dỡn",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ai_muon",

                        source: "remote",

                        caption: {

                            background: { colors: ["#E91E63", "#F44336"] },

                            icon: { data: "🤔", type: "emoji" },

                            max_lines: 1,

                            text: "Ai mượn?",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:hay_ra_de_qua_a",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFF59D", "#80DEEA"] },

                            icon: { data: "🥺", type: "emoji" },

                            max_lines: 1,

                            text: "Hay ra dẻ quá à!",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:giam_suc_manh_con_tuong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#4CAF50", "#00BCD4"] },

                            icon: { data: "🎮", type: "emoji" },

                            max_lines: 1,

                            text: "Giảm sức mạnh con tướng",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:mac_co_qua_hai_oi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFB74D", "#F8BBD0"] },

                            icon: { data: "😭", type: "emoji" },

                            max_lines: 1,

                            text: "Mắc cỡ quá hai ơi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:minh_la_lop",

                        source: "remote",

                        caption: {

                            background: { colors: ["#263238", "#455A64"] },

                            icon: { data: "🛞", type: "emoji" },

                            max_lines: 1,

                            text: "Mình là lốp",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:dep_trai_co_gi_sai",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF5722", "#FFC107"] },

                            icon: { data: "😎", type: "emoji" },

                            max_lines: 1,

                            text: "Đẹp trai có gì sai",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:mong_ton_hoa_sen",

                        source: "remote",

                        caption: {

                            background: { colors: ["#D8B4E2", "#F8BBD0"] },

                            icon: { data: "🪷", type: "emoji" },

                            max_lines: 1,

                            text: "Mong tôn hoa sen thấy cảnh này",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:dam_nhau_khong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#E53935", "#FF7043"] },

                            icon: { data: "🥊", type: "emoji" },

                            max_lines: 1,

                            text: "đấm nhau không",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:sieu_cap_ba_khi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#EC407A", "#F44336"] },

                            icon: { data: "🐉", type: "emoji" },

                            max_lines: 1,

                            text: "siêu cấp bá khí",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:du_an_ma",

                        source: "remote",

                        caption: {

                            background: { colors: ["#263238", "#455A64"] },

                            icon: { data: "👻", type: "emoji" },

                            max_lines: 1,

                            text: "dự án ma",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:doi_roi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF5F6D", "#FFC371"] },

                            icon: { data: "😤", type: "emoji" },

                            max_lines: 1,

                            text: "Dỗi rồi",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:dang_ban_tuong_tu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1A2980", "#26D0CE"] },

                            icon: { data: "💭", type: "emoji" },

                            max_lines: 1,

                            text: "Đang bận tương tư",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:mo_hon_nhung_tam_hien",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFB75E", "#ED8F03"] },

                            icon: { data: "🐤", type: "emoji" },

                            max_lines: 1,

                            text: "Mỏ hỗn nhưng tâm hiền",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:muon_duoc_om",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF9A9E", "#FECFEF"] },

                            icon: { data: "🫂", type: "emoji" },

                            max_lines: 1,

                            text: "Muốn được ôm",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                ]

            },

            {

                section: "🎨 Trend TikTok",

                items: [

                    {

                        overlay_id: "caption:hoi_chieu_troi_mua",

                        source: "remote",

                        caption: {

                            background: { colors: ["#546E7A", "#263238"] },

                            icon: { data: "🌧️", type: "emoji" },

                            max_lines: 1,

                            text: "Hồi chiều trời mưa...",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:con_vien_la_lan",

                        source: "remote",

                        caption: {

                            background: { colors: ["#12C2E9", "#F64F59"] },

                            icon: { data: "🍂", type: "emoji" },

                            max_lines: 1,

                            text: "côn viên lá làn",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:gian_dang_iu_hong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#3E2723", "#6D4C41", "#A1887F"] },

                            icon: { data: "🪳", type: "emoji" },

                            max_lines: 1,

                            text: "Gián đáng iu hong",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:nau_xoi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#7B1FA2", "#E91E63", "#FFB74D"] },

                            icon: { data: "🙀", type: "emoji" },

                            max_lines: 1,

                            text: "Nấu xói",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:co_tien_lam_phien_thien_ha",

                        source: "remote",

                        caption: {

                            background: { colors: ["#0F0C29", "#302B63", "#F7971E", "#FFD200"] },

                            icon: { data: "💰", type: "emoji" },

                            max_lines: 1,

                            text: "Có tiền làm phiền thiên hạ",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:nguoi_im_lang_gap_nguoi_hay_noi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#232526", "#414345", "#6C7A89", "#B0BEC5"] },

                            icon: { data: "🤐", type: "emoji" },

                            max_lines: 1,

                            text: "Người im lặng gặp người hay nói",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:roi_let_luon",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF9A9E", "#FECFEF", "#FBC2EB", "#A6C1EE"] },

                            icon: { data: "💅", type: "emoji" },

                            max_lines: 1,

                            text: "rồi lét luôn",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:roi_gay_luon",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF6EC7", "#7873F5", "#4ADEDE", "#FFE66D"] },

                            icon: { data: "🌈", type: "emoji" },

                            max_lines: 1,

                            text: "rồi gay luôn",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:tuyet_doi_khong_nghe",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF416C", "#FF4B2B"] },

                            icon: { data: "🙉", type: "emoji" },

                            max_lines: 1,

                            text: "Tuyệt đối không nghe",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cha_nay_tu_luyen_ghe",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFDEE9", "#B5FFFC", "#FAD0C4", "#FFD1FF"] },

                            icon: { data: "🪞", type: "emoji" },

                            max_lines: 1,

                            text: "Cha này tự luyến ghê",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:co_bien_co_bien",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF512F", "#F09819", "#FFD200"] },

                            icon: { data: "🚨", type: "emoji" },

                            max_lines: 1,

                            text: "Có biến có biến",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:hong_drama",

                        source: "remote",

                        caption: {

                            background: { colors: ["#8A2387", "#E94057", "#F27121"] },

                            icon: { data: "🍿", type: "emoji" },

                            max_lines: 1,

                            text: "Hóng drama",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cuoi_vcl_m_oi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F7971E", "#FFD200", "#FFEE58"] },

                            icon: { data: "😂", type: "emoji" },

                            max_lines: 1,

                            text: "Cười vcl m oi",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:vl_m_oi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1F1C2C", "#928DAB", "#C9D6FF"] },

                            icon: { data: "😳", type: "emoji" },

                            max_lines: 1,

                            text: "vl m ơi?",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:noi_het_bi_mat_thi_co_yeu_hong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#EE9CA7", "#FFDDE1", "#C6FFDD", "#FBD786"] },

                            icon: { data: "🤫", type: "emoji" },

                            max_lines: 1,

                            text: "Nói hết bị mật thì có yêu hong",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:flex_den_hoi_tho_cuoi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F7971E", "#FFD200"] },

                            icon: { data: "💎", type: "emoji" },

                            max_lines: 1,

                            text: "Flex đến hơi thở cuối",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:overthinking_vai_chuong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2C3E50", "#4CA1AF"] },

                            icon: { data: "🤯", type: "emoji" },

                            max_lines: 1,

                            text: "Overthinking vai chưởng",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:chan_bo_may_di",

                        source: "remote",

                        caption: {

                            background: { colors: ["#870000", "#190A05"] },

                            icon: { data: "🙄", type: "emoji" },

                            max_lines: 1,

                            text: "Chan bố mày đi",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:oach_xa_lach",

                        source: "remote",

                        caption: {

                            background: { colors: ["#11998E", "#38EF7D"] },

                            icon: { data: "🥬", type: "emoji" },

                            max_lines: 1,

                            text: "oách xà lách",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:lai_phai_lo",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FBD3E9", "#BB377D", "#6A0572"] },

                            icon: { data: "💔", type: "emoji" },

                            max_lines: 1,

                            text: "lại phải lọ",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ua_alo",

                        source: "remote",

                        caption: {

                            background: { colors: ["#8E2DE2", "#4A00E0"] },

                            icon: { data: "📞", type: "emoji" },

                            max_lines: 1,

                            text: "Ủa alo",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ke_chuyen_nghe_choi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#8A2387", "#E94057"] },

                            icon: { data: "🍿", type: "emoji" },

                            max_lines: 1,

                            text: "Kể chuyện nghe chơi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:hom_nay_toi_buon",

                        source: "remote",

                        caption: {

                            background: { colors: ["#141E30", "#243B55"] },

                            icon: { data: "🥀", type: "emoji" },

                            max_lines: 1,

                            text: "hôm nay tôi buồn",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:xinh_dep_tuyet_voi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FC5C7D", "#6A82FB"] },

                            icon: { data: "💅", type: "emoji" },

                            max_lines: 1,

                            text: "Xinh đẹp tuyệt vời",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:tram_cam_nhe",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1F1C2C", "#928DAB"] },

                            icon: { data: "🫠", type: "emoji" },

                            max_lines: 1,

                            text: "Trầm cảm nhẹ",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:chua_du_wow",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF5349", "#EB0C00"] },

                            icon: { data: "⭐", type: "emoji" },

                            max_lines: 1,

                            text: "Chưa đủ wow",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:boc_trung_sit_rit",

                        source: "remote",

                        caption: {

                            background: { colors: ["#9C27B0", "#7B1FA2"] },

                            icon: { data: "🎁", type: "emoji" },

                            max_lines: 1,

                            text: "Bóc trúng sít rịt",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:hen_lam_moi_xui_duoc_vay_a",

                        source: "remote",

                        caption: {

                            background: { colors: ["#00BCD4", "#0097A7"] },

                            icon: { data: "😅", type: "emoji" },

                            max_lines: 1,

                            text: "Hèn lắm mới xui được vậy á",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ra_duong_ne_moi_anh",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2196F3", "#1976D2"] },

                            icon: { data: "👤", type: "emoji" },

                            max_lines: 1,

                            text: "Ra đường nể mỗi anh",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cung_cung_di",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFC107", "#FFA000"] },

                            icon: { data: "🚀", type: "emoji" },

                            max_lines: 1,

                            text: "Cũng cứng đi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:tuyet_doi_dien_anh",

                        source: "remote",

                        caption: {

                            background: { colors: ["#455A64", "#263238"] },

                            icon: { data: "📷", type: "emoji" },

                            max_lines: 1,

                            text: "Tuyệt đối điện ảnh",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:du_ba_khi_chua",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF5722", "#E64A19"] },

                            icon: { data: "⚡", type: "emoji" },

                            max_lines: 1,

                            text: "Đủ bá khí chưa",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ua_alo",

                        source: "remote",

                        caption: {

                            background: { colors: ["#9C27B0", "#7B1FA2"] },

                            icon: { data: "❓", type: "emoji" },

                            max_lines: 1,

                            text: "Ủa alo?",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cai_gi_vay_troi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F44336", "#D32F2F"] },

                            icon: { data: "❗", type: "emoji" },

                            max_lines: 1,

                            text: "Cái gì vậy trời",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:nay_la_het_cuu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#607D8B", "#455A64"] },

                            icon: { data: "❌", type: "emoji" },

                            max_lines: 1,

                            text: "Này là hết cứu",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:qua_la_dien_anh",

                        source: "remote",

                        caption: {

                            background: { colors: ["#26A69A", "#00897B"] },

                            icon: { data: "📷", type: "emoji" },

                            max_lines: 1,

                            text: "Quá là điện ảnh",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Gen Z Life 🩻",

                items: [

                    {

                        overlay_id: "caption:hao_han",

                        source: "remote",

                        caption: {

                            background: { colors: ["#114357", "#F29492"] },

                            icon: { data: "🗡️", type: "emoji" },

                            max_lines: 1,

                            text: "Hảo hán",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:cam_lanh",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2193B0", "#6DD5ED"] },

                            icon: { data: "🤧", type: "emoji" },

                            max_lines: 1,

                            text: "Cảm lạnh",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:bat_luc",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2C3E50", "#3498DB"] },

                            icon: { data: "🏳️", type: "emoji" },

                            max_lines: 1,

                            text: "Bất lực",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:xin_lui_duoc_chua",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F6D365", "#FDA085"] },

                            icon: { data: "🥺", type: "emoji" },

                            max_lines: 1,

                            text: "Xin lũi được chưa",

                            text_color: "#000000",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:rot_nuoc_mat",

                        source: "remote",

                        caption: {

                            background: { colors: ["#1CB5E0", "#000046"] },

                            icon: { data: "😭", type: "emoji" },

                            max_lines: 1,

                            text: "Rớt nước mắt",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:guc_nga",

                        source: "remote",

                        caption: {

                            background: { colors: ["#3A1C71", "#D76D77"] },

                            icon: { data: "📉", type: "emoji" },

                            max_lines: 1,

                            text: "Gục ngã",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:tien_dinh",

                        source: "remote",

                        caption: {

                            background: { colors: ["#C33764", "#1D2671"] },

                            icon: { data: "🌪️", type: "emoji" },

                            max_lines: 1,

                            text: "Tiền đình",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:che_manh",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF4E50", "#F9D423"] },

                            icon: { data: "👎", type: "emoji" },

                            max_lines: 1,

                            text: "Chê mạnh",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:xinh_gai_an_phim_1",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F77062", "#FE5196"] },

                            icon: { data: "💅", type: "emoji" },

                            max_lines: 1,

                            text: "Xinh gái ấn phím 1",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:di_lam_vi_dam_me",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FDC830", "#F37335"] },

                            icon: { data: "🤡", type: "emoji" },

                            max_lines: 1,

                            text: "Đi làm vì đam mê",

                            text_color: "#FFFFFF",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Meme vui nhộn",

                items: [

                    {

                        overlay_id: "caption:cuoi_xiu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFEB3B", "#FF9800"] },

                            icon: { data: "😎", type: "emoji" },

                            max_lines: 1,

                            text: "Cười xỉu",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:toang_that_roi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F44336", "#B71C1C"] },

                            icon: { data: "🐉", type: "emoji" },

                            max_lines: 1,

                            text: "Toang thật rồi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:toi_roi_toi_roi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#673AB7", "#512DA8"] },

                            icon: { data: "❗", type: "emoji" },

                            max_lines: 1,

                            text: "Tới rồi tới rồi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:khong_the_tin_noi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#00BCD4", "#0097A7"] },

                            icon: { data: "❓", type: "emoji" },

                            max_lines: 1,

                            text: "Không thể tin nổi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Đời sống",

                items: [

                    {

                        overlay_id: "caption:ngay_moi_vui_ve",

                        source: "remote",

                        caption: {

                            background: { colors: ["#4CAF50", "#2E7D32"] },

                            icon: { data: "☀️", type: "emoji" },

                            max_lines: 1,

                            text: "Ngày mới vui vẻ",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ngu_ngon",

                        source: "remote",

                        caption: {

                            background: { colors: ["#3F51B5", "#1A237E"] },

                            icon: { data: "🌙", type: "emoji" },

                            max_lines: 1,

                            text: "Ngủ ngon",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:an_com_chua",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF9800", "#F57C00"] },

                            icon: { data: "🍽️", type: "emoji" },

                            max_lines: 1,

                            text: "Ăn cơm chưa?",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:di_choi_khong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#E91E63", "#C2185B"] },

                            icon: { data: "✈️", type: "emoji" },

                            max_lines: 1,

                            text: "Đi chơi không?",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Gen Z Slay",

                items: [

                    {

                        overlay_id: "caption:tinh_hoa_hoi_tu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFD700", "#FF8C00"] },

                            icon: { data: "✨", type: "emoji" },

                            max_lines: 1,

                            text: "Tinh hoa hội tụ",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:phu_tinh_khong_phu_ban",

                        source: "remote",

                        caption: {

                            background: { colors: ["#8E2DE2", "#4A00E0"] },

                            icon: { data: "🕶️", type: "emoji" },

                            max_lines: 1,

                            text: "Phụ tình không phụ bản",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ngoan_xinh_yeu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FFAFBD", "#FFC3A0"] },

                            icon: { data: "🌸", type: "emoji" },

                            max_lines: 1,

                            text: "Ngoan xinh yêu của ai?",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:nhin_la_biet_uy_tin",

                        source: "remote",

                        caption: {

                            background: { colors: ["#2980B9", "#2C3E50"] },

                            icon: { data: "👌", type: "emoji" },

                            max_lines: 1,

                            text: "Nhìn là biết uy tín",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Bất ổn & Khó đỡ",

                items: [

                    {

                        overlay_id: "caption:luon_vui_tuoi",

                        source: "remote",

                        caption: {

                            background: { colors: ["#00F2FE", "#4FACFE"] },

                            icon: { data: "🤡", type: "emoji" },

                            max_lines: 1,

                            text: "Luôn vui tươi",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:bat_on_that_su",

                        source: "remote",

                        caption: {

                            background: { colors: ["#636363", "#A2AB58"] },

                            icon: { data: "🫠", type: "emoji" },

                            max_lines: 1,

                            text: "Bất ổn thật sự",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:khong_cam_xuc",

                        source: "remote",

                        caption: {

                            background: { colors: ["#434343", "#000000"] },

                            icon: { data: "🗿", type: "emoji" },

                            max_lines: 1,

                            text: "Không cảm xúc",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:phu_huynh_dung_xem",

                        source: "remote",

                        caption: {

                            background: { colors: ["#FF0844", "#FFB199"] },

                            icon: { data: "🙈", type: "emoji" },

                            max_lines: 1,

                            text: "Phụ huynh đừng xem",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

            {

                section: "🎨 Check VAR & Hóng hớt",

                items: [

                    {

                        overlay_id: "caption:check_var",

                        source: "remote",

                        caption: {

                            background: { colors: ["#11998E", "#38EF7D"] },

                            icon: { data: "📺", type: "emoji" },

                            max_lines: 1,

                            text: "Check VAR liền",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:qua_nhieu_su_de_thuong",

                        source: "remote",

                        caption: {

                            background: { colors: ["#F38181", "#FCE38A"] },

                            icon: { data: "🎀", type: "emoji" },

                            max_lines: 1,

                            text: "Quá nhiều sự dễ thương",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:mac_bay_tinh_yeu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#EE9CA7", "#FFDDE1"] },

                            icon: { data: "💘", type: "emoji" },

                            max_lines: 1,

                            text: "Mắc bẫy tình yêu",

                            text_color: "#000000E6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:song_gio_phu_doi_trai",

                        source: "remote",

                        caption: {

                            background: { colors: ["#3A1C71", "#D76D77"] },

                            icon: { data: "🌪️", type: "emoji" },

                            max_lines: 1,

                            text: "Sóng gió phủ đời trai",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    }

                ]

            },

                        {
                section: "📍 Check-in Vị Trí VIP",
                items: [
                    {
                        overlay_id: "caption:location_paris",
                        source: "remote",
                        caption: {
                            background: { colors: ["#141E30", "#243B55"] },
                            icon: { data: "🗼", type: "emoji" },
                            max_lines: 1,
                            text: "Tháp Eiffel, Paris 🇫🇷",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:location_tokyo",
                        source: "remote",
                        caption: {
                            background: { colors: ["#ED213A", "#93291E"] },
                            icon: { data: "⛩️", type: "emoji" },
                            max_lines: 1,
                            text: "Shinjuku, Tokyo 🇯🇵",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:location_monaco",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#203A43", "#2C5364"] },
                            icon: { data: "🛥️", type: "emoji" },
                            max_lines: 1,
                            text: "Monaco Yacht Club ⚓",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:location_dalat",
                        source: "remote",
                        caption: {
                            background: { colors: ["#134E5E", "#71B280"] },
                            icon: { data: "🌲", type: "emoji" },
                            max_lines: 1,
                            text: "Đà Lạt Sương Mù ☕",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:location_manhattan",
                        source: "remote",
                        caption: {
                            background: { colors: ["#232526", "#414345"] },
                            icon: { data: "🗽", type: "emoji" },
                            max_lines: 1,
                            text: "Manhattan, New York 🇺🇸",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:location_gangnam",
                        source: "remote",
                        caption: {
                            background: { colors: ["#654ea3", "#eaafc8"] },
                            icon: { data: "✨", type: "emoji" },
                            max_lines: 1,
                            text: "Gangnam, Seoul 🇰🇷",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "⛅ Thời Tiết & Nhiệt Độ VIP",
                items: [
                    {
                        overlay_id: "caption:weather_snow",
                        source: "remote",
                        caption: {
                            background: { colors: ["#70e1f5", "#ffd194"] },
                            icon: { data: "❄️", type: "emoji" },
                            max_lines: 1,
                            text: "Tuyết rơi -2°C 🌨️",
                            text_color: "#000000E6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:weather_rain",
                        source: "remote",
                        caption: {
                            background: { colors: ["#3a7bd5", "#3a6073"] },
                            icon: { data: "🌧️", type: "emoji" },
                            max_lines: 1,
                            text: "Mưa rào lãng mạn 20°C ☔",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:weather_autumn",
                        source: "remote",
                        caption: {
                            background: { colors: ["#F3904F", "#3B4371"] },
                            icon: { data: "🍂", type: "emoji" },
                            max_lines: 1,
                            text: "Nắng nhẹ chiều thu 24°C 🌤️",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:weather_stars",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#2C5364"] },
                            icon: { data: "🌌", type: "emoji" },
                            max_lines: 1,
                            text: "Trời đầy sao 18°C ✨",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    },
                    {
                        overlay_id: "caption:weather_mist",
                        source: "remote",
                        caption: {
                            background: { colors: ["#606c88", "#3f4c6b"] },
                            icon: { data: "🌫️", type: "emoji" },
                            max_lines: 1,
                            text: "Sương mù giăng lối 15°C 💨",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
{

                section: "🎨 Góc Deadline & Đi Làm",

                items: [

                    {

                        overlay_id: "caption:deadline_ruot",

                        source: "remote",

                        caption: {

                            background: { colors: ["#ED213A", "#93291E"] },

                            icon: { data: "🔥", type: "emoji" },

                            max_lines: 1,

                            text: "Deadline dí tụt quần",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:ca_o_ran_doc",

                        source: "remote",

                        caption: {

                            background: { colors: ["#0F2027", "#1B5E20", "#66BB6A"] },

                            icon: { data: "🐍", type: "emoji" },

                            max_lines: 1,

                            text: "Cả ổ rắn độc",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {

                        overlay_id: "caption:tien_dau_ma_tieu",

                        source: "remote",

                        caption: {

                            background: { colors: ["#11998E", "#38EF7D"] },

                            icon: { data: "💸", type: "emoji" },

                            max_lines: 1,

                            text: "Tiền đâu mà tiêu",

                            text_color: "#FFFFFFE6",

                            type: "static_content"

                        }

                    },

                    {
                        overlay_id: "caption:nghien_cuu_khoa_hoc",
                        source: "remote",
                        caption: {
                            background: { colors: ["#0F2027", "#2C5364"] },
                            icon: { data: "☕", type: "emoji" },
                            max_lines: 1,
                            text: "Cần nạp cafein gấp",
                            text_color: "#FFFFFFE6",
                            type: "static_content"
                        }
                    }
                ]
            },
            {
                section: "🎨 Chứng Nhận Locket VIP",
                items: [
                    { overlay_id: "caption:locket_cuti", source: "remote", caption: { background: { colors: ["#FF9A9E", "#FECFEF"] }, icon: { data: "🌸", type: "emoji" }, max_lines: 1, text: "Locket xác nhận bạn cutii", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:locket_xinh", source: "remote", caption: { background: { colors: ["#FA709A", "#FEE140"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Locket xác nhận bạn xinh gái", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:locket_dep", source: "remote", caption: { background: { colors: ["#4FACFE", "#00F2FE"] }, icon: { data: "👑", type: "emoji" }, max_lines: 1, text: "Locket xác nhận bạn đẹp trai", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:locket_dangiu", source: "remote", caption: { background: { colors: ["#F093FB", "#F5576C"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "Locket xác nhận bạn đáng yêu", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:gai_dep", source: "remote", caption: { background: { colors: ["#FF758C", "#FF7EB3"] }, icon: { data: "💋", type: "emoji" }, max_lines: 1, text: "Đã xác minh: Gái đẹp 100%", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:trai_dep", source: "remote", caption: { background: { colors: ["#13547A", "#80D0C7"] }, icon: { data: "🕶️", type: "emoji" }, max_lines: 1, text: "Đã xác minh: Trai đẹp 100%", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:be_ngoan", source: "remote", caption: { background: { colors: ["#FFE000", "#799F0C"] }, icon: { data: "🧸", type: "emoji" }, max_lines: 1, text: "Đã xác nhận: Bé ngoan xuất sắc", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:tuyen_duong", source: "remote", caption: { background: { colors: ["#F857A6", "#FF5858"] }, icon: { data: "🌟", type: "emoji" }, max_lines: 1, text: "Locket tuyên dương bạn cute", text_color: "#FFFFFFE6", type: "static_content" } }
                ]
            },
            {
                section: "☕ Daily Vibe & Chữa Lành",
                items: [
                    { overlay_id: "caption:matcha_latte", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "🍵", type: "emoji" }, max_lines: 1, text: "Matcha Latte 🍵", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:rainy_day", source: "remote", caption: { background: { colors: ["#3A6073", "#3A7BD5"] }, icon: { data: "🌧️", type: "emoji" }, max_lines: 1, text: "Rainy Day ☕🌧️", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:night_vibes", source: "remote", caption: { background: { colors: ["#0F2027", "#2C5364"] }, icon: { data: "🌌", type: "emoji" }, max_lines: 1, text: "Night Vibes 🌌", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:2am_thoughts", source: "remote", caption: { background: { colors: ["#141E30", "#243B55"] }, icon: { data: "🌙", type: "emoji" }, max_lines: 1, text: "2:00 AM Thoughts 🌙", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:pin_1", source: "remote", caption: { background: { colors: ["#ED213A", "#93291E"] }, icon: { data: "🪫", type: "emoji" }, max_lines: 1, text: "Cảnh báo: Pin còn 1% 🪫", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:offline_heal", source: "remote", caption: { background: { colors: ["#0052D4", "#4364F7"] }, icon: { data: "🔋", type: "emoji" }, max_lines: 1, text: "Offline để hồi sinh 🔋", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:nam_im", source: "remote", caption: { background: { colors: ["#434343", "#000000"] }, icon: { data: "🛌", type: "emoji" }, max_lines: 1, text: "Nhiệm vụ hôm nay: Nằm im 🛌", text_color: "#FFFFFFE6", type: "static_content" } }
                ]
            },
            {
                section: "💕 Tình Bạn & Tình Yêu Son Sắt",
                items: [
                    { overlay_id: "caption:bet_phen", source: "remote", caption: { background: { colors: ["#F12711", "#F5AF19"] }, icon: { data: "👯‍♀️", type: "emoji" }, max_lines: 1, text: "Bét Phen Pho Ri Vờ 👯‍♀️", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:cuc_vang", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200"] }, icon: { data: "💛", type: "emoji" }, max_lines: 1, text: "Bạn là cục vàng cụa tui ✨", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:tren_tinh_ban", source: "remote", caption: { background: { colors: ["#E55D87", "#5FC3E4"] }, icon: { data: "💖", type: "emoji" }, max_lines: 1, text: "Trên tình bạn dưới tình yêu 💖", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:len_do", source: "remote", caption: { background: { colors: ["#FC466B", "#3F5EFB"] }, icon: { data: "🛵", type: "emoji" }, max_lines: 1, text: "Lên đồ đi chơi thôiiiii 🛵", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:tang_hoa", source: "remote", caption: { background: { colors: ["#EE9CA7", "#FFDDE1"] }, icon: { data: "💐", type: "emoji" }, max_lines: 1, text: "POV: Bạn được tặng hoa 💐", text_color: "#FFFFFFE6", type: "static_content" } }
                ]
            },
            {
                section: "🏝️ Check-in Du Lịch Việt Nam",
                items: [
                    { overlay_id: "caption:checkin_phuquy", source: "remote", caption: { background: { colors: ["#2193B0", "#6DD5ED"] }, icon: { data: "🌊", type: "emoji" }, max_lines: 1, text: "Đảo Phú Quý 🏝️", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:checkin_dalat", source: "remote", caption: { background: { colors: ["#134E5E", "#71B280"] }, icon: { data: "🌲", type: "emoji" }, max_lines: 1, text: "Đà Lạt Mộng Mơ 🌲", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:checkin_sapa", source: "remote", caption: { background: { colors: ["#556270", "#4ECDC4"] }, icon: { data: "🏔️", type: "emoji" }, max_lines: 1, text: "Sa Pa Trong Sương 🏔️", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:checkin_hanoi", source: "remote", caption: { background: { colors: ["#C33764", "#1D2671"] }, icon: { data: "🏮", type: "emoji" }, max_lines: 1, text: "Hà Nội 36 Phố Phường 🏮", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:checkin_saigon", source: "remote", caption: { background: { colors: ["#FF416C", "#FF4B2B"] }, icon: { data: "🏙️", type: "emoji" }, max_lines: 1, text: "Sài Gòn Hoa Lệ 🏙️", text_color: "#FFFFFFE6", type: "static_content" } },
                    { overlay_id: "caption:checkin_hoian", source: "remote", caption: { background: { colors: ["#FFB75E", "#ED8F03"] }, icon: { data: "✨", type: "emoji" }, max_lines: 1, text: "Phố Cổ Hội An 🏮", text_color: "#FFFFFFE6", type: "static_content" } }
                ]
            }
        ])

    });

        var out = { body: JSON.stringify(obj), status: 200 };
    try {
      var res = (typeof $response !== "undefined" && $response) ? $response : null;
      var h = (res && res.headers) ? Object.assign({}, res.headers) : {};
      h["Cache-Control"] = "no-store, no-cache, must-revalidate";
      h["Pragma"] = "no-cache";
      delete h["ETag"];
      delete h["etag"];
      delete h["If-None-Match"];
      delete h["if-none-match"];
      delete h["Last-Modified"];
      delete h["last-modified"];
      // Bắt buộc trả về ETag mới để RCNConfigSettings.m cập nhật lastETagUpdateTime -> FIRRemoteConfig.m kích hoạt (activate) ngay lập tức!
      h["etag"] = '"anhtu-v315-' + out.body.length.toString(16) + '"';
      out.headers = h;
    } catch (e) {}
    $done(out);
}
})();
