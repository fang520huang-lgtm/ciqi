import { useEffect, useMemo, useState } from "react"
import { Database, ExternalLink, Images, Maximize2, Search, Stamp } from "lucide-react"
import catalogData from "./catalog.json"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type DetailImage = {
  image: string
  kind: "view" | "mark" | "base" | "detail"
  label: string
}

type CatalogItem = {
  id: string
  objectNumber: string
  titleZh: string
  title: string
  reign: string
  period: string
  date: string
  category: string
  decoration: string
  medium: string
  dimensions: string
  image: string | null
  imageStatus?: "open" | "museum-only" | "unavailable" | "check-failed"
  additionalImages?: DetailImage[]
  hasMarkImage?: boolean
  hasBaseImage?: boolean
  hasDetailImages?: boolean
  markDescription?: string
  objectName?: string
  creditLine?: string
  accessionYear?: string
  galleryNumber?: string
  tags?: string[]
  source: string
  rights: string
  url: string
}

type SiteView = "catalog" | "marks"

const fullCatalog = catalogData as CatalogItem[]
const catalog = fullCatalog.filter((item): item is CatalogItem & { image: string } => Boolean(item.image))
const markCatalog = fullCatalog.flatMap((item) => {
  const markImage = item.additionalImages?.find((image) => image.kind === "mark")
  return markImage ? [{ item, markImage }] : []
})
const reigns = ["全部", "顺治", "康熙", "雍正", "乾隆", "嘉庆", "道光", "咸丰", "同治", "光绪", "宣统"]
const markReigns = ["顺治", "康熙", "雍正", "乾隆", "嘉庆", "道光", "咸丰", "同治", "光绪", "宣统"]
const categoryOrder = ["全部", "碗", "盘", "杯", "瓶", "罐", "文房", "壶", "盒", "炉", "其他"]
const decorationOrder = ["全部", "青花", "釉上彩", "粉彩", "青釉", "豇豆红", "铜红釉", "黄釉", "蓝釉", "白釉", "颜色釉", "茄皮紫釉", "瓷器"]
const imageFilters = ["全部有图", "有底款图", "有胎底图", "有附加图"]

