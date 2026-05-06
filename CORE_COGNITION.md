# 雅思教练 (IELTS Coach) 全局认知与系统宪法

> [!IMPORTANT]
> 本文件是本项目的“数字化记忆”与“最高准则”。
> 任何参与开发的 AI 或人员在开始工作前必须完整阅读此文档，确保产品逻辑的连续性与稳定性。

## 1. 产品愿景 (Product Vision)
雅思教练是一个面向长线备考者的、高审美、自适应智能学习平台。
它旨在通过“数据-逻辑-表现”三层分离的架构，实现跨设备（手机/电脑）的无缝学习体验，并根据用户的真实进步动态调整教学方案。

## 2. 核心架构 (System Architecture - V6+)

### 2.1 数据与逻辑分离 (Decoupling)
- **`app.js` (Logic)**: 纯逻辑引擎。包含渲染、算法、API 调用、状态管理。它是静态的、不存储业务数据。
- **`data/data.js` (Data Content)**: 静态资源库。注入到 `window.IELTS_DATA`。包含 30-365 天的任务主题、阅读文章、语法题库。
- **`db.json` (State Sync)**: 动态进度包。存储在用户私有 GitHub 仓库中，仅包含 `leanState`（用户偏好、错题本、SRS 队列）。

### 2.2 自适应学习引擎 (Adaptive Engine)
- **SRS (Spaced Repetition)**: 艾宾浩斯记忆模型。通过 `state.vocabSRS` 数组管理，字段包含 `nextReviewDay` 和 `mastered`。
- **弱点路由 (Weakness Routing)**: 标签化调度。如果 `errorBank` 中某一分类错误数达到阈值，系统会自动拦截 Day N 任务，替换为专项强化题。

## 3. 技术标准与红线 (Technical Guidelines & Redlines)

### 3.1 代码修改规则
1. **原子化提交**: 每次只修改一个功能模块，严禁大面积替换 UI 代码。
2. **数据更新验证**: 更新 `data.js` 必须通过自动化脚本生成，严禁手动修改大型 JSON 以免造成语法崩溃。
3. **兼容性优先**: 必须支持 `file://` 协议运行（即双击 index.html 即可使用），严禁引入需要复杂 Node.js 后端的依赖。

### 3.2 同步协议 (Sync Protocol)
- **编码方式**: 使用 `Base64(UTF-8)` 传输。
- **瘦身同步**: 上传云端前必须执行 `delete leanState.curriculum` 等操作，确保 payload < 10KB。
- **SHA 锁**: 更新前必须先拉取最新的 `sha` 标识，严禁强制推送覆盖用户数据。

## 4. 关键参数 (Key Configurations)
- **刷新时间**: 每日凌晨 1:00 (1:00 AM) 切换下一天任务。
- **学习周期**: 30 天为一个内容包周期，一年为一个完整备考周期。
- **API 接口**: 
    - 词汇发音: `Free Dictionary API`
    - 语法诊断: `LanguageTool API`

## 5. 维护者声明 (Maintainer's Note)
我作为您的 AI 合作伙伴，承诺在每一次交互中优先读取并遵守此文件。我们要共同把“雅思教练”做成一个极致稳定、懂人性的精品产品。

---
*Last Updated: 2026-05-06*
*Version: 6.1.0 (Stability Guardrail)*
