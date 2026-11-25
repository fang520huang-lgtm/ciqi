# 图片来源与授权记录

本项目的瓷器实物图均来自 The Metropolitan Museum of Art（The Met）Open Access 藏品数据库，原始记录标注为 **Public Domain**。文件优先使用 The Met 提供的 `web-large` 版本；未裁去馆方拍摄背景或馆藏标签。馆方页面可见但未明确开放复用的图片不复制到本项目。

## 批量图鉴数据

- `src/catalog.json` 由 The Met 官方 Open Access 全量数据集 `MetObjects.csv` 筛选生成。
- 收录条件：`Is Public Domain = True`、`Department = Asian Art`、`Culture = China`、`Period` 为清代且明确包含 `mark and period`、`Medium` 包含 `Porcelain`。
- 当前共 248 条元数据：康熙 120、雍正 32、乾隆 54、嘉庆 17、道光 23、光绪 2；其中 159 件已校验并下载开放主图。
- `public/assets/images/catalog/met-{Object ID}.jpg` 与 The Met Object ID 一一对应；每条记录的原始馆藏链接保存在 `catalog.json`。
- `public/assets/images/catalog/details/met-{Object ID}-{序号}.jpg` 为同一馆藏的开放附加视角。当前 51 件含附图；42 件经视觉确认含底款图，45 件含底款或胎底/足部图。
- `scripts/build-catalog.ps1` 负责从官方 CSV 生成基础目录；`scripts/enrich-catalog.mjs` 断点补充开放图与馆藏字段；`scripts/curate-details.mjs` 写入已经人工确认的底款/胎底分类。

The Met 官方开放数据仓库：https://github.com/metmuseum/openaccess

| 本地文件前缀 | 藏品 | 馆藏号 | 原始记录 |
| --- | --- | --- | --- |
| `kangxi-water-coupe*` | 清康熙 豇豆红釉太白尊 | 91.1.407 | https://www.metmuseum.org/art/collection/search/51221 |
| `kangxi-flower-cups*` | 清康熙 青花五彩十二月令花神杯 | 50.145.267–.278 | https://www.metmuseum.org/art/collection/search/52872 |
| `kangxi-brush-washer*` | 清康熙 豇豆红釉笔洗 | 14.40.385 | https://www.metmuseum.org/art/collection/search/42230 |
| `yongzheng-ewer*` | 清雍正 粉青釉暗花花浇 | 1981.468 | https://www.metmuseum.org/art/collection/search/50765 |
| `yongzheng-bowl*` | 清雍正 粉彩花蝶纹碗 | 65.86.5 | https://www.metmuseum.org/art/collection/search/50776 |
| `qianlong-gui*` | 清乾隆 霁蓝釉礼器簋 | 25.143.1a, b | https://www.metmuseum.org/art/collection/search/42418 |
| `qianlong-nine-peaches*` | 清乾隆 粉彩九桃纹天球瓶 | 17.120.194 | https://www.metmuseum.org/art/collection/search/42317 |
| `qianlong-archaistic-vase*` | 清乾隆 绿釉描金仿古纹瓶 | 14.40.400 | https://www.metmuseum.org/art/collection/search/46130 |
| `daoguang-phoenix-bowl*` | 清道光 粉彩夔凤纹碗 | 79.2.664 | https://www.metmuseum.org/art/collection/search/51122 |
| `daoguang-yellow-jar*` | 清道光 黄釉罐 | 79.2.1215 | https://www.metmuseum.org/art/collection/search/51187 |

The Met Open Access 政策：https://www.metmuseum.org/about-the-met/policies-and-documents/open-access

## 使用说明

- 页面中的年代、材质、尺寸与馆藏号以对应馆藏记录为准。
- `detail`、`base` 文件为同一馆藏记录中的附加视角；底部旧标签、红色编号或馆藏贴纸不是原器款识。
- 数据中的 `check-failed` 表示本次核对受到网络或馆方临时限流影响，不代表馆方无图；这类记录不会显示“无开放图”的错误结论。
- 图片有馆方网页展示但没有明确开放许可时，网站只说明可查看的图片类型并给出馆方入口，不转载受限图片。
- 如馆方日后修订定名或年代，以原始记录的最新内容为准。
