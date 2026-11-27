/***********************************************
> RevenueCat Multi-App Premium Unlocker
> Locket Gold + Generic RC Apps
> Original: z3rokaze (revenuecat_multi.js)
> Updated: Nguyễn Ngọc Anh Tú (z3rokaze)
> Date: 2026-10-30 (v3.2.3 - 130+ Apps RevenueCat VIP Lifetime 2099)
>
> CHANGELOG v2.6.0:
> - FIX: Locket Gold not activating — added first_seen, request_date
> - FIX: Added store_transaction_id to entitlement template (required by Locket)
> - FIX: original_app_user_id preservation (SDK v5+ validation)
> - FIX: Improved Locket detection (case-insensitive + bundle ID)
> - FIX: Remove expired/conflicting entitlements before injecting
> - FIX: Added original_purchase_date to entitlement (RC SDK v5.2+)
> - FIX: Ensure subscriber.first_seen is always set
> - ADD: Locket Widget companion app support
***********************************************/

(function () {
// ========= App ID Mapping ========= //
// [entitlement, productIdentifier]. Khóa để dạng UTF-8 thường (KHÔNG percent-encode)
// vì User-Agent chứa chuỗi thật. App có trong mapping -> cấp ĐÚNG entitlement key riêng.
// App RC khác (đa số app hot quốc tế) -> rơi vào fallback đa-entitlement bên dưới.
const mapping = {
  'CapCut': ['pro', 'com.lemon.lvoverseas.vip.yearly'],
  'capcut': ['pro', 'com.lemon.lvoverseas.vip.yearly'],
  'PicsArt': ['gold', 'picsart_gold_yearly'],
  'picsart': ['gold', 'picsart_gold_yearly'],
  'Picsart': ['gold', 'picsart_gold_yearly'],
  'Lightroom': ['premium', 'lightroom_premium_yearly'],
  'lightroom': ['premium', 'lightroom_premium_yearly'],
  'ChatOn': ['pro', 'chaton_pro_yearly'],
  'chaton': ['pro', 'chaton_pro_yearly'],
  'ChatAI': ['premium', 'chatai_premium_yearly'],
  'chatai': ['premium', 'chatai_premium_yearly'],
  'AskAI': ['premium', 'askai_premium_yearly'],
  'askai': ['premium', 'askai_premium_yearly'],
  'Flo': ['premium', 'flo_premium_yearly'],
  'flo': ['premium', 'flo_premium_yearly'],
  'SleepCycle': ['premium', 'sleepcycle_premium_yearly'],
  'sleepcycle': ['premium', 'sleepcycle_premium_yearly'],
  'Strava': ['summit', 'strava_summit_yearly'],
  'strava': ['summit', 'strava_summit_yearly'],
  'Lifesum': ['premium', 'lifesum_premium_yearly'],
  'lifesum': ['premium', 'lifesum_premium_yearly'],
  'Forest': ['pro', 'forest_pro_lifetime'],
  'forest': ['pro', 'forest_pro_lifetime'],
  'Reface': ['pro', 'reface_pro_yearly'],
  'reface': ['pro', 'reface_pro_yearly'],
  'FaceApp': ['pro', 'faceapp_pro_yearly'],
  'faceapp': ['pro', 'faceapp_pro_yearly'],
  'AirBrush': ['black', 'airbrush_black_yearly'],
  'airbrush': ['black', 'airbrush_black_yearly'],
  'Fotor': ['pro', 'fotor_pro_yearly'],
  'fotor': ['pro', 'fotor_pro_yearly'],
  'DawnAI': ['pro', 'dawnai_pro_yearly'],
  'dawnai': ['pro', 'dawnai_pro_yearly'],
  'Wonder': ['pro', 'wonder_pro_yearly'],
  'wonder': ['pro', 'wonder_pro_yearly'],
  'InShot': ['pro', 'inshot_pro_yearly'],
  'inshot': ['pro', 'inshot_pro_yearly'],
  'Filmora': ['pro', 'filmora_pro_yearly'],
  'filmora': ['pro', 'filmora_pro_yearly'],
  'VITA': ['vip', 'vita_vip_yearly'],
  'vita': ['vip', 'vita_vip_yearly'],
  'B612': ['vip', 'b612_vip_yearly'],
  'b612': ['vip', 'b612_vip_yearly'],
  'SODA': ['vip', 'soda_vip_yearly'],
  'soda': ['vip', 'soda_vip_yearly'],
  'Foodie': ['vip', 'foodie_vip_yearly'],
  'foodie': ['vip', 'foodie_vip_yearly'],
  'VN': ['pro', 'vn_pro_yearly'],
  'vn': ['pro', 'vn_pro_yearly'],
  'AlightMotion': ['pro', 'alightmotion_pro_yearly'],
  'alightmotion': ['pro', 'alightmotion_pro_yearly'],
  'Kinemaster': ['premium', 'kinemaster_premium_yearly'],
  'kinemaster': ['premium', 'kinemaster_premium_yearly'],
  'BeautyPlus': ['premium', 'beautyplus_premium_yearly'],
  'beautyplus': ['premium', 'beautyplus_premium_yearly'],
  'Meitu': ['vip', 'meitu_vip_yearly'],
  'meitu': ['vip', 'meitu_vip_yearly'],
  'Wink': ['vip', 'wink_vip_yearly'],
  'wink': ['vip', 'wink_vip_yearly'],
  'VSCO': ['pro', 'vsco_membership_yearly'],
  'vsco': ['pro', 'vsco_membership_yearly'],
  'Locket': ['Gold', 'locket_1600_1y'],
  'locket': ['Gold', 'locket_1600_1y'],
  'Locket Widget': ['Gold', 'locket_1600_1y'],
  'co.locket.Locket': ['Gold', 'locket_1600_1y'],
  'Remini': ['premium', 'com.bigwinepot.nwdn.revive.sub.yearly'],
  'PhotoRoom': ['pro', 'photoroom_pro_yearly'],
  'ELSA': ['premium', 'elsa_premium_1y'],
  'Bazaart': ['pro', 'bazaart_pro_yearly'],
  'Splice': ['pro', 'splice_pro_yearly'],
  'Facetune': ['VIP', 'facetune_vip_yearly'],
  'Mojo': ['pro', 'mojo_pro_yearly'],
  'Prequel': ['premium', 'prequel_premium_yearly'],
  '24FPS': ['pro', 'twentyfourfps_pro_yearly'],
  'Unfold': ['plus', 'unfold_plus_yearly'],
  'Videoleap': ['pro', 'videoleap_pro_yearly'],
  'Captions': ['pro', 'captions_pro_yearly'],
  'iScreen': ['VIP', 'iscreen_vip_yearly'],
  'MDVinyl': ['pro', 'mdvinyl_pro_yearly'],
  'MD Vinyl': ['pro', 'mdvinyl_pro_yearly'],
  'Structured': ['pro', 'structured_pro_lifetime'],
  'Moises': ['premium', 'moises_premium_yearly'],
  'Lensa': ['pro', 'lensa_pro_yearly'],
  'AIMirror': ['premium', 'aimirror_premium_yearly'],
  'AI Mirror': ['premium', 'aimirror_premium_yearly'],
  'Widgetsmith': ['Premium', 'widgetsmith_premium_yearly'],
  'Pixelup': ['pro', 'pixelup_pro_yearly'],
  'ScannerPro': ['pro', 'com.readdle.ScannerPro.SubscriptionYearly'],
  'Scanner Pro': ['pro', 'com.readdle.ScannerPro.SubscriptionYearly'],
  'iScanner': ['pro', 'iscanner_pro_yearly'],
  'QuickScan': ['pro', 'quickscan_pro_yearly'],
  'DocScanner': ['pro', 'docscanner_pro_yearly'],
  'Photoroom': ['pro', 'photoroom_pro_yearly'],
  'Epik': ['pro', 'com.snowcorp.epik.subscribe.yearly'],
  'EPIK': ['pro', 'com.snowcorp.epik.subscribe.yearly'],
  'Hypic': ['pro', 'hypic_pro_yearly'],
  'Speak': ['premium', 'speak_premium_yearly'],
  'Praktika': ['premium', 'praktika_premium_yearly'],
  'Craft': ['pro', 'com.lukilabs.lukiapp.pro_yearly'],
  'DayOne': ['premium', 'com.bloombuilt.dayone-ios.premium_yearly'],
  'Day One': ['premium', 'com.bloombuilt.dayone-ios.premium_yearly'],
  'DeepL': ['pro', 'deepl_pro_yearly'],
  'Notability': ['premium', 'com.gingerlabs.Notability.premium_subscription'],
  'ProCCD': ['pro', 'com.yengshine.proccd.yearly'],
  'proccd': ['pro', 'com.yengshine.proccd.yearly'],
  'com.yengshine.proccd': ['pro', 'com.yengshine.proccd.yearly'],
  'Dazz': ['pro', 'com.haocai.dazzcam.pro'],
  'DazzCam': ['pro', 'com.haocai.dazzcam.pro'],
  'dazz': ['pro', 'com.haocai.dazzcam.pro'],
  'EE35': ['pro', 'com.eightivedesign.ee35.pro'],
  'ee35': ['pro', 'com.eightivedesign.ee35.pro'],
  'NOMO': ['pro', 'com.farlens.nomo.pro'],
  'nomo': ['pro', 'com.farlens.nomo.pro'],
  'NOMO Point': ['pro', 'com.farlens.point.pro'],
  'nomo point': ['pro', 'com.farlens.point.pro'],
  'KUNI': ['pro', 'com.ginnypix.kunicam.forever'],
  'kuni': ['pro', 'com.ginnypix.kunicam.forever'],
  '1998 Cam': ['pro', 'com.canhtran.1998cam.yearly'],
  '1998cam': ['pro', 'com.canhtran.1998cam.yearly'],
  'LoFi Cam': ['pro', 'com.loficam.pro'],
  'loficam': ['pro', 'com.loficam.pro'],
  'CalculatorJ': ['pro', 'com.calculatorx.lifetime'],
  'CalculatorX': ['pro', 'com.calculatorx.lifetime'],
  'com.calculatorx': ['pro', 'com.calculatorx.lifetime'],
  'Linger': ['Pro access', 'linger_lifetime_standard'],
  'linger': ['Pro access', 'linger_lifetime_standard'],
  'SaveLoop': ['Sloop Pro', 'com.sloopbrowser.www.plus.Lifetime'],
  'sloop': ['Sloop Pro', 'com.sloopbrowser.www.plus.Lifetime'],
  'FitCurve': ['pro', 'com.fitcurve.pro.lifetime'],
  'fitcurve': ['pro', 'com.fitcurve.pro.lifetime'],
  'StartSleep': ['vip', 'kaishui_vip_lifetime'],
  'com.suxuanlv.startsleepapp': ['vip', 'kaishui_vip_lifetime'],
  'me.xgmm.meallog': ['pro', '202602071529'],
  'me.xgmm.note': ['one month', '20250203'],

  // === 350+ Community App VIP Additions (November 2026 Sync) ===
  'com.ukgroup.translator': ['Pro', 'lifetime_translator'],
  'co.visualsupply.cam': ['pro', 'vscopro_global_5999_annual_7D_free'],
  'me.capilabs.sleep': ['Capi - Sleep Factors Analysis Unlimited Access', 'me.capilabs.sleep.premium.lifetime'],
  'com.qiqi1996.think-action': ['vip', 'think_action.yearly'],
  'com.abighead.Widgets': ['HiWidget.Pro', 'com.abighead.Widgets.LifetimePro'],
  'com.qiqi1996.qi-watermark': ['vip', 'com.qiqi1996.qi_watermark.yearly'],
  'com.qiqi1996.pause-life': ['vip', 'pause_life_lifetime'],
  'com.qiqi1996.app-poster': ['vip', 'app_poster_lifetime'],
  'com.minardwu.cocam': ['com.minardwu.cocam_lifetime', 'com.minardwu.cocam_lifetime'],
  'com.qiqi1996.card-note': ['vip', 'qi_card_note_lifetime'],
  'com.zhang333.dd': ['premium', 'com.zhang3.plus'],
  'io.fadel.TeleprompterX': ['io.fadel.teleprompterx.pro', 'io.fadel.TeleprompterX.pro.lifetime'],
  'com.flexicalc.app': ['pro', 'pro_product'],
  'com.trainfitness.Train': ['Pro', 'TrainAnnualSubscription'],
  'com.OfflineMusic.www': ['premium', 'com.OfflineMusic.www.lifetime298'],
  'com.ausoco.umai': ['umai_pro', 'umai_pro_yearly'],
  'camp.user.penbook': ['pro', 'penbook.lifetime01'],
  'design.yugen.Flow': ['pro', 'design.yugen.Flow.Lifetime'],
  'com.runbuddy.prod': ['premium', 'rb_9999_1y_1y7999'],
  'TeleprompterX': ['Pro Upgrade', 'TPXOTP'],
  'com.exoplanet.chatme': ['premium', 'chatme_premium_year_trial'],
  'com.reku.Counter': ['plus', 'com.reku.counter.plus.lifetime'],
  'moonbox.co.il.grow': ['pro', 'moonbox.co.il.grow.lifetime.offer'],
  'tech.miidii.MDClock': ['Entitlement.Pro', 'tech.miidii.MDClock.pro'],
  'com.voicedream.Voic': ['standard', 'vd_annual_79_3daytrial'],
  'com.laser-focused.focus-ios': ['subscribed', 'iap.io.masterbuilders.focus.pro_one_year'],
  'com.roehl': ['Pro', 'habitkit_3499_lt'],
  'net.tengl.powertimer': ['plus', 'powertimer.plus'],
  'com.reader.book': ['pro', 'reader.lifetimeFamily.pro'],
  'app.imone.OneWidget': ['pro', 'app.imone.OneWidget.Lifetime'],
  'io.innerpeace.yiye': ['Premium', 'io.innerpeace.yiye.lifetime.forYearly'],
  'com.valo.reader': ['com.valo.reader.vip1.forever', 'com.valo.reader.vip1.forever'],
  'com.skysoft.removalfree': ['Pro', 'com.skysoft.removalfree.subscription.newyearly'],
  'TouchRetouchBasic': ['premium', 'tr5_yearlysubsc_15dlrs_2'],
  'billmate': ['Bill Mate Pro', 'com.billmate.plus.yearly'],
  'col.or': ['Color Plus', 'com.color.plus'],
  'knowme-storage': ['pro', 'pro'],
  'Readora': ['com.chengnayu.readora', 'com.chengnayu.readora.permanent'],
  'PixelSensePocket': ['pro', 'pixelsense_pocket_unlock_forever'],
  'ByePhotos': ['ByePhotos access', 'com.panicbyte.byephotos.lifetime'],
  'LaunchX': ['Pro', 'com.launcherx.Lifetime'],
  'varacare': ['varacare_pro', 'com.beliveapptech.varacare.lifetime'],
  'Fine': ['Fine Pro', 'fine_subscription_yearly'],
  'nebuwall': ['wallpaper_pass', 'wallpaper_pass_lifetime'],
  'DailyIdiomApp': ['calendar', 'com.fiachra.DailyIdiomApp.yearly'],
  'SLPDFMaker': ['pro', 'com.pdfstudio.lifetime.pro'],
  'ScreenMaker': ['pro', 'snapApp_pro_lifetime'],
  'ReadCopilot': ['premium', 'read_copilot_premium_yearly'],
  'volix': ['Device Kit Pro', 'com.volix.pro'],
  'RoundedCorner': ['pro', 'com.smallCorner.lifetime'],
  'CircleTime': ['Premium', '000'],
  'jinduoduo_calculator': ['yuhuzi001', 'lifetime_vip'],
  'Erasee': ['pro', 'erasee.pro.lifetime'],
  'YiKe': ['YiKe - Light Journaling Pro', 'yike_pro'],
  'MusicPlayer': ['com.zhuangmengting.player', 'com.zhuangmengting.player.permanen'],
  'VideoBlur': ['com.zhuangmengting.blur', 'com.zhuangmengting.blur.pro.permanent'],
  'PicPure': ['PicPure Pro', 'LifetimeAccess2'],
  'VHSCamera': ['pro', 'vhscam_pro_lifetime'],
  'Image2PDF': ['Convertly Pro', 'life_time_id'],
  'OpsCat': ['OpsCat - Server Monitor & SSH Pro', 'LifetimeAccessOps'],
  'OneTT': ['CloneCam Pro', 'clonecam.lifetime'],
  'ShowcasePro': ['ShowcasePro.Ultra', 'DesignTech.SIA.ShowcasePro.Ultra.Lifetime'],
  'Speedometer': ['SpeedometerLite Pro', 'speedometerlite_lifetime'],
  'demo_FingerChooser': ['pro', 'chooser.pro.lifetime'],
  'scanbatch': ['Pro', 'scanbatch.lifetime'],
  'Charge': ['premium', 'charge.iap.special'],
  'DualLensPro': ['premium', 'com.dualcapture.lifetime'],
  'Swish': ['Swish Pro', 'swish_pro_lifetime'],
  'PinDou': ['PinDou Pro', 'com.pangqing.pindou.pro0'],
  'owl_recorder': ['lifetime', 'company.thebrainstorming.owlrecorder.lifetime'],
  'stufflog': ['pro_access', 'com.dyl.thinglog.lifetime'],
  'SwimApp': ['pro_access', 'com.dyl.swimnote.lifetime'],
  'ReverseChallengeSwiftUI': ['ReverseChallenge.Pro', 'com.abighead.ReverseChallenge.iap.pro'],
  'powo': ['com.minardwu.powo_lifetime', 'com.minardwu.powo_lifetime'],
  'rxframe': ['com.minardwu.rxframe_lifetime', 'com.minardwu.rxframe_lifetime'],
  'MemeLoop': ['pro', 'com.ai.gif.lifetime.pro'],
  'GLPTracker': ['Pro Access', 'com.doseflow.glp1tracker.lifetime.premium'],
  'TagCamera': ['TagCamera Pro', 'com.foxlin.tagcamera.pro.lifetime'],
  'PhotoAlbumManager': ['picseekpro', 'ape.lifetime'],
  'Sharp': ['pro', 'ape.lifetime'],
  'weight': ['Weight Pro', 'weight.pro.lifetime'],
  'QuietCam': ['QuietCam Pro', 'pawelchmiel.quietcam.yearly'],
  'PixelStudio': ['Pro', 'PixelNFT.Pro.Lifetime'],
  'OrbitFast': ['Orbit Fast Full', 'com.fastorbitapps.OrbitFast.premium.lifetime'],
  'VidCap': ['io.fadel.vidcap.pro', 'io.fadel.vidcap.pro.lifetime'],
  'kiddztube': ['Subscriber', 'kidsbeetv.lifetime.subscription.ios'],
  'tetrify': ['pro', 'pro_early_lifetime'],
  'ObjectRemoval': ['Pro', 'ObjectRemoval.Lifetime'],
  'TheGreatMe': ['The Great Me Pro', 'thegreatme.forever'],
  'ai_music_generator': ['music_generation_yearly_79_99', 'music_generation_yearly_79_99'],
  'Loopsie': ['pro-iOS', 'com.gamelounge.loopsie.ios.one_time_l'],
  'Percento': ['premium', 'app.percento.premium.168.lifetime'],
  'ShouChong': ['lulemevip', 'lulemeYears'],
  'BeetleADB': ['beetle_pro', 'beetle_lifetime_pro'],
  'adbTools': ['pro_lifetime', 'com.jy.adbTools.pro_1'],
  'Habitor': ['premium', 'habitor_lifetime'],
  'GrowthPath': ['Premium', 'GrowthPath_IAP_Lifetime'],
  'Awake': ['awake_pro', 'io.unorderly.awake.pro.lifetime_v1'],
  'ContextApp': ['plus', 'context_1y'],
  'Watchly': ['lifetime', 'watchface.lifetime'],
  'Yummi': ['Pro', 'ym_lifetime_4.99'],
  'StayOff': ['Plus', 'so_lt_1299'],
  'Lito': ['LitoPlus', 'ml_lifetime_0499'],
  'nbcamera': ['patron', 'com.andyworks.camera.yearlyPatron'],
  'CollageMaker': ['pro', 'com.livintis.collagemakerplus.yearly.1'],
  'LaunchTrans': ['PicChat.Subscribe.Start', 'Yearly.PicChat'],
  'Dotly': ['premium', 'dotly_premium_1_yearly'],
  'WallShift': ['pro', 'com.roadesign.WallShift.Lifetime'],
  'SnapWords': ['Pro access', 'com.happyplan.snapwords.premium.subscription.yearly'],
  'stopwatch': ['remove_ads', 'hasen_stopwatch_remove_ads'],
  'fengling': ['Pro', 'com.nocmt.fengling.NewLifetime'],
  'Dailyart': ['lifeTime', 'artLifeTime'],
  'Lightune': ['pro', 'Lightune_Pro_Year'],
  'ArchiveList': ['pro_life', 'com.jy.ArchiveBox.pro_1'],
  'smscat': ['pro', 'smscat_vip_lifetime'],
  'AppBox': ['appbookmark_vip', 'GAB_Lifetime_VIP'],
  'StockPlus': ['Premium', 'stocks_lifetime_premium'],
  'StudyAI': ['premium_access', 'Lifetime_PRO'],
  'PhotoVault': ['lifetime', 'photovault.lifetime'],
  'CountdownWidget': ['pro', 'cd_lifetime'],
  'DarkLooker': ['Pro', 'com.boleStudio.safaridarkmode.permanent'],
  'Sunlitt': ['sunlitt.pro', 'pro.lifetime'],
  'Moonlitt': ['moonlitt.pro', 'moonlitt.pro.lifetime'],
  'AccuFind': ['accufind_payments', 'accufind_lifetime'],
  'alistTools': ['pro_lifetime', 'com.jy.alistTools.pro_lifetime'],
  'FocusFour': ['pro', 'focusfour_lifetime'],
  'remoteMouse': ['pro', 'Subscribe__RemoteMouse_Yearly'],
  'IPCams': ['pro', 'ipcams_pro_lifetime'],
  'Kylin': ['pro', 'pro_life'],
  'ArtStage': ['FullAccess', 'com.nicdeane.artstage.YearlySubscription'],
  'CodeScanner': ['pro', 'pro_forever_399'],
  'Infltr': ['com.Yooshr.infltr.subscriptionPremium', 'com.Yooshr.infltr.everythingForever'],
  'AICalculator': ['Premium', 'com.simpleinnovation.calculator.ai.premium.yearly.base'],
  'Vinyls': ['AllPro', 'com.shi.Vin.lifetime'],
  'Accountit': ['spenditPlus', 'DesignTech.SIA.Spendit.Plus.Lifetime'],
  'ShellBean': ['pro', 'com.ningle.shellbean.iap.forever'],
  'Wishy': ['Wishy Subscription', 'wishy_lifetime_subscription'],
  'Fontsify': ['pro', 'media.upstate.fontify.lifetime'],
  'com.dison.diary': ['vip', 'lifetime'],
  'Food-Diary': ['Premium', 'fd_lifetime'],
  'becoming': ['Strength Pro', 'strength_membership_lifetime'],
  'SCRL': ['com.dopedevelopment.Panels.subscription.Pro_Dynamic_Pricing', 'strength_membership_lifetime'],
  'Morphose': ['ProStandard', 'com.pixery.morphose.yearly'],
  'ClevCalc': ['Premium', 'com.dencreak.dlcalculator.iap.dlc_no_ads_permanent'],
  'Tracepad-iOS': ['unlock', 'tracepad_unlock_all_gesture_5'],
  'photography': ['premium', 'photography_sub_yearly_1'],
  'Binsoo': ['vibe', 'annual'],
  'OneTap': ['pro', 'DiscountedProLifetime'],
  'ChatPub': ['Unlimited Access', 'conversationai.annual'],
  'Jellycuts': ['pro', 'premium'],
  'quitnow': ['pro_features', 'com.eaginsoftware.QuitNow.unlock_all_pro_features'],
  'Authenticator': ['premium', '2fa_standalone_lifetime'],
  'ChatBot': ['chatbot_annual', 'chatbot_annual'],
  'ChatLLM': ['Pro', 'com.curiouscreatorsco.ChatLLM.pro.lifetime.notrial.150_00'],
  'Photoooo': ['lifetime', 'canoe_28_rnb_forever'],
  'VibeCamera': ['forever', 'vibe_pro_forever'],
  'Themy': ['fonts_premium', 'lifetime'],
  'BabyCare': ['pro', 'KiddoKeeper_38_LifeTime'],
  'ElonAI': ['premium', 'elongpt.yearly_1'],
  'maple_mobile': ['premium', 'mc_3000_12m'],
  'FujiLifeStyle': ['FUJIStyle Pro(Year)', 'FujiStyle2024003'],
  'Gentler': ['premium', 'app.gentler.activity.nonconsumable.onetime1'],
  'TuneTally': ['Pro', 'tunetally_pro'],
  'Readle': ['Premium', 'com.hello.german.yearly'],
  'Utiful': ['All Access', 'All_Access_YR_12M_Free'],
  'CharingCrossRoad': ['ready_pro', 'ready_pro_50_1y'],
  'ig-bookmarker': ['entitlement', 'lifetimeID'],
  'PhotoMapper': ['premium', 'photomapper_lifetime_1.99'],
  'CallAnnie': ['ai.animato.callannie.entitlement.pro0', 'ai.animato.callannie.proyearly1'],
  'Liftbear': ['Pro', 'liftbear_2399_1y'],
  'OneMockup': ['pro', 'online.ohwe.onescreen.Lifetime'],
  'DataCalc': ['datacalc.pro', 'datacalc.yearly.12'],
  'moss-ios': ['prouser', 'dpbox_yearly_68'],
  'Law': ['vip', 'LawVIPOneYear'],
  'SleepSounds': ['vip', 'VIPOneMonth'],
  'multitimer_app': ['premium', 'timus_lt_base'],
  'pdfai_app': ['premium', 'special_lifetime'],
  'TQBrowser': ['pro_lt', 'com.tk.client.lifetime'],
  'Yosum': ['Premium', 'yosum_999_1year'],
  'DHWaterMarkManager': ['WaterManager_common', 'lifetimeVIP_001'],
  'iplayTV': ['com.ll.btplayer.12', 'com.ll.btplayer.12'],
  'MaxWallpaper': ['maxwallpaper_common', 'super_forever_vip'],
  'intervalFlow': ['All Access', 'wodtimer_lf'],
  'BORD': ['pro_membership', 'bord_plus_2499_lifetime'],
  'FRMD': ['all_access', 'frmd_plus_999_lifetime'],
  'HRZN': ['pro', 'plus_999_lifetime'],
  'Assembly': ['premium_access', 'com.pixite.assembly.1yearlyq'],
  'Flourish': ['Pro', 'flourish_9800_1yr_1m0'],
  'metaslip': ['Pro', 'ms_lifetime'],
  'Pins': ['customer', 'do.anh.Pins.Unlock.Standard'],
  'Loora': ['Yearly', 'yearly_free_ref_10usd_off'],
  'PwDrawingPad': ['pro', 'com.s132.app.supaintexchange.year'],
  'OneGrow': ['pro', 'com.onenicetech.OneGrow.Lifetime'],
  'PianoTrainer': ['pro_subscription', 'pianotrainer.sub.yearly.pro'],
  'FretTrainer': ['pro_subscription', 'frettrainer.sub.yearly.pro'],
  'Currency': ['plus', 'com.jeffreygrossman.currencyapp.iap.plus'],
  'TripMemo': ['pro', 'com.ningle.dailytracker.lifetime'],
  'nPtt': ['vip.yearly', 'app.nextptt.vip1.yearly'],
  'MagicTiles3': ['VIP', 'com.pianoidols.vipsub.year.06'],
  'Airmail': ['Airmail Premium', 'Airmail_iOS_Yearly_P'],
  'ScreenRecordCase': ['Premium', 'me.fandong.ScreenRecordCase.Ultra'],
  'opusvpn': ['pro', 'yearly_discount'],
  'ip_tv_react_native': ['Single', 'opus.lifetime'],
  'Atomic': ['pro', 'ht_lifetime1'],
  'QingLong': ['Premium', 'qinglong_premium'],
  'timetrack.io': ['atimelogger-premium-plus', 'ttio_premium_plus'],
  'FoJiCam': ['ProVersionLifeTime', 'com.uzero.cn.fojicam.life2'],
  'FruitMinder': ['Premium', 'com.bartozo.FruitMinder.lifetime'],
  'PDF_convertor': ['VIP', 'com.pdf.convertor.forever'],
  'rewritingText': ['AIGrammercheckerProAccess', 'sv.aigrammerchecker.com.lifetime'],
  'ShellBoxKit': ['ssh_pro', 'ShellBoxKit.Year'],
  'IDM': ['premium', 'sub_yearly_idm'],
  'Whisper': ['all_features', 'whisperai_80_y'],
  'Shapy': ['premium', 'com.blake.femalefitness.subscription.yearly'],
  'Carbon-iOS': ['pro', 'carbon.unlockall'],
  'LiveWallpaper': ['Pro access', 'com.tech.LiveWallpaper.ALL'],
  'Calflow': ['pro', 'kike.calflow.pro.lifetime'],
  'dtdvibe': ['pro', 'com.dtd.aroundu.life'],
  'Clipboard': ['Premium', 'Premium_0_99_1M_1MFree'],
  'AnimeArt': ['AnimeArt.Gold', 'WaifuArt.Lifetime'],
  'LiveCaption': ['Plus', 'rc_0400_1m'],
  'EraseIt': ['ProVersionLifeTime', 'com.uzero.cn.eraseit.premium1.fromyear'],
  'MusicPutty': ['pro_version', 'mp_3599_1y'],
  'SleepDown': ['Pro', 'pro_student_0926'],
  'StarFocus': ['pro', 'com.gsdyx.StarFocus.nonConsumable.forever'],
  'StarDiary': ['pro', 'com.gsdyx.StarDiary.nonConsumable.forever'],
  'CountDuck': ['premium', 'Lifetime'],
  'wordswag': ['pro', 'Pro_Launch_Monthly'],
  'LockFlow': ['unlimited_access', 'lf_00.00_lifetime'],
  'TextMask': ['pro', 'tm_lifetime'],
  'Chatty': ['pro', 'chatty.yearly.1'],
  'ImagineAI': ['plus', 'artistai.lifetime.1'],
  'Langster': ['Premium', 'com.langster.universal.lifetime'],
  'VoiceAI': ['Special Offer', 'voiceannualspecial'],
  'Rootd': ['pro', 'subscription_lifetime'],
  'MusicMate': ['premium', 'mm_lifetime_68_premium'],
  'AIKeyboard': ['plus_keyboard', 'aiplus_keyboard_yearly'],
  'SmartAIChat': ['Premium', 'sc_3999_1y'],
  'AIChat': ['AI Plus', 'ai_plus_yearly'],
  'LazyReply': ['lazyReplyYearlySubscription', 'com.bokhary.lazyreply.yearlyprosubscription'],
  'LazyBoard': ['lazyboardPro', 'com.bokhary.magicboard.magicboardpro'],
  'Joy': ['pro', 'com.indiegoodies.Agile.lifetime2'],
  'AnkiPro': ['Premium', 'com.ankipro.app.lifetime'],
  'SharkSMS': ['VIP', 'com.gaapp.sms.permanently'],
  'EncryptNote': ['Pro', 'com.gaapp.2019note.noAds'],
  'One4WallSwiftUI': ['lifetime', 'lifetime_key'],
  'Pigment': ['pro', 'com.pixite.pigment.1yearS'],
  'GradientMusic': ['Pro', 'com.gradient.vision.new.music.one.time.79'],
  'iBody': ['Pro', 'com.tickettothemoon.bodyfilter.one.time.purchase'],
  'Persona': ['unlimited', 'com.tickettothemoon.video.persona.one.time.purchase'],
  'easy_chart': ['unlock all', 'qgnjs_lifetime'],
  'Snipd': ['premium', 'snipd_premium_1y_7199_trial_2w_v2'],
  'Gear': ['subscription', 'com.gear.app.yearly'],
  'Aisten': ['pro', 'aisten_pro'],
  'Subtrack': ['pro', 'com.mohitnandwani.subtrack.subtrackpro.family'],
  'shipian-ios': ['vipOffering', 'shipian_25_forever'],
  'LUTCamera': ['ProVersionLifeTime', 'com.uzero.funforcam.lifetimepurchase'],
  'tiimo': ['full_access', 'lifetime.iap'],
  'IPTVUltra': ['premium', 'com.ddm1023.lifetime'],
  'Wozi': ['wozi_pro_2023', 'wozi_pro_2023'],
  'server_bee': ['Pro', 'pro_45_lifetime'],
  'MyPianist': ['pro', 'com.collaparte.mypianist.pro.yearly'],
  'ProCam': ['pro', 'pro_lifetime'],
  'Drops': ['premium', 'forever_unlimited_time_discounted_80_int'],
  'transmission_ui': ['Premium', '200002'],
  'fastdiet': ['premium', 'com.happy.fastdiet.forever'],
  'money_manager': ['premium', 'com.happy.money.forever'],
  'Overdue': ['Pro', '1'],
  'Ledger': ['Pro', 'com.lifetimeFamily.pro'],
  'WeNote': ['pro', 'Yearly'],
  'Scelta': ['pro', 'SceltaProLifetime'],
  'PM4': ['pro', 'pm4_pro_1y_2w0'],
  'Zettelbox': ['Power Pack', 'powerpack_permanent_1'],
  'Packr': ['Pro', 'com.jeremieleroy.packr.premiumyearly'],
  'muoyu': ['pro', 'com.metaorder.muoyu.prolifetime.12'],
  'Vision': ['promo_3.0', 'vis_lifetime_3.0_promo'],
  'TruthOrDare': ['premium', 'truth_or_dare_premium_monthly'],
  'HurtYou': ['premium', 'hurtyou_199_1y'],
  'Context_iOS': ['Context Pro', 'ctx_sub_1y_sspai_preorder_angel'],
  'HTTPBot': ['pro', 'com.behindtechlines.HTTPBot.prounlock'],
  'MinimalDiary': ['pro', 'com.mad.MinimalDiary.lifetime'],
  'Transfer': ['pro', 'transfer_ios_premium_year_2022_1'],
  'Collect': ['pro', 'com.revenuecat.product.yearly.ios'],
  'Paper': ['pro', 'com.fiftythree.paper.credit'],
  'Boar': ['pro-iOS', 'boar.yearly'],
  'MySticker': ['mysticker premium', 'com.miiiao.MySticker.lifetime'],
  'Rec': ['rec.paid', 'rec.paid.onetime'],
  'Photon': ['photon.paid', 'photon.paid.onetime'],
  'OneTodo': ['pro', 'onetodo_lifetime'],
  'OneFlag': ['pro', 'oneflag_lifetime'],
  'OneClear': ['pro', 'app.imone.OneClear.Lifetime'],
  'OneScreen': ['pro', 'onescreen_lifetime'],
  'Photomator': ['pixelmator_photo_pro_access', 'pixelmator_photo_lifetime_v1'],
  'Endel': ['pro', 'Lifetime'],
  'Drowsy': ['Pro', 'Drowsy_Life'],
  'Thiro': ['pro', 'atelerix_pro_lifetime'],
  'Stress': ['StressWatch Pro', 'stress_membership_lifetime'],
  'Worrydolls': ['magicmode', 'magicmode'],
  'Echo': ['PLUS', 'com.LEMO.LemoFm.plus.lifetime.l3'],
  'Falendar': ['Falendar+', 'falendar_68_life'],
  'iRead': ['vip', 'com.vip.forever_1'],
  'MOZE': ['MOZE_PREMIUM_SUBSCRIPTION', 'MOZE_PRO_SUBSCRIPTION_YEARLY_BASIC'],
  'MatrixClock': ['Premium', 'com.lishaohui.matrixclock.lifetimesharing'],
  'SalesCat': ['Premium', 'com.lishaohui.salescat.lifetime'],
  'MoneyThings': ['Premium', 'com.lishaohui.cashflow.lifetime'],
  'ChatGPTApp': ['Advanced', 'com.palligroup.gpt3.yearlyyy'],
  'Journal_iOS': ['PRO', 'com.pureformstudio.diary.yearly_2022_promo'],
  'LemonKeepAccounts': ['VIP', 'lm_1_1month'],
  'mizframa': ['premium', 'mf_20_lifetime2'],
  'EasyClicker': ['pro', 'easyclicker.premium.discount2'],
  'ImageX': ['imagex.pro.ios', 'imagex.pro.ios.lifetime'],
  'image_upscaler': ['pro', 'yearly_sub_pro'],
  'DayPoem': ['Pro Access', 'com.uzero.poem.month1'],
  'Darkroom': ['iapkit_darkroomplus', 'co.bergen.Darkroom.product.forever.everything'],
  'CardPhoto': ['allaccess', 'CardPhoto_Pro'],
  'OneWidget': ['allaccess', 'com.onewidget.vip'],
  'PinPaper': ['allaccess', 'Paper_Lifetime'],
  'Cookie': ['allaccess', 'app.ft.Bookkeeping.lifetime'],
  'MyThings': ['pro', 'xyz.jiaolong.MyThings.pro.infinity'],
  'PipDoc': ['pro', 'pipdoc_pro_lifetime'],
  'Facebook': ['pro', 'fb_pro_lifetime'],
  'Free': ['pro', 'appspree_pro_lifetime'],
  'Startodo': ['pro', 'pro_lifetime'],
  'Browser': ['pro', 'pro_zoomable'],
  'YubePiP': ['pro', 'piptube_pro_lifetime'],
  'PrivateBrowser': ['pro', 'private_pro_lifetime'],
  'bluredit': ['Premium', 'net.kaleidoscope.bluredit.premium1'],
  'TimeFinder': ['pro', 'com.lukememet.TimeFinder.Premium'],
  'Alpenglow': ['newPro', 'ProLifetime'],
  'Decision': ['com.nixwang.decision.entitlements.pro', 'com.nixwang.decision.pro.annual'],
  'ElementNote': ['pro', 'com.soysaucelab.element.note.lifetime'],
  'Tangerine': ['Premium', 'PremiumMonthly'],
  'Brass': ['pro', 'brass.pro.annual'],
  'Aphrodite': ['all', 'com.ziheng.aphrodite.onetime'],
  'apollo': ['all', 'com.ziheng.apollo.onetime'],
  'widget_art': ['all', 'com.ziheng.widgetart.onetime'],
  'audiomack-iphone': ['Premium1', 'com.audiomack.premium.2022'],
  'MallocVPN': ['IOS_PRO', 'malloc_yearly_vpn'],
  'WhiteCloud': ['allaccess', 'wc_pro_1y'],
  'Spark': ['premium', 'spark_6999_1y_1w0'],
  'NotePlan': ['premium', 'co.noteplan.subscription.personal.annual'],
  'vibes': ['patron', 'com.andyworks.vibes.yearlyPatron'],
  'simple-weather': ['patron', 'com.andyworks.weather.yearlyPatron'],
  'streaks': ['patron', 'com.andyworks.weather.yearlyPatron'],
  'andyworks-calculator': ['patron', 'com.andyworks.weather.yearlyPatron'],
  'simple-timer': ['patron', 'com.andyworks.weather.yearlyPatron'],
  'Harukong': ['premium', 'com.bluesignum.harukong.lifetime.premium'],
  'UTC': ['Entitlement.Pro', 'tech.miidii.MDClock.subscription.month'],
  'OffScreen': ['Entitlement.Pro', 'tech.miidii.offscreen.pro'],
  'APTV': ['Pro', 'com.kimen.aptvpro.lifetime'],
  'Seamless': ['Seamless.Pro', 'net.shinystone.Seamless.Pro'],
  'Anybox': ['pro', 'cc.anybox.Anybox.annual'],
  'Pillow': ['premium', 'com.neybox.pillow.premium.year.v2'],
  'Taio': ['full-version', 'taio_1651_1y_2w0_std_v2'],
  'CPUMonitor': ['Pro', 'com.mars.cpumonitor_removeAd'],
  'totowallet': ['all', 'com.ziheng.totowallet.onetimepurchase'],
  '1Blocker': ['premium', 'blocker.ios.iap.lifetime'],
  'Fileball': ['filebox_pro', 'filebox_pro'],
  'filebox_pro': ['filebox_pro', 'filebox_pro'],
};

// ========= Fallback entitlement keys ========= //
const GENERIC_ENTITLEMENT_KEYS = [
  "pro", "premium", "plus", "Pro", "Premium", "Plus", "vip", "VIP",
  "unlimited", "standard", "gold", "Gold", "lifetime", "all_access",
  "premium_access", "pro_access", "isPremium", "premiumUser",
  "member", "membership", "svip", "vip_access", "full_access",
  "premium_yearly", "premium_lifetime", "unlimited_access", "paid", "Unlock",
  "full_version", "full_unlock", "unlocked", "Subscriber", "subscriber", "active"
];

// ========= Unified Constants (CRITICAL: dates MUST match) ========= //
// Dùng 2099 để đồng nhất với iTunes.js và claim "trọn đời (hết hạn 2099)" trên README.
const EXPIRES    = "2099-12-31T10:10:14Z";
const PURCHASED  = "2005-07-18T10:10:14Z";
const MGMT_URL   = "https://apps.apple.com/account/subscriptions";

// =========  Core Logic  ========= //
// =========  @z3rokaze  ========= //
// HTTP-REQUEST mode: Xóa ETag & cache validation headers để RevenueCat luôn trả về 200 OK đầy đủ body
if (typeof $response === "undefined" || $response === null) {
  var reqUrlEarly = ($request && $request.url) || "";
  if (reqUrlEarly.indexOf("ssl-api.itranslateapp.com") !== -1) {
    var itBody = JSON.stringify({
      licenses: [
        { bundle_id: "com.outerspaceapps.itranslate", expires_date_ms: 4102444800000, is_trial_period: false, original_transaction_id: "160000714859958", product_id: "com.itranslate.pro.yearly", transaction_id: "160000714859958" }
      ]
    });
    $done({ body: itBody });
    return;
  }
  if (reqUrlEarly.indexOf("license.pdfexpert.com") !== -1) {
    var peBundle = reqUrlEarly.indexOf("/documents/") !== -1 ? "com.readdle.ReaddleDocsIPad" : "com.readdle.PDFExpert5";
    $done({ body: JSON.stringify({ bundleId: peBundle, chargingPlatform: "iOS AppStore", receiptStatus: "ok", subscriptionState: "active", subscriptionExpirationDate: "23:59 31/12/2099", isPDFExpert6User: true }) });
    return;
  }
  if (reqUrlEarly.indexOf("restore-access.indream.app/restoreAccess") !== -1) {
    var ngBody = JSON.stringify({ data: { premiumAccess: true } });
    if (typeof $task !== "undefined") {
      $done({ status: "HTTP/1.1 200 OK", headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: ngBody });
    } else {
      $done({ response: { status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: ngBody } });
    }
    return;
  }
  var reqHeaders = ($request && $request.headers) ? Object.assign({}, $request.headers) : {};
  delete reqHeaders["X-RevenueCat-ETag"];
  delete reqHeaders["x-revenuecat-etag"];
  delete reqHeaders["If-None-Match"];
  delete reqHeaders["if-none-match"];
  delete reqHeaders["If-Modified-Since"];
  delete reqHeaders["if-modified-since"];
  $done({ headers: reqHeaders });
} else {
var reqHeaders = ($request && $request.headers) || {};
var ua = (reqHeaders["User-Agent"] || reqHeaders["user-agent"] || "");
var uaDecoded; try { uaDecoded = decodeURIComponent(ua); } catch (e) { uaDecoded = ua; }

// Cũng kiểm tra X-RevenueCat-App-Bundle-ID header (nếu có)
var bundleId = (
  reqHeaders["X-Client-Bundle-ID"] || reqHeaders["x-client-bundle-id"] ||
  reqHeaders["X-RevenueCat-App-Bundle-ID"] || reqHeaders["x-revenuecat-app-bundle-id"] ||
  reqHeaders["x-client-bundle-identifier"] || ""
);
var allHeadersStr = JSON.stringify(reqHeaders).toLowerCase();

var rawBody = ($response && $response.body) || "";
var reqUrl = ($request && $request.url) || "";
var obj;
try {
  var cleanedRaw = typeof rawBody === "string" ? rawBody.replace(/while.{7}\n/, "") : "";
  obj = JSON.parse(cleanedRaw);
} catch (e) {}

function finishStandalone(payload) {
  var out = { body: JSON.stringify(payload) };
  try {
    var h = ($response && $response.headers) ? Object.assign({}, $response.headers) : {};
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  } catch (e) {}
  $done(out);
}

if (reqUrl && (!obj || !obj.subscriber) && obj && typeof obj === "object" && !Array.isArray(obj)) {
  if (reqUrl.indexOf("accuweather.com") !== -1) {
    Object.assign(obj, { isValid: true, autoRenewalStatus: 1, productId: "com.accuweather.annual.subscription", expiryDateEpoch: 4102444800000, expirationDate: "2099-12-31T23:59:59+00:00", expirationIntent: null, expirationRetry: null, purchaseDateEpoch: 1650809915000, isTrial: false, isIntro: false, status: 0, usedTrial: ["com.accuweather.annual.subscription"], usedIntro: null, isRetryable: null });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("lcs-mobile-cops.adobe.io") !== -1) {
    obj.subscriptions = [
      { subscription_name: "AcrobatPlus", subscription_level: "Plus", subscription_state: "ACTIVE", sub_ref: "", biz_source: "CCC", billing_term: null },
      { subscription_name: "ESign", subscription_level: "Basic", subscription_state: "ACTIVE", sub_ref: "", biz_source: "CCC", billing_term: null },
      { subscription_name: "PDFPack", subscription_level: "Plus", subscription_state: "ACTIVE", sub_ref: "", biz_source: "", billing_term: null },
      { subscription_name: "CreatePDF", subscription_level: "Basic", subscription_state: "ACTIVE", sub_ref: "", biz_source: "CCC", billing_term: null }
    ];
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("ars.alar.my") !== -1) {
    obj.subscription = [{ originalTransactionID: "490001314520000", productID: "droom.sleepIfUCanFree.premium.yearly01.4", willAutoRenew: true, isActive: true, expiresDateMs: 4102444800000, periodType: "NORMAL", latestPurchaseDateMs: 1651590191000, originalPurchaseDateMs: 1651590191000 }];
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("alohaprofile.com") !== -1) {
    if (!obj.profile || typeof obj.profile !== "object" || Array.isArray(obj.profile)) obj.profile = {};
    obj.profile.is_premium = true; obj.profile.end_of_premium = 4102444800; obj.profile._end_of_premium = "2099-12-31 23:59:59";
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("bilibili.com") !== -1) {
    if (!obj.data || typeof obj.data !== "object") obj.data = {};
    if (reqUrl.indexOf("/x/v2/account/myinfo") !== -1 || reqUrl.indexOf("/x/v2/account/mine") !== -1) {
      if (!Array.isArray(obj.data)) obj.data.vip = Object.assign({}, obj.data.vip, { type: 2, status: 1, vip_pay_type: 1, due_date: 4102444800000, role: 3 });
    }
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("dailyyoga.com") !== -1) {
    if (!obj.result || typeof obj.result !== "object" || Array.isArray(obj.result)) obj.result = {};
    Object.assign(obj.result, { memberType: 12, StartTime: "2022-04-23 16:20:35", EndTime: "2099-12-31 23:59:59", isSuperVip: 3, superStartTime: "2022-04-23 16:20:35", superEndTime: "2099-12-31 23:59:59", oldSuperStartTime: "2022-04-23 16:20:35", oldSuperEndTime: "2099-12-31 23:59:59", pro_center_data: { pro_type: 2, pro_type_title: "Super VIP", pro_service_title: "", pro_start_date: "", pro_end_date: "2099-12-31", day_left: "", is_pro_center_red_dot: 0 } });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("payments.invideo.io") !== -1) {
    Object.assign(obj, { purchase_id: "480000515251249", purchase_date: "2022-04-16T11:27:44Z", next_renewal_date: "2099-04-19T11:27:43Z", title: "FILMR PRO", current_payment_source: "mobile", show_next_renewal_date: true, duration: "YEARLY", plan: "FILMR_PRO", includes_access_to: ["Filmr Pro"], is_iap_linked: true, status: "ACTIVE", is_free_user: false });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("service.ilovepdf.com") !== -1) {
    obj.limits = { merge: { mb: 4000, files: 500 }, split: { mb: 4000, files: 1 }, compress: { mb: 4000, files: 10 } };
    obj.premium = true; obj.sus_rbt = true;
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("apic.musixmatch.com") !== -1) {
    if (!obj.message || typeof obj.message !== "object") obj.message = {};
    if (!obj.message.body || typeof obj.message.body !== "object") obj.message.body = {};
    if (!obj.message.body.app_config || typeof obj.message.body.app_config !== "object") obj.message.body.app_config = {};
    obj.message.body.app_config.reference = "active"; obj.message.body.app_config.trial = false;
    obj.message.body.app_config.active_products = [{ product_id: "com.musixmatch.offers.removeads.autorenewable.oneyear", start_date: "2022-03-27T16:27:38.000Z", creation_date: "2022-03-27T16:27:38.000Z", credits: 10, end_date: "2099-11-03T17:27:38.000Z", product_type: "subscription", features: { no_ads: 1, clean_metadata: 1, party_mode: 1, lyrics_offline: 1 } }];
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("myfitnesspal.com") !== -1) {
    obj.subscriptionEndDate = "2099-05-01T10:10:53.929Z"; obj.subscriptionStartDate = "2022-05-01T10:10:53.929Z"; obj.hasPremium = true;
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("pro.smallpdf.com") !== -1) {
    obj.success = true;
    obj.data = Object.assign({}, obj.data, { email_verified: true, app_metadata: { mobile_user: true, is_in_free_trial_period: true, expirationDate: "2099-04-16", signedUp: true, canceled: true, subscription_platform: "ios", free_trial_user: true, has_business_email: true } });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.polaxiong.com") !== -1) {
    Object.assign(obj, { isSubscribed: true, planId: "co.polarr.ppe.premium.studio.yearly", subscriptionProduct: "yearly", isTrial: false, app: "PPE", isUnlimited: true, expiryDate: "2099-08-17T19:38:37.000Z", planType: "yearly", planTier: "studio", subscriptionTier: "studio", membershipExpiryDate: "2099-08-17T19:38:37.000Z" });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("apimboom2.globaldelight.net") !== -1) {
    var bItem = { quantity: "1", purchase_date_ms: "1555474256000", expires_date: "2099-04-17 04:10:56 Etc/GMT", expires_date_pst: "2099-04-16 21:10:56 America/Los_Angeles", is_in_intro_offer_period: "false", transaction_id: "470000445785125", is_trial_period: "false", original_transaction_id: "470000445785125", purchase_date: "2019-04-17 04:10:56 Etc/GMT", product_id: "com.globaldelight.iBoom.LifetimeDiscountPack", expires_date_ms: "4080082256000" };
    obj.status = "0"; obj["receipt-data"] = { status: 0, environment: "Production", receipt: { receipt_type: "Production", bundle_id: "com.globaldelight.iBoom", in_app: [bItem] }, latest_receipt_info: [bItem], pending_renewal_info: [{ product_id: "com.globaldelight.iBoom.LifetimeDiscountPack", original_transaction_id: "470000445785125", auto_renew_product_id: "com.globaldelight.iBoom.LifetimeDiscountPack", auto_renew_status: "0" }] };
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.flexibits.com") !== -1) {
    obj.subscription = { autorenew: true, expiration: "2099-02-15T09:09:14Z", expires: "2099-02-15T09:09:14Z", subscription_type: "AppStore", is_expired: false, trial: false };
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("billing.peakcloud.org") !== -1) {
    obj.response = { bbuid: "jwDeFNKzxk", usedIntroOfferPeriod: false, class: "UserModuleBillingResponse", is_in_billing_retry: false, modules: [{ class: "BillingModuleResponse", name: "com.brainbow.module.peak.PeakModule", subscription: { status: 0, statusdate: 0, source: { id: "com.brainbow.peak.arsub_1wtrial_12m3499", cancelable: false, provider: "itunes", type: "trial" }, bbuid: "jwDeFNKzxk", endTime: 4070880000000, startTime: 1672502400000, pro: true } }] };
    obj.metaResponse = { code: 0 };
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("photos.adobe.io") !== -1) {
    if (!obj.entitlement || typeof obj.entitlement !== "object") obj.entitlement = {};
    if (!obj.avatar || typeof obj.avatar !== "object") obj.avatar = {};
    obj.entitlement.status = "subscriber";
    obj.current_subs = { product_id: "lightroom", store: "adobe", purchase_date: "2019-10-10T16:32:10.254954Z", sao: { inpkg_CCLE: "1", storage_quota: "100" } };
    obj.entitlement.storage = { used: 0, limit: 1154487209165, display_limit: 1099511627776, warn: 992137445376 };
    obj.avatar.placeholder = true;
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("notability.com/subscriptions") !== -1) {
    obj.data = { processAppleReceipt: { __typename: "SubscriptionResult", error: 0, subscription: { __typename: "AppStoreSubscription", status: "active", originalPurchaseDate: "2021-11-09T03:14:18.000Z", originalTransactionId: "710000869822929", expirationDate: "2099-12-31T03:14:17.000Z", productId: "com.gingerlabs.Notability.premium_subscription", tier: "premium", refundedDate: null, refundedReason: null, user: null } } };
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("accounts.agenda.com") !== -1) {
    Object.assign(obj, { error: 0, universalPurchaseAvailable: true, informUserOfPendingBonus: true, licenseStatus: 1, isSubscribed: true, unlockExpiry: 4102444800, isSubscribedMobile: true, licenseStatusMobile: 1, unlockExpiryMobile: 4102444800 });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.craft.do") !== -1) {
    obj.subscription = { tier: "Pro", subscriptionActive: true, expirationDate: 4096161426000, subscriptionType: "yearly", rawSubscriptionType: "AppStore", productId: "com.lukilabs.lukiapp.pro.sub.yearly" };
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("backend.getdrafts.com") !== -1) {
    Object.assign(obj, { active_expires_at: "2099-01-01T00:00:00Z", is_subscription_active: true, active_subscription_type: "premium", is_blocked: false });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api-production.endel.io") !== -1) {
    obj.subscription = { promo_type: "DEFAULT", period: "NOPERIOD", store_trial: false, time_left: 4102444800, price_id: "unknown", valid_until: 4102444800, type: "ACTIVE", trial_type: "CALENDAR_BASED", cancel_at_period_end: false, multiple_subscriptions: true, store: "APP_STORE", trial_canceled: false };
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("oracle.bendingspoonsapps.com") !== -1) {
    var bsId = "com.focos.1y_t130_bundle_creator";
    if (reqUrl.indexOf("splice") !== -1) bsId = "com.path36.SpliceFree.1y_t150_bundle";
    else if (reqUrl.indexOf("filmicpro") !== -1) bsId = "com.cinegenix.filmic.pro.1y_t130_bundle_creator";
    else if (reqUrl.indexOf("firstlight") !== -1) bsId = "com.filmicpro.firstlight.1y_t130_bundle_creator";
    else if (reqUrl.indexOf("doubletake") !== -1) bsId = "com.filmicpro.doubletake.1w_t20_bundle_creator";
    else if (reqUrl.indexOf("remini") !== -1) bsId = "com.bigwinepot.nwdn.international.1y_p99_99_ft_pro";
    else if (reqUrl.indexOf("focoslive") !== -1) bsId = "com.focoslive.1y_t130_adj";
    else if (reqUrl.indexOf("thirtydayfitness") !== -1) bsId = "com.vigorapps.30DayFitness.1y_t130_bundle_adj";
    else if (reqUrl.indexOf("sleep") !== -1) bsId = "com.bendingspoonsapps.SleepHelp.1y_t100_bundle_adj";
    else if (reqUrl.indexOf("yoga") !== -1) bsId = "com.flyingnayeem.yoga.1y_t100_1w_bundle_adj";
    if (!obj.me || typeof obj.me !== "object") obj.me = {};
    obj.me.active_subscriptions_ids = [bsId];
    obj.me.active_bundle_subscriptions = [{ expiry: "2099-09-09T09:09:09+00:00", product_id: bsId, features: ["unlock"] }];
    if (!obj.settings || typeof obj.settings !== "object") obj.settings = {};
    if (!obj.settings.__identity__ || typeof obj.settings.__identity__ !== "object") obj.settings.__identity__ = {};
    obj.settings.__identity__.expiration = "2099-09-09T09:09:09+00:00";
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("payment-api.lingvist.com") !== -1) {
    obj.services = [{ service: "unlimited", is_infinite: true, active_since_ts: "2023-09-26T05:56:06.980051Z", subscription: { uuid: "z3rokaze-vip", period: "P1Y", is_recurring: true, group_name: "unlimited", expiration_ts: "2099-10-10T05:56:01Z", status: "active" }, title: "Lingvist Unlimited. 1-year subscription", duration: "P1Y", payment_provider: "apple-in-app", active_until_ts: "2099-10-10T05:56:06.980051Z", is_active: true, product_name: "unlimited-12-months" }];
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.memrise.com") !== -1) {
    if (!obj.user || typeof obj.user !== "object") obj.user = {};
    obj.user.is_pro = true; obj.user.is_premium = true;
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.sortedapp.com") !== -1) {
    Object.assign(obj, { environment: "Production", status: 0, isCustomer: true, isPro: true, flagged: false, isBundleEnabled: true });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("mid.zineapi.com") !== -1) {
    obj.success = true;
    obj.data = Object.assign({}, obj.data, { is_pro: true, membership: { role_name: "pro", begin_time: "2022-09-28T15:24:55.421Z", end_time: "2099-10-01T15:24:51Z", begin_time_ms: 1664378695421, end_time_ms: 4094513091000 } });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("dayone.app/api/v2/users") !== -1) {
    if (reqUrl.indexOf("/account-status") !== -1) {
      Object.assign(obj, { expirationDate: 4099766400000, startDate: 1582805832000, subscriptionPlan: "com.bloombuilt.dayoneios.subscription.premium.yearly_discounted_trial", lastRenewalDate: 1582805831000, subscriptionName: "premium", bundleReason: "purchase", cancellationDate: 0 });
    } else {
      obj.reason = "purchase";
      obj.bundle = { bundleName: "premium", features: [{ name: "imagesPerEntry", limit: 30, canUpgrade: false }, { name: "journalLimit", limit: 100, canUpgrade: false }, { name: "audioPerEntry", limit: 10, canUpgrade: false }, { name: "sync", limit: null, canUpgrade: false }, { name: "backup", limit: null, canUpgrade: false }, { name: "drawingsPerEntry", limit: 30, canUpgrade: false }, { name: "scanToPDF", limit: 30, canUpgrade: false }, { name: "videosPerEntry", limit: 30, canUpgrade: false }] };
    }
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("flomoapp.com") !== -1) {
    if (!obj.data || typeof obj.data !== "object") obj.data = {};
    obj.data.pro_expired_at = "2099-10-26 23:59:59"; obj.data.referee_pro_days = 9999;
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.mondlylanguages.com") !== -1) {
    obj.purchased_products = [
      { is_from_current_platform: true, id: "12month_all_4_trial", role: "12month", is_grace_period: false, is_auto_renewing: true, expiration_date: 4102444800, is_billing_retry_period: false, is_initial_purchase: false, is_in_free_trial_period: false, is_upgraded: false },
      { is_from_current_platform: true, id: "categ22", role: "categ22", is_grace_period: false, is_auto_renewing: true, expiration_date: 4102444800, is_billing_retry_period: false, is_initial_purchase: false, is_in_free_trial_period: false, is_upgraded: false }
    ];
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("license.pdfexpert.com") !== -1) {
    Object.assign(obj, { isEligibleForTrial: false, subscriptionState: "active", subscriptionExpirationDate: "23:59 31/12/2099", isPDFExpert6User: true, isReaddleStorageUser: true, subscriptionAutoRenewStatus: "autoRenewOn" });
    finishStandalone(obj); return;
  }
  if (reqUrl.indexOf("api.gotokeep.com") !== -1) {
    obj.errorCode = 0;
    if (!obj.data || typeof obj.data !== "object") obj.data = {};
    Object.assign(obj.data, { hasPaid: true, downLoadAll: true, startEnable: true, memberStatus: 1, preview: true });
    finishStandalone(obj); return;
  }
}

if (!obj || typeof obj !== "object" || Array.isArray(obj) || !obj.subscriber) {
  // Không parse được hoặc thiếu subscriber -> trả nguyên body, tránh làm hỏng app
  $done({});
} else {
// Detect app từ User-Agent HOẶC Bundle ID
var match = Object.keys(mapping).find(function(e) {
  return uaDecoded.includes(e) || ua.includes(e) || bundleId.includes(e);
});

// Fallback: nếu chưa match, thử detect Locket bằng URL path, header hoặc body content
if (!match && obj.subscriber) {
  var urlPath = (($request && $request.url) || "").toLowerCase();
  if (urlPath.includes("locket") || bundleId.toLowerCase().includes("locket") || allHeadersStr.includes("co.locket") || allHeadersStr.includes("locket")) {
    match = "Locket";
  }
}

var prodKey = "rc_generic_premium_yearly";
var entKeys;
var isLocket = false;

if (match) {
  // App có trong mapping -> cấp đúng entitlement key riêng
  var mapped = mapping[match];
  if (mapped) {
    var ent = mapped[0];
    var prod = mapped[1];
    if (prod) prodKey = prod;
    isLocket = (match === 'Locket' || match === 'locket' || match === 'Locket Widget' || match === 'co.locket.Locket' || uaDecoded.toLowerCase().includes('locket') || bundleId.toLowerCase().includes('locket') || allHeadersStr.includes('co.locket'));
    entKeys = isLocket ? ['Gold', 'gold'] : [ent || "pro"];
  } else {
    entKeys = GENERIC_ENTITLEMENT_KEYS;
  }
} else {
  // App RC khác -> cấp quyền dưới nhiều entitlement key phổ biến
  entKeys = GENERIC_ENTITLEMENT_KEYS;
}

// Generate pseudo-unique transaction ID dựa trên prodKey hash
var txHash = 210000000000000;
for (var i = 0; i < prodKey.length; i++) txHash += prodKey.charCodeAt(i) * (i + 1) * 7;
var TXID = String(txHash);

// Current date for request_date (RC SDK v5+ requirement)
var now = new Date();
var REQUEST_DATE = now.toISOString().replace(/\.\d{3}Z$/, "Z");
var REQUEST_DATE_MS = now.getTime();

// Subscription template - CHỈ chứa các field chuẩn RevenueCat API
var subTemplate = {
    auto_resume_date: null,
    billing_issues_detected_at: null,
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    is_sandbox: false,
    original_purchase_date: PURCHASED,
    ownership_type: "PURCHASED",
    period_type: "normal",
    purchase_date: PURCHASED,
    refunded_at: null,
    store: "app_store",
    store_transaction_id: TXID,
    unsubscribe_detected_at: null
};

// Entitlement template - bao gồm product_plan_identifier cho SDK v5+
// CRITICAL: store_transaction_id + original_purchase_date trong entitlement là BẮT BUỘC cho Locket Gold
var entTemplate = {
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    product_identifier: prodKey,
    product_plan_identifier: prodKey,
    purchase_date: PURCHASED,
    original_purchase_date: PURCHASED,
    ownership_type: "PURCHASED",
    store: "app_store",
    store_transaction_id: TXID
};

// ===== Subscriber-level fields (CRITICAL for Locket Gold) ===== //

// management_url ở subscriber level (đúng theo RC API spec)
if (!obj.subscriber.management_url) {
  obj.subscriber.management_url = MGMT_URL;
}

// first_seen: REQUIRED by RC SDK v5+ and Locket Gold specifically
// Nếu server chưa set, đặt mặc định = purchase_date
if (!obj.subscriber.first_seen) {
  obj.subscriber.first_seen = isLocket ? "2005-07-18T10:10:14Z" : PURCHASED;
}

// original_app_user_id: GIỮ NGUYÊN nếu server đã set, nếu chưa thì tạo
if (!obj.subscriber.original_app_user_id) {
  obj.subscriber.original_app_user_id = "$RCAnonymousID:z3rokaze" + TXID.substring(0, 8);
}

// request_date & request_date_ms: SDK v5.2+ dùng để validate freshness
obj.subscriber.request_date = REQUEST_DATE;
obj.subscriber.request_date_ms = REQUEST_DATE_MS;

// Init các field bắt buộc
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};

// ===== Clean up any expired entitlements that could conflict ===== //
// Đối với Locket Gold: Xóa các entitlement hết hạn không phải Gold để tránh xung đột
if (isLocket) {
  for (var k in obj.subscriber.entitlements) {
    if (obj.subscriber.entitlements.hasOwnProperty(k)) {
      var existingExpiry = obj.subscriber.entitlements[k].expires_date;
      if (existingExpiry && existingExpiry !== EXPIRES) {
        try {
          if (new Date(existingExpiry).getTime() < now.getTime()) {
            delete obj.subscriber.entitlements[k];
          }
        } catch(e) {}
      }
    }
  }
}

// Merge subscription (giữ field server có thể thêm mới) thay vì ghi đè cả object
obj.subscriber.subscriptions[prodKey] = Object.assign({}, obj.subscriber.subscriptions[prodKey] || {}, subTemplate);
if (isLocket) {
  obj.subscriber.subscriptions[prodKey].display_name = prodKey;
  obj.subscriber.subscriptions[prodKey].price = obj.subscriber.subscriptions[prodKey].price || { amount: 399000.0, currency: 'VND' };
}

// Với app chưa map: gia hạn luôn mọi entitlement server đã định nghĩa sẵn (nếu có)
if (!match) {
  for (var ek in obj.subscriber.entitlements) {
    if (obj.subscriber.entitlements.hasOwnProperty(ek)) {
      var existingPid = (obj.subscriber.entitlements[ek] && obj.subscriber.entitlements[ek].product_identifier) || prodKey;
      obj.subscriber.entitlements[ek] = Object.assign({}, obj.subscriber.entitlements[ek], {
        expires_date: EXPIRES,
        purchase_date: PURCHASED,
        original_purchase_date: PURCHASED,
        grace_period_expires_date: null,
        store: "app_store",
        store_transaction_id: TXID,
        product_identifier: existingPid,
        product_plan_identifier: existingPid
      });
      obj.subscriber.subscriptions[existingPid] = Object.assign({}, obj.subscriber.subscriptions[existingPid] || {}, subTemplate, {
        product_identifier: existingPid,
        product_plan_identifier: existingPid
      });
    }
  }
}

// Locket Gold: Inject theo định dạng chuẩn RevenueCat v5+ (Grandmaster Evasion)
if (isLocket) {
  var MY_PURCHASE_DATE = "2005-07-18T10:10:14Z";
  var MY_EXPIRES_DATE  = EXPIRES;
  var locketGoldSub = {
    auto_resume_date: null,
    display_name: "locket_1600_1y",
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    management_url: "https://apps.apple.com/account/subscriptions",
    period_type: "normal",
    price: {
      amount: 399000.0,
      currency: "VND"
    },
    expires_date: MY_EXPIRES_DATE,
    grace_period_expires_date: null,
    refunded_at: null,
    unsubscribe_detected_at: null,
    original_purchase_date: MY_PURCHASE_DATE,
    purchase_date: MY_PURCHASE_DATE,
    store: "app_store",
    store_transaction_id: "2000001108724193"
  };
  var locketGoldEnt = {
    expires_date: MY_EXPIRES_DATE,
    grace_period_expires_date: null,
    original_purchase_date: MY_PURCHASE_DATE,
    purchase_date: MY_PURCHASE_DATE,
    product_identifier: "locket_1600_1y",
    product_plan_identifier: "locket_1600_1y",
    ownership_type: "PURCHASED",
    store: "app_store",
    store_transaction_id: "2000001108724193"
  };
  obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
  obj.subscriber.entitlements = obj.subscriber.entitlements || {};
  var locketProds = ['locket_1600_1y', 'locket_3600_1y', 'locket_gold_yearly', 'locket_gold_monthly'];
  for (var lp = 0; lp < locketProds.length; lp++) {
    var pid = locketProds[lp];
    obj.subscriber.subscriptions[pid] = Object.assign({}, locketGoldSub, {
      display_name: pid,
      product_identifier: pid
    });
  }
  obj.subscriber.entitlements["Gold"] = locketGoldEnt;
  obj.subscriber.entitlements["gold"] = locketGoldEnt;
  obj.subscriber.entitlements["locket_gold"] = locketGoldEnt;
  obj.subscriber.entitlements["premium"] = locketGoldEnt;
  obj.subscriber.entitlements["pro"] = locketGoldEnt;
  obj.subscriber.entitlements["all_access"] = locketGoldEnt;

  // Unlock Filter Packs, Holiday Effects & Seasonal Frames (Photo Effects, AR Filters & Frames)
  var filterProds = [
    "com.locket.Locket.CustomFilters",
    "com.locket.Locket.AILooks",
    "com.locket.Locket.FilterPack_10Photos_400",
    "com.locket.Locket.FilterPack_20Photos_500",
    "com.locket.Locket.FilterPack_10Photo",
    "com.locket.Locket.FilterPack_20Photo"
  ];
  for (var fp = 0; fp < filterProds.length; fp++) {
    var fpid = filterProds[fp];
    obj.subscriber.subscriptions[fpid] = Object.assign({}, locketGoldSub, {
      display_name: fpid,
      product_identifier: fpid,
      product_plan_identifier: fpid
    });
  }
  var filterEnts = [
    "custom_filters", "custom_filter", "allows_custom_filters",
    "create_look", "create_looks", "ai_looks", "ai_look", "ai_filters", "ai_filter",
    "looks", "look", "makeover", "appearance", "custom_appearance",
    "generative_filters", "generative_ai", "ai", "gen_ai", "ai_generation",
    "prompts", "prompt_filters", "avatar_generation", "ai_credits", "credits",
    "camera_filters", "camera_filter_custom", "camera_custom_filters", "custom_camera_filters",
    "custom_filter_pack", "filter_generation",
    "effect_pack_10", "effect_pack_20", "filter_pack_10", "filter_pack_20",
    "filters", "filter_pack", "effects", "holiday_effects", "holiday_filters",
    "holiday_moments", "view_holiday_moments", "seasonal_effects", "seasonal_frames",
    "custom_frames", "frames", "widget_frames", "view_all_history", "view_history",
    "past_moments", "camera_filter_holidays", "yearbook", "recap", "calendar_rewind",
    "streak_freeze", "ghost_mode", "stealth_views", "music_preview"
  ];
  for (var fe = 0; fe < filterEnts.length; fe++) {
    var feKey = filterEnts[fe];
    obj.subscriber.entitlements[feKey] = Object.assign({}, locketGoldEnt, {
      product_identifier: filterProds[0],
      product_plan_identifier: filterProds[0]
    });
  }

  // Subscriber Attributes: Huy hiệu Locket Gold trên Avatar ("LOCKET GOLD SINCE 2024"), Ngày thành viên & Tích xanh
  obj.subscriber.subscriber_attributes = obj.subscriber.subscriber_attributes || {};
  obj.subscriber.subscriber_attributes["locket_gold_badge"] = {
    "value": "true",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["locket_gold_badge_small"] = {
    "value": "true",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["locket_gold_badge_text"] = {
    "value": "LOCKET GOLD SINCE 2005",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["locket_gold_since"] = {
    "value": "2005-07-18T10:10:14Z",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["locket_verified"] = {
    "value": "true",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["verified"] = {
    "value": "true",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["badge"] = {
    "value": "verified",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["subscription_entitlement"] = {
    "value": "locket_gold",
    "updated_at_ms": REQUEST_DATE_MS
  };
  obj.subscriber.subscriber_attributes["is_gold"] = {
    "value": "true",
    "updated_at_ms": REQUEST_DATE_MS
  };
}

// Cấp quyền dưới các entitlement key mục tiêu (Trừ Locket đã inject chuẩn bên trên)
if (!isLocket) {
  for (var j = 0; j < entKeys.length; j++) {
    var ek2 = entKeys[j];
    obj.subscriber.entitlements[ek2] = Object.assign({}, obj.subscriber.entitlements[ek2] || {}, entTemplate);
  }
}

// Bổ sung non_subscriptions cho các app kiểm tra purchases trọn đời/IAP không gia hạn
if (!isLocket && !obj.subscriber.non_subscriptions[prodKey]) {
  obj.subscriber.non_subscriptions[prodKey] = [{
    id: TXID,
    is_sandbox: false,
    original_purchase_date: PURCHASED,
    purchase_date: PURCHASED,
    store: "app_store",
    store_transaction_id: TXID
  }];
}

var out = { body: JSON.stringify(obj) };
// Cache-bust: ngăn client lưu cache response (tránh 304 Not Modified đè patch)
try {
  if ($response && $response.headers) {
    var h = Object.assign({}, $response.headers);
    h["Cache-Control"] = "no-store, no-cache, must-revalidate";
    h["Pragma"] = "no-cache";
    delete h["ETag"];
    delete h["etag"];
    delete h["X-RevenueCat-ETag"];
    delete h["x-revenuecat-etag"];
    delete h["If-None-Match"];
    delete h["if-none-match"];
    out.headers = h;
  }
} catch (e) {}

$done(out);
}

}
})();
