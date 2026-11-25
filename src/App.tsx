import { useEffect, useMemo, useState } from "react"
import { Database, ExternalLink, ImageOff, Search } from "lucide-react"
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
  source: string
  rights: string
  url: string
}

const catalog = catalogData as CatalogItem[]
const reigns = ["全部", "康熙", "雍正", "乾隆", "嘉庆", "道光", "光绪"]
const categoryOrder = ["全部", "碗", "盘", "杯", "瓶", "罐", "文房", "壶", "盒", "炉", "其他"]
const decorationOrder = ["全部", "青花", "釉上彩", "粉彩", "青釉", "豇豆红", "铜红釉", "黄釉", "蓝釉", "白釉", "颜色釉", "茄皮紫釉", "瓷器"]

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

function MuseumImage({ item, className = "" }: { item: CatalogItem; className?: string }) {
  if (!item.image) {
    return (
      <div className={`grid place-items-center bg-muted text-muted-foreground ${className}`}>
        <div className="text-center">
          <ImageOff className="mx-auto mb-3 size-6 opacity-45" />
          <p className="text-sm">馆藏暂无开放图像</p>
        </div>
      </div>
    )
  }
  return <img src={assetUrl(item.image)} alt={titleFor(item)} loading="lazy" className={`bg-white object-contain ${className}`} />
}

