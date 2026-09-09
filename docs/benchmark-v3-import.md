# ChatCut Native Benchmark Pack V3 导入记录

导入日期：2026-09-09

本次将 Benchmark Pack V3 的 17 张原生 Motion Graphic 卡片纳入素材库。导入后素材库共有 20 张卡片。

## 版本处理

以下 6 张卡片保留原有 `1.0.0`，新增 `2.0.0` 并切换为当前版本：

- `broll-takeover`
- `keyword-impact`
- `logo-wall`
- `number-impact`
- `screen-focus-callout`
- `template-wall`

以下 11 张卡片以 `1.0.0` 新增：

- `category-card-scene`
- `chapter-neon-title`
- `perspective-result-split`
- `process-map-scene`
- `proof-split-scene`
- `result-card-scene`
- `result-gallery-scene`
- `screen-pip-scene`
- `side-kicker`
- `side-tag-cluster`
- `tool-badge`

原有 `tag-list`、`result-compare` 和 `tool-demo-scene` 保持不变。

## 素材约定

卡片只保存通用构图、动画、可编辑属性和媒体槽位声明。图片与视频属性的默认值保持为空，实际素材在 ChatCut 项目中绑定。网页素材库使用同一份 `Component.jsx` 渲染预览，并对需要绑定媒体的卡片显示提示。

## 验证

- `npm run validate:cards`：20 张卡片通过结构校验。
- `npm test`：27 项测试通过。
- `npm run build`：构建通过。
- 浏览器逐张触发 20 张卡片播放，控制台无运行错误。
