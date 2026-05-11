# 雅思教练产品状态记录

日期：2026-05-10

## 当前结论

这个版本已经从“能打开的学习页面”逐步整理成“有训练逻辑的个人雅思教练原型”。

当前最重要的变化是：

- 每日模块已经不再只是展示页面，而是有了更稳定的训练结构
- 内容重复和结构混乱的问题已经在多个核心模块中被明显收紧
- 首页、目标追踪、周复盘、月度诊断开始和真实训练行为挂钩
- 同步和日期逻辑的明显问题已经做过一轮稳定化处理

## 已完成的核心调整

### 1. 语法模块

- 语法题库已经替换为新的 `300` 题结构
- 改为按天取题，而不是全局乱串
- 每题带有更清楚的训练字段
- 页面会显示类别、难度、主题和主要服务能力

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/grammar_questions_v2.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 2. 发音实验室

- 发音和听力已经分开，不再互相混用
- 发音实验室现在只做辨音、跟读、录音纠偏
- 发音训练已经做成 `30` 天阶段递进
- 声音播放逻辑做过稳定化处理

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 3. 听力专项

- 听力已成为独立模块
- 每天固定 `3` 题
- 结构为关键词捕捉、句子填空、信息理解
- 目标从“辨音”转为“声音到信息”

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 4. 词汇模块

- 每日节奏改为 `6` 个新词 + 最多 `4` 个复习词
- 学新词和复习词已分开
- 前 `30` 天词条已做源头修订覆盖
- 一批明显错词、空例句、异常词性已经修过

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/vocabulary_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 5. 阅读模块

- 阅读统一为每天 `1` 篇 + `3` 题
- 判分逻辑已修稳
- 多组文章题型已从单一判断题改成更平衡的组合
- 当前更接近“主旨 + 细节 + 信息理解”的训练方式

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/reading_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 6. 写作模块

- 写作页面已补成训练单元，不再只是文本纠错页
- 能区分 `Task 1` 和 `Task 2`
- 会显示阶段、今日重点、完成标准
- 反馈会显示字数、句子数、连接表达和准确性问题
- 写作题库已扩成稳定的 `30` 天覆盖

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/writing_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 7. 口语模块

- 口语页面已成为每日训练单元
- 有每日目标、纠偏重点和可套用表达
- 口语题库已改成更稳定的 `30` 天覆盖
- 每天的话题开始和主题日历更贴近

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/speaking_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 8. 首页与目标追踪

- 首页增加了阶段、进度和教练提醒
- 目标追踪不再主要使用虚拟进度值
- 指标开始更多依赖真实训练行为
- 热力图和打卡逻辑已做过一轮修正

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 9. 周复盘与月度诊断

- 周复盘已改成更像真实复盘单
- 月度阶段考已改成 `30` 天训练诊断单
- 开始直接回答“最近一个月是否更接近 6.5”

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 10. 同步与日期

- 每日任务会按新的一天自动重置
- 云同步下载会先做安全合并
- 右上角日期改为本地自动显示
- 日期相关逻辑已统一为本地日期，不再混用 UTC
- 首次上传时的同步载荷处理更稳

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

## 当前仍然存在的注意点

### 1. 同步安全性

- GitHub Token 仍保存在浏览器本地存储中
- 对个人原型可用，但长期仍有安全隐患

### 2. 诊断仍属于训练判断，不是官方评分

- 周复盘和月度诊断现在更有用了
- 但它们仍然是训练阶段判断，不是正式 IELTS band 分数

### 3. 还没有做完整体验回归

- 当前已经做过代码级和数据级确认
- 并且已经补做过一轮真实使用路径检查
- 但仍然没有做到逐页逐按钮的完整人工体验回归

## 本轮真实使用回归补充

这轮回归重点检查了：

- 首页和日期显示
- 各核心模块入口
- 页面命名是否仍停留在旧版本
- 同步与日期逻辑是否仍有错位

### 本轮发现并已修复

#### 1. 听力专项缺少独立导航入口

- 模块本身已经独立
- 但导航里之前没有独立入口
- 现已补上侧边导航和移动端底部导航入口

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/index.html`

#### 2. 写作模块命名仍有旧口径残留

- 导航、首页任务标题、页面定位之前不完全一致
- 现已统一为更符合当前版本的写作训练命名

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/index.html`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

#### 3. 日期逻辑已切到本地日期

- 右上角日期已改为页面初始化后按本地日期显示
- 热力图、连续打卡、活动记录也已统一使用本地日期

相关文件：

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`

### 回归后的当前判断

目前可以确认：

- 核心模块已经不是只有代码层更新，而是入口和命名也开始对齐
- 听力、写作、口语、阅读、词汇、语法等模块都已经接到新的训练逻辑
- 周复盘和月度诊断也已经进入可使用状态

仍建议后续继续观察：

- 右上角日期虽然会被正确替换，但 HTML 初始占位仍是旧日期文本
- 云同步虽然已稳定化一轮，但长期仍需要继续观察使用表现

## 当前关键文件

- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/index.html`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/data.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/grammar_questions_v2.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/vocabulary_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/reading_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/writing_overrides.js`
- `/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/speaking_overrides.js`

## 下一步建议

- 做一次按真实使用顺序的体验回归
- 继续观察同步是否稳定
- 如果后面准备对外分享，再考虑同步安全性和 README 整理
