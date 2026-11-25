export type Reign = {
  name: string
  years: string
  phase: string
  summary: string
  marks: string
  style: string
  tags: string[]
}

export const reigns: Reign[] = [
  { name: "顺治", years: "1644—1661", phase: "明清过渡 · 御窑复烧", summary: "战乱后的恢复期，传世御窑器相对少，面貌与晚明联系紧密。重点是理解制度与工艺尚在重建，而不是寻找一个固定“顺治款”。", marks: "署款总体少见，可见本朝年款、干支纪年或纪事文字；无款不能直接排除御用背景。", style: "造型与装饰保留晚明气息，青花、五彩是重要观察对象；器形与题记常比款式更有信息量。", tags: ["过渡面貌", "署款稀少", "青花与五彩", "题记器"] },
  { name: "康熙", years: "1662—1722", phase: "制度恢复 · 釉彩开拓", summary: "御窑生产逐步稳定，青花、五彩与多种高温颜色釉表现突出。豇豆红文房器和规整本朝年款，是建立标准器认识的好入口。", marks: "“大清康熙年制”六字楷书款是重要类型，常见青花书写；另有“康熙御制”等特殊款。", style: "胎釉精进，青花层次清晰；五彩用色明快；豇豆红、郎窑红等铜红釉成为时代亮点。", tags: ["六字楷款", "豇豆红", "康熙五彩", "文房器"] },
  { name: "雍正", years: "1723—1735", phase: "精雅克制 · 仿古创新", summary: "器物比例、修坯与釉色追求精细，既高水平仿宋名窑，也吸收外来器型。粉彩与单色釉常呈现安静、含蓄的审美。", marks: "六字楷书款常见，六字篆书款开始出现；四字“雍正年制”也可见。", style: "造型精雅，胎体与修足规整；粉彩柔和，仿汝、仿官、粉青等釉色成熟，暗花与刻划纹精细。", tags: ["楷篆并见", "粉彩", "仿宋釉", "精修足"] },
  { name: "乾隆", years: "1736—1795", phase: "技术集成 · 繁复壮丽", summary: "御窑技术与品类极盛，仿古、仿材质、转心与套瓶等复杂制作并行；既有繁复彩瓷，也有严格礼制用器和精雅单色釉。", marks: "六字篆书款成为主流，书写或刻印整齐；楷书仍存在。仿前朝款很多，不能按字面断代。", style: "器型丰富，大器与复杂器增加；粉彩、色地描金、仿青铜与礼制颜色釉都具代表性。", tags: ["篆款主流", "粉彩", "仿材质", "礼制器"] },
  { name: "嘉庆", years: "1796—1820", phase: "承续乾隆 · 规模收缩", summary: "早期多延续乾隆官样与技术，创新性和生产规模随后收缩。辨识时要留意与乾隆晚期的连续性。", marks: "篆书年款仍是主流；红彩、金彩款在部分粉彩及色地器上可见。", style: "粉彩、青花、斗彩与传统颜色釉继续烧造，常见缠枝莲、吉祥纹与成套宫廷用器。", tags: ["承续官样", "篆书款", "粉彩", "成套用器"] },
  { name: "道光", years: "1821—1850", phase: "传统复用 · 宫廷专款", summary: "宫廷烧造品种与数量一度较嘉庆上升。总体沿用既定官样，同时“慎德堂制”等专用款提供了明确宫廷线索。", marks: "六字篆书款常见，楷书款也重新增多；“慎德堂制”属于重要堂名款。", style: "粉彩、青花、斗彩与黄釉等传统品种延续；精作仍可见细致画工与规整器形。", tags: ["慎德堂制", "楷篆并见", "粉彩", "传统官样"] },
  { name: "咸丰", years: "1851—1861", phase: "战乱冲击 · 御窑停烧", summary: "短暂年号叠加太平天国战乱，御窑生产受到严重冲击，并在咸丰五年停烧。传世官窑数量和系统性都受限制。", marks: "本朝年款有楷、篆等形式；样本相对少，更需要依赖明确馆藏、出土与档案记录。", style: "传统青花、粉彩与颜色釉继续出现，但产量与制作条件受时局显著影响。", tags: ["短朝", "咸丰五年停烧", "样本稀少", "传统品种"] },
  { name: "同治", years: "1862—1874", phase: "战后复烧 · 大婚瓷", summary: "御窑逐步恢复。皇帝大婚带来大规模成套餐具烧造，宫廷专用款与吉祥纹样成为晚清研究的重要主题。", marks: "本朝年款之外，还需单列“同治年制”“吉祥如意”“长春同庆”等婚庆与宫廷专用款。", style: "黄地、粉彩、吉祥花卉与成套器突出；应区分大运、传办和具体项目。", tags: ["御窑复烧", "大婚瓷", "成套餐具", "吉祥专款"] },
  { name: "光绪", years: "1875—1908", phase: "仿古复兴 · 宫廷订烧", summary: "既延续晚清宫廷项目，也出现仿康熙、雍正、乾隆风格的复兴倾向。“大雅斋”等系列与官样制度密切相关。", marks: "六字青花楷书款较常见，也见篆书、红彩等；“大雅斋”“天地一家春”属于特定宫廷标识。", style: "仿古青花、颜色釉与粉彩并行；官样可帮助核对纹样、尺寸、数量与实际器物。", tags: ["六字楷款", "大雅斋", "仿古复兴", "官样对照"] },
  { name: "宣统", years: "1909—1911", phase: "短朝终章 · 制度落幕", summary: "在位仅三年，御窑仍按既有制度烧造部分大运与传办器。宣统三年，延续数百年的御窑体系随清朝结束。", marks: "“大清宣统年制”六字楷书款是核心类型，常见青花书写；短朝并不意味着见款即真。", style: "器形与工艺多承袭光绪官样，部分作品制作规整；研究应重视成套传承和档案背景。", tags: ["六字楷款", "短朝", "承袭官样", "宣统三年终止"] },
]

