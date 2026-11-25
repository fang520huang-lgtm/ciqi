# 清瓷图鉴｜清代官窑馆藏索引

以权威博物馆记录为基础的清代官窑瓷器图鉴。界面使用 shadcn/ui 的开放组件方式构建，主体是搜索、朝代/器型/釉彩筛选、馆藏卡片与单件详情。

## 当前数据

- 248 条 The Metropolitan Museum of Art Open Access 馆藏记录
- 仅收录馆方明确标注为清代某朝 `mark and period`、材质为瓷器且属于 Public Domain 的对象
- 康熙 120、雍正 32、乾隆 54、嘉庆 17、道光 23、光绪 2
- 所有记录保留馆藏编号、尺寸、材质、断代和原始馆藏链接

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

脚本会重新筛选权威记录、读取 The Met Collection API、下载公共领域图片并生成 `src/catalog.json`。

## 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会通过 GitHub Actions 部署到：

https://fang520huang-lgtm.github.io/ciqi/
