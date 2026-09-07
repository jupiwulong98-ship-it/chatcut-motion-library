# ChatCut 原生动效卡片库 V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建成一个本地只读网页，展示 8 张 ChatCut 原生动效卡，并让 AI 能按卡片 ID 读取唯一 JSX 源码、复用资产和放置时间线实例。

**Architecture:** `cards/` 是唯一源码；每张卡包含 JSX、说明、封面和预览视频。React 网页只读取卡片索引并展示，不连接 ChatCut。AI 按本地文件和卡片 ID 调用 ChatCut Desktop 工具。

**Tech Stack:** Node.js 22+、Vite、React、TypeScript、Vitest、Playwright CLI、ChatCut Desktop Motion Graphic JSX。

**Spec:** `docs/superpowers/specs/2026-09-08-chatcut-motion-library-design.md`

## Global Constraints

- V1 只包含已确认的 8 张卡，不新增第九张。
- 网页只读，不修改参数、不管理素材、不连接 ChatCut。
- 列表和详情页均不自动播放；只有用户点击播放按钮才播放。
- `cards/<id>/Component.jsx` 是该版本卡片的唯一动效源码。
- 旧版本默认保留；只有用户明确授权才能删除。
- 图片、视频、Logo 和 B-roll 只在 ChatCut 内手动绑定。

---

### Task 1: 搭建只读卡片索引

**Files:**
- Create: `package.json`
- Create: `src/cards/types.ts`
- Create: `src/cards/loadCards.ts`
- Create: `scripts/validate-cards.mjs`
- Create: `tests/cards.test.ts`

**Interfaces:**
- Produces: `CardManifest` 类型、`loadCards(): CardManifest[]`、`npm run validate:cards`。

- [ ] **Step 1: 写失败测试**

  测试必须要求：卡片 ID 唯一、版本目录存在、JSX/封面/预览文件存在、参数 key 不重复。

  ```ts
  expect(cards).toHaveLength(8)
  expect(new Set(cards.map(card => card.id)).size).toBe(8)
  expect(validateCards(cards)).toEqual([])
  ```

- [ ] **Step 2: 运行 `npm test`，确认因加载器尚未实现而失败**

- [ ] **Step 3: 实现最小类型、加载器和校验脚本**

  `CardManifest` 只包含 `id/name/version/description/defaultDuration/properties/mediaSlots/poster/preview/source`。不添加账号、标签推荐或 SRT 选卡字段。

- [ ] **Step 4: 运行 `npm test` 和 `npm run validate:cards`，确认通过**

- [ ] **Step 5: 提交 `feat: scaffold read-only card registry`**

### Task 2: 标准化 8 张 ChatCut 卡片

**Files:**
- Create: `cards/<card-id>/versions/1.0.0/Component.jsx`
- Create: `cards/<card-id>/versions/1.0.0/manifest.json`
- Create: `cards/<card-id>/current.json`
- Create: `tests/motion-contract.test.ts`

**Interfaces:**
- Consumes: Task 1 的 `CardManifest` 和校验器。
- Produces: 8 个固定 ID 的 ChatCut JSX 及默认参数。

- [ ] **Step 1: 写 Motion Graphic 合约测试**

  ```ts
  expect(source).toContain('const Component')
  expect(source).not.toMatch(/^\s*import\s/m)
  expect(source).not.toContain('export default')
  expect(source).toContain('item.props')
  ```

- [ ] **Step 2: 运行定向测试，确认 8 张卡尚不存在**

- [ ] **Step 3: 将已在 ChatCut 验证的 8 种效果整理为唯一 JSX 源码**

  固定 ID：`keyword-impact`、`logo-wall`、`number-impact`、`tag-list`、`screen-focus-callout`、`template-wall`、`result-compare`、`broll-takeover`。参数名称必须与 ChatCut `propertyOverrides` 一致。

- [ ] **Step 4: 在 ChatCut 创建每张卡，读回资产并检查入场、稳定帧和退场**

- [ ] **Step 5: 运行全部卡片校验并提交 `feat: add eight native motion cards`**

### Task 3: 实现本地网格网页

**Files:**
- Create: `src/App.tsx`
- Create: `src/pages/GalleryPage.tsx`
- Create: `src/pages/CardDetailPage.tsx`
- Create: `src/components/PreviewPlayer.tsx`
- Create: `src/styles.css`
- Create: `tests/gallery.test.tsx`

**Interfaces:**
- Consumes: `loadCards()` 输出。
- Produces: 只读首页、详情页和手动播放预览。

- [ ] **Step 1: 写交互测试**

  ```ts
  expect(screen.getAllByRole('button', { name: '播放预览' })).toHaveLength(8)
  expect(screen.queryByText('添加到 ChatCut')).not.toBeInTheDocument()
  expect(video.autoplay).toBe(false)
  ```

- [ ] **Step 2: 运行 `npm test`，确认页面尚未实现**

- [ ] **Step 3: 实现已确认的 A 方案**

  首页使用 8 张简单网格卡。默认显示封面；只有点击中央播放按钮才播放一次。点击其他区域进入详情页。

- [ ] **Step 4: 运行单元测试和 `npm run build`**

- [ ] **Step 5: 用 Playwright CLI 实际点击首页和详情页，验证不自动播放、手动播放和返回封面**

- [ ] **Step 6: 提交 `feat: add local motion card gallery`**

### Task 4: 生成预览并验证 AI 复用闭环

**Files:**
- Create: `cards/<card-id>/versions/1.0.0/poster.png`
- Create: `cards/<card-id>/versions/1.0.0/preview.mp4`
- Create: `docs/ai-usage.md`
- Create: `scripts/find-card.mjs`

**Interfaces:**
- Produces: `node scripts/find-card.mjs <card-id> [version]` 可读取确定版本的源码和默认参数。

- [ ] **Step 1: 写 `find-card` 失败测试**

  已知 ID 必须返回确定版本；未知 ID 必须非零退出，且不得自动选择相似卡片。

- [ ] **Step 2: 实现 `find-card`，运行测试和全量校验**

- [ ] **Step 3: 从每张卡的 ChatCut 实际渲染结果生成封面和短视频**

- [ ] **Step 4: 在一个 ChatCut 测试项目执行复用验收**

  首次使用 `number-impact@1.0.0` 时创建资产并放置实例；第二次使用时必须复用同一资产。两个实例使用不同文字或数字，并在实际合成帧中正确显示。

- [ ] **Step 5: 验证旧版本保留和未授权删除防护**

- [ ] **Step 6: 运行 `npm test && npm run validate:cards && npm run build`，再用 Playwright 完成网页验收**

- [ ] **Step 7: 提交 `docs: document AI card reuse workflow`**

## 交付检查

- 8 张卡全部在网页可见，且只能手动播放。
- 网页无 ChatCut 写入入口。
- 每张卡的网页预览来自同一 JSX 源码的 ChatCut 实际渲染。
- AI 可按 ID 确定读卡、安装、复用和放置。
- 旧版本未经授权不删除。