export type FormItem = { name: string; category: string; shape: string; desc: string }
export const forms: FormItem[] = [
  { name: "碗", category: "饮食", shape: "bowl", desc: "敞口或撇口，弧腹、圈足。宫廷日用与祭祀体系中数量很大。" },
  { name: "盘", category: "饮食", shape: "dish", desc: "口沿、折腰与圈足比例是观察重点；成套官样常限定尺寸。" },
  { name: "杯 / 盅", category: "饮食", shape: "cup", desc: "直口、撇口或小圈足，花神杯、高足杯等各有专名。" },
  { name: "盖碗", category: "饮食", shape: "covered", desc: "盖、碗、托组合；晚清宫廷茶器中常见成套烧造。" },
  { name: "梅瓶", category: "陈设", shape: "meiping", desc: "小口、短颈、丰肩、下腹收敛。清代多仿古，也发展新比例。" },
  { name: "玉壶春瓶", category: "陈设", shape: "yuhuchun", desc: "撇口、细长颈、垂腹、圈足，线条连贯；各朝曲线张力不同。" },
  { name: "天球瓶", category: "陈设", shape: "tianqiu", desc: "直长颈接近球形腹；雍乾常见粉彩、青花等宫廷陈设器。" },
  { name: "赏瓶", category: "陈设", shape: "shang", desc: "撇口、长颈、丰肩，清代后期沿袭烧造并用于赏赐。" },
  { name: "棒槌瓶", category: "陈设", shape: "mallet", desc: "长直颈与筒形腹如洗衣棒槌，康熙时期尤具辨识度。" },
  { name: "琮式瓶", category: "仿古", shape: "cong", desc: "外方内圆，仿玉琮并常结合仿官、仿哥等古雅釉色。" },
  { name: "贯耳瓶", category: "仿古", shape: "guaner", desc: "颈部两侧设管状耳，源于古代礼器意象，官窑多种釉色烧造。" },
  { name: "蒜头瓶", category: "陈设", shape: "garlic", desc: "口部膨大似蒜头，长颈接腹，常见青花或单色釉。" },
  { name: "花浇", category: "陈设", shape: "ewer", desc: "流、颈、腹与曲柄组合；雍正器可融合伊斯兰器物传统。" },
  { name: "太白尊", category: "文房", shape: "coupe", desc: "矮圆腹、小口，康熙豇豆红文房器名品之一。" },
  { name: "笔洗", category: "文房", shape: "washer", desc: "浅腹、敞口，洗笔盛水；体量、口足与釉面尤其重要。" },
  { name: "印盒", category: "文房", shape: "box", desc: "盖与器身子母口相合，常见单色釉、青花、粉彩等品种。" },
  { name: "簋式炉 / 簋", category: "礼制", shape: "gui", desc: "仿青铜簋，有双耳与圈足；乾隆礼制器有严格颜色系统。" },
  { name: "五供", category: "礼制", shape: "altar", desc: "香炉一、花觚二、烛台二组成祭坛陈设，常成套烧造。" },
]

