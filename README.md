# IELTS Coach | 雅思教练

一个以自用为主、持续打磨中的雅思训练原型。

当前版本的目标不是做“题库很多的网页”，而是逐步把它整理成一套：

- 可持续使用
- 每日任务清楚
- 模块稳定
- 能看到阶段变化
- 能逐步逼近雅思 `6.5`

## 当前定位

这个项目目前主要服务于个人长期自学场景。

重点不是“马上对外发布”，而是先确认：

- 每天打开是否稳定
- 内容是否重复太多
- 每个模块的训练目标是否清楚
- 连续使用 `1-2` 个月后，是否真的能看到进步

## 当前主要模块

- 每日计划
- 目标追踪
- 阅读专项
- 核心词汇
- 语法诊所
- 发音实验室
- 听力专项
- 写作训练
- 口语纠偏
- 错题库
- 周度复盘
- 月度诊断
- 云同步

## 当前已完成的重点整理

### 内容层

- 语法题库已经改成按天稳定派发
- 词汇模块已经做过前 `30` 天词条修订
- 阅读题库已经统一成 `1` 篇 + `3` 题
- 写作题库已经扩成更稳定的 `30` 天覆盖
- 口语题库已经扩成更贴近主题日历的 `30` 天覆盖

### 训练层

- 发音和听力已经拆分
- 首页开始解释“今天为什么练这些”
- 写作和口语不再只是输入框，而是有目标、有重点、有反馈
- 周复盘和月度诊断已经从占位页改成可用版本

### 稳定性

- 每日任务会按新的一天自动重置
- 日期逻辑已经改成本地日期
- 云同步下载已经做过一轮安全合并

## 运行方式

这是一个纯前端静态项目。

当前最简单的使用方式：

1. 打开项目目录
2. 直接打开 [index.html](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/index.html)

如果浏览器对本地音频、麦克风或接口有限制，也可以放到一个本地静态服务器里打开。

## 关键文件

- [index.html](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/index.html)
- [app.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/app.js)
- [data/data.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/data.js)

当前内容覆盖层：

- [data/grammar_questions_v2.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/grammar_questions_v2.js)
- [data/vocabulary_overrides.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/vocabulary_overrides.js)
- [data/reading_overrides.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/reading_overrides.js)
- [data/writing_overrides.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/writing_overrides.js)
- [data/speaking_overrides.js](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/data/speaking_overrides.js)

## 数据与同步

### 本地状态

学习状态主要保存在浏览器本地。

包括：

- 每日任务完成情况
- 错题
- 词汇复习状态
- 写作草稿
- 口语输入
- 打卡记录

### 云同步

当前支持通过 GitHub 同步 `db.json`。

适合：

- 电脑和手机之间同步个人学习状态

当前注意点：

- GitHub Token 仍保存在本地浏览器存储中
- 对个人原型可用，但长期安全性仍需继续优化

## 文档入口

如果要查看当前版本整理说明，请先看：

- [docs/README.md](/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练/docs/README.md)

其中包括：

- 产品状态记录
- 每日检查清单

## 自动化

当前已添加每日自动检查：

- `IELTS Coach Daily Check`

它会每天检查：

- 日期显示
- 每日任务是否重置
- 各核心模块是否仍然接到最新内容
- 同步入口是否存在

## 当前仍然存在的限制

- 这还不是正式 IELTS 评分系统
- 月度诊断属于训练判断，不是官方 band 分
- 同步安全性还可以继续加强
- 还需要继续做真实使用回归

## 下一步适合做什么

- 做一次完整体验回归
- 继续观察同步稳定性
- 继续打磨写作和口语反馈细节
- 如果准备分享给别人，再继续整理对外说明和版本线
