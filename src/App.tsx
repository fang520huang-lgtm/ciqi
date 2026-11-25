import { useMemo, useState, type ReactNode } from "react"
import {
  BookOpen,
  CheckCircle2,
  Eye,
  Info,
  Library,
  Menu,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { forms, glazes, markTypes, objects, reigns, shapePaths, sources, type ObjectItem } from "@/data"
import { cn } from "@/lib/utils"

const imageUrl = (name: string) => `${import.meta.env.BASE_URL}assets/images/${name}`

const navItems = [
  ["朝代", "#timeline"],
  ["款识", "#marks"],
  ["器型", "#forms"],
  ["胎釉", "#materials"],
  ["馆藏实例", "#collection"],
  ["资料来源", "#sources"],
]

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="清瓷谱首页">
      <span className={cn("seal grid size-10 place-items-center border font-serif-cn text-lg", light ? "border-white/50 bg-vermilion text-white" : "border-primary/30 bg-primary text-primary-foreground")}>清</span>
      <span className="leading-none">
        <strong className="block font-serif-cn text-lg tracking-[.16em]">清瓷谱</strong>
        <small className={cn("mt-1 block text-[11px] tracking-[.08em]", light ? "text-white/55" : "text-muted-foreground")}>清代官窑学习志</small>
      </span>
    </a>
  )
}