export const shapePaths: Record<string, string> = {
  bowl: "M19 36Q20 83 50 89Q80 83 81 36M15 35Q50 41 85 35M37 88L36 96H64L63 88",
  dish: "M12 61Q50 83 88 61M12 61Q50 70 88 61M38 73L37 82H63L62 73",
  cup: "M27 38Q29 82 50 84Q71 82 73 38M25 37Q50 43 75 37M39 84L38 92H62L61 84",
  covered: "M25 48Q29 82 50 84Q71 82 75 48M23 47Q50 53 77 47M29 46Q32 28 50 24Q68 28 71 46M46 24V19H54V24M38 84L37 92H63L62 84",
  meiping: "M43 16H57L60 25Q77 32 76 55Q73 82 62 91H38Q27 82 24 55Q23 32 40 25ZM40 16Q50 20 60 16M38 91V96H62V91",
  yuhuchun: "M39 13Q50 18 61 13Q57 30 62 44Q78 64 70 86Q63 94 50 95Q37 94 30 86Q22 64 38 44Q43 30 39 13M36 12Q50 17 64 12",
  tianqiu: "M41 10H59L60 42Q80 51 79 72Q77 94 50 96Q23 94 21 72Q20 51 40 42ZM39 10Q50 14 61 10",
  shang: "M38 10Q50 15 62 10L59 38Q74 44 76 63Q78 87 62 94H38Q22 87 24 63Q26 44 41 38Z",
  mallet: "M39 10Q50 14 61 10L59 40L70 47L69 89Q50 95 31 89L30 47L41 40Z",
  cong: "M35 18H65L70 92H30ZM42 11Q50 15 58 11V20H42ZM38 92V97H62V92",
  guaner: "M39 12Q50 16 61 12L59 38Q72 44 72 70Q70 91 60 94H40Q30 91 28 70Q28 44 41 38ZM28 42L18 38V56L29 59M72 42L82 38V56L71 59",
  garlic: "M39 12Q50 3 61 12Q68 21 59 29L60 44Q77 53 74 78Q70 94 50 95Q30 94 26 78Q23 53 40 44L41 29Q32 21 39 12",
  ewer: "M42 11Q51 16 60 12V28Q64 35 61 43Q74 54 72 78Q68 94 48 95Q28 94 25 78Q23 54 38 43Q35 35 40 28ZM61 34Q76 27 82 16M61 40Q78 37 84 18M28 45Q12 49 15 71Q18 86 31 76",
  coupe: "M20 50Q22 84 50 87Q78 84 80 50Q50 61 20 50M18 49Q50 58 82 49M38 87L37 93H63L62 87",
  washer: "M15 57Q17 81 50 84Q83 81 85 57M15 56Q50 65 85 56M36 84V90H64V84",
  box: "M24 47Q50 57 76 47L75 80Q50 89 25 80ZM22 46Q50 57 78 46L75 34Q50 25 25 34Z",
  gui: "M22 44Q25 75 50 78Q75 75 78 44M20 43Q50 52 80 43M22 50Q9 45 12 63Q15 72 25 66M78 50Q91 45 88 63Q85 72 75 66M36 78L31 92H69L64 78",
  altar: "M42 12Q50 17 58 12L57 22L62 29L60 43L68 52L64 90H36L32 52L40 43L38 29L43 22ZM29 90H71L68 97H32Z",
}

