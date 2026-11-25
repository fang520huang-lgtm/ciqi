# 清瓷图鉴｜清代官窑馆藏索引

以权威博物馆记录为基础的清代官窑瓷器图鉴。界面使用 shadcn/ui 的开放组件方式构建，主体是有图馆藏卡片、底款/胎底筛选、馆藏搜索与单件图文详情。

## 当前数据

- 248 条 The Metropolitan Museum of Art Open Access 馆藏元数据，其中 159 件已校验并下载开放主图
- 51 件含馆方附加视角，42 件已视觉确认含底款图，45 件含底款或胎底/足部图
- 仅收录馆方明确标注为清代某朝 `mark and period`、材质为瓷器且属于 Public Domain 的对象
- 康熙 120、雍正 32、乾隆 54、嘉庆 17、道光 23、光绪 2
- 网站主网格只显示已有开放主图的器物；所有详情保留馆藏编号、尺寸、材质、断代和原始馆藏链接

图像及数据来源说明见 [`IMAGE_SOURCES.md`](IMAGE_SOURCES.md)。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 更新馆藏数据

从 The Met 官方 Open Access 仓库下载 `MetObjects.csv`，然后运行：

```powershell
pwsh -File .\scripts\build-catalog.ps1 -MetCsvPath C:\path\to\MetObjects.csv
```

脚本会重新筛选权威记录、读取 The Met Collection API、下载公共领域主图并生成 `src/catalog.json`。继续补齐主图、附加视角和馆藏字段，再执行人工确认过的底款分类：

```powershell
node .\scripts\enrich-catalog.mjs --limit 60 --delay 1500
node .\scripts\curate-details.mjs
```

抓取失败只会标为 `check-failed`，不会再误写成“无开放图片”。

## 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会通过 GitHub Actions 部署到：

https://fang520huang-lgtm.github.io/ciqi/