function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}assets/images/${path}`
}

function titleFor(item: CatalogItem) {
  const title = item.titleZh?.trim() || item.title
  if (/[A-Za-z]/.test(title)) return item.decoration === "瓷器" ? item.category : `${item.decoration}${item.category}`
  if (title.length <= 2 && item.decoration !== "瓷器") return `${item.decoration}${title}`
  return title
}

function countBy(key: "reign" | "category" | "decoration", value: string) {
  if (value === "全部") return catalog.length
  return catalog.filter((item) => item[key] === value).length
}

function matchesImageFilter(item: CatalogItem, value: string) {
  if (value === "有底款图") return Boolean(item.hasMarkImage)
  if (value === "有胎底图") return Boolean(item.hasBaseImage)
  if (value === "有附加图") return Boolean(item.additionalImages?.length)
  return true
}

function countImageFilter(value: string) {
  return catalog.filter((item) => matchesImageFilter(item, value)).length
}

function MuseumImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={assetUrl(src)} alt={alt} loading="lazy" className={`bg-white object-contain ${className}`} />
}

function ZoomableMuseumImage({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="group/zoom relative block size-full cursor-zoom-in overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`放大查看${label}`}>
          <MuseumImage src={src} alt={alt} className={className} />
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-sm bg-black/70 px-2.5 py-1.5 text-xs text-white opacity-0 backdrop-blur transition-opacity group-hover/zoom:opacity-100 group-focus-visible/zoom:opacity-100">
            <Maximize2 className="size-3.5" />点击放大
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="h-[94svh] w-[calc(100%-1rem)] max-w-[96vw] gap-0 overflow-hidden border-0 bg-black/95 p-3 text-white shadow-2xl sm:p-5" showCloseButton>
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">放大查看馆方开放图片</DialogDescription>
        <MuseumImage src={src} alt={alt} className="size-full max-h-[calc(94svh-1.5rem)] bg-transparent" />
        <span className="pointer-events-none absolute bottom-4 left-1/2 max-w-[80vw] -translate-x-1/2 truncate rounded-sm bg-black/70 px-3 py-1.5 text-sm text-white backdrop-blur">{label}</span>
      </DialogContent>
    </Dialog>
  )
}

function ImageGallery({ item }: { item: CatalogItem & { image: string } }) {
  const gallery = [
    { image: item.image, kind: "main", label: "整器" },
    ...(item.additionalImages ?? []),
  ]
  const [selected, setSelected] = useState(0)
  const current = gallery[selected] ?? gallery[0]

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-muted/45 p-4 sm:p-5 lg:min-h-[720px]">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-white">
        <ZoomableMuseumImage src={current.image} alt={`${titleFor(item)} · ${current.label}`} label={`${titleFor(item)} · ${current.label}`} className="max-h-[72svh] size-full" />
        <Badge variant="secondary" className="pointer-events-none absolute left-3 top-3 rounded-sm bg-white/92 backdrop-blur">{current.label}</Badge>
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="器物附图">
          {gallery.map((image, index) => (
            <button
              key={`${image.image}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`查看${image.label}`}
              aria-pressed={selected === index}
              className={`relative size-20 shrink-0 overflow-hidden rounded-md border-2 bg-white p-1 transition ${selected === index ? "border-foreground" : "border-transparent hover:border-border"}`}
            >
              <MuseumImage src={image.image} alt="" className="size-full" />
              {image.kind === "mark" && <span className="absolute bottom-1 right-1 rounded-sm bg-foreground px-1 text-[10px] text-background">款</span>}
              {image.kind === "base" && <span className="absolute bottom-1 right-1 rounded-sm bg-foreground px-1 text-[10px] text-background">底</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ItemDialog({ item }: { item: CatalogItem & { image: string } }) {
  const metadata = [
    ["馆藏编号", item.objectNumber],
    ["馆藏断代", item.period],
    ["年代", item.date || "馆藏记录未单列"],
    ["器型", item.category],
    ["装饰 / 釉彩", item.decoration],
    ["材质与工艺", item.medium],
    ["尺寸", item.dimensions || "馆藏记录未公开"],
    ["款识", item.markDescription],
    ["入藏年份", item.accessionYear],
    ["来源 / 捐赠", item.creditLine],
    ["展厅", item.galleryNumber ? `The Met ${item.galleryNumber} 展厅` : ""],
    ["收藏机构", item.source],
  ].filter(([, value]) => Boolean(value)) as [string, string][]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Card className="gap-0 overflow-hidden rounded-md py-0 shadow-none transition hover:border-foreground/25 hover:shadow-sm">
            <div className="relative aspect-[4/5] overflow-hidden bg-white p-3">
              <MuseumImage src={item.image} alt={titleFor(item)} className="size-full transition-transform duration-300 group-hover:scale-[1.015]" />
              <Badge variant="secondary" className="absolute left-3 top-3 rounded-sm bg-white/90 text-foreground backdrop-blur">{item.reign}</Badge>
              {item.hasMarkImage && <Badge className="absolute bottom-3 right-3 rounded-sm"><Stamp className="size-3" />底款</Badge>}
              {!item.hasMarkImage && item.additionalImages?.length ? <Badge variant="outline" className="absolute bottom-3 right-3 rounded-sm bg-white/90"><Images className="size-3" />{item.additionalImages.length} 附图</Badge> : null}
            </div>
            <CardContent className="border-t p-4">
              <h2 className="line-clamp-2 min-h-12 font-medium leading-6">{titleFor(item)}</h2>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{item.category} · {item.decoration}</span>
                <span className="shrink-0">{item.objectNumber}</span>
              </div>
            </CardContent>
          </Card>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[96svh] max-w-6xl overflow-y-auto p-0 sm:rounded-lg">
        <div className="grid lg:grid-cols-[1.12fr_.88fr]">
          <ImageGallery item={item} />
          <div className="p-6 sm:p-9">
            <DialogHeader className="text-left">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge className="rounded-sm">{item.reign}</Badge>
                <Badge variant="outline" className="rounded-sm">本朝款及本朝</Badge>
                <Badge variant="outline" className="rounded-sm">{item.rights}</Badge>
              </div>
              <DialogTitle className="text-3xl leading-tight">{titleFor(item)}</DialogTitle>
              <DialogDescription>{item.title}</DialogDescription>
            </DialogHeader>

            {item.hasMarkImage && (
              <div className="mt-6 rounded-md border bg-muted/35 p-4">
                <div className="flex items-center gap-2 text-sm font-medium"><Stamp className="size-4" />此器有底款附图</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.markDescription || "点击左侧标有“款”的缩略图，可直接查看馆方开放的底款照片。"}</p>
              </div>
            )}

            <dl className="mt-7 divide-y border-y text-sm">
              {metadata.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="leading-6">{value}</dd>
                </div>
              ))}
            </dl>

            {item.tags?.length ? <p className="mt-4 text-xs leading-5 text-muted-foreground">馆方标签：{item.tags.join("、")}</p> : null}
            <Button asChild className="mt-7 w-full"><a href={item.url} target="_blank" rel="noreferrer">查看博物馆原始记录 <ExternalLink className="size-4" /></a></Button>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">本页已集中呈现馆方开放的基本资料与可复用图片；原始链接用于核查最新版权状态和馆藏记录。</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FilterButtons({ items, value, onChange, kind }: { items: string[]; value: string; onChange: (value: string) => void; kind: "reign" | "category" | "decoration" }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.filter((item) => item === "全部" || countBy(kind, item) > 0).map((item) => (
        <Button key={item} type="button" size="sm" variant={value === item ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => onChange(item)}>
          {item}<span className="ml-1 text-[11px] opacity-55">{countBy(kind, item)}</span>
        </Button>
      ))}
    </div>
  )
}

