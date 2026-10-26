/*
 * @name: iTunes Premium Unlock
 * @desc: Unlock 250+ apps via App Store buy.itunes.apple.com verifyReceipt hijack
 * @author: Nguyễn Ngọc Anh Tú (z3rokaze)
 * @homepage: https://github.com/K4Z3X0R/NguyenNgocAnhTu
 * @date: 2026-07-16 (v2.2.0-stable)
 */

(function () {
let body = ($response && $response.body) || "";
if (!body) {
  $done({});
  return;
}
let ddm = null, data = null, anchor = false;
function tryParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
ddm = tryParse(body);
if (!ddm) {
  let start = body.indexOf("{");
  let end = body.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    ddm = tryParse(body.substring(start, end + 1));
    if (ddm) console.log("✅ iTunes: JSON parsed via substring fallback");
  }
}
if (!ddm) {
  let match = body.match(/\{[\s\S]*\}/);
  if (match) {
    ddm = tryParse(match[0]);
    if (ddm) console.log("✅ iTunes: JSON parsed via regex fallback");
  }
}
if (!ddm) {
  console.log("❌ iTunes: JSON parse failed, skipping rewrite");
  $done({});
  return;
}
const reqHeaders = ($request && $request.headers) || {};
const ua = reqHeaders["User-Agent"] || reqHeaders["user-agent"] || "";
if (!ddm || typeof ddm !== "object" || Array.isArray(ddm) || !ddm.receipt) {
  $done({});
  return;
}
const bundle_id = ddm.receipt["bundle_id"] || ddm.receipt["Bundle_Id"] || "";

// ===== App列表 =====
const list = {
  'Booka': { tp: 'timeb', hx: 'hxpda', id: "com.jianili.Booka.pro.lifetime" }, // Booka - Đọc sách tối giản (10/2026)
  'com.jianili.Booka': { tp: 'timeb', hx: 'hxpda', id: "com.jianili.Booka.pro.lifetime" }, // Booka
  'PhimCiaj': { tp: 'timeb', hx: 'hxpda', id: "com.jiancent.calligraphymaster.lifetime" }, // 练字大师 Calligraphy (10/2026)
  'com.jiancent.calligraphymaster': { tp: 'timeb', hx: 'hxpda', id: "com.jiancent.calligraphymaster.lifetime" }, // 练字大师 Calligraphy
  'dazz': { tp: 'timeb', hx: 'hxpda', id: "com.haocai.dazzcam.forever" }, // Dazz Cam
  'com.haocai.DazzCam': { tp: 'timeb', hx: 'hxpda', id: "com.haocai.dazzcam.forever" }, // Dazz Cam
  'dazz.camera': { tp: 'timeb', hx: 'hxpda', id: "com.haocai.dazzcam.forever" }, // Dazz Cam
  'com.haocai.dazz': { tp: 'timeb', hx: 'hxpda', id: "com.haocai.dazzcam.forever" }, // Dazz Cam
  'ProCCD': { tp: 'timeb', hx: 'hxpda', id: "com.yengshine.proccd.yearly" }, // ProCCD
  'com.yengshine.proccd': { tp: 'timeb', hx: 'hxpda', id: "com.yengshine.proccd.yearly" }, // ProCCD
  'com.yengshine.proccd.lifetime': { tp: 'timeb', hx: 'hxpda', id: "com.yengshine.proccd.yearly" }, // ProCCD Lifetime
  'EE35': { tp: 'timeb', hx: 'hxpda', id: "com.eightivedesign.ee35.lifetime" }, // EE35 Film
  'com.eightivedesign.ee35': { tp: 'timeb', hx: 'hxpda', id: "com.eightivedesign.ee35.lifetime" }, // EE35 Film
  'NOMO': { tp: 'timeb', hx: 'hxpda', id: "com.farlens.nomo.pro" }, // NOMO CAM
  'com.farlens.nomo': { tp: 'timeb', hx: 'hxpda', id: "com.farlens.nomo.pro" }, // NOMO CAM
  'NOMO Point': { tp: 'timeb', hx: 'hxpda', id: "com.farlens.point.pro" }, // NOMO Point
  'com.farlens.point': { tp: 'timeb', hx: 'hxpda', id: "com.farlens.point.pro" }, // NOMO Point
  'kuni': { tp: 'timeb', hx: 'hxpda', id: "com.ginnypix.kunicam.forever" }, // KUNI Cam
  'com.ginnypix.kunicam': { tp: 'timeb', hx: 'hxpda', id: "com.ginnypix.kunicam.forever" }, // KUNI Cam
  '1998cam': { tp: 'timeb', hx: 'hxpda', id: "com.canhtran.1998cam.yearly" }, // 1998 Cam
  'com.canhtran.1998cam': { tp: 'timeb', hx: 'hxpda', id: "com.canhtran.1998cam.yearly" }, // 1998 Cam
  'loficam': { tp: 'timeb', hx: 'hxpda', id: "com.loficam.pro" }, // LoFi Cam
  'com.loficam': { tp: 'timeb', hx: 'hxpda', id: "com.loficam.pro" }, // LoFi Cam
  'bazaart': { tp: 'timea', hx: 'hxpda', id: "Bazaart_Super_Three_Months_v4" }, //Bazaart百色特
  'SHScan': { tp: 'timea', hx: 'hxpda', id: "com.ws.SHScanFree.Year" }, //扫描王
  'EnglishTalent': { tp: 'timea', hx: 'hxpda', id: "com.mango.newYearVip", strict: "auto" }, //英语演讲
  'art.yueyin.ebook-convert': { tp: 'timea', hx: 'hxpda', id: "art.yueyin.ebook.year" }, //电子书格式转换
  'MaiqiSun': { tp: 'timeb', hx: 'hxpda', id: "life_cn_68" }, //iSunning
  'PulseWatch': { tp: 'timeb', hx: 'hxpda', id: "relaxlife_ebp" }, //RelaxWatch:AI智能压力监测
  'PicCompress': { tp: 'timea', hx: 'hxpda', id: "pc_vip_new_1y" }, //图片压缩
  'XiangCePhoto': { tp: 'timeb', hx: 'hxpda', id: "ql128" }, //相册清理-删除重复照片
  'FileMaster': { tp: 'timeb', hx: 'hxpda', id: "FileMaster_ProVersion" },  //文件大师
  'Tuesday': { tp: 'timeb', hx: 'hxpda', id: "PIGLET_VIP_Forever" },  //Tuesday-纪念日
  'IPTV%20Flixana': { tp: 'timeb', hx: 'hxpda', id: "iptv_flixana_lifetime_sub" },  //IPTV Flixana
  'AdBlocker': { tp: 'timeb', hx: 'hxpda', id: "com.va.adBlocker.lifeTimefree" },  //AdBlocker
  'ECGPlus': { tp: 'timeb', hx: 'hxpda', id: "com.wms.hrv.pro" },  //ECG+心电房颤分析
  'WatchWallpaper': { tp: 'timea', hx: 'hxpda', id: "indie.davidwang.WatchWallpaper.yearsubscriptegold" },  //表盘专辑
  'com.beauty.MeiTui': { tp: 'timea', hx: 'hxpda', id: "vip_member_v3_365day" },  //AI美腿
  'ChmReader': { tp: 'timeb', hx: 'hxpda', id: "EpubReader_ProVersion" },  //Epub阅读器
  'MediaConvert': { tp: 'timeb', hx: 'hxpda', id: "MediaConverter_ProVersion" },  //格式转换
  'Period': { tp: 'timeb', hx: 'hxpda', id: "com.hanchongzan.time.pro" },  //时光提醒
  'com.sixiaobo.MusCut': { tp: 'timeb', hx: 'hxpdb', id: "com.purecollage.pro" },  //无损拼图
  'com.hanchongzan.loverlist': { tp: 'timeb', hx: 'hxpda', id: "com.hanchongzan.loverlist.01" },  //恋人清单
  'FlashTransportMaster': { tp: 'timea', hx: 'hxpda', id: "com.flashtransport.fightenegery.yearly.base" },  //时光罐罐
  'com.ideack.ASR': { tp: 'timeb', hx: 'hxpda', id: "ASR_Permanent_Plan" },  //录音转文字
  'Presets': { tp: 'timea', hx: 'hxpda', id: "com.chromatech.chroma.yearlyAutoRenewable" },  //Presets:照片处理、图像编辑器
  'GoodTask': { tp: 'timeb', hx: 'hxpda', id: "com.hahainteractive.goodtask3.pro" },  //代办事项清单-GoodTask
  'com.hanchongzan.period': { tp: 'timeb', hx: 'hxpda', id: "com.hanchongzan.period.girl" },  //姨妈来咯
  'com.hanchongzan.book': { tp: 'timeb', hx: 'hxpda', id: "com.hanchongzan.book.vip" }, //闪电记账
  'SoundLab': { tp: 'timeb', hx: 'hxpda', id: "8001" },  //合声-音乐制作
  'ECGANALYZER': { tp: 'timea', hx: 'hxpda', id: "com.wms.hrv.yearlyfamilysharing" }, //ECG+
  'com.RuoG.Pixiu': { tp: 'timea', hx: 'hxpda', id: "com.RuoG.Pixiu.VIPYear" }, //貔貅记账
  'com.ideack.BusinessCard': { tp: 'timeb', hx: 'hxpda', id: "BusinessCardVipPerpetual" }, //名片夹
  'com.ideack.MagicAudio': { tp: 'timeb', hx: 'hxpdb', id: "MagicAudioPermanent" }, //音乐剪辑
  'DuChuangZhe': { tp: 'timea', hx: 'hxpda', id: "org.zrey.du.main" }, //独创者
  'PhotoWhite': { tp: 'timeb', hx: 'hxpda', id: "org.zrey.photowhite.flash_lifetime" },  //印白相册
  'Pure%20Tuber%20Pro': { tp: 'timeb', hx: 'hxpda', id: "lifetime" },  //PureTuberPro
  'FETreeVideoChange': { tp: 'timeb', hx: 'hxpda', id: "com.dj.videototext.forever" },  //视频转文字
  '%E5%B0%8F%E5%B0%8F%E7%9B%B8%E6%9C%BA%E5%A4%A7%E5%B8%88': { tp: 'timeb', hx: 'hxpda', id: "com.ai.merge.forever.vip" },  //乐颜
  'FoodIdentificationTool': { tp: 'timeb', hx: 'hxpda', id: "20002" },  //剂查查
  'com.qingcheng.seal.Seal': { tp: 'timeb', hx: 'hxpda', id: "com.qingcheng.seal.Seal.premium.forever" },  //印章制作
  'com.geekapp.VoiceTranslation': { tp: 'timeb', hx: 'hxpda', id: "VoiceTranslatorPerpetual" },  //出国翻译官
  'com.idealityapp.VideoEditing': { tp: 'timeb', hx: 'hxpda', id: "MagicVideo_Vip_Permanent" },  //魔影-视频剪辑
  'YinzhangMaster': { tp: 'timeb', hx: 'hxpda', id: "com.xiaoqi.seal.forever" },  //印章大师
  'com.cuilingshi.flipclock': { tp: 'timeb', hx: 'hxpda', id: "FlipClockProVersion" },  //翻页时钟
  'com.maine.aifill': { tp: 'timeb', hx: 'hxpda', id: "com.maine.aifill.unlimited" },  //AI FILL-智能填充.换衣/换背景
  'Graphionica': { tp: 'timea', hx: 'hxpda', id: "premium_year" },  //Graphionica
  'AIAssistant': { tp: 'timea', hx: 'hxpda', id: "AIchat_1w_7.99_trial" },  //AIAssistant
  'MonitorPlus': { tp: 'timeb', hx: 'hxpda', id: "com.unhonin.MonitorPlus.proversion" },  //Monitor+
  'MessageHold': { tp: 'timea', hx: 'hxpda', id: "com.messagehold.forever" },  //拦截盾
  'Guitar%20Gravitas': { tp: 'timea', hx: 'hxpda', id: "GuitarGravitasChordsScalesArpeggiosLessons" },  //GuitarGravitas
  'com.casttv.remotetv': { tp: 'timeb', hx: 'hxpda', id: "liftetime2" }, //TVRemote电视遥控器
  'WallpaperWidget': { tp: 'timea', hx: 'hxpda', id: "com.widget.theme.yearly.3dayfree" }, //壁纸主题(需试用)
  'ProREC': { tp: 'timea', hx: 'hxpda', id: "ProAudioCamera_Annual" }, //ProREC-相机
  'TypeOn%20Keyboard': { tp: 'timeb', hx: 'hxpda', id: "com.hanchongzan.book.vip" }, //TypeOn
  'PhotoCollagePro': { tp: 'timeb', hx: 'hxpda', id: "PHOTABLE_PREMIUM" }, //Photable-腹肌P图神器
  'com.alphamobiletech.bodyApp': { tp: 'timeb', hx: 'hxpda', id: "Bodyapp_Forever" }, //Bodyapp-身材修图软件
  'com.alphamobiletech.facey': { tp: 'timeb', hx: 'hxpda', id: "Facey_Forever" }, //Facey-专业彩妆P图神器
  'Packet': { tp: 'timeb', hx: 'hxpda', id: "com.aaaalab.nepacket.iap.full" }, //HTTPS抓包
  'AllMyBatteries': { tp: 'timeb', hx: 'hxpda', id: "AllMyBatteries_Ultimate" }, //AllMyBatteries-电池管家
  'VDIT': { tp: 'timeb', hx: 'hxpda', id: "me.imgbase.videoday.profeaturesLifetime" }, //VDIT-视频转换
  'CodeSnippet': { tp: 'timea', hx: 'hxpda', id: "it.beatcode.codesnippetpro.annualSubscription" }, //CodeSnippet
  'darkWeb': { tp: 'timea', hx: 'hxpda', id: "dforce_unlock_all_functions" }, //DForce-Safari扩展
  'BookReader': { tp: 'timea', hx: 'hxpda', id: "com.reader.1year" }, //阅读器-小说阅读器
  'BeatStation': { tp: 'timea', hx: 'hxpda', id: "BS_Pro_Yearly" }, //BeatStation-节奏工作站
  'FastPlayer': { tp: 'timea', hx: 'hxpda', id: "VideoPlayer_ProVersion" }, //万能播放器
  'SimpleNotation': { tp: 'timeb', hx: 'hxpda', id: "com.xinlin.notation.once" }, //简谱大师
  'ChordMaster': { tp: 'timeb', hx: 'hxpda', id: "com.chordMaster.once" }, //MusicTotor-识谱大师
  'Xfuse': { tp: 'timeb', hx: 'hxpda', id: "com.xfuse.ProVision" }, //磁力宅播放器
  'com.BertonYc.ScannerOCR': { tp: 'timeb', hx: 'hxpda', id: "Scanner_Subscibe_Permanent" }, //万能扫描王
  'HRV': { hx: 'hxpdc', id: "com.stress.test.record.yearly" },  //解压小橘子(需试用)
  'iVCam': { tp: 'timeb', hx: 'hxpda', id: "ivcam.full" },//iVCam-电脑摄像头
  'RBrowser': { tp: 'timea', hx: 'hxpda', id: "com.mm.RBroswer.product11" }, //R浏览器(需试用)
  'Filterra': { tp: 'timeb', hx: 'hxpda', id: "com.filterra.wtonetimepurchase" },//Filterra-照片编辑器
  'MOLDIV': { tp: 'timeb', hx: 'hxpda', id: "com.jellybus.Moldiv.IAP.PRO7999" },//MOLDIV-视频/照片编辑
  'PICSPLAY': { tp: 'timea', hx: 'hxpda', id: "com.jellybus.PicsPlay2.IAP.PRO5999" },//PICSPLAY-照片编辑
  'Rookie': { tp: 'timea', hx: 'hxpda', id: "com.jellybus.Rookie.IAP.PRO5999" },//RKCAM-照片编辑
  'MoneyWiz': { tp: 'timea', hx: 'hxpda', id: "com.moneywiz.personalfinance.1year" }, //MoneyWiz-个人财务
  'qxzs': { tp: 'timeb', hx: 'hxpda', id: "yongjiu" },//心率广播
  'Overdrop': { tp: 'timeb', hx: 'hxpda', id: "com.weather.overdrop.forever" }, //Overdrop-天气预报
  'Boom': { tp: 'timeb', hx: 'hxpda', id: "com.globaldelight.iBoom.LifetimeDiscountPack" }, //Boom-感受音乐
  'PDFReaderPro%20Free': { tp: 'timeb', hx: 'hxpda', id: "com.pdfreaderpro.free.member.all_access_pack_permanent_license.001" }, //PDFReaderProFree
  'VideoHelper': { tp: 'timeb', hx: 'hxpda', id: "vip_service" }, //媒关系
  'Digital%20Planner': { tp: 'timea', hx: 'hxpda', id: "com.softwings.DigitalPlanner.1year" }, //电子手帐
  'SuperMandarin': { tp: 'timea', hx: 'hxpda', id: "pth_vip_year" }, //普通话水平测试
  'SuperQuestion': { tp: 'timea', hx: 'hxpda', id: "qtzs_vip_year" }, //真题全刷
  'SuperElves': { tp: 'timeb', hx: 'hxpda', id: "com.SuperElves.Answer.Forever" }, //答案精灵
  'SuperDriving': { tp: 'timeb', hx: 'hxpda', id: "jiakao_vip_forever" }, //驾考学典
  'Pollykann': { tp: 'timeb', hx: 'hxpda', id: "vip.forever.pollykann" }, //小鹦看看
  'JCCalendar': { tp: 'timeb', hx: 'hxpda', id: "com.sjc.calendar.vip.lifelong" }, //简约日历
  'com.yanxia.ChsMedical': { tp: 'timeb', hx: 'hxpda', id: "VIPUser" }, //中医精华
  'SuperPointer': { tp: 'timeb', hx: 'hxpda', id: "com.SuperPointer.Location.Forever" }, //海拔指南针
  'SnakeReader': { tp: 'timea', hx: 'hxpda', id: "com.lyran.snakescanner.premium18" }, //开卷阅读
  'FourthPPT': { tp: 'timeb', hx: 'hxpda', id: "com.FourthPPT.Mobile.Forever" }, //PPT制作软件
  'OneExtractor': { tp: 'timeb', hx: 'hxpda', id: "com.OneExtractor.Video.Forever" }, //视频提取器
  'com.Colin.Colors': { tp: 'timea', hx: 'hxpda', id: "com.colin.colors.annualVIP" }, //搜图
  'PhotosSorter': { tp: 'timeb', hx: 'hxpda', id: "sorter.pro.ipa" }, //Sorter-相册整理
  'intolive': { tp: 'timea', hx: 'hxpda', id: "me.imgbase.intolive.proSubYearly" }, //intolive-实况壁纸制作器
  'MyAlbum': { tp: 'timeb', hx: 'hxpda', id: "com.colin.myalbum.isUpgradeVip" }, //Cleaner-照片管理
  'VideoEditor': { tp: 'timeb', hx: 'hxpda', id: "com.god.videohand.alwaysowner" }, //VideoShot
  'ShotOn': { tp: 'timeb', hx: 'hxpda', id: "com.colin.shoton.forevervip" }, //ShotOn
  'TimeCut': { tp: 'timea', hx: 'hxpda', id: "com.floatcamellia.hfrslowmotion.forevervip" },  //TimeCut
  'com.floatcamellia.motiok': { tp: 'timea', hx: 'hxpda', id: "com.floatcamellia.motiok.vipforever" },  //Hype_Text-AE特效片制作
  'GreetingScanner': { tp: 'timea', hx: 'hxpda', id: "com.alphaplus.greetingscaner.w.b" },  //扫描识别王
  'FancyCamPlus': { tp: 'timea', hx: 'hxpda', id: "com.alphaplus.fancycam.year.198" },  //悦颜相机
  'Again': { tp: 'timeb', hx: 'hxpda', id: "com.owen.again.profession" },  //Again-稍后阅读器
  'com.damon.dubbing': { tp: 'timea', hx: 'hxpda', id: "com.damon.dubbing.vip12" },  //有声英语绘本
  'ZHUBEN': { tp: 'timea', hx: 'hxpda', id: "com.xiaoyu.yue" },  //有声英语绘本
  'XIAOTangHomeParadise': { tp: 'timea', hx: 'hxpda', id: "com.yuee.mo2" },  //鸿海幼儿启蒙
  'film': { tp: 'timea', hx: 'hxpda', id: "pro_auto_subscribe_year_ovs" },  //胶卷相机
  'Muza': { tp: 'timea', hx: 'hxpda', id: "com.appmuza.premium_year" },  //Muza-修图APP
  'StandbyWidget': { tp: 'timed', hx: 'hxpda', id: "com.standby.idream.year.68", ids: "standbyus.nonconsume.missingyou" },  //StandBy_Us-情侣定位
  'Mango6Minute': { tp: 'timea', hx: 'hxpda', id: "576170870" },  //6分钟英语
  'Photo%20Cutout': { tp: 'timea', hx: 'hxpda', id: "com.icepine.allyear" },  //轻松扣图
  'WasteCat': { tp: 'timeb', hx: 'hxpda', id: "dev.sanjin.WasteCat.PermanentVip" },  //垃圾贪吃猫
  'MeowTalk': { tp: 'timea', hx: 'hxpda', id: "meowtalk.month.basic.autorenewable.subscription" },  //喵说
  'habitdot': { tp: 'timeb', hx: 'hxpda', id: "habitdots_pro_forever" },  //习惯点点
  'stretchworkout': { tp: 'timea', hx: 'hxpda', id: "com.abishkking.premiumYearStretch" },  //拉伸运动
  'com.uzstudio.avenuecast.ios': { tp: 'timeb', hx: 'hxpda', id: "1001" },  //凡视知音
  'CongZhenBaZi': { tp: 'timeb', hx: 'hxpda', id: "vip_forever_78" },  //八字排盘-从真版
  'CongZhenQiMen': { tp: 'timea', hx: 'hxpda', id: "cn.congzhen.CongZhenQiMen.yearlyplan" },  //奇门遁甲
  'ProFit': { tp: 'timea', hx: 'hxpda', id: "com.maxty.gofitness.yearlyplan" },  //ProFit锻炼计划
  'GPSMaker': { tp: 'timea', hx: 'hxpda', id: "theodolite_vip_year" },  //指南针定位
  'Smoke': { tp: 'timea', hx: 'hxpda', id: "smoke19870727" },  //今日香烟
  'AppAlarmIOS': { tp: 'timea', hx: 'hxpda', id: "alarm.me.vip.year.tier1" },  //Me+
  'Tinglee': { tp: 'timea', hx: 'hxpdb', id: "vip.forever.tinglee" },  //英语听听
  'NoteKeys': { tp: 'timea', hx: 'hxpda', id: "notekeys_access_weekly" },  //五线谱
  'SheetMusicPro': { tp: 'timea', hx: 'hxpda', id: "sheetmusicpro.yearwithtrial" },  //乐谱吧
  'ProtractorEdge': { tp: 'timea', hx: 'hxpda', id: "ProtracatorEdge.PremiumAccess" },  //量角器
  'Piano%20Plus': { tp: 'timea', hx: 'hxpda', id: "kn_access_weekly" },  //Piano Plus
  'Notation%20Pad': { tp: 'timea', hx: 'hxpda', id: "np_access_weekly" },  //Notation Pad
  'Guitar%20Notation': { tp: 'timea', hx: 'hxpda', id: "gn_access_weekly" },  //Guitar Notation
  'Piano%20Fantasy': { tp: 'timea', hx: 'hxpda', id: "com.lotuz.PianoFantasy.weekwithtrail" },  //钢琴幻想
  'Piano%20Rush': { tp: 'timea', hx: 'hxpda', id: "com.lotuz.PianoPro.weekwithtrail" },  //钢琴大师
  'com.richads.saucyart': { tp: 'timea', hx: 'hxpda', id: "com.richads.saucyart.sub.quarterly_29.99" },  //Perky
  'SurveyorPro': { tp: 'timea', hx: 'hxpda', id: "com.celiangyuan.SurveyorPro.OneYear" },  //测量员Pro
  'com.ydatong.dingdone': { tp: 'timeb', hx: 'hxpda', id: "com.ydatong.dingdone.vip.forever" },  //叮当代办
  'Dial': { tp: 'timea', hx: 'hxpda', id: "2104" },  //T9拨号
  'qxwp%20copy': { tp: 'timed', hx: 'hxpda', id: "com.chowjoe.wp2free.year.pro", ids: "com.chowjoe.wp2free.coin.70" },  //壁纸
  'LingLongShouZ': { tp: 'timea', hx: 'hxpda', id: "zhenwushouzhangQuarterlyPlus" },  //Cute手帐软件
  'MediaEditor': { tp: 'timeb', hx: 'hxpda', id: "alwaysowner" },  //剪影(需试用)
  'com.gostraight.smallAccountBook': { tp: 'timeb', hx: 'hxpda', id: "ForeverVIPPayment" },  //iCost记账(需要购买)
  'ZJTBiaoGe': { tp: 'timea', hx: 'hxpda', id: "zhangjt.biaoge.monthvip" },  //表格手机版
  'MiniMouse': { tp: 'timea', hx: 'hxpda', id: "minimouse_vip_1year" },  //MiniMouse
  'Paste%20Keyboard': { tp: 'timea', hx: 'hxpda', id: "com.keyboard.1yetr" },  //复制和粘贴键盘
  'EWA': { tp: 'timea', hx: 'hxpda', id: "com.ewa.renewable.subscription.year8" },  //EWA-学习外语
  'BuBuSZ': { tp: 'timea', hx: 'hxpda', id: "quaVersion" },  //BuBu手帐
  'com.icandiapps.nightsky': { tp: 'timea', hx: 'hxpda', id: "com.icandiapps.ns4.annual" },  //星空
  'Wallpapers': { tp: 'timea', hx: 'hxpda', id: "wallpaperworld.subscription.yearly.12.notrial" },  //Wallpaper Tree壁纸
  'com.yumiteam.Kuki.ID': { tp: 'timea', hx: 'hxpda', id: "com.yumiteam.Kuki.ID.2" },  //PicsLeap-美飞
  'com.quangtm193.picpro': { tp: 'timea', hx: 'hxpda', id: "com.quangtm193.picpro1year" },  //PicPro-人工智能照片编辑器
  'Storybeat': { tp: 'timea', hx: 'hxpda', id: "yearly_1" },  //Storybeat
  'SmartGym': { tp: 'timea', hx: 'hxpda', id: "com.smartgymapp.smartgym.premiumuserworkoutsyearly" },  //SmartGym
  'Prookie': { tp: 'timea', hx: 'hxpda', id: "prookie.month.withtrial.0615" },  //AI灵绘
  'BodyTune': { tp: 'timea', hx: 'hxpda', id: "Bodypro1" },  //BodyTune-瘦身相机
  'killer.sudoku.free.brain.puzzle': { tp: 'timea', hx: 'hxpda', id: "ks.i.iap.premium" },  //杀手数独
  'sudoku.puzzle.free.game.brain': { tp: 'timea', hx: 'hxpda', id: "sudoku.i.sub.vvip.p1y" },  //数独
  'One%20Markdown': { tp: 'timeb', hx: 'hxpda', id: "10012" },  //One Markdown
  'MWeb%20iOS': { tp: 'timeb', hx: 'hxpda', id: "10001" },  //MWeb-编辑器/笔记/发布
  'NYMF': { tp: 'timea', hx: 'hxpda', id: "com.nymf.app.premium_year" },  //Nymf艺术照片
  'com.lockwidt.cn': { tp: 'timea', hx: 'hxpda', id: "com.lockwidt.cn.member" },  //壁纸16
  'Utsuki': { tp: 'timea', hx: 'hxpda', id: "KameePro" },  //梦见账本
  'one%20sec': { tp: 'timea', hx: 'hxpda', id: "wtf.riedel.one_sec.pro.annual.individual" },  //one sec-番茄钟
  'com.instagridpost.rsigp': { tp: 'timea', hx: 'hxpda', id: "com.GridPost.oneyearplus" },  //九宫格切图
  'com.skysoft.removalfree': { tp: 'timea', hx: 'hxpda', id: "com.skysoft.removalfree.discount.unlimitedaccess" },  //神奇消除笔-图片消除
  'MGhostLens': { tp: 'timea', hx: 'hxpda', id: "com.ghostlens.premium1month" },  //魔鬼相机
  'Luminous': { tp: 'timea', hx: 'hxpda', id: "com.spacemushrooms.weekly" },  //光影修图
  'PerfectImage': { tp: 'timea', hx: 'hxpda', id: "Perfect_Image_VIP_Yearly" },  //完美影像(需试用)
  'moment': { tp: 'timea', hx: 'hxpda', id: "PYJMoment2" },  //片羽集(需试用)
  'HiddenBox': { tp: 'timec', hx: 'hxpdb', version: "1" },//我的书橱
  'Synthesizer': { tp: 'timea', hx: 'hxpda', id: "com.qingxiu.synthesizer.mon" },  //语音合成
  'ContractMaster': { tp: 'timea', hx: 'hxpda', id: "com.qingxiu.contracts.monthly" },  //印象全能王
  'MyDiary': { tp: 'timea', hx: 'hxpda', id: "diary.yearly.vip.1029" },  //我的日记
  'Translator': { tp: 'timea', hx: 'hxpda', id: "trans_sub_week" },  //翻译家
  'Idea': { tp: 'timea', hx: 'hxpda', id: "top.ideaapp.ideaiOS.membership.oneyear" },  //灵感(需试用)
  'ZeroTuImg': { tp: 'timea', hx: 'hxpda', id: "ZeroTuImgPlus" },  //Zero壁纸
  'com.traveltao.ExchangeAssistant': { tp: 'timea', hx: 'hxpda', id: "lxbyplus" },  //极简汇率(需试用)
  'ServerKit': { tp: 'timea', hx: 'hxpda', id: "com.serverkit.subscription.year.a" },  //服务器助手
  'RawPlus': { tp: 'timea', hx: 'hxpda', id: "com.dynamicappdesign.rawplus.yearlysubscription" },  //Raw相机
  'OrderGenerator': { tp: 'timeb', hx: 'hxpda', id: "oder_pay_forever" },  //订单生成
  'GenerateAllOrdersTool': { tp: 'timea', hx: 'hxpda', id: "Order_Vip_010" },  //订单生成器(需试用)
  'MoMoShouZhang': { tp: 'timea', hx: 'hxpda', id: "shunchangshouzhangQuarterlyPlus" },  //卡卡手账(需试用)
  'Mindkit': { tp: 'timeb', hx: 'hxpda', id: "mindkit_permanently" },  //Mindkit
  'Miary': { tp: 'timeb', hx: 'hxpda', id: "lifetime_sub" },  //Miary-记录日记
  'BingQiTools': { tp: 'timea', hx: 'hxpda', id: "bingqi_e2" },  //猫狗翻译
  'AnyDown': { tp: 'timeb', hx: 'hxpda', id: "com.xiaoqi.down.forever" },  //AnyDown-下载神器
  'Reader': { tp: 'timeb', hx: 'hxpda', id: "com.xiaoqi.reader.forever" },  //爱阅读-TXT阅读器
  'com.bestmusicvideo.formmaster': { tp: 'timea', hx: 'hxpda', id: "com.form.1yearvip" },  //表格大师
  'ExcelSpreadSheetsWPS': { tp: 'timea', hx: 'hxpda', id: "com.turbocms.SimpleSpreadSheet.viponeyear" },  //简易表格(需试用)
  'XinQingRiJi': { tp: 'timea', hx: 'hxpda', id: "zhiwenshouzhangQuarterlyPlus" },  //猫咪手帐(需试用)
  'Nutrilio': { tp: 'timea', hx: 'hxpda', id: "net.nutrilio.one_year_plus" },  //Nutrilio
  'AIHeader': { tp: 'timea', hx: 'hxpda', id: "com.ai.avatar.maker.month.3dayfree" },  //AI头像馆
  'MoodTracker': { tp: 'timeb', hx: 'hxpda', id: "co.vulcanlabs.moodtracker.lifetime2" },  //ChatSmith(美区)
  'com.dandelion.Routine': { tp: 'timeb', hx: 'hxpda', id: "membership" },  //小日常
  'YSBrowser': { tp: 'timeb', hx: 'hxpda', id: "com.ys.pro" },  //亚瑟浏览器
  'org.zrey.metion': { tp: 'timed', hx: 'hxpda', id: "org.zrey.metion.pro", ids: "org.zrey.metion.main" },  //Metion-基础+Pro
  'ZenJournal': { tp: 'timea', hx: 'hxpda', id: "zen_pro" },  //禅记
  'com.visualmidi.app.perfectpiano.Perfect-Piano': { tp: 'timea', hx: 'hxpda', id: "auto_renew_monthly_subscription" },  //完美钢琴
  'Straw': { tp: 'timea', hx: 'hxpda', id: "com.1year.eyedropper" },  //吸管Pro-取色
  'vibee': { tp: 'timea', hx: 'hxpda', id: "com.vibee.year.bigchampagne" },  //vibee-氛围歌单小组件
  'DrumPads': { tp: 'timeb', hx: 'hxpda', id: "com.gismart.drumpads.pro_lifetime_30" },  //BeatMakerGo-打碟机/打击垫/DJ鼓机
  'WaterMaskCamera': { tp: 'timea', hx: 'hxpda', id: "com.camera.watermark.yearly.3dayfree" },  //徕卡水印相机
  'SymbolKeyboard': { tp: 'timeb', hx: 'hxpda', id: "fronts.keyboard.singingfish.one" },  //Fonts花样字体
  'com.kuaijiezhilingdashi.appname': { tp: 'timea', hx: 'hxpda', id: "com.othermaster.yearlyvip" },  //快捷指令库
  'LogInput': { tp: 'timea', hx: 'hxpda', id: "com.logcg.loginput" },  //落格输入法
  'HandNote': { tp: 'timeb', hx: 'hxpda', id: "permanent_membership" },  //千本笔记
  'Kilonotes': { tp: 'timea', hx: 'hxpda', id: "kipa_kilonotes_quarter_subscription" },  //千本笔记
  'YiJianKouTu': { tp: 'timea', hx: 'hxpda', id: "XiChaoYiJianKouTuPlus" },  //一键抠图
  'FileArtifact': { tp: 'timeb', hx: 'hxpda', id: "com.shengzhou.fileartifact.permanent" },  //文晓生
  'Wext': { tp: 'timeb', hx: 'hxpda', id: "com.lmf.wext.life" },  //万源阅读
  'ColorCapture': { tp: 'timeb', hx: 'hxpda', id: "10001" },  //色采
  'xTerminal': { tp: 'timea', hx: 'hxpda', id: "xterminal.pro2" },  //xTerminal
  'Fotoz': { tp: 'timeb', hx: 'hxpda', id: "com.kiddy.fotoz.ipa.pro" },  //Fotoz - 图片一键下载
  'TheLastFilm': { tp: 'timea', hx: 'hxpda', id: "Filmroll_Pro_1Year" },  //最后一卷胶片(需订阅一次)
  'Motivation': { tp: 'timea', hx: 'hxpda', id: "com.monkeytaps.motivation.premium.year3" },  //Motivation
  'io.sumi.GridDiary2': { tp: 'timea', hx: 'hxpda', id: "io.sumi.GridDiary.pro.annually" },  //格志
  'com.leapfitness.fasting': { tp: 'timea', hx: 'hxpda', id: "com.leapfitness.fasting.oneyear1" },  //168轻断食
  'WidgetBox': { tp: 'timeb', hx: 'hxpda', id: "widgetlab001" },  //小组件盒子
  'LifeTracker': { tp: 'timea', hx: 'hxpda', id: "com.dk.lifetracker.yearplan" },  //Becord生活记录
  'imgplay': { tp: 'timea', hx: 'hxpda', id: "me.imgbase.imgplay.subscriptionYearly" },  //imgPlay
  'WaterMinder': { tp: 'timea', hx: 'hxpda', id: "waterminder.premiumYearly" },  //WaterMinder喝水APP
  'HashPhotos': { tp: 'timeb', hx: 'hxpda', id: "com.kobaltlab.HashPhotos.iap.proLifetime" },  //HashPhotos
  'SilProject': { tp: 'timea', hx: 'hxpda', id: "com.sm.Alina.Pro" },  //Alina米克锁屏—
  'com.chenxi.shanniankapian': { tp: 'timea', hx: 'hxpda', id: "com.chenxi.shannian.superNian" },  //闪念
  'com.risingcabbage.pro.camera': { tp: 'timea', hx: 'hxpda', id: "com.risingcabbage.pro.camera.yearlysubscription" },  //ReLens相机
  'co.bazaart.patternator': { tp: 'timea', hx: 'hxpda', id: "Patternator_Lock_Screen_Monthly" },  //拍特内头
  'cn.linfei.SimpleRecorder': { tp: 'timea', hx: 'hxpda', id: "cn.linfei.SimpleRecorder.Plus" },  //录音机
  'com.maliquankai.appdesign': { tp: 'timec', hx: 'hxpdb', version: "1.5.8" },  //PutApp-应用收集
  'BestColor': { tp: 'timea', hx: 'hxpda', id: "com.bestColor.tool.month" },  //小红图
  'com.decibel.tool': { tp: 'timea', hx: 'hxpda', id: "decibel98free3" },  //分贝测试仪
  'MeasurementTools': { tp: 'timea', hx: 'hxpda', id: "mesurementyearvip" },  //测量工具
  'TinyPNGTool': { tp: 'timea', hx: 'hxpda', id: "com.tinypngtool.tool.weekvip" },  //TinyPNG
  'IconChange': { tp: 'timea', hx: 'hxpda', id: "iconeryearvip" },  //iconser图标更换
  'com.floatcamellia.motionninja': { tp: 'timea', hx: 'hxpda', id: "com.floatcamellia.motionninja.yearlyvip" },  //MotionNinja
  'com.iuuapp.audiomaker': { tp: 'timed', hx: 'hxpda', id: "com.iuuapp.audiomaker.cloud.year", ids: "com.iuuapp.audiomaker.removeads" },  //音频剪辑
  'com.biggerlens.photoretouch': { tp: 'timeb', hx: 'hxpda', id: "com.photoretouch.SVIP" },  //PhotoRetouch消除笔P图
  'com.macpaw.iosgemini': { tp: 'timea', hx: 'hxpda', id: "com.macpaw.iosgemini.month.trial" },  //GeminiPhotos
  'com.mematom.ios': { tp: 'timea', hx: 'hxpda', id: "MMYear" },  //年轮3
  'com.LuoWei.aDiary': { tp: 'timea', hx: 'hxpda', id: "com.LuoWei.aDiary.yearly0" },  //aDiary-待办日记本
  'com.zerone.hidesktop': { tp: 'timeb', hx: 'hxpda', id: "com.zerone.hidesktop.forever" },  //iScreen-桌面小组件主题美化
  'MagicWidget': { tp: 'timeb', hx: 'hxpda', id: "cf__forever_0_4.7.1" },  //ColorfulWidget—小组件
  'com.tasmanic.capture': { tp: 'timea', hx: 'hxpda', id: "CTPCAPTUREYEARLY" },  //3DScanner-绘制/测量平面图
  'com.readdle.CalendarsLite': { tp: 'timea', hx: 'hxpda', id: "com.readdle.CalendarsLite.subscription.year20trial7" },  //Calendars-日历/计划
  'com.readdle.ReaddleDocsIPad': { tp: 'timea', hx: 'hxpda', id: "com.readdle.ReaddleDocsIPad.subscription.month10_allusers" },  //Documents
  'com.1ps.lovetalk': { tp: 'timea', hx: 'hxpda', id: "com.1ps.lovetalk.normal.weekly" },  //高级恋爱话术
  'tech.miidii.MDClock': { tp: 'timeb', hx: 'hxpda', id: "tech.miidii.MDClock.pro" },  //谜底时钟
  'com.floatcamellia.prettyup': { tp: 'timeb', hx: 'hxpda', id: "com.floatcamellia.prettyup.onetimepurchase" },  //PrettyUp视频P图
  'com.zijayrate.analogcam': { tp: 'timea', hx: 'hxpda', id: "com.zijayrate.analogcam.vipforever10" },  //oldroll复古相机
  'net.daylio.Daylio': { tp: 'timea', hx: 'hxpda', id: "net.daylio.one_year_pro.offer_initial" },  //Daylio-日记
  'com.palmmob.pdfios': { tp: 'timea', hx: 'hxpda', id: "com.palmmob.pdfios.168" },  //图片PDF转换器
  'com.palmmob.scanner2ios': { tp: 'timea', hx: 'hxpda', id: "com.palmmob.scanner2ios.396" },  //文字扫描
  'com.palmmob.officeios': { tp: 'timea', hx: 'hxpda', id: "com.palmmob.officeios.188" },  //文档表格编辑
  'com.palmmob.recorder': { tp: 'timea', hx: 'hxpda', id: "com.palmmob.recorder.198" },  //录音转文字
  'com.7color.newclean': { tp: 'timea', hx: 'hxpda', id: "com.cleaner.salesyear" },  //手机清理
  'Habbit': { tp: 'timea', hx: 'hxpda', id: "HabitUpYearly" },  //习惯清单
  'com.dbmeterpro.dB-Meter-Free': { tp: 'timea', hx: 'hxpda', id: "com.dbmeterpro.premiumModeSubscriptionWithTrial" },  //dBMeter-分贝仪(专业版)
  'com.vstudio.newpuzzle': { tp: 'timea', hx: 'hxpda', id: "com.vstudio.newpuzzle.yearlyVipFreetrail.15_99" },  //拼图酱
  'com.ziheng.OneBox': { tp: 'timeb', hx: 'hxpda', id: "com.ziheng.OneBox" },  //Pandora管理订阅
  'ChickAlarmClock': { tp: 'timeb', hx: 'hxpda', id: "Lifetime_Promotion" },  //小鸡专注
  'com.CalculatorForiPad.InternetRocks': { tp: 'timea', hx: 'hxpda', id: "co.airapps.calculator.year" },  //计算器Air
  'SuperWidget': { tp: 'timea', hx: 'hxpda', id: "com.focoslive" },  //PandaWidget小组件
  'Picsew': { tp: 'timeb', hx: 'hxpdb', id: "com.sugarmo.ScrollClip.pro"},  //Picsew截长图3.9.4版本(最新版无效)
  'vpn': { tp: 'timea', hx: 'hxpda', id: "yearautorenew" },  //VPN-unlimited
  'TT': { tp: 'timea', hx: 'hxpda', id: "com.55panda.hicalculator.year_sub" },  //TT_私密相册管家
  'Focos': { tp: 'timea', hx: 'hxpda', id: "com.focos.1w_t4_1w" },  //Focos
  'ProKnockOut': { tp: 'timed', hx: 'hxpda', id: "com.knockout.SVIP.50off", ids: "com.knockout.1year.AIVIP" },  //ProKnockOut
  'com.teadoku.flashnote': { tp: 'timea', hx: 'hxpda', id: "pro_ios_ipad_mac" }  //AnkiNote
};

// ===== 自动App分组 =====
const autoMap = {
  year: [
    'com.internet-rocks',  //Air Apps System
    'co.airapps'  //Air Apps System
  ],
  yearly: [
    'com.pocket'  //NetPocket Co
  ],
  yearlysubscription: [
    'solutions.wzp'  //Air Apps System 
  ],
  lifetime: [
    'co.vulcanlabs'  //Vulcan Labs Company Limited
  ],
  forever: [
    
  ]
};

// ===== 需要expires为null的App =====
const nullExpireApps = [];

// ===== 购买时间 =====
const purchase = "2025-09-09T09:09:09Z";
// ===== 到期时间 =====
const expiration = "2099-09-09T09:09:09Z";

// ===== 自动生成订阅ID =====
const AutoID = {
  year: (bid) => `${bid}.year`,
  yearly: (bid) => `${bid}.yearly`,
  yearlysubscription: (bid) => `${bid}.yearlysubscription`,
  lifetime: (bid) => `${bid}.lifetime`,
  forever: (bid) => `${bid}.Forever`
};

// ===== 自动注入list =====
for (const type in autoMap) {
  autoMap[type].forEach(key => {
    if (!list[key]) {
      const isForever = ['lifetime', 'forever'].includes(type);
      list[key] = {
        tp: isForever ? 'timeb' : 'timea',
        hx: 'hxpda',
        auto: true,
        autoType: type
      };
    }
  });
}

// ===== 工具函数 =====
function rand(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function format(time) {
  return time.toISOString().replace(/\.\d{3}Z$/, 'Z').replace('T', ' ').replace('Z', ' Etc/GMT');
}

function formatPST(time) {
  let pst = new Date(time.getTime() - 7 * 3600 * 1000);
  return pst.toISOString().replace(/\.\d{3}Z$/, 'Z').replace('T', ' ').replace('Z', ' America/Los_Angeles');
}

// ===== 时间初始化 =====
let now = new Date(purchase);
let start = new Date(now.getTime() - 60 * 1000);
let expire = new Date(now.getTime() + 3650 * 86400000);
let fixedExpire = new Date(expiration);

// ===== transaction id =====
let transactionid = "49000" + rand(10);

// ===== 构建订阅 =====
function build(productId, purchaseTime, expireTime, tp, useExpireArg, forceNullExpire) {
  if (!(purchaseTime instanceof Date) || isNaN(purchaseTime)) purchaseTime = new Date();
  if (!(expireTime instanceof Date) || isNaN(expireTime)) expireTime = new Date(purchaseTime.getTime() + 86400000);
  let finalExpire = useExpireArg ? expireTime : fixedExpire;
  let origPurchase = new Date(purchaseTime.getTime() - 1000);
  let item = {
    quantity: "1",
    transaction_id: transactionid,
    original_transaction_id: transactionid,
    purchase_date: format(purchaseTime),
    purchase_date_ms: String(purchaseTime.getTime()),
    purchase_date_pst: formatPST(purchaseTime),
    product_id: productId,
    is_trial_period: "false",
    is_in_intro_offer_period: "false",
    in_app_ownership_type: "PURCHASED",
    web_order_line_item_id: "49000" + rand(10),
    original_purchase_date: format(origPurchase),
    original_purchase_date_ms: String(origPurchase.getTime()),
    original_purchase_date_pst: formatPST(origPurchase)
  };
  if (tp === "timea" || tp === "timed") {
    item.expires_date = format(finalExpire);
    item.expires_date_ms = String(finalExpire.getTime());
    item.expires_date_pst = formatPST(finalExpire);
  }
  if (tp === "timeb" && forceNullExpire) {
    item.expires_date = null;
    item.expires_date_ms = null;
    item.expires_date_pst = null;
  }
  return item;
}

function buildHistory(productId, tp, strict, forceNullExpire) {
  let pTime = now;
  if (strict === "auto") {
    pTime = new Date();
  } else if (strict === "fix") {
    pTime = new Date(purchase);
  }
  if (!strict) {
    return [build(productId, pTime, expire, tp, false, forceNullExpire)];
  }
  let oneYearMs = 365 * 86400000;
  let prevPurchase = new Date(pTime.getTime() - oneYearMs);
  let prevExpire = new Date(prevPurchase.getTime() + oneYearMs);
  let prevTp = tp === "timeb" ? "timea" : tp;
  return [
    build(productId, prevPurchase, prevExpire, prevTp, true, forceNullExpire),
    build(productId, pTime, expire, tp, true, forceNullExpire)
  ];
}

function fakeReceipt() {
  let token = "receipt_" + Date.now() + "_" + Math.random();
  let raw = token + token;
  if (typeof btoa === "function") return btoa(raw);
  if (typeof Buffer !== "undefined") return Buffer.from(raw, "utf8").toString("base64");
  return raw;
}

for (const i in list) {
  const regex = new RegExp("^" + i, "i");
  if (regex.test(ua) || regex.test(bundle_id)) {
    let { tp, hx, id, ids, version, strict, auto, autoType } = list[i];
    if (auto && autoType && AutoID[autoType]) {
      id = AutoID[autoType](bundle_id);
    }
    const forceNull = nullExpireApps.includes(i);
    let history = buildHistory(id, tp, strict, forceNull);
    let latest = history[history.length - 1];
    switch (tp) {
      case "timea":
      case "timeb":
        data = [latest];
        break;
      case "timec":
        data = [];
        break;
      case "timed":
        data = [build(ids, new Date(Number(latest.purchase_date_ms) || now.getTime()), expire, "timed", strict, forceNull), latest];
        break;
    }
    if (hx.includes("hxpda")) {
      ddm.receipt.in_app = data;
      ddm.latest_receipt_info = strict ? history : data;
      ddm.pending_renewal_info = [{
        product_id: id,
        original_transaction_id: transactionid,
        auto_renew_product_id: id,
        auto_renew_status: "1"
      }];
      ddm.latest_receipt = fakeReceipt();
    } else if (hx.includes("hxpdb")) {
      ddm.receipt.in_app = data;
    } else if (hx.includes("hxpdc")) {
      const patch = {
        expires_date_formatted: format(fixedExpire),
        expires_date: String(fixedExpire.getTime()),
        expires_date_formatted_pst: formatPST(fixedExpire),
        purchase_date: format(now),
        purchase_date_ms: String(now.getTime()),
        purchase_date_pst: formatPST(now),
        original_purchase_date: format(start),
        original_purchase_date_ms: String(start.getTime()),
        original_purchase_date_pst: formatPST(start),
        transaction_id: transactionid,
        original_transaction_id: transactionid,
        web_order_line_item_id: "49000" + rand(10),
        product_id: id,
        in_app_ownership_type: "PURCHASED",
        is_trial_period: "false",
        is_in_intro_offer_period: "false"
      };
      ddm.receipt = Object.assign({}, ddm.receipt, patch);
      ddm.latest_receipt_info = Object.assign({}, ddm.receipt);
      ddm.status = 0;
    }
    if (version && version.trim() !== "") {
      ddm.receipt.original_application_version = version;
    }
    anchor = true;
    console.log("✅ iTunes Unlock: Subscription applied (" + i + ") — z3rokaze");
    break;
  }
}

if (!anchor) {
  const inApp = ddm.receipt.in_app || [];
  if (inApp.length > 0) {
    let updated = false;
    for (const item of inApp) {
      if (item.product_id) {
        if (!item.expires_date) {
          console.log('✅ iTunes: Lifetime or non-expiring subscription detected, skipping');
          $done({});
          return;
        }
        const expireTime = item.expires_date_ms ? Number(item.expires_date_ms) : 0;
        if (expireTime < Date.now()) {
          item.expires_date = format(fixedExpire);
          item.expires_date_ms = String(fixedExpire.getTime());
          item.expires_date_pst = formatPST(fixedExpire);
          updated = true;
        }
      }
    }
    if (updated) {
      console.log('⚠️ iTunes: Expired subscription detected, updated expiry date to 2099');
    } else {
      console.log('✅ iTunes: Active subscription detected, no modification needed');
    }
  } else {
    let fallbackId = AutoID.yearly(bundle_id);
    let history = buildHistory(fallbackId, 'timea', false, false);
    let latest = history[0];
    latest.expires_date = format(fixedExpire);
    latest.expires_date_ms = String(fixedExpire.getTime());
    latest.expires_date_pst = formatPST(fixedExpire);
    ddm["receipt"]["in_app"] = [latest];
    ddm["latest_receipt_info"] = [latest];
    ddm["pending_renewal_info"] = [{
      "product_id": fallbackId,
      "original_transaction_id": transactionid,
      "auto_renew_product_id": fallbackId,
      "auto_renew_status": "1"
    }];
    console.log('✅ iTunes Unlock: Fallback subscription applied — z3rokaze (https://github.com/K4Z3X0R/NguyenNgocAnhTu)');
  }
}

var out = { body: JSON.stringify(ddm || {}) };
try {
  if ($response && $response.headers) {
    var h = Object.assign({}, $response.headers);
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
})();