export const glazes = [
  { name: "青花", tech: "釉下彩", color: "#3e79a6", text: "钴料绘于胎上，再罩透明釉高温烧成。观察发色、晕散、笔触与釉面关系。" },
  { name: "豇豆红", tech: "高温铜红釉", color: "#a74849", text: "康熙御窑文房器名品，红色常有苔点、绿斑与浓淡变化。" },
  { name: "祭红 / 霁红", tech: "高温铜红釉", color: "#8f1f25", text: "追求均匀深沉的红色，需与郎窑红、豇豆红分辨。" },
  { name: "霁蓝", tech: "高温钴蓝釉", color: "#153e73", text: "浓蓝色釉，祭器与陈设器均见；礼制器颜色还与祭祀场所有关。" },
  { name: "黄釉", tech: "传统颜色釉", color: "#d4ad35", text: "明清宫廷等级色彩之一；需区分浇黄、柠檬黄、蛋黄等品种。" },
  { name: "粉青 / 仿官", tech: "高温青釉", color: "#9dbfb1", text: "雍乾仿宋名窑的重要方向，常配合暗花、开片或古器造型。" },
  { name: "斗彩", tech: "釉下青花＋釉上彩", color: "linear-gradient(135deg,#3e79a6 0 46%,#b84b42 47% 64%,#70a275 65%)", text: "青花轮廓与釉上彩相配合，清代官窑延续并重释成化传统。" },
  { name: "五彩", tech: "釉上彩为主", color: "linear-gradient(135deg,#b13c36 0 32%,#4d8a63 33% 65%,#d6ae3f 66%)", text: "康熙五彩尤著名，色彩明快、线描劲健，白瓷地也是构图的一部分。" },
  { name: "粉彩", tech: "釉上彩", color: "linear-gradient(135deg,#e7b5b5 0 40%,#8ab09c 41% 70%,#dbbe67 71%)", text: "借助玻璃白与新色料形成柔和层次，雍乾成熟，晚清持续烧造。" },
]

export type ObjectItem = { id: string; title: string; reign: string; period: string; image: string; markImage?: string; medium: string; size: string; type: string; note: string; url: string }
export const objects: ObjectItem[] = [
  { id: "91.1.407", title: "豇豆红釉太白尊", reign: "康熙", period: "康熙款及本朝（1662—1722）", image: "kangxi-water-coupe.jpg", markImage: "kangxi-water-coupe-base.jpg", medium: "瓷胎；暗刻纹；豇豆红釉", size: "高 8.7 cm；宽 12.9 cm", type: "文房 · 太白尊", note: "康熙御窑豇豆红文房器。器型矮圆，釉色以铜红烧成，底有六字青花楷书款。", url: "https://www.metmuseum.org/art/collection/search/51221" },
  { id: "50.145.267–.278", title: "青花五彩十二月令花神杯", reign: "康熙", period: "康熙款及本朝（1662—1722）", image: "kangxi-flower-cups.jpg", medium: "瓷胎；釉下青花与釉上彩", size: "每件高约 4.9 cm；直径 6.4 cm", type: "饮食 · 杯", note: "十二只月令花杯成套，花卉与诗文相配，是清代宫廷成组设计与诗画装饰的代表。", url: "https://www.metmuseum.org/art/collection/search/52872" },
  { id: "1981.468", title: "粉青釉暗花花浇", reign: "雍正", period: "雍正款及本朝（1723—1735）", image: "yongzheng-ewer.jpg", markImage: "yongzheng-ewer-detail-1.jpg", medium: "瓷胎；暗刻纹；青釉", size: "高 31.1 cm", type: "陈设 · 花浇", note: "器型可能取意伊斯兰金属或玻璃壶，结合中国粉青釉与暗刻纹，体现借古融新。", url: "https://www.metmuseum.org/art/collection/search/50765" },
  { id: "65.86.5", title: "粉彩花蝶纹碗", reign: "雍正", period: "雍正款及本朝（1723—1735）", image: "yongzheng-bowl.jpg", medium: "瓷胎；釉上多彩珐琅", size: "高 5.7 cm；直径 11.4 cm", type: "饮食 · 碗", note: "薄胎小碗上以釉上彩绘花蝶，适合观察雍正粉彩的柔和色阶与留白。", url: "https://www.metmuseum.org/art/collection/search/50776" },
  { id: "25.143.1a, b", title: "霁蓝釉礼器簋", reign: "乾隆", period: "乾隆款及本朝（1736—1795）", image: "qianlong-gui.jpg", markImage: "qianlong-gui-detail-3.jpg", medium: "瓷胎；低浮雕；深蓝釉", size: "高 27.3 cm", type: "礼制 · 簋", note: "仿青铜簋造型，按乾隆朝国家祭祀颜色体系使用，说明器型、釉色与制度相互关联。", url: "https://www.metmuseum.org/art/collection/search/42418" },
  { id: "17.120.194", title: "粉彩九桃纹天球瓶", reign: "乾隆", period: "乾隆款及本朝（1736—1795）", image: "qianlong-nine-peaches.jpg", markImage: "qianlong-nine-peaches-detail-4.jpg", medium: "瓷胎；透明釉上彩", size: "高 50.8 cm；腹径 40.6 cm", type: "陈设 · 天球瓶", note: "九桃寓意长寿，粉红色阶与绿叶层次展示十八世纪新色料体系；底书六字篆款。", url: "https://www.metmuseum.org/art/collection/search/42317" },
  { id: "14.40.400", title: "绿釉描金仿古纹瓶", reign: "乾隆", period: "乾隆款及本朝（1736—1795）", image: "qianlong-archaistic-vase.jpg", medium: "瓷胎；绿彩；浮雕描金", size: "高 40 cm", type: "仿古 · 陈设瓶", note: "以绿彩与金饰模拟古代器物的庄重质感，是乾隆御窑仿古创新的典型。", url: "https://www.metmuseum.org/art/collection/search/46130" },
  { id: "79.2.664", title: "粉彩夔凤纹碗", reign: "道光", period: "道光款及本朝（1821—1850）", image: "daoguang-phoenix-bowl.jpg", markImage: "daoguang-phoenix-bowl-detail-4.jpg", medium: "瓷胎；釉上多彩珐琅", size: "高 9.2 cm；直径 21 cm", type: "饮食 · 碗", note: "夔凤、花卉与卷草构成连续纹带，底书六字篆款，说明道光官窑精作仍保持繁密画工。", url: "https://www.metmuseum.org/art/collection/search/51122" },
  { id: "79.2.1215", title: "黄釉罐", reign: "道光", period: "道光款及本朝（1821—1850）", image: "daoguang-yellow-jar.jpg", medium: "瓷胎；黄釉", size: "高 23.7 cm；直径 21.4 cm", type: "陈设 · 罐", note: "单色黄釉罐强调器形、釉层和烧成均匀度，适合训练不依赖纹饰的观察方法。", url: "https://www.metmuseum.org/art/collection/search/51187" },
]

