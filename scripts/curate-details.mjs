import { readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const projectRoot = new URL("..", import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, "$1")
const catalogPath = join(projectRoot, "src", "catalog.json")
const catalog = JSON.parse(await readFile(catalogPath, "utf8"))
const catalogImageRoot = join(projectRoot, "public", "assets", "images", "catalog")
const detailImageRoot = join(catalogImageRoot, "details")
const mainFiles = new Set((await readdir(catalogImageRoot)).filter((name) => /^met-\d+\.jpg$/.test(name)))
const detailFiles = (await readdir(detailImageRoot)).filter((name) => /^met-\d+-\d+\.jpg$/.test(name))

const markDetails = new Set([
  "42217-2", "42227-3", "42229-2", "42230-2", "42232-2", "42244-2", "42247-4",
  "42363-1", "42386-1", "42388-5", "42404-2", "42405-1", "42410-1", "42413-1",
  "42416-4", "42421-3", "42422-1", "42423-1", "42424-1", "42427-2", "42428-1",
  "46964-3", "49348-3", "49349-4", "49350-2", "49351-1", "49853-1", "50740-3",
  "50779-4", "50791-2", "50925-1", "50929-1",
  "51162-2", "51221-1", "52044-1", "52049-1", "52056-2", "52869-4",
])

const baseDetails = new Set(["42404-1", "45879-2", "49349-3", "50840-6"])
const noteDetails = new Map([
  ["50779-6", "杯身诗文与印章"],
  ["50840-4", "器身题诗局部"],
  ["50840-5", "器身题诗局部"],
  ["52837-1", "器内俯视"],
])

const legacy = {
  "51221": [
    { image: "kangxi-water-coupe-base.jpg", kind: "mark", label: "底款局部" },
  ],
  "50765": [
    { image: "yongzheng-ewer-detail-1.jpg", kind: "mark", label: "底款局部" },
    { image: "yongzheng-ewer-detail-2.jpg", kind: "view", label: "整器另一面" },
    { image: "yongzheng-ewer-detail-3.jpg", kind: "view", label: "整器另一面" },
  ],
  "42317": [
    { image: "qianlong-nine-peaches-detail-1.jpg", kind: "view", label: "整器另一面" },
    { image: "qianlong-nine-peaches-detail-2.jpg", kind: "view", label: "整器另一面" },
    { image: "qianlong-nine-peaches-detail-3.jpg", kind: "view", label: "整器另一面" },
    { image: "qianlong-nine-peaches-detail-4.jpg", kind: "mark", label: "底款局部" },
  ],
  "42418": [
    { image: "qianlong-gui-detail-1.jpg", kind: "view", label: "整器正面" },
    { image: "qianlong-gui-detail-2.jpg", kind: "base", label: "器底与足部" },
    { image: "qianlong-gui-detail-3.jpg", kind: "mark", label: "底款局部" },
  ],
  "51122": [
    { image: "daoguang-phoenix-bowl-detail-1.jpg", kind: "view", label: "纹饰展开视角" },
    { image: "daoguang-phoenix-bowl-detail-2.jpg", kind: "view", label: "纹饰展开视角" },
    { image: "daoguang-phoenix-bowl-detail-3.jpg", kind: "view", label: "纹饰展开视角" },
    { image: "daoguang-phoenix-bowl-detail-4.jpg", kind: "mark", label: "底款与圈足" },
  ],
}

const markDescriptions = {
  "50765": "青花六字篆书“大清雍正年製”款",
  "42317": "青花六字篆书“大清乾隆年製”款",
  "42418": "模印六字篆书“大清乾隆年製”款",
  "51122": "青花六字篆书“大清道光年製”款",
}

for (const item of catalog) {
  const mainName = `met-${item.id}.jpg`
  if (mainFiles.has(mainName)) {
    item.image = `catalog/${mainName}`
    item.imageStatus = "open"
  }

  let details = (item.additionalImages ?? []).map((detail, index) => {
    const key = `${item.id}-${index + 1}`
    if (markDetails.has(key)) return { ...detail, kind: "mark", label: "底款与圈足" }
    if (baseDetails.has(key)) return { ...detail, kind: "base", label: "胎底 / 足部" }
    if (item.id === "42258" && index === 0) return { ...detail, kind: "base", label: "底部与图记" }
    if (noteDetails.has(key)) return { ...detail, kind: "detail", label: noteDetails.get(key) }
    return detail
  })

  const recoveredDetails = detailFiles
    .filter((name) => name.startsWith(`met-${item.id}-`))
    .sort((left, right) => Number(left.match(/-(\d+)\.jpg$/)?.[1]) - Number(right.match(/-(\d+)\.jpg$/)?.[1]))
  for (const name of recoveredDetails) {
    const image = `catalog/details/${name}`
    if (!details.some((detail) => detail.image === image)) {
      const number = name.match(/-(\d+)\.jpg$/)?.[1]
      details.push({ image, kind: "view", label: `附加视角 ${number}` })
    }
  }

  for (const detail of legacy[item.id] ?? []) {
    if (!details.some((current) => current.image === detail.image)) details.push(detail)
  }

  const hasMarkImage = details.some((detail) => detail.kind === "mark")
  const hasBaseImage = details.some((detail) => detail.kind === "mark" || detail.kind === "base")
  item.additionalImages = details
  item.hasMarkImage = hasMarkImage
  item.hasBaseImage = hasBaseImage
  item.hasDetailImages = details.length > 0

  if (hasMarkImage) {
    item.markDescription = markDescriptions[item.id]
      ?? (item.reign === "康熙" ? "青花六字双行楷书“大清康熙年製”款" : "")
  } else {
    item.markDescription = ""
  }
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")
console.log(`Curated ${catalog.filter((item) => item.hasMarkImage).length} mark records and ${catalog.filter((item) => item.hasBaseImage).length} base records.`)
