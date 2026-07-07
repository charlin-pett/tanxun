# 📋 项目日志

## 项目信息
- **项目名称：** 探寻
- **项目路径：** D:\探寻
- **创建日期：** 2026-07-07
- **技术栈：** Next.js 16 + TypeScript + Tailwind CSS + next-intl 4.x
- **部署平台：** Vercel（目标）
- **语言路线：** 中文 → 英文 → 俄语

---

## 日志条目

### 2026-07-07 — Phase 1：项目脚手架搭建完成

#### ✅ 已完成
1. **项目初始化**
   - 创建 D:\探寻 项目目录
   - 用 `create-next-app` 初始化 Next.js 16 项目（TypeScript + App Router + Tailwind）
   - 安装 `next-intl` 4.x 国际化依赖

2. **国际化架构搭建**
   - `src/i18n/request.ts` — next-intl 请求配置，支持多语言消息加载
   - `src/proxy.ts` — 语言检测中间件（Next.js 16 改用 proxy 替代 middleware）
   - `src/i18n/navigation.ts` — 导航工具封装（`Link`/`redirect`/`usePathname`/`useRouter`）
   - `messages/zh-CN.json` — 中文语言包（site/nav/home/dream/bazi/knowledge/hexagram/common 全部 UI 文案）

3. **项目目录结构**
   ```
   D:\探寻/
   ├── src/              ← 所有源码
   │   ├── app/          ← 页面路由
   │   ├── components/   ← 共用组件
   │   ├── data/         ← 知识库数据
   │   ├── i18n/         ← 国际化配置
   │   ├── lib/          ← 工具函数
   │   ├── types/        ← 类型定义
   │   └── proxy.ts      ← 语言检测中间件
   ├── messages/         ← 国际化语言包
   └── public/           ← 静态资源
   ```

4. **页面路由全部就绪**
   - `/` → 重定向到 `/zh-CN/`
   - `/zh-CN/` → 首页（Hero + 四大功能卡片 + 每日运势占位）
   - `/zh-CN/dream` → 解梦页（占位）
   - `/zh-CN/bazi` → 八字排盘页（占位）
   - `/zh-CN/hexagram` → 六十四卦列表 + 详情页
   - `/zh-CN/knowledge` → 玄学百科页（占位）

5. **UI 组件**
   - **Header** — 导航栏 + Logo（太极图标 CSS 绘制）+ 语言切换下拉框
   - **Footer** — 版权声明 + 免责声明（玄学类网站必填）
   - **FeatureCard** — 首页功能卡片（梦/八字/卦/书 四个 SVG 图标）
   - **LocaleSwitcher** — 语言选择器（中/英/俄，使用 `startTransition` 不阻塞 UI）
   - **国风设计系统** — 宣纸底 `#f5efe0`、墨色/朱红/金色配色

6. **六十四卦数据库**
   - 录入全部 64 卦数据（卦名、卦符、卦辞、六爻爻辞+释义、象传、现代释义）
   - 卦象列表页：8x8 网格视图，显示卦符+卦名
   - 卦象详情页：卦符+卦名+卦辞+爻辞+象传+现代释义+前后卦导航
   - 非法卦序（0, 65等）自动返回 404

#### 📝 踩坑记录
- Next.js 16 中 `middleware.ts` 已弃用，需改为 `proxy.ts`
- next-intl v4 中 `createSharedPathnamesNavigation` → `createNavigation`
- `getRequestConfig` 必须返回 `locale` 字段（字符串类型）
- npm 不能使用中文项目名，用 `tanxun` 作为代码项目名
- **所有源码文件必须放在 `src/` 目录下**（`@/` 映射指向 `./src/`），包括 data/ types/ lib/ engine/ prompts/

#### 🔜 下一步计划
- **Phase 3:** 八字排盘算法引擎（排四柱 + 十神 + 大运 + 流年）
- **Phase 4:** 解梦功能（AI 接入）

### 2026-07-07 — Phase 2 & Phase 3：六十四卦 + 八字排盘完成

#### ✅ 六十四卦数据库（Phase 2）
- 录入全部 64 卦数据（卦名、卦符、卦辞、六爻爻辞+释义、象传、现代释义、分类）
- 卦象列表页：8×8 网格视图，每格显示卦符+卦名，点击进入详情
- 卦象详情页：卦符区+卦辞+象传+六爻逐条展示+现代释义+前后卦导航
- 非法卦序自动返回 404