function SiteHeader() {
  return (
    <header id="top" className="sticky top-0 z-40 border-b border-white/10 bg-[#082f49]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Brand light />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="主导航">
          {navItems.map(([label, href]) => <a key={href} href={href} className="text-sm text-white/68 transition-colors hover:text-white">{label}</a>)}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="打开导航"><Menu /></Button>
          </SheetTrigger>
          <SheetContent className="bg-[#f7f4ec]">
            <SheetHeader className="mb-10"><SheetTitle><Brand /></SheetTitle></SheetHeader>
            <nav className="flex flex-col" aria-label="移动端导航">
              {navItems.map(([label, href]) => (
                <SheetClose key={href} asChild><a href={href} className="border-b py-4 font-serif-cn text-xl">{label}</a></SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={cn("mb-3 text-xs font-semibold uppercase tracking-[.2em]", dark ? "text-[#f0b4a9]" : "text-vermilion")}>{children}</p>
}

function SectionHeading({ eyebrow, title, intro, dark = false }: { eyebrow: string; title: string; intro: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("mb-10 grid items-end gap-5 lg:mb-14 lg:grid-cols-[.8fr_1fr] lg:gap-20", dark && "text-white")}>
      <div><Eyebrow dark={dark}>{eyebrow}</Eyebrow><h2 className="font-serif-cn text-4xl font-normal tracking-[-.04em] sm:text-5xl lg:text-7xl">{title}</h2></div>
      <div className={cn("max-w-2xl text-base leading-7", dark ? "text-white/64" : "text-muted-foreground")}>{intro}</div>
    </div>
  )
}

function Hero() {
  const stats = [["10", "清代年号"], ["4", "款识主类"], ["18", "常见器型"], ["9", "开放馆藏实例"]]
  return (
    <section className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-[#082f49] text-white">
      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1700px] lg:grid-cols-[1.08fr_.72fr]">
        <div className="paper-noise relative z-10 flex items-center px-5 py-20 sm:px-10 lg:px-[7vw]">
          <div className="max-w-3xl">
            <Eyebrow dark>QING IMPERIAL PORCELAIN · 1644—1911</Eyebrow>
            <h1 className="font-serif-cn text-[clamp(4rem,8.5vw,9rem)] font-normal leading-[.9] tracking-[-.05em]">先看整体，<br /><span className="text-[#b8d2c4]">再读细节。</span></h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">从器型、款识、胎、釉与时代风格建立一套可复查的学习方法。本站只讨论清代景德镇御窑及有明确宫廷烧造背景的用瓷，不把“写着年款”直接等同于官窑。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-none bg-vermilion px-6 hover:bg-[#922f28]"><a href="#timeline">按朝代开始</a></Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><a href="#method">先读使用方法</a></Button>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-7 sm:grid-cols-4">
              {stats.map(([value, label]) => <div key={label}><dt className="font-serif-cn text-3xl">{value}</dt><dd className="mt-1 text-xs text-white/45">{label}</dd></div>)}
            </dl>
          </div>
        </div>
        <figure className="relative min-h-[68svh] overflow-hidden bg-stone-200 lg:min-h-full">
          <img src={imageUrl("qianlong-nine-peaches-detail-1.jpg")} alt="清乾隆粉彩九桃纹天球瓶" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061f2a]/75 via-transparent to-transparent" />
          <div className="seal absolute right-7 top-7 grid size-[68px] place-items-center border border-white bg-vermilion font-serif-cn leading-5 shadow-xl">乾隆<br />御窑</div>
          <figcaption className="absolute inset-x-7 bottom-7">
            <p className="font-serif-cn text-xl">粉彩九桃纹天球瓶</p>
            <p className="mt-1 text-xs text-white/65">清乾隆 · The Met 17.120.194 · Public Domain</p>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function ScopeBar() {
  return (
    <section className="border-b bg-[#b8d2c4] px-4 py-4 text-sm">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-2 sm:flex-row sm:items-center sm:gap-7">
        <Badge className="w-fit rounded-none bg-[#082f49]">收录边界</Badge>
        <p><strong>御窑 / 官窑</strong>、奉旨传办、大运瓷、明确宫廷专用款</p>
        <Separator orientation="vertical" className="hidden h-5 bg-[#082f49]/20 sm:block" />
        <p className="text-[#102832]/60"><strong>暂不收录</strong> 民窑、外销瓷、仅凭款识推定的商品瓷</p>
      </div>
    </section>
  )
}

function MethodSection() {
  const steps = [
    [ShieldCheck, "先定范围", "确认是御窑、大运、传办或宫廷专用体系；把“官搭民烧”等边界问题单列。"],
    [Shapes, "看器型与比例", "记录口、颈、肩、腹、足的转折与比例。同名器型在不同时代仍有差异。"],
    [Sparkles, "看胎、釉与装饰", "观察露胎、修足、釉层与彩料层次，避免被后加彩或人工做旧误导。"],
    [Eye, "最后核款", "核对书体、布局、落款位置与工艺；仿古款、寄托款不等于所写年号。"],
  ] as const
  return (
    <section id="method" className="section-shell scroll-mt-20 bg-background">
      <SectionHeading eyebrow="A METHOD, NOT A SHORTCUT" title="四步读一件瓷器" intro="断代不是“对款识答案”。可靠判断需要把造型、制作工艺、纹饰与款识放在同一条证据链上，再与有明确馆藏记录或出土背景的标准器比对。" />
      <div className="grid overflow-hidden border md:grid-cols-2 xl:grid-cols-4">
        {steps.map(([Icon, title, text], index) => (
          <Card key={title} className="rounded-none border-0 border-b bg-transparent shadow-none last:border-b-0 md:border-r xl:border-b-0">
            <CardHeader>
              <div className="mb-10 flex items-center justify-between"><span className="text-xs font-semibold text-vermilion">0{index + 1}</span><Icon className="size-5 text-primary/55" /></div>
              <CardTitle className="font-serif-cn text-2xl font-normal">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">{text}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-5 flex gap-3 border-l-2 border-vermilion bg-white/55 p-4 text-sm leading-6 text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0 text-vermilion" /><p><strong className="text-foreground">学习提示：</strong>本站是入门索引，不提供交易估价或“看图鉴真”。实物鉴定还需要尺寸、重量、口沿、足底、侧光与显微观察等信息。</p></div>
    </section>
  )
}

function TimelineSection() {
  return (
    <section id="timeline" className="section-shell scroll-mt-20 bg-[#082f49] text-white">
      <SectionHeading dark eyebrow="TEN REIGNS · ONE KILN SYSTEM" title="十朝御窑脉络" intro="点击年号，比较工艺重心、常见款式与时代语气。时间轴描述的是总体趋势，不代替对单件器物的判断。" />
      <Tabs defaultValue="康熙" className="gap-0">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border border-white/15 bg-white/5 p-0">
          {reigns.map(reign => <TabsTrigger key={reign.name} value={reign.name} className="min-w-[104px] rounded-none border-r border-white/10 px-4 py-4 text-white/48 data-[state=active]:bg-vermilion data-[state=active]:text-white">{reign.name}<span className="ml-1 text-[10px] opacity-60">{reign.years.slice(0,4)}</span></TabsTrigger>)}
        </TabsList>
        {reigns.map(reign => (
          <TabsContent key={reign.name} value={reign.name} className="mt-0 border border-t-0 border-white/15 bg-white/[.035] p-5 sm:p-8 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
              <div><p className="text-xs font-semibold tracking-[.14em] text-[#f0b4a9]">{reign.phase}</p><h3 className="mt-3 font-serif-cn text-6xl font-normal sm:text-8xl">{reign.name}</h3><p className="mt-2 text-sm text-white/40">{reign.years}</p><p className="mt-7 max-w-lg leading-8 text-white/70">{reign.summary}</p></div>
              <div className="space-y-7">
                <div className="border-b border-white/15 pb-6"><h4 className="mb-2 text-xs font-semibold tracking-[.14em] text-[#b8d2c4]">款识趋势</h4><p className="leading-7 text-white/72">{reign.marks}</p></div>
                <div className="border-b border-white/15 pb-6"><h4 className="mb-2 text-xs font-semibold tracking-[.14em] text-[#b8d2c4]">器物与工艺</h4><p className="leading-7 text-white/72">{reign.style}</p></div>
                <div><h4 className="mb-3 text-xs font-semibold tracking-[.14em] text-[#b8d2c4]">学习关键词</h4><div className="flex flex-wrap gap-2">{reign.tags.map(tag => <Badge key={tag} variant="outline" className="rounded-none border-white/20 text-white/70">{tag}</Badge>)}</div></div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

const markSamples = [
  { reign: "康熙", style: "六字三行青花楷书", id: "The Met 91.1.407", image: "kangxi-water-coupe-base.jpg" },
  { reign: "雍正", style: "六字三行青花篆书", id: "The Met 1981.468", image: "yongzheng-ewer-detail-1.jpg" },
  { reign: "乾隆", style: "六字三行青花篆书", id: "The Met 17.120.194", image: "qianlong-nine-peaches-detail-4.jpg" },
]

function MarksSection() {
  return (
    <section id="marks" className="section-shell scroll-mt-20">
      <SectionHeading eyebrow="MARKS ARE EVIDENCE, NOT VERDICTS" title="款识，大概有几种？" intro={<>没有一个固定总数。入门时可先按用途分成 <strong className="text-foreground">4 个主类</strong>，再用“字数与布局、书体、呈色与工艺”三个维度细分。</>} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {markTypes.map(mark => (
          <Card key={mark.title} className="rounded-none border-border/80 bg-card shadow-none">
            <CardHeader><span className="seal mb-8 grid size-9 place-items-center rounded-full bg-vermilion font-serif-cn text-white">{mark.no}</span><CardTitle className="font-serif-cn text-xl font-normal">{mark.title}</CardTitle></CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">{mark.text}</CardContent>
            <CardFooter><p className="text-xs text-vermilion">看：{mark.note}</p></CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {markSamples.map(sample => (
          <Dialog key={sample.reign}>
            <Card className="gap-0 overflow-hidden rounded-none border-0 bg-[#082f49] py-0 text-white shadow-none">
              <DialogTrigger asChild><button className="group relative h-64 cursor-zoom-in overflow-hidden bg-white" aria-label={`放大查看${sample.reign}款识`}><img src={imageUrl(sample.image)} alt={`${sample.reign}${sample.style}`} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /></button></DialogTrigger>
              <CardHeader className="grid grid-cols-[auto_1fr] gap-x-4 py-5"><CardTitle className="row-span-2 font-serif-cn text-xl font-normal text-[#b8d2c4]">{sample.reign}</CardTitle><CardDescription className="text-white/80">{sample.style}</CardDescription><span className="text-xs text-white/45">{sample.id}</span></CardHeader>
            </Card>
            <DialogContent className="max-h-[92svh] max-w-4xl overflow-hidden border-0 bg-[#0b1f29] p-0"><DialogTitle className="sr-only">{sample.reign}款识大图</DialogTitle><img src={imageUrl(sample.image)} alt={`${sample.reign}${sample.style}`} className="max-h-[92svh] w-full object-contain" /></DialogContent>
          </Dialog>
        ))}
      </div>
      <div className="mt-10 grid gap-8 border-y py-8 lg:grid-cols-[.65fr_1.35fr]">
        <div><Eyebrow>THREE AXES</Eyebrow><h3 className="font-serif-cn text-3xl font-normal">读款识的三个维度</h3></div>
        <dl className="divide-y">
          <div className="grid gap-2 py-4 sm:grid-cols-[6rem_1fr]"><dt className="font-semibold text-vermilion">结构</dt><dd className="text-muted-foreground">四字或六字；双行或三行；横款、竖款；有无双圈、双方框。</dd></div>
          <div className="grid gap-2 py-4 sm:grid-cols-[6rem_1fr]"><dt className="font-semibold text-vermilion">书体</dt><dd className="text-muted-foreground">楷书或篆书是时代趋势，不是绝对规则。雍正开始出现六字篆款，乾隆以后更普遍。</dd></div>
          <div className="grid gap-2 py-4 sm:grid-cols-[6rem_1fr]"><dt className="font-semibold text-vermilion">工艺</dt><dd className="text-muted-foreground">青花、红彩、黑彩、金彩、料彩，以及刻、印、模等。呈色要与器物类别一起看。</dd></div>
        </dl>
      </div>
    </section>
  )
}

function FormIcon({ path }: { path: string }) {
  return <svg viewBox="0 0 100 110" aria-hidden="true" className="h-28 w-20 fill-sky-900/5 stroke-sky-800 stroke-[1.4]"><path d={path} /></svg>
}

function FormsSection() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("全部")
  const categories = ["全部", ...new Set(forms.map(form => form.category))]
  const filtered = useMemo(() => forms.filter(form => (category === "全部" || form.category === category) && `${form.name}${form.category}${form.desc}`.toLowerCase().includes(query.trim().toLowerCase())), [category, query])
  return (
    <section id="forms" className="section-shell scroll-mt-20 bg-white/70">
      <SectionHeading eyebrow="FORM FOLLOWS USE" title="器型词典" intro="先识“用途族”，再记具体名称。输入名称、用途或结构词，例如“文房”“长颈”“仿青铜”。" />
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <label className="relative w-full lg:max-w-sm"><span className="sr-only">搜索器型</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索器型、用途或特征" className="rounded-none bg-background pl-10" /></label>
        <div className="flex flex-wrap gap-2" aria-label="器型分类筛选">{categories.map(item => <Button key={item} size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} className="rounded-full">{item}</Button>)}</div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(form => <Card key={form.name} className="group grid grid-cols-[88px_1fr] items-center gap-4 rounded-none bg-background py-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-md"><div className="grid place-items-center pl-3"><FormIcon path={shapePaths[form.shape]} /></div><div className="pr-5"><div className="flex items-center justify-between"><CardTitle className="font-serif-cn text-xl font-normal">{form.name}</CardTitle><Badge variant="outline" className="rounded-full text-[10px] text-vermilion">{form.category}</Badge></div><CardDescription className="mt-3 leading-6">{form.desc}</CardDescription></div></Card>)}
      </div>
      {!filtered.length && <div className="mt-5 border border-dashed p-10 text-center text-muted-foreground">没有匹配的器型，试试更短的关键词。</div>}
    </section>
  )
}

function MaterialsSection() {
  const points = [["口沿", "厚薄、削修、是否覆釉"], ["器壁", "透光、接胎、拉坯或模制痕迹"], ["圈足", "足墙、足脊、修足与沾砂"], ["底心", "釉面、款识、垫烧或支烧信息"], ["破损处", "胎色、致密度与杂质；完整器不要人为试验"]]
  return (
    <section id="materials" className="section-shell scroll-mt-20 bg-[#071f2a] text-white">
      <SectionHeading dark eyebrow="BODY · GLAZE · FIRING" title="胎与釉，分开观察" intro="“胎白、釉亮”不是结论。记录胎土精炼程度、厚薄、修坯、足端露胎，再描述釉层、呈色与装饰层所在位置。" />
      <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr]">
        <Card className="rounded-none border-white/15 bg-white/[.045] text-white shadow-none"><CardHeader><Eyebrow dark>THE BODY</Eyebrow><CardTitle className="font-serif-cn text-3xl font-normal">观察瓷胎的 5 个位置</CardTitle></CardHeader><CardContent><div className="divide-y divide-white/12">{points.map(([title, text]) => <div key={title} className="grid grid-cols-[4.5rem_1fr] gap-3 py-4"><strong className="text-[#b8d2c4]">{title}</strong><span className="text-white/60">{text}</span></div>)}</div><div className="mt-6 border-l-2 border-[#e07769] bg-vermilion/15 p-4 text-sm leading-6 text-white/65">官窑质量有高低，晚清也有精作；“胎粗就是民窑”或“胎白就是乾隆”都不成立。</div></CardContent></Card>
        <div className="grid border border-white/12 sm:grid-cols-2 xl:grid-cols-3">
          {glazes.map(glaze => <div key={glaze.name} className="border-b border-r border-white/12 bg-white/[.025] p-5"><div className="mb-9 size-10 rounded-full border border-white/35 shadow-inner" style={{ background: glaze.color }} /><h3 className="font-serif-cn text-xl">{glaze.name}</h3><p className="text-xs text-sky-200/70">{glaze.tech}</p><p className="mt-3 text-sm leading-6 text-white/55">{glaze.text}</p></div>)}
        </div>
      </div>
    </section>
  )
}

function ObjectDialog({ object }: { object: ObjectItem }) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button className="w-full rounded-none bg-vermilion hover:bg-[#922f28]">查看学习卡</Button></DialogTrigger>
      <DialogContent className="max-h-[94svh] max-w-5xl overflow-y-auto rounded-none p-0">
        <DialogTitle className="sr-only">{object.title}</DialogTitle>
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="bg-stone-100"><img src={imageUrl(object.image)} alt={object.title} className="h-[430px] w-full object-cover lg:h-[660px]" />{object.markImage && <div className="grid grid-cols-[140px_1fr] items-center gap-4 border-t bg-white p-4"><img src={imageUrl(object.markImage)} alt={`${object.title}底款或足底细节`} className="h-24 w-[140px] object-cover" /><p className="text-sm text-muted-foreground"><strong className="mb-1 block font-serif-cn text-base text-foreground">款识 / 足底细节</strong>同一馆藏记录附图。馆藏标签与旧编号不属于原器款识。</p></div>}</div>
          <div className="flex items-center p-7 sm:p-10"><div><Eyebrow>THE MET · PUBLIC DOMAIN</Eyebrow><DialogHeader><DialogTitle className="font-serif-cn text-4xl font-normal tracking-[-.04em] sm:text-5xl">{object.title}</DialogTitle><DialogDescription className="pt-2 text-vermilion">{object.period}</DialogDescription></DialogHeader><p className="mt-6 leading-7 text-muted-foreground">{object.note}</p><dl className="mt-7 divide-y border-y text-sm">{[["器型", object.type], ["材质", object.medium], ["尺寸", object.size], ["馆藏号", object.id]].map(([label, value]) => <div key={label} className="grid grid-cols-[5rem_1fr] gap-3 py-3"><dt className="font-semibold">{label}</dt><dd className="text-muted-foreground">{value}</dd></div>)}</dl><Button asChild className="mt-7 rounded-none"><a href={object.url} target="_blank" rel="noreferrer">打开博物馆原始记录</a></Button></div></div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CollectionSection() {
  const [reign, setReign] = useState("全部")
  const filters = ["全部", ...new Set(objects.map(object => object.reign))]
  const filtered = objects.filter(object => reign === "全部" || object.reign === reign)
  return (
    <section id="collection" className="section-shell scroll-mt-20">
      <SectionHeading eyebrow="OPEN COLLECTION STUDY SET" title="权威馆藏实例" intro="图片均来自大都会艺术博物馆开放获取藏品，标注为 Public Domain。每张卡片保留馆藏编号，并链接原始藏品页。" />
      <div className="mb-7 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center"><div className="flex flex-wrap gap-2">{filters.map(item => <Button key={item} size="sm" variant={reign === item ? "default" : "outline"} className="rounded-full" onClick={() => setReign(item)}>{item}</Button>)}</div><span className="text-sm text-muted-foreground">显示 {filtered.length} / {objects.length} 件</span></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(object => <Card key={object.id} className="gap-0 overflow-hidden rounded-none py-0 shadow-none"><div className="relative aspect-[4/4.7] overflow-hidden bg-stone-200"><img src={imageUrl(object.image)} alt={object.title} loading="lazy" className="size-full object-cover transition-transform duration-500 hover:scale-[1.025]" /><Badge className="absolute left-4 top-4 rounded-none bg-[#082f49]">{object.reign}</Badge></div><CardHeader className="pt-5"><CardTitle className="font-serif-cn text-2xl font-normal">{object.title}</CardTitle><CardDescription className="min-h-20 pt-2 leading-6">{object.note}</CardDescription></CardHeader><CardContent className="pb-4"><div className="flex justify-between gap-3 border-t pt-3 text-xs text-muted-foreground"><span>{object.type}</span><span>The Met {object.id}</span></div></CardContent><ObjectDialog object={object} /></Card>)}
      </div>
    </section>
  )
}

function SourcesSection() {
  return (
    <section id="sources" className="section-shell scroll-mt-20 bg-[#082f49] text-white">
      <SectionHeading dark eyebrow="TRACEABLE BY DESIGN" title="资料来源与注释" intro="优先使用博物馆、馆藏数据库、博物院研究期刊与公开教育资料。二手资料只作为检索线索，不作为页面结论的唯一依据。" />
      <div className="grid border-l border-t border-white/15 sm:grid-cols-2 xl:grid-cols-4">
        {sources.map(source => <a key={source.title} href={source.url} target="_blank" rel="noreferrer" className="group min-h-60 border-b border-r border-white/15 p-6 transition-colors hover:bg-white/[.06]"><p className="text-xs tracking-[.08em] text-[#f0b4a9]">{source.org}</p><h3 className="mt-9 font-serif-cn text-lg">{source.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{source.text}</p></a>)}
      </div>
      <div className="mt-6 grid gap-2 border-l-2 border-[#b8d2c4] bg-white/[.05] p-5 text-sm sm:grid-cols-[auto_1fr_auto] sm:gap-5"><strong>编辑原则</strong><p className="text-white/58">朝代特征使用“常见、倾向、可见”等表述，不把风格趋势写成绝对鉴定口诀；馆藏数据库如日后更新，以原馆藏页为准。</p><span className="text-xs text-white/40">资料校订：2026-11-25</span></div>
    </section>
  )
}

function Footer() {
  return <footer className="bg-[#041820] px-5 py-10 text-white/60"><div className="mx-auto grid max-w-[1360px] items-center gap-7 md:grid-cols-[auto_1fr_auto]"><Brand light /><p className="max-w-3xl text-xs leading-6">专注清代官窑与宫廷御用瓷。内容用于学习索引，不替代实物鉴定、法律意见或交易判断。</p><a href="#top" className="text-sm text-[#b8d2c4]">回到顶部</a></div></footer>
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-3">跳到正文</a>
      <SiteHeader />
      <main id="main"><Hero /><ScopeBar /><MethodSection /><TimelineSection /><MarksSection /><FormsSection /><MaterialsSection /><CollectionSection /><SourcesSection /></main>
      <Footer />
    </div>
  )
}
