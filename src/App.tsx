import { useEffect, useMemo, useState } from "react"
import { Database, ExternalLink, Images, Search, Stamp } from "lucide-react"
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

const fullCatalog = catalogData as CatalogItem[]
const catalog = fullCatalog.filter((item): item is CatalogItem & { image: string } => Boolean(item.image))
const reigns = ["全部", "康熙", "雍正", "乾隆", "嘉庆", "道光", "光绪"]
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
        <MuseumImage src={current.image} alt={`${titleFor(item)} · ${current.label}`} className="max-h-[72svh] size-full" />
        <Badge variant="secondary" className="absolute left-3 top-3 rounded-sm bg-white/92 backdrop-blur">{current.label}</Badge>
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

export default function App() {
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
    <div className="min-h-screen bg-background text-foreground">
      <a href="#catalog" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">跳到图鉴</a>
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3" aria-label="清瓷图鉴首页">
            <span className="grid size-9 place-items-center rounded-sm bg-foreground font-serif text-lg text-background">清</span>
            <div><strong className="block leading-none">清瓷图鉴</strong><span className="text-xs text-muted-foreground">清代官窑馆藏索引</span></div>
          </a>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Database className="size-4" /><span>{catalog.length} 件有图馆藏</span></div>
        </div>
      </header>

      <main id="top">
        <section className="border-b">
          <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
            <p className="mb-3 text-sm font-medium text-muted-foreground">QING IMPERIAL PORCELAIN INDEX</p>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">清代官窑图鉴</h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">只展示已取得馆方开放主图的器物。点击卡片即可在本站一次查看断代、器型、釉彩、材质、尺寸与全部开放附图；底款和胎底照片可直接筛选。</p>
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
              <Button type="button" variant={imageFilter === "有底款图" ? "default" : "outline"} onClick={() => setImageFilter(imageFilter === "有底款图" ? "全部有图" : "有底款图")}><Stamp className="size-4" />直接看底款</Button>
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
      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">清瓷图鉴 · 资料索引，不替代实物鉴定 · 数据校订 2026-11-25</footer>
    </div>
  )
}
