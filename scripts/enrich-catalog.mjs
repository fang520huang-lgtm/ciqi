import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

const projectRoot = new URL("..", import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, "$1")
const catalogPath = join(projectRoot, "src", "catalog.json")
const imageRoot = join(projectRoot, "public", "assets", "images")
const detailRoot = join(imageRoot, "catalog", "details")
const items = JSON.parse(await readFile(catalogPath, "utf8"))
const limitIndex = process.argv.indexOf("--limit")
const delayIndex = process.argv.indexOf("--delay")
const runLimit = limitIndex >= 0 ? Number(process.argv[limitIndex + 1]) : Number.POSITIVE_INFINITY
const requestDelay = delayIndex >= 0 ? Number(process.argv[delayIndex + 1]) : 0

await mkdir(detailRoot, { recursive: true })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchWithRetry(url, options = {}, attempts = 5) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36 Qing-Porcelain-Atlas/1.0",
          Accept: "application/json,text/plain,*/*",
          ...options.headers,
        },
        signal: AbortSignal.timeout(20_000),
      })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return response
    } catch (error) {
      lastError = error
      if (attempt < attempts) await sleep(500 * attempt)
    }
  }
  throw lastError
}

async function hasUsableFile(path) {
  try {
    return (await stat(path)).size > 1_000
  } catch {
    return false
  }
}

async function download(url, target) {
  if (await hasUsableFile(target)) return true
  const response = await fetchWithRetry(url)
  const data = Buffer.from(await response.arrayBuffer())
  if (data.length < 1_000) throw new Error("downloaded file is unexpectedly small")
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, data)
  return true
}

function webLarge(url) {
  return url.replace("/original/", "/web-large/")
}

async function pageImageInventory(url) {
  try {
    const html = await (await fetchWithRetry(url, { headers: { Accept: "text/html" } }, 3)).text()
    const match = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i)
    if (!match?.[1] || /logo|social|placeholder/i.test(match[1])) return []
    return [{ kind: "museum-only", label: "馆方页面图片", url }]
  } catch {
    return []
  }
}

const queue = items
  .map((item, index) => ({ item, index }))
  .filter(({ item }) => !item.objectName)
  .slice(0, runLimit)
let nextIndex = 0
let completed = 0
const failures = []

async function worker() {
  while (true) {
    const queueIndex = nextIndex
    nextIndex += 1
    if (queueIndex >= queue.length) return

    const { item, index } = queue[queueIndex]
    try {
      if (requestDelay) await sleep(requestDelay)
      const endpoint = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${item.id}`
      const record = await (await fetchWithRetry(endpoint)).json()
      const primaryName = `met-${item.id}.jpg`
      const primaryPath = join(imageRoot, "catalog", primaryName)
      let primaryDownloaded = await hasUsableFile(primaryPath)

      if (!primaryDownloaded && (record.primaryImageSmall || record.primaryImage)) {
        await download(record.primaryImageSmall || record.primaryImage, primaryPath)
        primaryDownloaded = true
      }

      const additional = []
      for (let detailIndex = 0; detailIndex < (record.additionalImages ?? []).length; detailIndex += 1) {
        const sourceUrl = record.additionalImages[detailIndex]
        const fileName = `met-${item.id}-${detailIndex + 1}.jpg`
        const target = join(detailRoot, fileName)
        try {
          await download(webLarge(sourceUrl), target)
        } catch {
          await download(sourceUrl, target)
        }
        additional.push({
          image: `catalog/details/${fileName}`,
          kind: "view",
          label: `附加视角 ${detailIndex + 1}`,
        })
      }

      const museumOnlyImages = !primaryDownloaded ? await pageImageInventory(item.url) : []
      items[index] = {
        ...item,
        image: primaryDownloaded ? `catalog/${primaryName}` : null,
        imageStatus: primaryDownloaded ? "open" : museumOnlyImages.length ? "museum-only" : "unavailable",
        additionalImages: additional,
        museumOnlyImages,
        objectName: record.objectName || item.category,
        creditLine: record.creditLine || "",
        accessionYear: record.accessionYear || "",
        galleryNumber: record.GalleryNumber || "",
        tags: (record.tags ?? []).map((tag) => tag.term).filter(Boolean),
      }
    } catch (error) {
      failures.push({ id: item.id, error: String(error) })
      items[index] = { ...item, imageStatus: item.image ? "open" : "check-failed", additionalImages: item.additionalImages ?? [], museumOnlyImages: item.museumOnlyImages ?? [] }
    }

    completed += 1
    if (completed % 20 === 0 || completed === queue.length) {
      console.log(`Processed ${completed}/${queue.length}`)
    }
  }
}

await worker()
await writeFile(catalogPath, `${JSON.stringify(items, null, 2)}\n`, "utf8")

const open = items.filter((item) => item.imageStatus === "open").length
const withDetails = items.filter((item) => item.additionalImages?.length).length
const museumOnly = items.filter((item) => item.imageStatus === "museum-only").length
console.log(`Open main images: ${open}; records with details: ${withDetails}; museum-page only: ${museumOnly}`)
if (failures.length) {
  console.error(`Failures (${failures.length}):`, failures)
  process.exitCode = 2
}