#### ✅ 八字排盘算法引擎（Phase 3）
- **`src/engine/types.ts`** — 核心数据结构（天干/地支/五行/六十甲子/四柱/大运/流年等类型定义）
- **`src/engine/ganzhi.ts`** — 底层计算函数（闰年判断、公历转干支、五虎遁/五鼠遁、时辰索引、月索引等）
- **`src/engine/bazi.ts`** — 排盘核心（排四柱、十神判定、五行统计、大运顺逆、流年计算）
- **`src/engine/labels.ts`** — 中文标签转换（引擎输出索引→中文文字）

#### ✅ 八字排盘UI（Phase 3）
- **BaziForm** — 全功能表单（年份/月份/日期/时间/性别输入，支持时辰选择和精确时间两种模式）
- **BaziResultView** — 命盘展示（四柱八字表格、日主标注、十神显示、五行柱状图、大运列表、流年）
- 所有计算在浏览器端完成，无需 API 调用

#### 📝 踩坑记录
- `ReturnType<typeof calcBaZi>['daYun']` 在客户端组件中使用需要确保类型正确
- 排盘算法中使用的是近似节气月，后续如需精确需根据立春日期调整
- 起运年龄简化为3岁（精确计算需根据出生日到节气日期的天数÷3）

### 2026-07-07 — Phase 4：星座 + AI命理报告全链路完成

#### ✅ 星座计算
- **`src/engine/zodiac.ts`** — 纯算法，根据公历月日返回星座索引 (0-11)，语言无关
- **`src/data/zodiac/zh-CN.json`** — 12 星座完整数据（性格描述、优点缺点、爱情事业、幸运信息）
- **`ZodiacCard`** — 星座展示卡片（符号、元素、关键词、优缺点、性格简述）
  - 根据出生月日自动计算，展示在命盘上方

#### ✅ AI命理报告系统
- **`src/engine/prompts/reading-zh-CN.ts`** — AI 提示词模板（中文 system prompt + user prompt，英文备用）
- **`src/app/api/reading/route.ts`** — 命理报告生成 API
  - **双模型策略：** DeepSeek（国内） / Claude（海外） / Mock（无需API Key）
  - 接收八字排盘数据 + 星座信息，调用 AI 生成完整命理分析报告
  - 报告结构：星座性格 → 八字命格 → 五行分析 → 性格总论 → 运势提示 → 发展建议
- **`AiReading`** — AI 报告组件（四态）
  - `idle` 初始态 → 显示"开始测算命理"按钮
  - `loading` 加载中 → 太极旋转动画 + 加载提示
  - `done` 完成态 → 显示完整命理分析报告
  - `error` 错误态 → 显示错误信息 + 重试按钮
- **`.env.example`** — 环境变量说明文件（配置 API Key 后自动启用 AI）

#### ✅ 整合展示
- **BaziResultView** 升级为完整三件套：
  1. 🏷 星座卡片（上方）
  2. ☯ 八字命盘 + 五行统计 + 大运 + 流年（中间）
  3. 🤖 AI 命理分析报告（下方，含星座+八字综合分析）

### 2026-07-07 — Phase 5：过渡动画完成

#### ✅ 全屏过渡动画
- **`BaziTransition`** — 全屏遮罩动画组件，三个递进阶段：
  - 0-1.5s：太极旋转 + 八卦符号（䷀䷁䷂䷃…）在四周飘散
  - 1.5-3.2s：五行文字金木水火土以对应颜色轮转（金色/翠绿/深蓝/朱红/檀木）
  - 3.2-4.7s：星座符号（♈♉♊♋♌♍…）星空气氛
  - 4.7-5.5s：收尾淡出缩放
- 底部渐变进度条 + 动态阶段文字
- 动画结束后自动显示完整结果

#### ✅ 三屏流程重构
- **BaziForm** 改为三屏状态机：`form → transition → result`
  1. 用户填写表单 → 点击"排盘测算"
  2. 全屏过渡动画 (5.5s)
  3. 自动显示星座卡片 + 八字命盘 + AI 命理报告（无需再点击）
- **AiReading** 支持 `autoFetch` 模式，挂载后自动生成报告
- 新增 `globals.css` 中 `animate-spin-slow` 自定义动画

#### 🔜 后续规划
- **配置 API Key** — 在 `.env.local` 中设置 `DEEPSEEK_API_KEY`
- **解梦功能（AI接入）**
- **玄学百科知识库**
- **部署到Vercel**
- **英文/俄语版本**

