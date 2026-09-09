# 工具演示场景 · 1.0.0

本卡是通用 ChatCut 原生 Motion Graphic 模板。只保存构图、动画、默认文案、颜色及尺寸参数、媒体槽位定义。实际录屏、Logo、人物视频和项目属性覆盖只在 ChatCut 实例中绑定，不保存到卡片源码或网页默认预览。

## 唯一源码和预览

源码：`cards/tool-demo-scene/versions/1.0.0/Component.jsx`。

默认画布 1920×1080、时长 4 秒。Vite 仅注入运行组件和预览 export；网页使用 Remotion Player 执行同一份 JSX。网页媒体槽保持空值，显示待绑定提示，仍可预览网格、组合构图及标签动画。

## 构图与节奏

内部采用 1280×720 参考坐标：

- 主录屏 `(130,92)`，1020×570，圆角 54。
- 白色 Logo 底板 `(77,47)`，160×163。
- 人物窗口 `(56,457)`，直径 234；视频内容圆形裁切，外层青色描边及轻微发光。
- 标签顶部 139 / 251 / 363，右边界 1151，高度 98，宽度跟随文字。
- 0–0.18 秒网格淡入；0.1 秒录屏进入；0.22 秒 Logo、0.28 秒人物进入。
- 0.6 / 1.1 / 1.6 秒标签依次滑入并保留，缩放 0.88→1，轻微弹簧超调。

不含字幕，不生成假网页。主录屏静音，人物保留原声。默认文案为「在线用」「支持长文本导出」「音色自然」，属于模板可编辑默认值。

## 在 ChatCut 绑定素材

manifest 的三个 `mediaSlots` 都必填：

| key | 类型 | 用途 |
| --- | --- | --- |
| screenVideo | video | 主工具录屏 |
| logoImage | image | 工具 Logo |
| presenterVideo | video | 人物口播 |

安装时使用 `src/cards/bindings.ts` 的 `chatcutProperties(manifest)`，将 mediaSlots 转换成原生 image/video properties，默认值全部为空。`mediaSlots` 不是原生创建工具的直接参数。

ChatCut 实例通过素材选择器或 `propertyOverrides` 绑定素材。组件通过 `item.props` 和原生 `Video` / `Img` 渲染；不要把素材写成 text 参数，不要把实例绑定反写入通用 manifest 或 JSX。

当前 MCP 图片绑定曾出现本地图片缺少 remoteUrl 的校验限制；不能把接口写入成功等同于画面验收通过。具体项目的资产 ID、测试素材及验收记录不属于本模板说明。

## 检查

运行 `npm test`、`npm run validate:cards`、`npm run build`。
网页检查通用构图和动画；绑定实际素材后的最终画面在 ChatCut 中验收。