function ItemDialog({ item }: { item: CatalogItem }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Card className="gap-0 overflow-hidden rounded-md py-0 shadow-none transition hover:border-foreground/25 hover:shadow-sm">
            <div className="relative aspect-[4/5] overflow-hidden bg-white p-3">
              <MuseumImage item={item} className="size-full transition-transform duration-300 group-hover:scale-[1.015]" />
              <Badge variant="secondary" className="absolute left-3 top-3 rounded-sm bg-white/90 text-foreground backdrop-blur">
                {item.reign}
              </Badge>
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
      <DialogContent className="max-h-[94svh] max-w-5xl overflow-y-auto p-0 sm:rounded-lg">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="min-h-[360px] bg-muted/50 p-5 lg:min-h-[680px]">
            <MuseumImage item={item} className="h-full max-h-[78svh] w-full" />
          </div>
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

            <dl className="mt-7 divide-y border-y text-sm">
              {[
                ["馆藏编号", item.objectNumber],
                ["馆藏断代", item.period],
                ["年代", item.date || "馆藏记录未单列"],
                ["器型", item.category],
                ["装饰 / 釉彩", item.decoration],
                ["材质与工艺", item.medium],
                ["尺寸", item.dimensions || "馆藏记录未公开"],
                ["收藏机构", item.source],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="leading-6">{value}</dd>
                </div>
              ))}
            </dl>

            <Button asChild className="mt-7 w-full">
              <a href={item.url} target="_blank" rel="noreferrer">
                查看博物馆原始记录 <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FilterButtons({
  items,
  value,
  onChange,
  kind,
}: {
  items: string[]
  value: string
  onChange: (value: string) => void
  kind: "reign" | "category" | "decoration"
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.filter((item) => item === "全部" || countBy(kind, item) > 0).map((item) => (
        <Button
          key={item}
          type="button"
          size="sm"
          variant={value === item ? "default" : "outline"}
          className="shrink-0 rounded-full"
          onClick={() => onChange(item)}
        >
          {item}
          <span className="ml-1 text-[11px] opacity-55">{countBy(kind, item)}</span>
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
  const [visible, setVisible] = useState(40)

  const categories = categoryOrder.filter((name) => name === "全部" || catalog.some((item) => item.category === name))
  const decorations = decorationOrder.filter((name) => name === "全部" || catalog.some((item) => item.decoration === name))
  const withImages = catalog.filter((item) => item.image).length

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return catalog.filter((item) => {
      if (reign !== "全部" && item.reign !== reign) return false
      if (category !== "全部" && item.category !== category) return false
      if (decoration !== "全部" && item.decoration !== decoration) return false
      if (!needle) return true
      return [item.titleZh, item.title, item.objectNumber, item.reign, item.category, item.decoration, item.medium]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [category, decoration, query, reign])

  useEffect(() => setVisible(40), [category, decoration, query, reign])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#catalog" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">跳到图鉴</a>

      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3" aria-label="清瓷图鉴首页">
            <span className="grid size-9 place-items-center rounded-sm bg-foreground font-serif text-lg text-background">清</span>
            <div><strong className="block leading-none">清瓷图鉴</strong><span className="text-xs text-muted-foreground">清代官窑馆藏索引</span></div>
          </a>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Database className="size-4" /><span>{catalog.length} 件馆藏记录</span></div>
        </div>
      </header>

      <main id="top">
        <section className="border-b">
          <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
            <p className="mb-3 text-sm font-medium text-muted-foreground">QING IMPERIAL PORCELAIN INDEX</p>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">清代官窑图鉴</h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">以权威博物馆的“本朝款及本朝”断代为收录依据。支持按朝代、器型、釉彩和馆藏编号检索，点击卡片查看完整馆藏记录。</p>
              </div>
              <div className="flex gap-8 text-sm">
                <div><strong className="block text-3xl text-foreground">{catalog.length}</strong><span className="text-muted-foreground">馆藏条目</span></div>
                <div><strong className="block text-3xl text-foreground">{withImages}</strong><span className="text-muted-foreground">开放图片</span></div>
                <div><strong className="block text-3xl text-foreground">6</strong><span className="text-muted-foreground">已收录朝代</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-[1500px] scroll-mt-20 px-4 py-8 sm:px-6">
          <Card className="mb-8 gap-5 rounded-lg p-4 shadow-none sm:p-5">
            <label className="relative block max-w-xl">
              <span className="sr-only">搜索馆藏</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索器名、釉彩、材质或馆藏编号" className="pl-9" />
            </label>
            <Separator />
            <div className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">朝代</span><FilterButtons items={reigns} value={reign} onChange={setReign} kind="reign" /></div>
              <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">器型</span><FilterButtons items={categories} value={category} onChange={setCategory} kind="category" /></div>
              <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center"><span className="text-sm text-muted-foreground">釉彩</span><FilterButtons items={decorations} value={decoration} onChange={setDecoration} kind="decoration" /></div>
            </div>
          </Card>

          <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
            <span>找到 {filtered.length} 件</span>
            {(query || reign !== "全部" || category !== "全部" || decoration !== "全部") && (
              <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setReign("全部"); setCategory("全部"); setDecoration("全部") }}>清除筛选</Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filtered.slice(0, visible).map((item) => <ItemDialog key={item.id} item={item} />)}
          </div>

          {!filtered.length && <div className="rounded-lg border border-dashed py-20 text-center text-muted-foreground">没有匹配的馆藏记录。</div>}

          {visible < filtered.length && (
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg" onClick={() => setVisible((value) => value + 40)}>加载更多（已显示 {Math.min(visible, filtered.length)} / {filtered.length}）</Button>
            </div>
          )}
        </section>

        <section className="border-t bg-muted/35">
          <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-10 text-sm leading-7 text-muted-foreground sm:px-6 lg:grid-cols-2">
            <div><h2 className="font-medium text-foreground">收录标准</h2><p className="mt-2">当前批次来自 The Metropolitan Museum of Art Open Access 数据集，仅收录馆方明确标注为清代某朝“mark and period”、材质为瓷器且属于公共领域的记录。未把普通清代瓷器、后仿款或仅标“某朝风格”的器物混入官窑图鉴。</p></div>
            <div>
              <h2 className="font-medium text-foreground">来源与更新</h2><p className="mt-2">所有条目保留馆藏编号和原始链接。图片版权状态以馆藏页为准；数据库会继续补充故宫博物院、国立故宫博物院及其他权威开放馆藏。</p>
              <div className="mt-3 flex flex-wrap gap-4"><a className="text-foreground underline underline-offset-4" href="https://www.metmuseum.org/about-the-met/policies-and-documents/open-access" target="_blank" rel="noreferrer">The Met Open Access</a><a className="text-foreground underline underline-offset-4" href="https://github.com/fang520huang-lgtm/ciqi/blob/main/IMAGE_SOURCES.md" target="_blank" rel="noreferrer">图片与来源记录</a></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">清瓷图鉴 · 资料索引，不替代实物鉴定 · 数据校订 2026-11-25</footer>
    </div>
  )
}
