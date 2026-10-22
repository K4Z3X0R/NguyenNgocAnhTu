// ============================================================
// Locket Remote Config Rewrite
// Dùng cho: Loon / Quantumult X / Surge / Shadowrocket
// cre: DINH DUY VINH 09 (Enhanced by z3rokaze)
// ============================================================

var reqHeaders = (typeof $request !== "undefined" && $request && $request.headers) || {};
var ua = reqHeaders["User-Agent"] || reqHeaders["user-agent"] || "";
var rawBody = (typeof $response !== "undefined" && $response && $response.body) || "";
var obj = null;

try {
    obj = JSON.parse(rawBody);
} catch (e) {
    obj = null;
}

if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    $done({});
} else {
    if (!ua || ua.includes("Locket") || ua.includes("locket")) {
        obj.state = "UPDATE";
        obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";
        obj.entries = obj.entries || {};

    // ============================================================
    // 1. CẤU HÌNH GOLD, FEATURE GATES & PAYWALL
    // ============================================================
    Object.assign(obj.entries, {
        feature_gates: JSON.stringify({
            app_icon_picker: "enabled",
            camera_roll: "enabled",
            camera_theme: "enabled",
            locket_views: "enabled",
            long_captions: "enabled",
            longer_video: "enabled",
            unlimited_friends: "enabled",
            priority_support: "enabled",
            profile_badge: "enabled",
            remove_ads: "enabled",
            video: "enabled",
            custom_widget_frames: "enabled",
            streak_recovery: "enabled"
        }),
        upsell_features: JSON.stringify({
            app_icon_picker: true,
            camera_roll: true,
            camera_theme: true,
            locket_views: true,
            remove_ads: true,
            custom_widget_frames: true
        }),
        paywall_presentation_config: JSON.stringify({
            uid: "paywall_testflight",
            onboarding: false,
            after_sent_moment: false,
            on_foreground: false,
            interval: 2592000,
            profile_banner: true
        }),
        feature_discovery_popup_config: JSON.stringify({
            tag: "LOCKET GOLD",
            tag_gradient: true,
            tag_style: "gold_gradient",
            title: "KHUNG MẶC ĐỊNH,CF 45S",
            feature_set: [
                {
                    title: "🤍🤍🤍🤍🤍🤍🤍🤍🤍🤍",
                    body: "💛💛💛💛💛💛💛💛💛💛",
                    imageURL: "https://i.ibb.co/xkJMqKn/photo-2026-10-16-15-31-19.png"
                
                }
            ],
            primary_button_title: "done",
            campaign: "locket_gold_welcome_v3",
            start_at: "2020-01-01T00:00:00",
            end_at: "2099-12-31T23:59:59",
            use_local_time_zone: true
        }),
        android_subscribe_gold_button_enabled: "false",
        profile_badge_visible: "true",
        lunar_new_year_app_icon_enabled: "true",
        settings_instagram_url: "he he",
        settings_tiktok_url: "hi hi"
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
        history_ads_debug_menu: "false",
        sentry_sample_rate: "0",
        sentry_network_tracing: "false",
        sentry_performance_tracking: "false",
        sentry_trace_sample_rate: "0",
        sentry_profiles_sample_rate: "0"
    });

    // ============================================================
    // 3. CAMERA, VIDEO, FILTERS & UPLOAD QUALITY
    // ============================================================
    var MY_VIDEO_DURATION = 45.0;
    
    var cameraConfig = {
        gold_max_duration: MY_VIDEO_DURATION,
        goldMaxDuration: MY_VIDEO_DURATION,
        max_duration: MY_VIDEO_DURATION,
        maxDuration: MY_VIDEO_DURATION,
        ultra_wide: true,
        ultraWide: true,
        volume_button: true,
        volumeButton: true,
        flash_button: true,
        telephoto: true,
        srgb: true,
        lanczos: true,
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
        max_file_size: 104857600,       // Cho phép file tối đa 100MB từ thư viện
        max_upload_bytes: 104857600,   // Nới lỏng giới hạn dung lượng tải lên
        max_size_bytes: 104857600,
        quality_mbps: 0.6,
        qualityMbps: 0.6,
        flash_button: true
    };

    obj.entries.camera = JSON.stringify(cameraConfig);
    obj.entries.camera_roll = JSON.stringify(cameraRollConfig);

    var durationStr = MY_VIDEO_DURATION.toString();
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
        video_duration: durationStr,
        camera_roll_max_duration: durationStr,
        camera_roll_duration: durationStr,
        max_video_duration: durationStr,
        video_max_duration: durationStr,
        video_trim_max_duration: durationStr,
        trim_max_duration: durationStr,
        gold_max_duration: durationStr,
        goldMaxDuration: durationStr,
        max_file_size: "104857600",
        max_upload_bytes: "104857600",
        video_quality_mbps: "0.",
        video_sound_enabled: "true",
        microphone_enabled: "true",
        camera_microphone_enabled: "true",
        audio_session_deactivation_enabled: "true",
        zoom_enabled: "true",
        upload_main: "false",
        upload_main_image_quality: "0.6",
        upload_main_image_size: "1440",
        upload_thumbnail_image_quality: "0.6",
        upload_thumbnail_image_size: "1020"
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
        signup_allow_skip_add_friends: "true"
    });

    // ============================================================
    // 5. MOMENTS, STREAK, CHAT & TƯƠNG TÁC
    // ============================================================
    try {
        var streak = JSON.parse(obj.entries.streak_config || "{}");
        streak.minimum_recovery_count = 0;
        streak.minimum_display_count = 0;
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
        calendar_rewind_enabled: "false",
        locket_yearbook_story_sharing_encouraged: "true",
        rollcall_enabled: "true",
        rollcall_comment_actions: "true",
        rollcall_profile_button: "true",
        rollcall_prompt_export_after_share: "true",
        rollcall_confirm_skip_tagging: "false",
        rollcall_tap_to_tag_enabled: "false"
    });

    // ============================================================
    // 6. WIDGET, THÔNG BÁO & GIAO DIỆN (JOURNAL / PROFILE)
    // ============================================================
        Object.assign(obj.entries, {
        widget_frame_event_max_images: "5",
        android_widget_frame_event_enabled: "true",
        widget_badge_enabled: "true",
        widget_badge_v2: "true",
        widget_stale_state_enabled: "false",
        widget_last_sent_indicator: "false",
        widget_sync_token_reload_mode: "clearTokenNever",
        widget_frame_event: JSON.stringify({
            uid: "midautumn_2026",
            url: "https://hosting.photobucket.com/884f09fa-d52e-40c7-b848-0dc5b19d4288/0cb2a814-22fe-4037-9a0a-25c0fe2476f5.png",
            use_local_time_zone: true,
            placement: "below",
            start_at: "2020-01-01T00:00:00",
            end_at: "2099-12-31T23:59:59"
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
            debug_menu_enabled: false,
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
    // 7. HỆ THỐNG, CACHE & STORAGE CDN
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
        
        // Cấu hình kho khung tĩnh VIP Gold tùy chỉnh
        widget_frames_config: JSON.stringify({
            enabled: true,
            allow_custom_frames: true,
            unlock_all_styles: true,
            default_style: "royal_gold_vip",
            styles: [
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
                }
            ]
        }),

        // Danh sách ID khung đè vào menu chọn widget
        widget_frame_styles: JSON.stringify([
            "royal_gold_vip",
            "gold_luxury",
            "classic"
        ]),

        // Cấu hình sự kiện / Seasonal Frames đè
        seasonal_frames_config: JSON.stringify({
            enabled: true,
            auto_rotate: false,
            override_default: true,
            current_season_theme: "royal_gold_vip"
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
            debug_menu_enabled: false,
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
                section: "🎨🎨🎨🎨🎨🎨",
                items: [
                    {
                        overlay_id: "caption:nca",
                        source: "remote",
                        caption: {
                            background: { colors: ["#B8E7FF", "#A8F5D0", "#DCCBFF"] },
                            max_lines: 1,
                            text: "nguyencongan",
                            text_color: "#183153",
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
                section: "👑 Tác giả & Độc quyền",
                items: [
                    {
                        overlay_id: "caption:z3rokaze",
                        source: "remote",
                        caption: {
                            background: { colors: ["#FFD700", "#FFA500"] },
                            icon: { data: "👑", type: "emoji" },
                            max_lines: 1,
                            text: "Nguyễn Ngọc Anh Tú VIP",
                            text_color: "#000000E6",
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
            }
        ])
    });
    }
    $done({ body: JSON.stringify(obj) });
}