export const markTypes = [
  { no: "壹", title: "本朝年号款", text: "如“大清康熙年制”六字款、“雍正年制”四字款。最常见，也最常被后仿。", note: "四/六字 · 双行/三行 · 楷/篆" },
  { no: "贰", title: "御制与堂名款", text: "如“康熙御制”“慎德堂制”，常与特定宫廷项目、处所或使用者相关。", note: "档案背景 · 器物组合 · 使用场景" },
  { no: "叁", title: "仿古与寄托款", text: "清代御窑常仿写宣德、成化等前朝款，是借古创新的一部分。", note: "看本朝工艺，不按字面断代" },
  { no: "肆", title: "专用、吉语与纪事款", text: "婚庆、万寿、宫殿专用或纪事文字另成系统，如晚清大婚瓷专用款。", note: "成套器 · 官样 · 清宫档案" },
]

export const sources = [
  { org: "故宫博物院", title: "《款识——皇帝的印记》", text: "年号款制度；康熙楷款、雍正篆款出现、乾嘉道篆款流行等。", url: "https://www.dpm.org.cn/Uploads/File/2019/07/25/u5d3948ac611f5.pdf" },
  { org: "故宫博物院", title: "《清代瓷器款识》", text: "清代楷篆款、书写工艺、彩款与时代变化。", url: "https://www.dpm.org.cn/Uploads/pdf/1558/T00066_00.pdf" },
  { org: "故宫博物院", title: "《承续烧造——大运瓷器》", text: "大运、奉旨传办与年节贡瓷等生产体系及晚清停复烧背景。", url: "https://www.dpm.org.cn/ceramics/talk/254996.html" },
  { org: "故宫博物院", title: "《清代瓷器研究成果举要》", text: "清宫档案、方志与清末民国研究史的来源脉络。", url: "https://www.dpm.org.cn/ceramics/talk/254672.html" },
  { org: "国立故宫博物院", title: "中国历代陶瓷发展：清", text: "皇家主导、盛清创新与晚清御窑变化的教育资料。", url: "https://www.npm.gov.tw/NewChineseArtDownload.ashx?bid=2339" },
  { org: "British Museum", title: "Room 95: Chinese Ceramics", text: "雍正、乾隆单色釉与烧成工艺的馆藏导览。", url: "https://www.britishmuseum.org/sites/default/files/2021-05/large_print_guide_room_95_chinese_ceramics.pdf" },
  { org: "The Met", title: "Open Access", text: "本站实物图的开放授权依据；每件藏品另附原始记录。", url: "https://www.metmuseum.org/about-the-met/policies-and-documents/open-access" },
  { org: "故宫博物院", title: "《清代御窑厂的建立与终结》", text: "御窑厂作为官府机构的制度定义与沿革。", url: "https://www.dpm.org.cn/ceramics/talk/208710.html?_list=1" },
]