function MarkAtlas() {
  const grouped = markReigns
    .map((reign) => ({ reign, records: markCatalog.filter(({ item }) => item.reign === reign) }))
    .filter(({ records }) => records.length)

  return (
    <main id="top">
      <section className="border-b">
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="mb-3 text-sm font-medium text-muted-foreground">QING IMPERIAL MARK STUDY</p>
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">清代官窑底款图鉴</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">专门研究底款的独立图鉴，只展示馆方开放的底款照片，不混入整器、侧面或其他细节图。按朝代分区，可对照款识书体、布局、落款方式与圈足特征。</p>
            </div>
            <div className="flex items-baseline gap-3"><strong className="text-4xl">{markCatalog.length}</strong><span className="text-sm text-muted-foreground">张开放底款图</span></div>
          </div>
          <nav className="mt-8 flex gap-2 overflow-x-auto pb-1" aria-label="按朝代查看底款">
            {grouped.map(({ reign, records }) => (
              <Button key={reign} asChild size="sm" variant="outline" className="shrink-0 rounded-full">
                <a href={`#mark-${reign}`}>{reign}<span className="ml-1 text-[11px] opacity-55">{records.length}</span></a>
              </Button>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6">
        {grouped.map(({ reign, records }, groupIndex) => (
          <section key={reign} id={`mark-${reign}`} className={`scroll-mt-24 ${groupIndex ? "mt-16 border-t pt-12" : ""}`}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div><p className="text-sm text-muted-foreground">{reign}官窑</p><h2 className="mt-1 text-3xl font-semibold">{reign}底款</h2></div>
              <span className="text-sm text-muted-foreground">{records.length} 张</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {records.map(({ item, markImage }) => (
                <Card key={`${item.id}-${markImage.image}`} className="gap-0 overflow-hidden rounded-md py-0 shadow-none">
                  <div className="aspect-square overflow-hidden border-b bg-white p-3">
                    <ZoomableMuseumImage src={markImage.image} alt={`${item.reign} · ${item.markDescription || "官窑底款"}`} label={`${item.reign} · ${item.markDescription || `${titleFor(item)}底款`}`} className="size-full transition-transform duration-300 group-hover/zoom:scale-[1.02]" />
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between gap-2"><Badge className="rounded-sm">{item.reign}</Badge><span className="text-xs text-muted-foreground">{item.objectNumber}</span></div>
                    <h3 className="line-clamp-2 min-h-12 font-medium leading-6">{item.markDescription || "馆方未单列款识文字"}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{titleFor(item)} · {item.category}</p>
                    <a className="mt-4 inline-flex items-center gap-1 text-sm underline underline-offset-4" href={item.url} target="_blank" rel="noreferrer">馆方记录 <ExternalLink className="size-3.5" /></a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="border-t bg-muted/35">
        <div className="mx-auto max-w-[1500px] px-4 py-9 text-sm leading-7 text-muted-foreground sm:px-6">
          <h2 className="font-medium text-foreground">底款研究提示</h2>
          <p className="mt-2 max-w-4xl">同一朝代的年款会因书写者、烧造批次、器型与窑炉气氛出现差异；底款只能作为断代证据之一，应与胎釉、器型、纹饰、修足和馆藏来源综合判断。本站资料索引不替代实物鉴定。</p>
        </div>
      </section>
    </main>
  )
}

function CatalogView() {
  const [query, setQuery] = useState("")
  const [reign, setReign] = useState("全部")
  const [category, setCategory] = useState("全部")
  const [decoration, setDecoration] = useState("全部")
  const [imageFilter, setImageFilter] = useState("全部有图")
  const [visible, setVisible] = useState(40)

  const categories = categoryOrder.filter((name) => name === "全部" || catalog.some((item) => item.category === name))
  const decorations = decorationOrder.filter((name) => name === "全部" || catalog.some((item) => item.decoration === name))
  const withMarks = catalog.filter((item) => item.hasMarkImage).length
  const withDetails = catalog.filter((item) => item.additionalImages?.length).length

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return catalog.filter((item) => {
      if (reign !== "全部" && item.reign !== reign) return false
      if (category !== "全部" && item.category !== category) return false
      if (decoration !== "全部" && item.decoration !== decoration) return false
      if (!matchesImageFilter(item, imageFilter)) return false
      if (!needle) return true
      return [item.titleZh, item.title, item.objectNumber, item.reign, item.category, item.decoration, item.medium, item.markDescription, ...(item.tags ?? [])].join(" ").toLowerCase().includes(needle)
    })
  }, [category, decoration, imageFilter, query, reign])

  useEffect(() => setVisible(40), [category, decoration, imageFilter, query, reign])

  const clearFilters = () => {
    setQuery("")
    setReign("全部")
    setCategory("全部")
    setDecoration("全部")
    setImageFilter("全部有图")
  }

  return (
    <main id="top">
      <section className="border-b">
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
          <p className="mb-3 text-sm font-medium text-muted-foreground">QING IMPERIAL PORCELAIN INDEX</p>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">清代官窑图鉴</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">只展示已取得馆方开放主图的器物。点击卡片即可在本站一次查看断代、器型、釉彩、材质、尺寸与全部开放附图；点击详情大图可全屏放大。</p>
            </div>
            <div className="flex gap-8 text-sm">
              <div><strong className="block text-3xl text-foreground">{catalog.length}</strong><span className="text-muted-foreground">有图器物</span></div>
              <div><strong className="block text-3xl text-foreground">{withMarks}</strong><span className="text-muted-foreground">有底款图</span></div>
              <div><strong className="block text-3xl text-foreground">{withDetails}</strong><span className="text-muted-foreground">有附加图</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-[1500px] scroll-mt-20 px-4 py-8 sm:px-6">
        <Card className="mb-8 gap-5 rounded-lg p-4 shadow-none sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block max-w-xl flex-1">
              <span className="sr-only">搜索馆藏</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索器名、釉彩、材质、款识或馆藏编号" className="pl-9" />
            </label>
            <Button asChild variant="outline"><a href={`${import.meta.env.BASE_URL}?view=marks`}><Stamp className="size-4" />进入底款图鉴</a></Button>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">图片</span><div className="flex gap-2 overflow-x-auto pb-1">{imageFilters.filter((item) => countImageFilter(item) > 0).map((item) => <Button key={item} type="button" size="sm" variant={imageFilter === item ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => setImageFilter(item)}>{item}<span className="ml-1 text-[11px] opacity-55">{countImageFilter(item)}</span></Button>)}</div></div>
            <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">朝代</span><FilterButtons items={reigns} value={reign} onChange={setReign} kind="reign" /></div>
            <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">器型</span><FilterButtons items={categories} value={category} onChange={setCategory} kind="category" /></div>
            <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">釉彩</span><FilterButtons items={decorations} value={decoration} onChange={setDecoration} kind="decoration" /></div>
          </div>
        </Card>

        <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>找到 {filtered.length} 件</span>
          {(query || reign !== "全部" || category !== "全部" || decoration !== "全部" || imageFilter !== "全部有图") && <Button variant="ghost" size="sm" onClick={clearFilters}>清除筛选</Button>}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.slice(0, visible).map((item) => <ItemDialog key={item.id} item={item} />)}
        </div>
        {!filtered.length && <div className="rounded-lg border border-dashed py-20 text-center text-muted-foreground">没有匹配的有图馆藏记录。</div>}
        {visible < filtered.length && <div className="mt-10 text-center"><Button variant="outline" size="lg" onClick={() => setVisible((value) => value + 40)}>加载更多（已显示 {Math.min(visible, filtered.length)} / {filtered.length}）</Button></div>}
      </section>

      <section className="border-t bg-muted/35">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-10 text-sm leading-7 text-muted-foreground sm:px-6 lg:grid-cols-2">
          <div><h2 className="font-medium text-foreground">收录标准</h2><p className="mt-2">当前批次来自 The Metropolitan Museum of Art Open Access 数据集，仅收录馆方明确标注为清代某朝“mark and period”、材质为瓷器且属于公共领域的记录。主图抓取失败不会再被误标成“无开放图”；主网格只展示已校验成功的本地图像。</p></div>
          <div>
            <h2 className="font-medium text-foreground">图像与版权</h2><p className="mt-2">本站只转载馆方明确开放复用的图片。馆方页面有图但未开放转载时，会另列图片类型和查看入口，不复制受限图像；没有底款、胎底或修足附图的器物不显示空栏目。</p>
            <div className="mt-3 flex flex-wrap gap-4"><a className="text-foreground underline underline-offset-4" href="https://www.metmuseum.org/about-the-met/policies-and-documents/open-access" target="_blank" rel="noreferrer">The Met Open Access</a><a className="text-foreground underline underline-offset-4" href="https://github.com/fang520huang-lgtm/ciqi/blob/main/IMAGE_SOURCES.md" target="_blank" rel="noreferrer">图片与来源记录</a></div>
          </div>
        </div>
      </section>
    </main>
  )
}

function currentView(): SiteView {
  return new URLSearchParams(window.location.search).get("view") === "marks" ? "marks" : "catalog"
}

export default function App() {
  const [view, setView] = useState<SiteView>(currentView)

  useEffect(() => {
    const syncView = () => setView(currentView())
    window.addEventListener("popstate", syncView)
    return () => window.removeEventListener("popstate", syncView)
  }, [])

  useEffect(() => {
    document.title = view === "marks" ? "清代官窑底款图鉴｜清瓷图鉴" : "清瓷图鉴｜清代官窑馆藏索引"
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [view])

  const changeView = (next: SiteView) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const url = next === "marks" ? `${import.meta.env.BASE_URL}?view=marks` : import.meta.env.BASE_URL
    window.history.pushState({}, "", url)
    setView(next)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href={view === "marks" ? "#mark-康熙" : "#catalog"} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">跳到图鉴</a>
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <a href={import.meta.env.BASE_URL} onClick={changeView("catalog")} className="flex shrink-0 items-center gap-3" aria-label="清瓷图鉴首页">
            <span className="grid size-9 place-items-center rounded-sm bg-foreground font-serif text-lg text-background">清</span>
            <div className="hidden sm:block"><strong className="block leading-none">清瓷图鉴</strong><span className="text-xs text-muted-foreground">清代官窑馆藏索引</span></div>
          </a>
          <nav className="flex items-center gap-1 rounded-md bg-muted p-1" aria-label="图鉴导航">
            <Button asChild size="sm" variant={view === "catalog" ? "default" : "ghost"}><a href={import.meta.env.BASE_URL} onClick={changeView("catalog")}>器物图鉴</a></Button>
            <Button asChild size="sm" variant={view === "marks" ? "default" : "ghost"}><a href={`${import.meta.env.BASE_URL}?view=marks`} onClick={changeView("marks")}><Stamp className="size-4" />底款图鉴</a></Button>
          </nav>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex"><Database className="size-4" /><span>{view === "marks" ? `${markCatalog.length} 张底款` : `${catalog.length} 件有图馆藏`}</span></div>
        </div>
      </header>

      {view === "marks" ? <MarkAtlas /> : <CatalogView />}

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">清瓷图鉴 · 资料索引，不替代实物鉴定 · 数据校订 2026-11-26</footer>
    </div>
  )
}
