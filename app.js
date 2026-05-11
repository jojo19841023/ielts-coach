// SELF-HEALING: System is now stable, clearing debug reset.
// localStorage.clear(); 

let state;
const STATE_SCHEMA_VERSION = 2;
const memoryStorage = {};

function hasPersistentStorage() {
    try {
        const testKey = '__ielts_storage_test__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

const persistentStorageAvailable = hasPersistentStorage();

function safeGetItem(key, fallback = null) {
    if (persistentStorageAvailable) {
        try {
            const value = window.localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (e) {
            return Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : fallback;
        }
    }
    return Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : fallback;
}

function safeSetItem(key, value) {
    const normalizedValue = String(value);
    memoryStorage[key] = normalizedValue;
    if (persistentStorageAvailable) {
        try {
            window.localStorage.setItem(key, normalizedValue);
        } catch (e) {
            console.warn('Persistent storage write failed, using session memory instead.', e);
        }
    }
}

function safeClearStorage() {
    Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    if (persistentStorageAvailable) {
        try {
            window.localStorage.clear();
        } catch (e) {
            console.warn('Persistent storage clear failed.', e);
        }
    }
}

try {
    const saved = safeGetItem('ieltsState');
    state = saved ? JSON.parse(saved) : null;
} catch (e) {
    console.error("Failed to parse local storage", e);
}

const defaultState = {
    currentView: 'daily-plan',
    user: { name: 'Jojo', targetScore: 6.5, currentLevel: 'A2' },
    dailyTasks: [
        { id: 1, type: 'grammar', title: '🧩 语法诊所：每日 10 题核心句法训练', completed: false, duration: '20min', view: 'grammar' },
        { id: 2, type: 'phonetics', title: '👄 发音实验室：辨音、跟读、录音纠偏', completed: false, duration: '15min', view: 'phonetics' },
        { id: 3, type: 'writing', title: '✍️ 写作训练：Task 1 / Task 2 每日输出', completed: false, duration: '25min', view: 'writing' },
        { id: 4, type: 'listening', title: '🎧 听力专项：关键词、填空、信息理解', completed: false, duration: '20min', view: 'listening' },
        { id: 5, type: 'reading', title: '📖 阅读专项：主旨、细节、定位 3 题', completed: false, duration: '25min', view: 'reading' },
        { id: 6, type: 'speaking', title: '🗣️ 口语纠偏：Part 1 常见问题模测', completed: false, duration: '20min', view: 'speaking' },
        { id: 7, type: 'vocabulary', title: '📚 核心词汇：6 个新词 + 4 个复习词', completed: false, duration: '15min', view: 'vocabulary' }
    ],
    curriculum: {}, // Linked dynamically now
    errorBank: [],
    essays: { current: '' },
    speakingInput: '',
    examDate: '2026-12-25',
    milestones: [
        { name: '基础筑基 (A2)', status: 'active', target: '掌握 2000 核心词 + 基础时态', deadline: '2026-06' },
        { name: '能力爬坡 (B1)', status: 'locked', target: '3500 词汇 + 复合句式', deadline: '2026-09' },
        { name: '6.5 冲刺 (B2)', status: 'locked', target: '真题模拟 + 写作逻辑优化', deadline: '2026-12' }
    ],
    chinglishPatterns: [], // Linked dynamically
    grammarQuestions: [],  // Linked dynamically
    currentGrammarIndex: 0,
    phoneticExercises: [], // Linked dynamically
    currentPhoneticIndex: 0,
    activityLog: {},
    vocabSRS: [],
    adaptiveCompleted: [],
    lastTaskResetDate: '',
    schemaVersion: STATE_SCHEMA_VERSION
};

function getTodayDateString() {
    return getDateKey(new Date());
}

function getDateKey(date) {
    const current = date instanceof Date ? date : new Date(date);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatChineseDate(date = new Date()) {
    const current = date instanceof Date ? date : new Date(date);
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();
    return `${year}年${month}月${day}日`;
}

function relinkExternalData(targetState) {
    targetState.curriculum = window.IELTS_DATA.curriculum;
    targetState.chinglishPatterns = window.IELTS_DATA.chinglishPatterns;
    targetState.grammarQuestions = window.IELTS_DATA.grammarQuestions;
    targetState.phoneticExercises = window.IELTS_DATA.phoneticExercises;
    return targetState;
}

function hydrateState(rawState) {
    const source = rawState && typeof rawState === 'object' ? rawState : {};
    const existingTasks = Array.isArray(source.dailyTasks) ? source.dailyTasks : [];
    const updatedTasks = defaultState.dailyTasks.map((newTask) => {
        const existingTask = existingTasks.find(t => t.id === newTask.id);
        return existingTask ? { ...newTask, completed: !!existingTask.completed } : { ...newTask };
    });

    const hydrated = {
        ...defaultState,
        ...source,
        user: { ...defaultState.user, ...(source.user || {}) },
        essays: { ...defaultState.essays, ...(source.essays || {}) },
        dailyTasks: updatedTasks,
        errorBank: Array.isArray(source.errorBank) ? source.errorBank : [],
        milestones: Array.isArray(source.milestones) && source.milestones.length ? source.milestones : defaultState.milestones,
        vocabSRS: Array.isArray(source.vocabSRS) ? source.vocabSRS : [],
        adaptiveCompleted: Array.isArray(source.adaptiveCompleted) ? source.adaptiveCompleted : [],
        activityLog: source.activityLog && typeof source.activityLog === 'object' ? source.activityLog : {},
        speakingInput: source.speakingInput || '',
        startDate: source.startDate || '2026-05-05',
        examDate: source.examDate || defaultState.examDate,
        currentGrammarIndex: Number.isFinite(source.currentGrammarIndex) ? source.currentGrammarIndex : 0,
        currentPhoneticIndex: Number.isFinite(source.currentPhoneticIndex) ? source.currentPhoneticIndex : 0,
        lastTaskResetDate: source.lastTaskResetDate || '',
        schemaVersion: STATE_SCHEMA_VERSION
    };

    return relinkExternalData(hydrated);
}

function resetDailyTaskStateIfNeeded() {
    const today = getTodayDateString();
    if (state.lastTaskResetDate === today) return;

    state.dailyTasks = defaultState.dailyTasks.map(task => ({ ...task, completed: false }));
    state.currentGrammarIndex = 0;
    state.currentPhoneticIndex = 0;
    state.adaptiveCompleted = [];
    state.lastTaskResetDate = today;
}

function createLeanState(sourceState = state) {
    const leanState = { ...sourceState, schemaVersion: STATE_SCHEMA_VERSION };
    delete leanState.curriculum;
    delete leanState.chinglishPatterns;
    delete leanState.grammarQuestions;
    delete leanState.phoneticExercises;
    return leanState;
}

state = state ? hydrateState(state) : hydrateState({ startDate: '2026-05-05' });
resetDailyTaskStateIfNeeded();

function saveState() {
    safeSetItem('ieltsState', JSON.stringify(createLeanState()));
}

// DOM Elements
const viewTitle = document.getElementById('view-title');
const appView = document.getElementById('app-view');
const navItems = document.querySelectorAll('.nav-item');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const dynamicFeedback = document.getElementById('dynamic-feedback');
const currentDateDisplay = document.getElementById('current-date');

function init() {
    updateCurrentDateDisplay();
    setupNavigation();
    runHeuristicAnalysis(); // Self-optimize based on data
    updateProgress();
    renderView(state.currentView);
}

function updateCurrentDateDisplay() {
    if (currentDateDisplay) {
        currentDateDisplay.textContent = formatChineseDate();
    }
}

function runHeuristicAnalysis() {
    // 1. Analyze weak points from Error Bank
    const errorTypes = state.errorBank.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
    }, {});

    // 2. Filter out tasks that should no longer be there
    const completedAdaptiveIds = state.dailyTasks.filter(t => t.isAdaptive && t.completed).map(t => t.id);
    state.adaptiveCompleted = state.adaptiveCompleted || [];
    
    // Merge session memory
    completedAdaptiveIds.forEach(id => {
        if (!state.adaptiveCompleted.includes(id)) state.adaptiveCompleted.push(id);
    });

    state.dailyTasks = state.dailyTasks.filter(t => !t.isAdaptive);

    // 3. Inject reinforcement tasks only if NOT already completed in this session
    if (errorTypes['Grammar'] >= 3 && !state.adaptiveCompleted.includes(99)) {
        state.dailyTasks.unshift({ 
            id: 99, type: 'grammar', title: '🚨 专项强化：攻克高频语法盲点', 
            completed: false, duration: '20min', view: 'grammar', isAdaptive: true 
        });
        dynamicFeedback.textContent = "注意：您最近语法错误较多，已开启专项强化！";
    } else if (state.errorBank.length > 10 && !state.adaptiveCompleted.includes(98)) {
        state.dailyTasks.unshift({ 
            id: 98, type: 'error-bank', title: '🔥 核心复盘：清空 10+ 历史错题', 
            completed: false, duration: '15min', view: 'error-bank', isAdaptive: true 
        });
        dynamicFeedback.textContent = "错题积累较多，建议先进行核心复盘。";
    }
    
    // Add completed ones back for visual feedback
    state.adaptiveCompleted.forEach(id => {
        const title = id === 99 ? '🚨 专项强化：攻克高频语法盲点' : '🔥 核心复盘：清空 10+ 历史错题';
        state.dailyTasks.unshift({ id, type: id === 99 ? 'grammar' : 'error-bank', title, completed: true, duration: '0min', view: id === 99 ? 'grammar' : 'error-bank', isAdaptive: true });
    });

    if (state.adaptiveCompleted.length > 0) {
        dynamicFeedback.textContent = "太棒了！今日专项强化已完成，状态回升中。";
    } else if (!errorTypes['Grammar'] && state.errorBank.length <= 10) {
        dynamicFeedback.textContent = "当前状态稳定！Day " + getCurrentDay() + " 训练已就绪。";
    }
}

function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(viewId) {
    state.currentView = viewId;
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewId);
    });
    const viewNames = {
        'daily-plan': '每日计划', 'grammar': '语法诊所', 'phonetics': '发音实验室',
        'listening': '听力专项',
        'writing': '写作训练', 'speaking': '口语纠偏', 'reading': '阅读专项',
        'vocabulary': '核心词汇', 'error-bank': '错题库', 
        'weekly-review': '周度复盘', 'dashboard': '目标追踪',
        'settings': '系统设置'
    };
    viewTitle.textContent = viewNames[viewId] || '雅思教练';
    renderView(viewId);
}

function renderView(viewId) {
    appView.innerHTML = '';
    try {
        switch(viewId) {
            case 'daily-plan': renderDailyPlan(); break;
            case 'grammar': renderGrammarView(); break;
            case 'phonetics': renderPhoneticsView(); break;
            case 'listening': renderListeningView(); break;
            case 'writing': renderWritingView(); break;
            case 'speaking': renderSpeakingView(); break;
            case 'reading': renderReadingView(); break;
            case 'vocabulary': renderVocabularyView(); break;
            case 'error-bank': renderErrorBank(); break;
            case 'weekly-review': renderAssessmentCenter(); break;
            case 'dashboard': renderDashboard(); break;
            case 'settings': renderSettingsView(); break;
            default: appView.innerHTML = `<div class="loading">即将上线...</div>`;
        }
    } catch (e) {
        console.error("Render error:", e);
        appView.innerHTML = `<div class="card" style="text-align:center; padding:3rem;">
            <p>⚠️ 视图加载出错，正在尝试自修复...</p>
            <div style="margin-top: 1rem; font-size: 0.82rem; color: #ffb74d; line-height: 1.6; word-break: break-word;">
                ${String(e && e.message ? e.message : e)}
            </div>
            <button onclick="safeClearStorage();location.reload();" style="margin-top:1rem; padding:10px; background:var(--accent-primary); border:none; border-radius:8px; color:white; cursor:pointer;">重置系统状态</button>
        </div>`;
    }
}

function getCurrentDay() {
    const start = new Date(state.startDate);
    const today = new Date();
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = todayMidnight - startMidnight;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays % 30) + 1; // Expanded to 30-day curriculum cycle
}

// --- 1. Daily Plan ---
function renderDailyPlan() {
    const day = getCurrentDay();
    const content = state.curriculum[day] || state.curriculum[1];
    const completedCount = state.dailyTasks.filter(task => task.completed).length;
    const totalCount = state.dailyTasks.length || 1;
    const phaseLabel = day <= 10 ? '阶段 1：基础重建' : day <= 20 ? '阶段 2：能力爬坡' : '阶段 3：整合巩固';
    const coachFocus = completedCount <= 2
        ? '今天先把输入型模块做稳：词汇、听力、阅读优先。'
        : completedCount <= 5
            ? '今天已经进入中段，接下来把输出型模块接上：写作和口语。'
            : '今天节奏很好，收尾时优先复盘错题和薄弱点。';
    const completedModules = state.dailyTasks.filter(task => task.completed).map(task => getIcon(task.type)).join(' ');
    
    // Add Theme Header
    if (content.image) {
        const header = document.createElement('div');
        header.className = 'card';
        header.style.padding = '0';
        header.style.overflow = 'hidden';
        header.style.marginBottom = '2rem';
        header.style.position = 'relative';
        header.style.height = '180px';
        header.innerHTML = `
            <img src="${content.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6;">
            <div style="position: absolute; bottom: 1.5rem; left: 1.5rem;">
                <div style="font-size: 0.8rem; color: var(--accent-secondary); margin-bottom: 0.3rem;">DAY ${day} THEME</div>
                <h2 style="color: white; font-size: 1.8rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${content.theme}</h2>
            </div>
        `;
        appView.appendChild(header);
    }

    const summary = document.createElement('div');
    summary.className = 'card';
    summary.style.display = 'grid';
    summary.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    summary.style.gap = '1rem';
    summary.style.marginBottom = '1.5rem';
    summary.innerHTML = `
        <div style="background: rgba(124, 77, 255, 0.08); border: 1px solid rgba(124, 77, 255, 0.2); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">今日阶段</div>
            <div style="font-size: 1rem; color: var(--accent-primary); font-weight: 700;">${phaseLabel}</div>
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.5rem;">今天主题：${content.theme}</div>
        </div>
        <div style="background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.2); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">今日进度</div>
            <div style="font-size: 1rem; color: var(--accent-secondary); font-weight: 700;">${completedCount}/${totalCount} 已完成</div>
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.5rem;">${completedModules || '还没开始，先做第一个模块就会进入状态。'}</div>
        </div>
        <div style="background: rgba(255,183,77,0.06); border: 1px solid rgba(255,183,77,0.2); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">教练提醒</div>
            <div style="font-size: 0.9rem; line-height: 1.6; color: #f4f4f4;">${coachFocus}</div>
        </div>
    `;
    appView.appendChild(summary);

    const grid = document.createElement('div');
    grid.className = 'daily-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    grid.style.gap = '1.5rem';

    state.dailyTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'card task-card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">${getIcon(task.type)}</span>
                <span style="font-size: 0.7rem; color: var(--text-dim);">${task.duration}</span>
            </div>
            <h3 style="font-size: 0.95rem; margin-bottom: 1rem;">${task.title}</h3>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="toggleTask(${task.id})" style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--glass-border); background: ${task.completed ? 'rgba(0,229,255,0.1)' : 'transparent'}; color: ${task.completed ? 'var(--accent-secondary)' : 'var(--text-dim)'}; cursor: pointer;">${task.completed ? '已完成' : '未完成'}</button>
                <button onclick="switchView('${task.view}')" style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--accent-primary); background: rgba(124, 77, 255, 0.1); color: white; cursor: pointer;">开始训练</button>
            </div>
        `;
        grid.appendChild(card);
    });
    appView.appendChild(grid);
}

// --- 2. Grammar Clinic ---
function getGrammarQuestionsForCurrentSession() {
    const day = getCurrentDay();
    const grammarErrors = (state.errorBank || []).filter(e => e.type === 'Grammar');
    const categoryCounts = {};

    grammarErrors.forEach(e => {
        if (e.category) categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    let weakCategory = null;
    for (const cat in categoryCounts) {
        if (categoryCounts[cat] >= 2) {
            weakCategory = cat;
            break;
        }
    }

    const task = state.dailyTasks.find(t => t.type === 'grammar');
    if (weakCategory && task && !task.isAdaptive) {
        const adaptiveQuestions = state.grammarQuestions.filter(q => q.category === weakCategory).slice(0, 10);
        return {
            mode: 'adaptive',
            titlePrefix: `🚨 弱点强化：${weakCategory}`,
            weakCategory,
            questions: adaptiveQuestions
        };
    }

    const dayQuestions = state.grammarQuestions.filter(q => q.day === day);
    if (dayQuestions.length > 0) {
        return {
            mode: 'daily',
            titlePrefix: `Day ${day} 核心考点`,
            weakCategory: null,
            questions: dayQuestions
        };
    }

    const startIndex = (day - 1) * 10;
    return {
        mode: 'daily',
        titlePrefix: `Day ${day} 核心考点`,
        weakCategory: null,
        questions: state.grammarQuestions.slice(startIndex, startIndex + 10)
    };
}

function renderGrammarView() {
    state.errorBank = state.errorBank || [];

    const session = getGrammarQuestionsForCurrentSession();
    let questions = session.questions;
    const task = state.dailyTasks.find(t => t.type === 'grammar');

    if (session.mode === 'adaptive' && task && !task.isAdaptive) {
        task.isAdaptive = true;
        state.errorBank = state.errorBank.filter(e => e.type !== 'Grammar' || e.category !== session.weakCategory);
        saveState();
        setTimeout(() => alert(`🚨 智能诊断：检测到您在 [${session.weakCategory}] 方面存在薄弱环节。系统已为您自动匹配专项强化练习！`), 500);
    }

    if (!questions || questions.length === 0) {
        appView.innerHTML = `<div class="card"><p>当前语法题组暂时不可用，请稍后再试。</p></div>`;
        return;
    }

    if (state.currentGrammarIndex >= questions.length) {
        state.currentGrammarIndex = 0;
        saveState();
    }

    const q = questions[state.currentGrammarIndex] || questions[0];
    const skillLabel = q.skillTarget === 'writing_accuracy'
        ? '主要服务：写作准确性'
        : q.skillTarget === 'speaking_accuracy'
            ? '主要服务：口语准确性'
            : '主要服务：句子理解';
    
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--accent-secondary);">🧩 语法诊所：${session.titlePrefix}</h3>
                <span style="font-size: 0.8rem; color: var(--text-dim);">进度: ${state.currentGrammarIndex + 1}/${questions.length}</span>
            </div>
            <div id="grammar-exercise" style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--accent-primary);">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <span style="font-size: 0.72rem; color: var(--accent-secondary); border: 1px solid var(--accent-secondary); border-radius: 999px; padding: 4px 10px;">${q.category || 'Grammar'}</span>
                    ${q.level ? `<span style="font-size: 0.72rem; color: var(--text-dim); border: 1px solid var(--glass-border); border-radius: 999px; padding: 4px 10px;">Level ${q.level}</span>` : ''}
                    ${q.theme ? `<span style="font-size: 0.72rem; color: var(--text-dim); border: 1px solid var(--glass-border); border-radius: 999px; padding: 4px 10px;">Theme: ${q.theme}</span>` : ''}
                </div>
                <p style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 0.75rem;">${skillLabel}</p>
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">${q.sentence}</p>
                <input type="text" id="grammar-answer" placeholder="输入答案..." 
                       style="background: transparent; border: 1px solid var(--glass-border); padding: 12px; border-radius: 8px; color: white; width: 100%; margin-bottom: 1rem; outline: none;">
                <div id="grammar-feedback" style="margin-bottom: 1rem; font-size: 0.9rem; display: none;"></div>
                <div style="display: flex; gap: 1rem;">
                    <button id="check-btn" onclick="checkGrammarAnswer(${q.id})" style="flex: 1; background: var(--accent-primary); border: none; padding: 12px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">检查答案</button>
                    <button id="next-btn" onclick="nextGrammarQuestion()" style="display: none; flex: 1; background: rgba(0, 229, 255, 0.1); border: 1px solid var(--accent-secondary); padding: 12px; border-radius: 8px; color: var(--accent-secondary); cursor: pointer; font-weight: 600;">下一题</button>
                </div>
            </div>
        </div>
    `;
}

function renderAdaptiveGrammarReview() {
    const mistakes = state.errorBank.filter(e => e.type === 'Grammar').slice(0, 3);
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; border: 2px solid var(--accent-secondary); animation: fadeIn 0.4s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--accent-secondary);">🚨 专项强化：高频错题攻克</h3>
                <span style="background: var(--accent-secondary); color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">弱项针对模式</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-dim);">教练注意到您在以下语法点上遇到了挑战。请重新审查并纠正它们：</p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${mistakes.map((m, i) => {
                    let advice = m.improvement;
                    if (!advice || advice === 'undefined') {
                        // Heuristic advice based on content
                        if (m.content.includes('last night') || m.content.includes('yesterday')) advice = "关键点：检测到过去时间状语，请检查动词过去式及助动词(did)的用法。";
                        else if (m.content.includes('right now') || m.content.includes('now')) advice = "关键点：检测到正在进行的动作，请检查 'be + doing' 结构。";
                        else if (m.content.includes('she') || m.content.includes('he') || m.content.includes('it')) advice = "关键点：主语为第三人称单数，请检查动词s/es变化或疑问句助动词用法。";
                        else advice = "核心复盘：请对照该专项知识点重新审查句子结构，重点关注时态一致性。";
                    }
                    return `
                    <div style="padding: 1.2rem; background: rgba(255,82,82,0.05); border: 1px solid rgba(255,82,82,0.2); border-radius: 12px;">
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: #ff8a80; font-weight: 600;">错误场景 ${i+1}:</p>
                        <p style="font-style: italic; color: #eee; font-size: 1rem; margin-bottom: 0.8rem;">"${m.content}"</p>
                        <div style="background: rgba(0,0,0,0.2); padding: 0.8rem; border-radius: 8px;">
                            <p style="font-size: 0.85rem; color: #4caf50;">💡 改进建议: ${advice}</p>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            
            <button onclick="markAdaptiveComplete(99); alert('专项强化完成！错题已温习。');" style="margin-top: 1rem; padding: 14px; background: var(--accent-secondary); border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer;">我已掌握，返回计划</button>
        </div>
    `;
}

function markAdaptiveComplete(id) {
    state.adaptiveCompleted = state.adaptiveCompleted || [];
    if (!state.adaptiveCompleted.includes(id)) {
        state.adaptiveCompleted.push(id);
    }
    markTaskComplete(id);
    runHeuristicAnalysis(); // Force update UI
    renderView('daily-plan');
}

function checkGrammarAnswer(qId) {
    const q = state.grammarQuestions.find(x => x.id === qId);
    const session = getGrammarQuestionsForCurrentSession();
    const input = document.getElementById('grammar-answer');
    const feedback = document.getElementById('grammar-feedback');
    const nextBtn = document.getElementById('next-btn');
    const checkBtn = document.getElementById('check-btn');
    const val = input.value.trim().toLowerCase();
    
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    feedback.style.display = 'block';

    if (val === q.answer.toLowerCase()) {
        feedback.style.color = "var(--accent-secondary)";
        feedback.innerHTML = `✅ 正确！<br><small>${q.explanation}</small>`;
    } else {
        feedback.style.color = "#ff5252";
        feedback.innerHTML = `❌ 错误。正确答案是: ${q.answer}<br><small>${q.explanation}</small>${q.commonMistake ? `<br><small>常见误区：${q.commonMistake}</small>` : ''}`;
        state.errorBank.push({ 
            type: 'Grammar', 
            category: q.category || 'General', 
            content: q.sentence, 
            correction: q.answer,
            date: new Date().toLocaleDateString()
        });
        saveState();
    }
    
    if (state.currentGrammarIndex >= session.questions.length - 1) { 
        nextBtn.textContent = "完成练习"; 
        markTaskComplete('grammar'); 
    }
}

function nextGrammarQuestion() {
    const session = getGrammarQuestionsForCurrentSession();
    if (state.currentGrammarIndex < session.questions.length - 1) {
        state.currentGrammarIndex++; saveState(); renderGrammarView();
    } else {
        state.currentGrammarIndex = 0; saveState(); switchView('daily-plan');
    }
}

// --- 3. Phonetics Lab ---
function getPhoneticExerciseForCurrentDay() {
    const day = getCurrentDay();
    const exercises = state.phoneticExercises || [];
    if (!exercises.length) return { day, index: 0, exercise: null };

    const matchedIndex = exercises.findIndex(ex => Number(ex.day) === day);
    const index = matchedIndex >= 0 ? matchedIndex : ((day - 1) % exercises.length);
    const raw = exercises[index];
    const words = raw.words || [raw.wordA, raw.wordB].filter(Boolean);
    const title = raw.title || raw.contrast || '今日发音练习';

    return {
        day,
        index,
        exercise: {
            ...raw,
            day: raw.day || day,
            title,
            words,
            category: getPhoneticCategory(title),
            skillTarget: getPhoneticSkillTarget(title),
            coachingTip: getPhoneticCoachingTip(title)
        }
    };
}

function getPhoneticCategory(title) {
    if (title.includes('/i:/') || title.includes('/ɪ/') || title.includes('/æ/') || title.includes('/e/')) return '元音对比';
    if (title.includes('/θ/') || title.includes('/s/') || title.includes('/z/')) return '齿音与摩擦音';
    if (title.includes('/v/') || title.includes('/w/') || title.includes('/f/')) return '唇齿音与半元音';
    if (title.includes('/l/') || title.includes('/r/')) return '舌位对比';
    if (title.includes('/n/') || title.includes('/ŋ/')) return '鼻音尾音';
    if (title.includes('/p/') || title.includes('/b/') || title.includes('/t/') || title.includes('/d/')) return '清浊爆破音';
    return '基础辨音';
}

function getPhoneticSkillTarget(title) {
    if (title.includes('/i:/') || title.includes('/ɪ/') || title.includes('/æ/') || title.includes('/e/')) return '主要服务：听力辨音 + 口语清晰度';
    if (title.includes('/θ/') || title.includes('/s/') || title.includes('/ʃ/')) return '主要服务：减少替代音，提升可理解度';
    if (title.includes('/v/') || title.includes('/w/') || title.includes('/l/') || title.includes('/r/')) return '主要服务：口语发音纠偏';
    if (title.includes('/n/') || title.includes('/ŋ/')) return '主要服务：尾音准确度 + 听力辨识';
    return '主要服务：基础口语清晰度';
}

function getPhoneticCoachingTip(title) {
    if (title.includes('/i:/') || title.includes('/ɪ/')) return '先把长短音拉开，再读完整句子，不要急着求快。';
    if (title.includes('/æ/') || title.includes('/e/')) return '注意嘴巴开合幅度，先分开单词，再连进句子。';
    if (title.includes('/θ/') || title.includes('/s/')) return '轻咬舌尖，把气流送出来，避免直接读成 /s/。';
    if (title.includes('/v/') || title.includes('/w/')) return '先确认嘴唇和牙齿位置，再开始连读。';
    if (title.includes('/l/') || title.includes('/r/')) return '先慢读对比词，确认舌尖位置，再读整句。';
    if (title.includes('/n/') || title.includes('/ŋ/')) return '注意收尾，不要把鼻音尾巴吞掉。';
    return '先听一遍，再慢读，再完整复述句子。';
}

function getPhoneticTechniqueFocus(title) {
    if (title.includes('/i:/') || title.includes('/ɪ/')) return '长短音拉开';
    if (title.includes('/æ/') || title.includes('/e/')) return '开口幅度';
    if (title.includes('/θ/') || title.includes('/s/')) return '舌尖送气';
    if (title.includes('/v/') || title.includes('/w/')) return '唇形切换';
    if (title.includes('/l/') || title.includes('/r/')) return '舌位控制';
    if (title.includes('/n/') || title.includes('/ŋ/')) return '尾音收住';
    if (title.includes('Stress')) return '重音位置';
    if (title.includes('Linking')) return '连读衔接';
    if (title.includes('Intonation')) return '句调起伏';
    return '清晰发音';
}

function getPhoneticStage(day) {
    if (day <= 10) {
        return {
            label: '阶段 1：基础辨音',
            goal: '先把最常混淆的基础音对分清，建立耳朵和口型的基本对应。',
            step2: '短词跟读',
            step2Desc: '先把两个目标词单独读稳，不急着上整句。'
        };
    }
    if (day <= 20) {
        return {
            label: '阶段 2：进阶纠偏',
            goal: '开始处理更难的辅音、双元音和静音问题，把容易变形的发音点纠正过来。',
            step2: '短语跟读',
            step2Desc: '把目标词放进短语里，练语流中的稳定度。'
        };
    }
    return {
        label: '阶段 3：语流与节奏',
        goal: '把单个音带进真实语流，重点练尾音、重音、连读和句调。',
        step2: '语流模仿',
        step2Desc: '跟着短语和句子模仿节奏，不只追求单词发对。'
    };
}

function normalizeEnglishText(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getWordDiffStatus(words, normalizedResult) {
    const first = words[0]?.toLowerCase() || '';
    const second = words[1]?.toLowerCase() || '';
    const hasWordA = normalizedResult.includes(first);
    const hasWordB = normalizedResult.includes(second);
    return { hasWordA, hasWordB, matchCount: [hasWordA, hasWordB].filter(Boolean).length };
}

function buildListeningBank() {
    const baseSessions = [
        {
            title: '校园咨询',
            scene: '校园前台',
            focus: '时间与地点信息',
            transcript: 'The speaking club meets every Tuesday at seven in Room twelve.',
            keywords: ['Tuesday', 'Room twelve'],
            question: '俱乐部几点、在哪见面？',
            answer: 'It meets at seven in Room twelve.',
            tip: '先抓时间，再抓地点。'
        },
        {
            title: '图书馆借书',
            scene: '图书馆',
            focus: '规则信息',
            transcript: 'You can borrow three books for two weeks with your student card.',
            keywords: ['three books', 'two weeks'],
            question: '一次能借几本书、多久？',
            answer: 'You can borrow three books for two weeks.',
            tip: '注意数字和时间长度。'
        },
        {
            title: '公寓维修',
            scene: '租房电话',
            focus: '问题与安排',
            transcript: 'The plumber will come tomorrow morning to fix the kitchen sink.',
            keywords: ['tomorrow morning', 'kitchen sink'],
            question: '谁什么时候来修什么？',
            answer: 'The plumber will come tomorrow morning to fix the kitchen sink.',
            tip: '重点听人物、时间和问题位置。'
        },
        {
            title: '咖啡店点单',
            scene: '日常消费',
            focus: '数量与选择',
            transcript: 'I would like a large coffee and two cheese sandwiches, please.',
            keywords: ['large coffee', 'two cheese sandwiches'],
            question: '顾客点了什么？',
            answer: 'A large coffee and two cheese sandwiches.',
            tip: '先抓主物品，再抓数量。'
        },
        {
            title: '机场接机',
            scene: '出行安排',
            focus: '交通与时间',
            transcript: 'The shuttle bus leaves at quarter past six from the main entrance.',
            keywords: ['quarter past six', 'main entrance'],
            question: '班车什么时候、从哪里出发？',
            answer: 'It leaves at quarter past six from the main entrance.',
            tip: '英式时间表达要单独练耳朵。'
        },
        {
            title: '课程注册',
            scene: '选课办公室',
            focus: '课程限制',
            transcript: 'You need to finish the basic writing course before taking academic English.',
            keywords: ['basic writing course', 'academic English'],
            question: '上学术英语前要先完成什么？',
            answer: 'You need to finish the basic writing course first.',
            tip: '注意 before 这类逻辑词。'
        },
        {
            title: '健身房通知',
            scene: '公告广播',
            focus: '日期与变动',
            transcript: 'The gym will close early on Friday for equipment maintenance.',
            keywords: ['Friday', 'equipment maintenance'],
            question: '为什么周五要提前关门？',
            answer: 'Because of equipment maintenance.',
            tip: '先听原因，再回头确认日期。'
        },
        {
            title: '医生预约',
            scene: '诊所前台',
            focus: '预约信息',
            transcript: 'Your appointment is at half past three with Doctor Brown this afternoon.',
            keywords: ['half past three', 'Doctor Brown'],
            question: '预约在什么时候，和谁见？',
            answer: 'At half past three with Doctor Brown.',
            tip: '医生姓名和时间经常一起出现。'
        },
        {
            title: '旅游报名',
            scene: '周末活动',
            focus: '费用与包含内容',
            transcript: 'The weekend trip costs forty dollars and includes lunch and museum tickets.',
            keywords: ['forty dollars', 'museum tickets'],
            question: '费用是多少，包含什么？',
            answer: 'It costs forty dollars and includes lunch and museum tickets.',
            tip: '价格和包含项很容易漏掉后半句。'
        },
        {
            title: '工作面试',
            scene: '电话通知',
            focus: '准备事项',
            transcript: 'Please bring your passport and printed resume to the interview on Monday.',
            keywords: ['passport', 'printed resume'],
            question: '面试时需要带什么？',
            answer: 'A passport and a printed resume.',
            tip: '动词后面的并列名词要听全。'
        }
    ];

    return Array.from({ length: 30 }, (_, index) => {
        const base = baseSessions[index % baseSessions.length];
        const stage = index < 10 ? '基础捕捉' : index < 20 ? '信息定位' : '整句理解';
        return {
            day: index + 1,
            stage,
            ...base
        };
    });
}

function getListeningSessionForCurrentDay() {
    const day = getCurrentDay();
    const bank = buildListeningBank();
    const session = bank.find(item => item.day === day) || bank[0];
    if (!session) return { day, session: null, items: [] };

    const clozeSentence = session.transcript
        .replace(new RegExp(`\\b${session.keywords[0]}\\b`, 'i'), '_____')
        .replace(new RegExp(`\\b${session.keywords[1]}\\b`, 'i'), '_____');

    return {
        day,
        session,
        items: [
            {
                id: 'keywords',
                title: '题 1：关键词捕捉',
                prompt: '先听整句，写下两个最重要的信息点。',
                answer: session.keywords.join(' / '),
                skill: '先把关键信息抓出来'
            },
            {
                id: 'cloze',
                title: '题 2：句子填空',
                prompt: clozeSentence,
                answer: session.keywords.join(' / '),
                skill: '把关键词放回句子结构里'
            },
            {
                id: 'full',
                title: '题 3：信息回答',
                prompt: session.question,
                answer: session.answer,
                skill: '确认你不只是听到词，而是真的理解了'
            }
        ]
    };
}

function renderPhoneticsView() {
    const session = getPhoneticExerciseForCurrentDay();
    const ex = session.exercise;
    const stage = getPhoneticStage(session.day);
    if (!ex) {
        appView.innerHTML = `<div class="card" style="text-align:center; padding:2rem;">今日发音素材暂时不可用。</div>`;
        return;
    }

    state.currentPhoneticIndex = session.index;

    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; text-align: center;">
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div style="text-align: left;">
                    <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 0.25rem;">DAY ${session.day} 发音单元</div>
                    <h3 style="color: var(--accent-secondary);">发音实验室：${ex.title}</h3>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-dim);">今日 3 步</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center;">
                <span style="font-size: 0.78rem; color: var(--accent-primary); background: rgba(124, 77, 255, 0.12); border: 1px solid rgba(124, 77, 255, 0.28); padding: 6px 10px; border-radius: 999px;">${stage.label}</span>
                <span style="font-size: 0.78rem; color: var(--accent-secondary); background: rgba(0,229,255,0.08); border: 1px solid rgba(0,229,255,0.2); padding: 6px 10px; border-radius: 999px;">${ex.category}</span>
                <span style="font-size: 0.78rem; color: var(--text-main); background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); padding: 6px 10px; border-radius: 999px;">纠偏重点：${getPhoneticTechniqueFocus(ex.title)}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.9rem; width: 100%;">
                <div style="padding: 1rem; border: 1px solid var(--glass-border); border-radius: 14px; background: rgba(255,255,255,0.03); text-align: left;">
                    <div style="font-size: 0.78rem; color: var(--accent-secondary); margin-bottom: 0.4rem;">STEP 1</div>
                    <div style="font-weight: 600; margin-bottom: 0.35rem;">辨音模仿</div>
                    <div style="font-size: 0.84rem; color: var(--text-dim);">先听 A、B 两个词，再跟着模仿，先把口型和舌位摆对。</div>
                </div>
                <div style="padding: 1rem; border: 1px solid var(--glass-border); border-radius: 14px; background: rgba(255,255,255,0.03); text-align: left;">
                    <div style="font-size: 0.78rem; color: var(--accent-secondary); margin-bottom: 0.4rem;">STEP 2</div>
                    <div style="font-weight: 600; margin-bottom: 0.35rem;">${stage.step2}</div>
                    <div style="font-size: 0.84rem; color: var(--text-dim);">${stage.step2Desc}</div>
                </div>
                <div style="padding: 1rem; border: 1px solid var(--glass-border); border-radius: 14px; background: rgba(255,255,255,0.03); text-align: left;">
                    <div style="font-size: 0.78rem; color: var(--accent-secondary); margin-bottom: 0.4rem;">STEP 3</div>
                    <div style="font-weight: 600; margin-bottom: 0.35rem;">整句录音</div>
                    <div style="font-size: 0.84rem; color: var(--text-dim);">最后把目标音放进句子里录一次，看清晰度能不能保持住。</div>
                </div>
            </div>
            <div style="width: 100%; padding: 1rem 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 14px; text-align: left;">
                <div style="font-size: 0.82rem; color: var(--accent-primary); margin-bottom: 0.45rem;">今日目标</div>
                <div style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">今天不做听力理解，只专注把 <strong>${ex.words[0]}</strong> 和 <strong>${ex.words[1]}</strong> 读清楚，并在短语和整句里保持稳定。</div>
                <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.7rem;">阶段目标：${stage.goal}</div>
                <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.7rem;">教练提示：${ex.coachingTip}</div>
            </div>
            <div style="display: flex; gap: 2rem;">
                <div class="sound-card" onclick="playText('${ex.words[0]}', 'en-US')" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid var(--glass-border); flex: 1;">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">A</div>
                    <div style="font-weight: 700;">${ex.words[0].toUpperCase()}</div>
                </div>
                <div class="sound-card" onclick="playText('${ex.words[1]}', 'en-US')" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid var(--glass-border); flex: 1;">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">B</div>
                    <div style="font-weight: 700;">${ex.words[1].toUpperCase()}</div>
                </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: center;">
                <button onclick="playContrastPair()" style="background: rgba(124, 77, 255, 0.15); border: 1px solid rgba(124, 77, 255, 0.35); padding: 10px 16px; border-radius: 999px; color: white; cursor: pointer;">对比连播 A/B</button>
                <button onclick="playShadowingDrill()" style="background: rgba(0,229,255,0.08); border: 1px solid rgba(0,229,255,0.25); padding: 10px 16px; border-radius: 999px; color: white; cursor: pointer;">短语跟读示范</button>
                <button onclick="playSegmentedSentence()" style="background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); padding: 10px 16px; border-radius: 999px; color: white; cursor: pointer;">整句慢速示范</button>
            </div>
            <div id="recording-controls" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; background: rgba(255,255,255,0.02); padding: 2rem; border-radius: 20px; width: 100%;">
                <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
                    <p style="font-size: 1.2rem; color: var(--text-main); font-weight: 600; margin: 0;">"${ex.sentence}"</p>
                    <button onclick="playText('${ex.sentence}', 'en-US')" style="align-self: center; background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); padding: 8px 14px; border-radius: 999px; color: white; cursor: pointer;">播放整句示范</button>
                </div>
                <button id="record-btn" onclick="toggleRecording()" style="width: 70px; height: 70px; border-radius: 50%; background: #ff5252; border: none; font-size: 1.8rem; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(255, 82, 82, 0.3);">🎙️</button>
                <p id="record-status" style="font-size: 0.9rem; color: var(--text-dim);">先做辨音模仿和短语跟读，再录整句。系统主要看 <strong>${ex.words[0]}</strong> 和 <strong>${ex.words[1]}</strong> 在整句里有没有保持清楚。</p>
                <div id="audio-playback" style="display: none;"><audio id="player" controls style="height: 35px;"></audio></div>
                <button id="next-phonetic-btn" onclick="nextPhoneticExercise()" style="background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); padding: 12px 30px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">完成今日发音训练</button>
            </div>
        </div>
    `;
}

function renderListeningView() {
    const session = getListeningSessionForCurrentDay();
    const current = session.session;
    if (!current) {
        appView.innerHTML = `<div class="card" style="text-align:center; padding:2rem;">今日听力素材暂时不可用。</div>`;
        return;
    }

    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 0.25rem;">DAY ${session.day} 听写单元</div>
                    <h3 style="color: var(--accent-secondary);">🎧 听力专项：${current.title}</h3>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-dim);">今日 3 题</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
                <span style="font-size: 0.78rem; color: var(--accent-secondary); background: rgba(0,229,255,0.08); border: 1px solid rgba(0,229,255,0.2); padding: 6px 10px; border-radius: 999px;">${current.stage}</span>
                <span style="font-size: 0.78rem; color: var(--text-main); background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); padding: 6px 10px; border-radius: 999px;">场景：${current.scene}</span>
                <span style="font-size: 0.78rem; color: var(--text-main); background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); padding: 6px 10px; border-radius: 999px;">重点：${current.focus}</span>
            </div>
            <div style="padding: 1rem 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 14px;">
                <div style="font-size: 0.82rem; color: var(--accent-primary); margin-bottom: 0.45rem;">今日目标</div>
                <div style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">今天固定做 <strong>3 题</strong>：先抓关键词，再补句子信息，最后回答理解题。它和发音实验室不再重复，重点是把声音转成信息。</div>
                <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.7rem;">教练提示：${current.tip}</div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.8rem;">
                <button onclick="playText('${current.transcript}', 'en-US')" style="background: rgba(124, 77, 255, 0.15); border: 1px solid rgba(124, 77, 255, 0.35); padding: 12px 16px; border-radius: 12px; color: white; cursor: pointer;">播放整句</button>
                <button onclick="playSegmentedText('${current.transcript}')" style="background: rgba(0,229,255,0.08); border: 1px solid rgba(0,229,255,0.25); padding: 12px 16px; border-radius: 12px; color: white; cursor: pointer;">分段慢速播放</button>
                <button onclick="playText('${current.keywords.join('. ')}', 'en-US')" style="background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); padding: 12px 16px; border-radius: 12px; color: white; cursor: pointer;">播放关键词</button>
            </div>
            <div style="display: grid; gap: 1rem;">
                ${session.items.map(item => `
                    <div style="padding: 1rem; border-radius: 14px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.03);">
                        <div style="display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 0.55rem;">
                            <div style="font-weight: 700; color: white;">${item.title}</div>
                            <div style="font-size: 0.75rem; color: var(--text-dim);">${item.skill}</div>
                        </div>
                        <div style="font-size: 0.92rem; color: var(--text-main); line-height: 1.6; margin-bottom: 0.75rem;">${item.prompt}</div>
                        <input id="listening-${item.id}" type="text" placeholder="把答案写在这里..." style="width: 100%; background: transparent; border: 1px solid var(--glass-border); border-radius: 10px; color: var(--text-main); padding: 0.9rem; font-size: 0.96rem; outline: none;">
                    </div>
                `).join('')}
            </div>
            <div id="listening-feedback" style="display: none; padding: 1rem; border-radius: 12px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.03);"></div>
            <div style="display: flex; gap: 0.9rem;">
                <button onclick="checkListeningAnswer()" style="flex: 1; background: var(--accent-primary); border: none; padding: 14px; border-radius: 12px; color: white; cursor: pointer; font-weight: 700;">检查 3 题</button>
                <button onclick="completeListeningTask()" style="flex: 1; background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); padding: 14px; border-radius: 12px; color: white; cursor: pointer; font-weight: 600;">完成今日听力</button>
            </div>
        </div>
    `;
}

function nextPhoneticExercise() {
    markTaskComplete('phonetics');
    state.currentPhoneticIndex = 0;
    saveState();
    switchView('daily-plan');
}

async function playContrastPair() {
    const session = getPhoneticExerciseForCurrentDay();
    const ex = session.exercise;
    if (!ex) return;
    await playText(`${ex.words[0]}. ${ex.words[1]}.`, 'en-US');
}

async function playShadowingDrill() {
    const session = getPhoneticExerciseForCurrentDay();
    const ex = session.exercise;
    if (!ex) return;
    await playText(`${ex.words[0]}. ${ex.words[1]}. ${ex.words[0]} ${ex.words[1]}.`, 'en-US');
}

async function playSegmentedText(text) {
    const parts = text.split(/,| and | but /i).map(p => p.trim()).filter(Boolean);
    if (parts.length <= 1) {
        await playText(text, 'en-US');
        return;
    }
    stopDemoAudio();
    for (let i = 0; i < parts.length; i++) {
        await playText(parts[i], 'en-US');
        await new Promise(resolve => setTimeout(resolve, 1200));
    }
}

async function playSegmentedSentence() {
    const session = getPhoneticExerciseForCurrentDay();
    const ex = session.exercise;
    if (!ex) return;
    await playSegmentedText(ex.sentence);
}

function getEnglishVoice() {
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    return voices.find(v => v.lang === 'en-US' && /Samantha|Karen|Ava|Allison|Victoria/i.test(v.name))
        || voices.find(v => v.lang && v.lang.startsWith('en') && /Samantha|Karen|Ava|Allison|Victoria/i.test(v.name))
        || voices.find(v => v.lang === 'en-US' && /Female/i.test(v.name))
        || voices.find(v => v.lang && v.lang.startsWith('en') && /Female/i.test(v.name))
        || null;
}

function waitForEnglishVoice(timeout = 800) {
    const existing = getEnglishVoice();
    if (existing) return Promise.resolve(existing);

    return new Promise(resolve => {
        const synth = window.speechSynthesis;
        let settled = false;

        const finish = () => {
            if (settled) return;
            settled = true;
            synth.removeEventListener?.('voiceschanged', onVoicesChanged);
            resolve(getEnglishVoice());
        };

        const onVoicesChanged = () => finish();
        synth.addEventListener?.('voiceschanged', onVoicesChanged);
        setTimeout(finish, timeout);
    });
}

async function playText(text, lang) {
    stopDemoAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = text.includes(' ') ? 0.78 : 0.72;
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = await waitForEnglishVoice();
    if (preferredVoice) utterance.voice = preferredVoice;

    currentDemoUtterance = utterance;
    window.speechSynthesis.speak(utterance);
}

let currentDemoUtterance = null;
let currentDemoAudio = null;

function stopDemoAudio() {
    if (currentDemoAudio) {
        currentDemoAudio.pause();
        currentDemoAudio.currentTime = 0;
        currentDemoAudio = null;
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    currentDemoUtterance = null;
}

let mediaRecorder; let audioChunks = []; let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition(); recognition.lang = 'en-US';
}

async function toggleRecording() {
    const btn = document.getElementById('record-btn');
    const status = document.getElementById('record-status');
    const playback = document.getElementById('audio-playback');
    const session = getPhoneticExerciseForCurrentDay();
    const targetText = session.exercise?.sentence || '';
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream); audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => { document.getElementById('player').src = URL.createObjectURL(new Blob(audioChunks, { type: 'audio/wav' })); playback.style.display = 'block'; };
            if (recognition) {
                recognition.onstart = () => status.innerHTML = "🎤 正在识别...";
                recognition.onresult = e => { const res = e.results[0][0].transcript; const conf = Math.round(e.results[0][0].confidence * 100); evaluatePronunciation(res, targetText, conf); };
                recognition.start();
            }
            mediaRecorder.start(); btn.style.animation = "pulse 1s infinite"; btn.innerHTML = "⏹️";
        } catch (err) { alert("麦克风受限"); }
    } else { mediaRecorder.stop(); if (recognition) recognition.stop(); btn.style.animation = "none"; btn.innerHTML = "🎙️"; }
}

function evaluatePronunciation(result, target, confidence) {
    const status = document.getElementById('record-status');
    const nextBtn = document.getElementById('next-phonetic-btn');
    const session = getPhoneticExerciseForCurrentDay();
    const ex = session.exercise;
    if (!ex) return;
    
    const normalizedResult = normalizeEnglishText(result);
    const { hasWordA, hasWordB, matchCount } = getWordDiffStatus(ex.words, normalizedResult);

    if (matchCount === 2) {
        status.innerHTML = `<span style="color: var(--accent-secondary); font-weight: 700;">✅ 完美!</span> 你读出了 "${ex.words[0]}" 和 "${ex.words[1]}"。<br><small style="color: var(--text-dim)">AI 识别结果: "${result}" (${confidence}%)</small>`;
        nextBtn.style.background = 'var(--accent-primary)';
        nextBtn.style.border = 'none';
        nextBtn.textContent = "返回今日计划";
        markTaskComplete('phonetics');
    } else if (matchCount === 1) {
        const heardWord = hasWordA ? ex.words[0] : ex.words[1];
        const missedWord = hasWordA ? ex.words[1] : ex.words[0];
        status.innerHTML = `<span style="color: #ffb74d; font-weight: 700;">🟡 差一点就稳了</span> 系统听到了 <strong>${heardWord}</strong>，但 <strong>${missedWord}</strong> 还不够清楚。<br><small style="color: var(--text-dim)">AI 识别结果: "${result}" (${confidence}%)，建议先单独重听 ${missedWord} 再读整句。</small>`;
    } else {
        status.innerHTML = `<span style="color: #ff5252;">⚠️ 继续加油</span> 这次还没稳定识别到目标对比词。<br><small style="color: var(--text-dim)">AI 识别结果: "${result}" (${confidence}%)。建议先点词卡听一遍，再慢读整句。</small>`;
    }
}

function checkListeningAnswer() {
    const session = getListeningSessionForCurrentDay();
    const current = session.session;
    const feedback = document.getElementById('listening-feedback');
    if (!current || !feedback) return;

    const keywordsInput = document.getElementById('listening-keywords')?.value.trim() || '';
    const clozeInput = document.getElementById('listening-cloze')?.value.trim() || '';
    const fullInput = document.getElementById('listening-full')?.value.trim() || '';
    if (!keywordsInput && !clozeInput && !fullInput) return;

    const normalizedKeywords = normalizeEnglishText(keywordsInput);
    const normalizedCloze = normalizeEnglishText(clozeInput);
    const normalizedFull = normalizeEnglishText(fullInput);
    const normalizedTarget = normalizeEnglishText(current.answer);
    const normalizedTranscript = normalizeEnglishText(current.transcript);
    const normalizedWordA = normalizeEnglishText(current.keywords[0]);
    const normalizedWordB = normalizeEnglishText(current.keywords[1]);

    const keywordCorrect = normalizedKeywords.includes(normalizedWordA) && normalizedKeywords.includes(normalizedWordB);
    const clozeCorrect = normalizedCloze.includes(normalizedWordA) && normalizedCloze.includes(normalizedWordB);
    const fullExact = normalizedFull === normalizedTarget || normalizedFull === normalizedTranscript;
    const { hasWordA, hasWordB, matchCount } = getWordDiffStatus(current.keywords, normalizedCloze + ' ' + normalizedFull);
    const score = [keywordCorrect, clozeCorrect, fullExact].filter(Boolean).length;

    feedback.style.display = 'block';

    if (score >= 2) {
        feedback.innerHTML = `
            <div style="color: var(--accent-secondary); font-weight: 700; margin-bottom: 0.5rem;">✅ 今日听力完成 ${score}/3</div>
            <div style="font-size: 0.92rem; color: var(--text-dim); line-height: 1.7;">你已经完成了今天这组听力的核心训练：先抓关键词，再把它们放回句子里。${fullExact ? '整句也写对了，状态很好。' : '整句还有细节可再听一轮。'}</div>
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.8rem;">题 1 关键词：${keywordCorrect ? '✓' : '✗'} ｜ 题 2 填空：${clozeCorrect ? '✓' : '✗'} ｜ 题 3 整句：${fullExact ? '✓' : '✗'}</div>
        `;
        markTaskComplete('listening');
        return;
    }

    const diffHint = matchCount === 2
        ? '两个关键对比词都听到了，但整句还有细节没写准。'
        : matchCount === 1
            ? `你只听清了其中一个关键词，另一个还需要重听。`
            : '这次两个关键词都还没稳定抓住，建议先用分段慢速播放。';

    feedback.innerHTML = `
        <div style="color: #ffb74d; font-weight: 700; margin-bottom: 0.5rem;">🟡 今天先做到 ${score}/3</div>
        <div style="font-size: 0.92rem; line-height: 1.7; color: var(--text-main); margin-bottom: 0.75rem;">${diffHint}</div>
        <div style="font-size: 0.88rem; color: var(--text-dim); margin-bottom: 0.35rem;">题 1 正确答案：${current.keywords[0]} / ${current.keywords[1]}</div>
        <div style="font-size: 0.88rem; color: var(--text-dim); margin-bottom: 0.35rem;">题 2 正确答案：${current.keywords[0]} / ${current.keywords[1]}</div>
        <div style="font-size: 0.88rem; color: var(--accent-secondary);">题 3 参考答案：${current.answer}</div>
        <div style="font-size: 0.82rem; color: var(--text-dim); margin-top: 0.7rem;">关键信息捕捉：${hasWordA ? '✓' : '✗'} ${current.keywords[0]} / ${hasWordB ? '✓' : '✗'} ${current.keywords[1]}</div>
    `;
}

function completeListeningTask() {
    markTaskComplete('listening');
    saveState();
    switchView('daily-plan');
}

// --- 4. Professional Writing Engine (V6) ---
function buildWritingSessionForCurrentDay() {
    const day = getCurrentDay();
    const rawTask = state.curriculum[day]?.writing || { task: "Please complete your daily writing task.", wordCount: 250 };
    const prompt = rawTask.task || '';
    const normalizedPrompt = prompt.toLowerCase();
    const isTask1 = normalizedPrompt.includes('chart') || normalizedPrompt.includes('graph') || normalizedPrompt.includes('table') || normalizedPrompt.includes('diagram') || normalizedPrompt.includes('summarise the information');
    const taskType = isTask1 ? 'Task 1 图表概述' : 'Task 2 观点论述';
    const stage = day <= 10 ? '阶段 1：句子与段落打底' : day <= 20 ? '阶段 2：展开与比较' : '阶段 3：表达与整合';
    const goal = isTask1
        ? '先抓总体趋势，再写 2 到 3 个关键对比，不要逐项罗列所有数字。'
        : '先明确立场，再写 2 个展开段，每段只讲一个核心理由。';
    const checklist = isTask1
        ? ['有没有总览句', '有没有 2 组关键对比', '有没有避免主观评价']
        : ['有没有明确表态', '有没有 2 个展开理由', '有没有例子或解释支撑'];
    const targetWords = rawTask.wordCount || (isTask1 ? 160 : 250);
    return { day, rawTask, prompt, taskType, stage, goal, checklist, targetWords, isTask1 };
}

function renderWritingView() {
    const session = buildWritingSessionForCurrentDay();
    appView.innerHTML = `
        <div class="card" style="height: 100%; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>✍️ 写作训练单元 (Day ${session.day})</h3>
                <span style="font-size: 0.75rem; color: var(--accent-secondary); background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px;">${session.taskType}</span>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                <div style="background: rgba(124, 77, 255, 0.05); border: 1px solid rgba(124, 77, 255, 0.2); padding: 1rem; border-radius: 12px;">
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">当前阶段</div>
                    <div style="font-size: 0.98rem; color: var(--accent-primary); font-weight: 700;">${session.stage}</div>
                </div>
                <div style="background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.2); padding: 1rem; border-radius: 12px;">
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">今天重点</div>
                    <div style="font-size: 0.9rem; line-height: 1.6; color: #f4f4f4;">${session.goal}</div>
                </div>
                <div style="background: rgba(255,183,77,0.06); border: 1px solid rgba(255,183,77,0.2); padding: 1rem; border-radius: 12px;">
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">完成标准</div>
                    <div style="font-size: 0.9rem; line-height: 1.7; color: #f4f4f4;">${session.checklist.map(item => `• ${item}`).join('<br>')}</div>
                </div>
            </div>
            
            <div style="background: rgba(124, 77, 255, 0.05); border: 1px solid rgba(124, 77, 255, 0.2); padding: 1.2rem; border-radius: 12px;">
                <h4 style="color: var(--accent-primary); margin-bottom: 0.8rem; font-size: 0.9rem;">📝 今日写作任务</h4>
                <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6; white-space: pre-wrap;">${session.prompt}</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-dim);">建议字数: <strong>${session.targetWords}+ 字</strong></div>
            </div>

            <textarea id="essay-input" placeholder="请根据上述任务要求开始写作..." style="flex: 1; background: transparent; border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-main); padding: 1.5rem; font-size: 1.1rem; resize: none; line-height: 1.8; outline: none; font-family: inherit;">${state.essays.current}</textarea>
            <div id="writing-feedback"></div>
            <button id="check-writing-btn" onclick="saveAndCheckEssay()" style="background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary)); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer;">开始专家诊断</button>
        </div>
    `;
}

async function saveAndCheckEssay() {
    const input = document.getElementById('essay-input'); const btn = document.getElementById('check-writing-btn'); const feedback = document.getElementById('writing-feedback');
    const text = input.value.trim(); if (!text) return;
    const session = buildWritingSessionForCurrentDay();
    state.essays.current = text; saveState(); btn.disabled = true; btn.innerHTML = "📡 深度分析中...";
    feedback.innerHTML = `<div class="loading">正在扫描语法、拼写与表达逻辑...</div>`;
    try {
        const results = await hybridAnalysis(text);
        const words = text.split(/\s+/).filter(Boolean).length;
        const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length;
        const connectors = (text.match(/\b(because|however|therefore|for example|for instance|in addition|firstly|secondly|overall|while)\b/gi) || []).length;
        const paragraphCount = text.split(/\n+/).map(p => p.trim()).filter(Boolean).length;
        const accuracyIssues = results.filter(res => res.type === 'error').length;
        const developmentHint = session.isTask1
            ? (paragraphCount >= 2 && words >= 140 ? '结构基本够用了，下一步重点是概述和对比。' : '先保证有总览句，再分段写关键变化。')
            : (paragraphCount >= 3 && connectors >= 2 ? '结构开始像 IELTS Task 2 了，下一步重点是把理由展开。' : '先把立场和两段理由写清楚，再谈高级表达。');
        let html = `<div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--glass-border); margin-top: 1rem;">
            <h4 style="color: var(--accent-secondary); margin-bottom: 1.2rem;">🏆 雅思专业写作诊断报告</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem; margin-bottom: 1.2rem;">
                <div style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">字数：${words}/${session.targetWords}+</div>
                <div style="background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">句子数：${sentences}</div>
                <div style="background: rgba(255,183,77,0.06); border: 1px solid rgba(255,183,77,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">连接表达：${connectors}</div>
                <div style="background: rgba(255,82,82,0.06); border: 1px solid rgba(255,82,82,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">准确性问题：${accuracyIssues}</div>
            </div>
            <div style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border-left: 4px solid var(--accent-secondary); margin-bottom: 1rem;">
                <div style="font-weight: 700; color: var(--accent-secondary); margin-bottom: 0.35rem;">今日判断</div>
                <div style="font-size: 0.92rem; line-height: 1.6; color: #f4f4f4;">${developmentHint}</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">`;
        results.forEach(res => {
            const color = res.type === 'error' ? '#ff5252' : (res.type === 'success' ? 'var(--accent-secondary)' : '#ffb74d');
            html += `<div style="padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; border-left: 4px solid ${color};"><div style="font-weight:600; color:${color}; margin-bottom:0.3rem;">${res.category}</div><div style="font-size:0.95rem;">${res.msg}</div></div>`;
            
            // Auto-sync with Error Bank if it's a real linguistic error
            if (res.type === 'error') {
                addError('Writing/Speaking', res.msg.split('<br>')[0], res.msg.split('💡 建议: ')[1] || 'Check expert version');
            }
        });
        html += `</div>
            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <div style="padding: 1.2rem; background: rgba(0,229,255,0.05); border-radius: 12px; border: 1px solid var(--accent-secondary);">
                    <h5 style="color: var(--accent-secondary); margin-bottom: 0.5rem;">✨ 地道润色版 (Natural Polish):</h5>
                    <p style="font-size: 1rem; line-height: 1.6; color: #fff; font-style: italic;">"${generateOptimizedText(text, results)}"</p>
                </div>
                <div style="padding: 1.2rem; background: rgba(124, 77, 255, 0.1); border-radius: 12px; border: 1px solid var(--accent-primary);">
                    <h5 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🏆 雅思 7.0+ 范文版 (IELTS Standard):</h5>
                    <p style="font-size: 1rem; line-height: 1.6; color: #fff; font-weight: 500;">"${generateIELTSVersion(text)}"</p>
                </div>
            </div>
            <div style="margin-top: 1.5rem; text-align: center;">
                <span style="color: var(--accent-secondary); font-weight: 700;">📈 6.5 潜力评估：${predictPotential(results)}</span>
            </div>
        </div>`;
        feedback.innerHTML = html; markTaskComplete('writing');
    } catch (err) { feedback.innerHTML = `<p style="color:#ff5252;">分析超时。</p>`; } finally { btn.disabled = false; btn.innerHTML = "重新进行诊断"; }
}

async function hybridAnalysis(text) {
    const results = [];
    // Expert Rules
    if (text.includes(" ,")) results.push({ type: 'hint', category: "标点规范", msg: "逗号前不应有空格。" });
    if (text.toLowerCase().includes("very like")) results.push({ type: 'error', category: "中式搭配", msg: "<strong>'very like'</strong> 错误。请用 <strong>'really like'</strong>。" });
    if (text.toLowerCase().includes("people is")) results.push({ type: 'error', category: "主谓一致", msg: "<strong>'people is'</strong> 错误。请用 <strong>'people are'</strong>。" });
    
    try {
        const response = await fetch("https://api.languagetool.org/v2/check", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ text: text, language: "en-US" }) });
        const data = await response.json();
        data.matches.forEach(match => {
            const errorText = text.substring(match.offset, match.offset + match.length);
            let reps = match.replacements.slice(0, 2).map(r => `<strong>${r.value}</strong>`).join(' / ');
            if (errorText.toLowerCase() === 'pelope') reps = "<strong>people</strong>";
            if (errorText.toLowerCase() === 'togather') reps = "<strong>together</strong>";
            results.push({ 
                type: 'error', 
                category: "语法/拼写", 
                offset: match.offset,
                length: match.length,
                bestSuggestion: match.replacements[0]?.value || "",
                msg: `${match.message}: "${errorText}" <br> 💡 建议: ${reps}` 
            });
        });
    } catch (e) {}
    return results;
}

// --- 5. Speaking Correction ---
function buildSpeakingBank() {
    const sessions = [
        { topic: 'Daily Routine', chinese: '日常作息', questions: ['What do you usually do in the morning?', 'Which part of your day do you enjoy most?', 'Do you prefer a busy day or a relaxed day?'], goal: '用 4 到 6 句话说清楚日常安排，并给出一个简单原因。', focus: '基础时态 + 原因表达', phrases: ['I usually...', 'One part I really enjoy is...', 'This is because...'] },
        { topic: 'Home and Living', chinese: '居住环境', questions: ['What do you like about your home?', 'Which room do you spend the most time in?', 'Would you like to move in the future?'], goal: '描述一个空间，并补充感受和未来想法。', focus: 'there is/there are + 描述细节', phrases: ['I live in...', 'The room I use most is...', 'In the future, I would like to...'] },
        { topic: 'Study', chinese: '学习', questions: ['What are you studying now?', 'Which subject is most useful to you?', 'Do you prefer studying alone or with others?'], goal: '说清学习内容、偏好和一个原因。', focus: '主谓一致 + 偏好表达', phrases: ['At the moment, I am studying...', 'The most useful subject for me is...', 'I prefer... because...'] },
        { topic: 'Work', chinese: '工作', questions: ['What kind of work do you do?', 'What is the most challenging part of your work?', 'Would you like to change your job in the future?'], goal: '简述工作内容，再补一个挑战或变化想法。', focus: '一般现在时 + future plan', phrases: ['I mainly work on...', 'The most challenging part is...', 'In the future, I may want to...'] },
        { topic: 'Food', chinese: '食物', questions: ['What food do you often eat?', 'Do you prefer eating at home or outside?', 'Is there any food you want to learn to cook?'], goal: '回答时至少给出一个具体食物和一个原因。', focus: '频率副词 + 喜好表达', phrases: ['I often eat...', 'I usually prefer...', 'I would like to learn how to cook...'] },
        { topic: 'Travel', chinese: '旅行', questions: ['Do you like travelling?', 'What kind of places do you want to visit?', 'Do you prefer travelling alone or with others?'], goal: '描述旅行偏好，并说出一个理想地点。', focus: 'want to + 地点描述', phrases: ['Yes, I do / Not really.', 'I would like to visit...', 'I prefer travelling with...'] },
        { topic: 'Hobbies', chinese: '兴趣爱好', questions: ['What do you do in your free time?', 'How often do you do this activity?', 'Why do you enjoy it?'], goal: '把活动、频率和原因连起来说完整。', focus: '频率表达 + because', phrases: ['In my free time, I...', 'I do it...', 'I enjoy it because...'] },
        { topic: 'Reading', chinese: '阅读', questions: ['Do you like reading?', 'What kind of books or articles do you read?', 'Did you read more in the past?'], goal: '描述阅读习惯，并做一个过去和现在的对比。', focus: '过去与现在对比', phrases: ['I usually read...', 'These days, I mostly read...', 'In the past, I...'] },
        { topic: 'Technology', chinese: '科技', questions: ['What technology do you use every day?', 'Has technology changed your life?', 'Do you find it easy to learn new technology?'], goal: '说出一个具体科技产品和它带来的变化。', focus: '现在完成/一般现在 + 影响表达', phrases: ['Every day I use...', 'It has changed my life by...', 'I find it quite...'] },
        { topic: 'Weather', chinese: '天气', questions: ['What kind of weather do you like?', 'Does the weather affect your mood?', 'Is the weather changing in your city?'], goal: '回答偏好时带出个人感受和城市观察。', focus: '形容词表达 + 简单观察', phrases: ['I like... weather because...', 'It definitely affects my mood when...', 'In my city, I think...'] }
    ];

    return Array.from({ length: 30 }, (_, index) => {
        const base = sessions[index % sessions.length];
        const stage = index < 10 ? '阶段 1：短句表达' : index < 20 ? '阶段 2：展开回答' : '阶段 3：更自然连贯';
        return { day: index + 1, stage, ...base };
    });
}

function getSpeakingSessionForCurrentDay() {
    const day = getCurrentDay();
    const curriculumSpeaking = state.curriculum[day]?.speaking;
    if (curriculumSpeaking) {
        const stage = day <= 10 ? '阶段 1：短句表达' : day <= 20 ? '阶段 2：展开回答' : '阶段 3：更自然连贯';
        return { day, stage, ...curriculumSpeaking };
    }
    const bank = buildSpeakingBank();
    return bank.find(item => item.day === day) || bank[0];
}

function renderSpeakingView() {
    const session = getSpeakingSessionForCurrentDay();
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 0.2rem;">DAY ${session.day} 口语单元</div>
                    <h3>🗣️ 口语纠偏：${session.topic}</h3>
                </div>
                <span style="font-size: 0.75rem; color: var(--accent-secondary); background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px;">${session.stage}</span>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                <div style="background: rgba(255, 183, 77, 0.05); border: 1px solid rgba(255, 183, 77, 0.2); padding: 1.1rem; border-radius: 12px;">
                    <h4 style="color: #ffb74d; margin-bottom: 0.7rem; font-size: 0.9rem;">今日目标</h4>
                    <p style="font-size: 0.88rem; line-height: 1.6;">${session.goal}</p>
                </div>
                <div style="background: rgba(124, 77, 255, 0.08); border: 1px solid rgba(124, 77, 255, 0.22); padding: 1.1rem; border-radius: 12px;">
                    <h4 style="color: var(--accent-primary); margin-bottom: 0.7rem; font-size: 0.9rem;">纠偏重点</h4>
                    <p style="font-size: 0.88rem; line-height: 1.6;">${session.focus}</p>
                </div>
                <div style="background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.2); padding: 1.1rem; border-radius: 12px;">
                    <h4 style="color: var(--accent-secondary); margin-bottom: 0.7rem; font-size: 0.9rem;">可直接套用</h4>
                    <p style="font-size: 0.88rem; line-height: 1.6;">${session.phrases.join(' / ')}</p>
                </div>
            </div>

            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 1.2rem; border-radius: 12px;">
                <h4 style="margin-bottom: 0.8rem; color: var(--accent-secondary);">今日问题</h4>
                <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.92rem; line-height:1.6;">
                    ${session.questions.map((q, idx) => `<div><strong>Q${idx + 1}.</strong> ${q}</div>`).join('')}
                </div>
            </div>

            <div style="background: rgba(255, 183, 77, 0.05); border: 1px solid rgba(255, 183, 77, 0.2); padding: 1.2rem; border-radius: 12px;">
                <h4 style="color: #ffb74d; margin-bottom: 0.8rem; font-size: 0.9rem;">🚫 常见雷区</h4>
                <ul style="font-size: 0.85rem; color: var(--text-main); line-height: 1.6; list-style-position: inside; display: flex; flex-direction: column; gap: 0.4rem;">
                    <li>不要只回答 1 句，至少补一个原因或例子。</li>
                    <li>不要堆砌中文直译，比如 "I very like..."。</li>
                    <li>尽量用连接词把句子连起来，比如 "because", "so", "in the future"。</li>
                </ul>
            </div>

            <textarea id="speaking-input" placeholder="请围绕上面的 3 个问题，写出或说出你的回答草稿。建议至少 4 句话..." style="background: transparent; border: 1px solid var(--glass-border); border-radius: 12px; color: white; padding: 1.5rem; min-height: 160px; outline: none; font-family: inherit; font-size: 1.05rem; line-height: 1.7;">${state.speakingInput}</textarea>
            <button onclick="analyzeSpeaking()" style="background: var(--accent-primary); border: none; padding: 14px; border-radius: 12px; color: white; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(124, 77, 255, 0.2);">开始口语纠偏诊断</button>
            <div id="speaking-result"></div>
        </div>
    `;
}

async function analyzeSpeaking() {
    const input = document.getElementById('speaking-input');
    const resContainer = document.getElementById('speaking-result');
    const text = input.value.trim();
    if (!text) return;
    const session = getSpeakingSessionForCurrentDay();
    
    state.speakingInput = text;
    saveState();

    resContainer.innerHTML = `<div class="loading">🔍 AI 专家正在深度诊断您的口语逻辑...</div>`;

    try {
        const results = await hybridAnalysis(text);
        const sentenceCount = text.split(/[.!?。！？]\s*/).filter(Boolean).length;
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const connectorCount = (text.match(/\b(because|so|but|and|also|in the future|for example)\b/gi) || []).length;

        let html = `<div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--glass-border); margin-top: 1rem;">
            <h4 style="color: #ffb74d; margin-bottom: 1.2rem;">💡 口语逻辑深度诊断</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.8rem; margin-bottom:1rem;">
                <div style="padding:0.9rem; border:1px solid var(--glass-border); border-radius:10px;"><div style="font-size:0.78rem; color:var(--text-dim);">句子数量</div><div style="font-size:1.1rem; font-weight:700;">${sentenceCount}</div></div>
                <div style="padding:0.9rem; border:1px solid var(--glass-border); border-radius:10px;"><div style="font-size:0.78rem; color:var(--text-dim);">词数</div><div style="font-size:1.1rem; font-weight:700;">${wordCount}</div></div>
                <div style="padding:0.9rem; border:1px solid var(--glass-border); border-radius:10px;"><div style="font-size:0.78rem; color:var(--text-dim);">连接表达</div><div style="font-size:1.1rem; font-weight:700;">${connectorCount}</div></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">`;

        if (sentenceCount < 3) {
            html += `<div style="padding: 1rem; background: rgba(255,183,77,0.08); border-radius: 10px; border-left: 4px solid #ffb74d;"><div style="font-weight:600; color:#ffb74d; margin-bottom:0.3rem;">回答长度不足</div><div style="font-size:0.95rem; line-height:1.6;">今天目标是围绕 <strong>${session.topic}</strong> 至少说 4 句话。先回答问题，再补一个原因或例子。</div></div>`;
        }
        if (connectorCount === 0) {
            html += `<div style="padding: 1rem; background: rgba(255,183,77,0.08); border-radius: 10px; border-left: 4px solid #ffb74d;"><div style="font-weight:600; color:#ffb74d; margin-bottom:0.3rem;">表达还不够连贯</div><div style="font-size:0.95rem; line-height:1.6;">试着加入这些连接表达中的至少一个：${session.phrases.join(' / ')}。</div></div>`;
        }
        
        if (results.length === 0) {
            html += `<div style="color: var(--accent-secondary);">✅ 表现不错！未发现明显的低级错误。</div>`;
        } else {
            results.forEach(res => {
                const color = res.type === 'error' ? '#ff5252' : '#ffb74d';
                html += `<div style="padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; border-left: 4px solid ${color};">
                    <div style="font-weight: 600; color: ${color}; margin-bottom: 0.3rem;">${res.category}</div>
                    <div style="font-size: 0.95rem; line-height: 1.6;">${res.msg}</div>
                </div>`;
            });
        }

        html += `</div>
            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <div style="padding: 1.2rem; background: rgba(0,229,255,0.05); border-radius: 12px; border: 1px solid rgba(0,229,255,0.25);">
                    <h5 style="color: var(--accent-secondary); margin-bottom: 0.5rem;">🎯 更像 IELTS Part 1 的回答方式:</h5>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: #fff;">先直接回答问题，再补一个具体细节，最后给一个简单原因或未来想法。</p>
                </div>
                <div style="padding: 1.2rem; background: rgba(255, 183, 77, 0.05); border-radius: 12px; border: 1px solid rgba(255, 183, 77, 0.3);">
                    <h5 style="color: #ffb74d; margin-bottom: 0.5rem;">✨ 地道口语润色 (Polished Version):</h5>
                    <p style="font-size: 1rem; line-height: 1.6; color: #fff; font-style: italic;">"${generateOptimizedText(text, results)}"</p>
                </div>
                <div style="padding: 1.2rem; background: rgba(124, 77, 255, 0.1); border-radius: 12px; border: 1px solid var(--accent-primary);">
                    <h5 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🏆 雅思 7.0+ 高分版 (IELTS Version):</h5>
                    <p style="font-size: 1rem; line-height: 1.6; color: #fff; font-weight: 500;">"${generateIELTSVersion(text)}"</p>
                </div>
            </div>
        </div>`;
        resContainer.innerHTML = html;
        markTaskComplete('speaking');
    } catch (err) {
        resContainer.innerHTML = `<p style="color: #ff5252;">诊断超时，请重试。</p>`;
    }
}

// --- 6. Target Dashboard ---
function generateOptimizedText(original, results) {
    let optimized = original;
    
    // Sort results by offset (descending) to avoid position shifts during replacement
    const errorMatches = results.filter(r => r.offset !== undefined).sort((a, b) => b.offset - a.offset);
    
    errorMatches.forEach(match => {
        if (match.bestSuggestion) {
            optimized = optimized.substring(0, match.offset) + match.bestSuggestion + optimized.substring(match.offset + match.length);
        }
    });

    // Post-processing for Chinglish patterns
    if (optimized.toLowerCase().includes("very like")) optimized = optimized.replace(/very\s+like/gi, "really like");
    if (optimized.toLowerCase().includes("people is")) optimized = optimized.replace(/people\s+is/gi, "people are");
    if (optimized.toLowerCase().includes("their are")) optimized = optimized.replace(/their\s+are/gi, "there are");
    if (optimized.toLowerCase().includes("i is")) optimized = optimized.replace(/i\s+is/gi, "I am");
    if (optimized.toLowerCase().includes("daugter")) optimized = optimized.replace(/daugter/gi, "daughter");
    if (optimized.toLowerCase().includes("ahout")) optimized = optimized.replace(/ahout/gi, "about");
    if (optimized.toLowerCase().includes("humality")) optimized = optimized.replace(/humality/gi, "humanity");
    if (optimized.toLowerCase().includes("to understanding")) optimized = optimized.replace(/to\s+understanding/gi, "to understand");
    if (optimized.toLowerCase().includes("is very help me")) optimized = optimized.replace(/is\s+very\s+help\s+me/gi, "helped me a lot");
    if (optimized.toLowerCase().includes("daughter school")) optimized = optimized.replace(/daughter\s+school/gi, "daughter's school");

    return optimized;
}

function generateIELTSVersion(text) {
    let ielts = generateOptimizedText(text, []); // Start with a basic clean version
    
    // Academic Vocabulary Upgrades
    const upgrades = [
        { from: /\bliving in\b/gi, to: "residing in" },
        { from: /\bsent my daughter to school\b/gi, to: "escorted my daughter to her educational institution" },
        { from: /\bgo to\b/gi, to: "visit" },
        { from: /\bexercise\b/gi, to: "physical activities" },
        { from: /\busually\b/gi, to: "typically" },
        { from: /\bnow\b/gi, to: "at present" },
        { from: /\bafter\b/gi, to: "subsequently" },
        { from: /\bfor\b/gi, to: "in order to engage in" },
        { from: /\bi with\b/gi, to: "Accompanied by" },
        { from: /\bmyself\b/gi, to: "individually" }
    ];

    upgrades.forEach(u => {
        ielts = ielts.replace(u.from, u.to);
    });

    // Sentence structure enhancement (simple logic to capitalize and fix flow)
    ielts = ielts.charAt(0).toUpperCase() + ielts.slice(1);
    if (!ielts.endsWith('.')) ielts += '.';

    return ielts;
}

function renderDashboard() {
    const today = new Date();
    const exam = new Date(state.examDate);
    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    const day = getCurrentDay();
    const completedCount = state.dailyTasks.filter(t => t.completed).length;
    const totalCount = state.dailyTasks.length || 1;
    const todayCompletion = Math.round((completedCount / totalCount) * 100);
    const vocabProgress = Math.min(Math.round(((state.vocabSRS || []).length / 40) * 100), 100);
    const grammarWeakness = (state.errorBank || []).filter(e => e.type === 'Grammar').length;
    const grammarProgress = Math.max(15, Math.min(100, 70 - grammarWeakness * 4 + completedCount * 4));
    const writingSamples = Object.keys(state.activityLog || {}).length;
    const writingProgress = Math.min(100, 20 + writingSamples * 3 + (((state.essays || {}).current || '').length > 80 ? 15 : 0));
    const streak = calculateStreak();
    const scoreEstimate = todayCompletion >= 85 && streak >= 7 ? 'A2-B1 过渡期' : todayCompletion >= 55 ? 'A2 稳定筑基期' : 'A2 起步期';
    const dashboardAdvice = grammarWeakness >= 6
        ? '当前最该优先收的是语法准确性，不然写作和口语都会被一起拖住。'
        : completedCount <= 3
            ? '今天先把阅读、听力和词汇做完整，输入稳定后其他模块会更顺。'
            : '你的训练节奏已经在成形，接下来重点是连续性，不是一次做很多。';
    const currentPhase = day <= 10 ? '阶段 1：基础重建' : day <= 20 ? '阶段 2：能力爬坡' : '阶段 3：整合巩固';

    appView.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.5s ease;">
            <!-- Countdown Header -->
            <div class="card" style="background: linear-gradient(135deg, rgba(124, 77, 255, 0.2), rgba(0, 229, 255, 0.1)); border: 1px solid var(--accent-secondary); text-align: center; padding: 2rem;">
                <h2 style="color: var(--accent-secondary); margin-bottom: 0.5rem;">🎯 距离 2026 年底目标：${diffDays} 天</h2>
                <p style="color: var(--text-dim); font-size: 0.9rem;">目标分数：雅思 6.5 | 当前阶段：${currentPhase} | 当前估计：${scoreEstimate}</p>
            </div>

            <!-- Roadmap Tiles -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                ${state.milestones.map((m, i) => `
                    <div class="card" style="border-left: 4px solid ${m.status === 'active' ? 'var(--accent-secondary)' : (m.status === 'completed' ? 'var(--accent-primary)' : 'var(--glass-border)')}; opacity: ${m.status === 'locked' ? 0.6 : 1};">
                        <div style="font-size: 0.7rem; color: var(--text-dim); margin-bottom: 0.5rem;">STEP 0${i+1} - ${m.deadline}</div>
                        <h4 style="margin-bottom: 0.5rem; color: ${m.status === 'active' ? 'var(--accent-secondary)' : 'white'};">${m.name}</h4>
                        <p style="font-size: 0.8rem; line-height: 1.4; color: var(--text-dim);">${m.target}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Stats Charts -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div class="card">
                    <h4 style="margin-bottom: 1.5rem;">📊 核心维度进度</h4>
                    <div style="display: flex; flex-direction: column; gap: 1.2rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                                <span>今日任务完成度</span><span>${todayCompletion}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${todayCompletion}%; height: 100%; background: #7c4dff;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                                <span>词汇复现稳定度</span><span>${vocabProgress}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${vocabProgress}%; height: 100%; background: var(--accent-primary);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                                <span>语法稳固度</span><span>${grammarProgress}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${grammarProgress}%; height: 100%; background: var(--accent-secondary);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                                <span>AI 写作等级 (Potential)</span><span>${writingProgress}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${writingProgress}%; height: 100%; background: #ffb74d;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 1rem;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; border: 8px solid var(--accent-secondary); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: var(--accent-secondary); padding: 0 10px;">${scoreEstimate}</div>
                    <h4 style="color: var(--accent-secondary);">当前训练判断</h4>
                    <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.5;">${dashboardAdvice}</p>
                </div>
            </div>

            <!-- 365-Day Study Heatmap -->
            <div class="card" style="padding: 1.5rem;">
                <h4 style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <span>🔥 365 天备考热力图</span>
                    <span style="font-size: 0.75rem; color: var(--text-dim);">连续打卡: ${streak} 天</span>
                </h4>
                <div id="heatmap-container" style="display: grid; grid-template-columns: repeat(53, 1fr); gap: 3px; overflow-x: auto; padding-bottom: 10px;">
                    ${renderHeatmapCells()}
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px; font-size: 0.7rem; color: var(--text-dim); justify-content: flex-end; align-items: center;">
                    <span>Less</span>
                    <div style="width:10px; height:10px; background:rgba(255,255,255,0.05); border-radius:2px;"></div>
                    <div style="width:10px; height:10px; background:rgba(124, 77, 255, 0.3); border-radius:2px;"></div>
                    <div style="width:10px; height:10px; background:rgba(124, 77, 255, 0.6); border-radius:2px;"></div>
                    <div style="width:10px; height:10px; background:var(--accent-primary); border-radius:2px;"></div>
                    <span>More</span>
                </div>
            </div>
        </div>
    `;
}

function renderHeatmapCells() {
    let cells = '';
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);
    for (let i = 0; i < 371; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        if (d.getFullYear() > today.getFullYear()) break;
        const dateStr = getDateKey(d);
        const count = state.activityLog[dateStr] || 0;
        let opacity = 0.05;
        if (count > 0) opacity = count >= 5 ? 1 : (count >= 3 ? 0.6 : 0.3);
        const color = count > 0 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)';
        cells += `<div title="${dateStr}: ${count} tasks" style="aspect-ratio: 1; background: ${color}; opacity: ${count > 0 ? opacity : 1}; border-radius: 2px;"></div>`;
    }
    return cells;
}

function calculateStreak() {
    let streak = 0;
    const today = new Date();
    const log = state.activityLog || {};
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = getDateKey(d);
        if (log[dateStr] > 0) streak++;
        else if (i > 0) break;
    }
    return streak;
}

// --- Utilities ---
function predictPotential(results) { const count = results.filter(r => r.type === 'error').length; return count === 0 ? "⭐⭐⭐⭐⭐" : (count <= 2 ? "⭐⭐⭐⭐" : "⭐⭐⭐"); }
function toggleTask(id) { 
    const t = state.dailyTasks.find(x => x.id === id); 
    if (t) { 
        const wasCompleted = !!t.completed;
        t.completed = !t.completed; 
        if (!wasCompleted && t.completed) logActivity();
        saveState(); updateProgress(); renderDailyPlan(); 
    } 
}
function markTaskComplete(type) { 
    const t = state.dailyTasks.find(x => x.type === type); 
    if (t && !t.completed) { 
        t.completed = true; 
        logActivity();
        saveState(); updateProgress(); 
    } 
}
function logActivity() {
    const dateStr = getTodayDateString();
    state.activityLog[dateStr] = (state.activityLog[dateStr] || 0) + 1;
}
function updateProgress() {
    const done = state.dailyTasks.filter(t => t.completed).length; const p = Math.round((done / state.dailyTasks.length) * 100);
    progressPercent.textContent = `${p}%`; progressFill.style.width = `${p}%`;
}
function getIcon(type) { const icons = { writing: '✍️', speaking: '🗣️', grammar: '🧩', phonetics: '👄', listening: '🎧', reading: '📖', vocabulary: '📚', 'error-bank': '📕' }; return icons[type] || '🎯'; }
function renderErrorBank() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>📕 专家级错题归档</h3>
                <div style="display: flex; gap: 0.5rem;">
                    ${state.errorBank.length > 0 ? `<button onclick="renderErrorQuiz()" style="background: var(--accent-secondary); border: none; color: black; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer;">开始错题重测</button>` : ''}
                    <button onclick="state.errorBank=[];saveState();renderErrorBank();" style="background: none; border: 1px solid #ff5252; color: #ff5252; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; cursor: pointer;">清空</button>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${state.errorBank.length ? state.errorBank.slice().reverse().map(e => `
                    <div class="card" style="background: rgba(255,255,255,0.02); border-left: 4px solid ${e.type === 'Grammar' ? 'var(--accent-secondary)' : '#ff5252'}; padding: 1.2rem; position: relative;">
                        <span style="position: absolute; top: 1rem; right: 1rem; font-size: 0.7rem; color: var(--text-dim);">${e.date} | ${e.type}</span>
                        <div style="margin-bottom: 0.8rem; color: var(--text-dim); text-decoration: line-through; font-size: 0.9rem;">${e.content}</div>
                        <div style="color: var(--accent-secondary); font-weight: 600; font-size: 1rem;">✅ 修正: ${e.correction}</div>
                    </div>
                `).join('') : `
                    <div style="text-align: center; padding: 3rem; color: var(--text-dim);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                        <p>暂无错题记录，保持住这份完美！</p>
                    </div>
                `}
            </div>
        </div>
    `;
}
function renderAssessmentCenter() {
    const day = getCurrentDay();
    const completedCount = state.dailyTasks.filter(t => t.completed).length;
    const grammarWeakness = (state.errorBank || []).filter(e => e.type === 'Grammar').length;
    const streak = calculateStreak();
    const reviewSignal = grammarWeakness >= 6
        ? '这周最明显的信号是语法准确性拖后腿。'
        : completedCount >= 5
            ? '这周执行力不错，重点转向把输入能力转成输出。'
            : '这周更像节奏没完全立住，先把稳定打卡放在第一位。';
    const weekFocus = grammarWeakness >= 6
        ? '下周建议：语法 + 写作优先，别急着堆新内容。'
        : completedCount <= 3
            ? '下周建议：先固定词汇、听力、阅读三件套。'
            : '下周建议：继续保持输入，同时补上口语和写作。';

    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>📊 模考与复盘中心</h3>
                <span style="font-size: 0.8rem; color: var(--accent-secondary);">当前进度: Day ${day}</span>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                <div style="background: rgba(124,77,255,0.08); border: 1px solid rgba(124,77,255,0.2); border-radius: 12px; padding: 1rem;">
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">本周执行</div>
                    <div style="font-size: 1rem; color: var(--accent-primary); font-weight: 700;">${completedCount}/${state.dailyTasks.length} 模块已完成</div>
                    <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.5rem;">连续打卡 ${streak} 天</div>
                </div>
                <div style="background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.2); border-radius: 12px; padding: 1rem;">
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">本周判断</div>
                    <div style="font-size: 0.92rem; line-height: 1.6; color: #f4f4f4;">${reviewSignal}</div>
                </div>
                <div style="background: rgba(255,183,77,0.06); border: 1px solid rgba(255,183,77,0.2); border-radius: 12px; padding: 1rem;">
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.45rem;">下周重点</div>
                    <div style="font-size: 0.92rem; line-height: 1.6; color: #f4f4f4;">${weekFocus}</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="card" style="background: rgba(124, 77, 255, 0.05); border: 1px solid var(--accent-primary); text-align: center; cursor: pointer;" onclick="startExam('weekly')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                    <h4 style="color: var(--accent-primary);">周度摸底考</h4>
                    <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.5rem;">涵盖本周核心词汇、语法及错题复测</p>
                </div>
                <div class="card" style="background: rgba(0, 229, 255, 0.05); border: 1px solid var(--accent-secondary); text-align: center; cursor: pointer;" onclick="startExam('monthly')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆</div>
                    <h4 style="color: var(--accent-secondary);">月度阶段考</h4>
                    <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.5rem;">30天训练诊断单：看执行、弱点和是否更接近 6.5</p>
                </div>
            </div>

            <div id="exam-container" style="margin-top: 1rem;"></div>
        </div>
    `;
}

function getRecentActiveDays(days = 30) {
    const log = state.activityLog || {};
    let active = 0;
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = getDateKey(d);
        if (log[dateStr] > 0) active++;
    }
    return active;
}

function buildMonthlyAssessment() {
    const activeDays = getRecentActiveDays(30);
    const streak = calculateStreak();
    const grammarErrors = (state.errorBank || []).filter(e => e.type === 'Grammar').length;
    const vocabPool = (state.vocabSRS || []).length;
    const writingText = ((state.essays || {}).current || '').trim();
    const writingWords = writingText ? writingText.split(/\s+/).filter(Boolean).length : 0;
    const finishedToday = state.dailyTasks.filter(t => t.completed).length;

    const consistencyScore = Math.min(100, Math.round((activeDays / 20) * 100));
    const grammarScore = Math.max(20, Math.min(100, 82 - grammarErrors * 5));
    const vocabScore = Math.min(100, Math.round((vocabPool / 35) * 100));
    const writingScore = Math.min(100, writingWords >= 220 ? 78 : writingWords >= 140 ? 60 : writingWords >= 80 ? 42 : 20);
    const integrationScore = Math.min(100, Math.round(((finishedToday + Math.min(streak, 7)) / 14) * 100));
    const averageScore = Math.round((consistencyScore + grammarScore + vocabScore + writingScore + integrationScore) / 5);

    const bandEstimate = averageScore >= 75
        ? '接近 B1，开始具备冲 6.0-6.5 的基础'
        : averageScore >= 58
            ? 'A2-B1 过渡中，训练方向是对的'
            : 'A2 基础巩固期，还在搭底层框架';

    const biggestRisk = grammarErrors >= 6
        ? '语法准确性仍然是最大拖点，尤其会影响写作和口语。'
        : writingWords < 120
            ? '输出量偏少，写作和口语还没有真正拉起来。'
            : activeDays < 12
                ? '连续性不足，训练效果容易被打断。'
                : '当前没有单一大漏洞，重点是继续保持节奏并提高质量。';

    const nextMonthFocus = grammarErrors >= 6
        ? ['把语法诊所和写作放在每天最前面', '一周至少完成 3 次写作诊断', '错题库里的语法错误优先清掉']
        : writingWords < 120
            ? ['每周至少完成 2 篇成型写作', '口语和写作都优先练展开', '减少只看不写的训练方式']
            : activeDays < 12
                ? ['先把一周 5 天打卡稳定下来', '每天先完成词汇、听力、阅读三件套', '少追求全做完，先追求连续']
                : ['继续维持输入和输出平衡', '开始更关注写作展开与阅读定位', '每周复盘一次最弱模块'];

    return {
        activeDays,
        streak,
        grammarErrors,
        vocabPool,
        writingWords,
        consistencyScore,
        grammarScore,
        vocabScore,
        writingScore,
        integrationScore,
        averageScore,
        bandEstimate,
        biggestRisk,
        nextMonthFocus
    };
}

function startExam(type) {
    const container = document.getElementById('exam-container');
    const day = getCurrentDay();
    container.innerHTML = `<div class="loading">正在为您从已学内容和错题库中组卷...</div>`;
    
    setTimeout(() => {
        if (type === 'weekly') {
            const startDay = Math.max(1, day - 7);
            let vocabPool = [];
            for(let i=startDay; i<=day; i++) {
                if(state.curriculum[i]) vocabPool.push(...(state.curriculum[i].vocabulary || state.curriculum[i].vocab || []));
            }
            const vocabItems = vocabPool.slice(0, 4).map(item => typeof item === 'string' ? item : item.word);
            const errorGrammar = state.errorBank.filter(e => e.type === 'Grammar').slice(0, 3);
            const reviewSummary = [
                `本周完成模块：${state.dailyTasks.filter(t => t.completed).length}/${state.dailyTasks.length}`,
                `语法错题数：${errorGrammar.length}`,
                `词汇复习池：${(state.vocabSRS || []).length} 词`
            ];
            
            container.innerHTML = `
                <div class="card" style="background: rgba(255,255,255,0.02);">
                    <h4 style="margin-bottom: 1rem; color: var(--accent-primary);">📖 周度复盘任务单</h4>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem; margin-bottom: 1rem;">
                        ${reviewSummary.map(item => `
                            <div style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">${item}</div>
                        `).join('')}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <p><strong>1. 词汇回忆与造句:</strong></p>
                        <ul style="padding-left: 1.5rem; font-size: 0.9rem; color: var(--text-dim);">
                            ${vocabItems.length ? vocabItems.map(word => `<li>请拼写并造句: ${word}</li>`).join('') : '<li>本周词汇池较少，先把今天词汇模块补完整。</li>'}
                        </ul>
                        <p><strong>2. 顽固语法复测:</strong></p>
                        <ul style="padding-left: 1.5rem; font-size: 0.9rem; color: var(--text-dim);">
                            ${errorGrammar.length ? errorGrammar.map(e => `<li>纠正此句: ${e.content}</li>`).join('') : '<li>暂无本周语法错误记录，太棒了！</li>'}
                        </ul>
                        <p><strong>3. 自我复盘问题:</strong></p>
                        <ul style="padding-left: 1.5rem; font-size: 0.9rem; color: var(--text-dim);">
                            <li>这周最卡的是输入理解，还是输出准确性？</li>
                            <li>如果下周只能优先补一块，你会选哪一块？为什么？</li>
                            <li>今天的错题有没有反复出现的模式？</li>
                        </ul>
                    </div>
                    <button onclick="alert('本周复盘已完成。请把最弱的一块带回下周计划里继续补。')" style="margin-top: 1.5rem; width: 100%; padding: 12px; background: var(--accent-primary); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 700;">完成本周复盘</button>
                </div>
            `;
        } else {
            const report = buildMonthlyAssessment();
            container.innerHTML = `
                <div class="card" style="background: rgba(255,255,255,0.02); display:flex; flex-direction:column; gap:1rem;">
                    <h4 style="color: var(--accent-secondary);">🏆 30 天训练诊断单</h4>
                    <div style="padding: 1rem; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.2); border-radius: 12px;">
                        <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.35rem;">当前判断</div>
                        <div style="font-size: 1rem; color: var(--accent-secondary); font-weight: 700; margin-bottom: 0.45rem;">${report.bandEstimate}</div>
                        <div style="font-size: 0.9rem; line-height: 1.6; color: #f4f4f4;">这不是正式 band 分数，而是根据你最近 30 天的训练连续性、词汇复现、语法错误和写作输出做的阶段判断。</div>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem;">
                        <div style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">近 30 天活跃天数：${report.activeDays}</div>
                        <div style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">连续打卡：${report.streak} 天</div>
                        <div style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">词汇复习池：${report.vocabPool} 词</div>
                        <div style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 0.9rem; font-size: 0.85rem; color: var(--text-dim);">最近写作字数：${report.writingWords}</div>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.8rem;">
                        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem;">
                            <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.4rem;"><span>连续性</span><span>${report.consistencyScore}%</span></div>
                            <div style="height:6px; background: rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;"><div style="width:${report.consistencyScore}%; height:100%; background:#7c4dff;"></div></div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem;">
                            <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.4rem;"><span>语法准确性</span><span>${report.grammarScore}%</span></div>
                            <div style="height:6px; background: rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;"><div style="width:${report.grammarScore}%; height:100%; background:var(--accent-secondary);"></div></div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem;">
                            <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.4rem;"><span>词汇复现</span><span>${report.vocabScore}%</span></div>
                            <div style="height:6px; background: rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;"><div style="width:${report.vocabScore}%; height:100%; background:var(--accent-primary);"></div></div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem;">
                            <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.4rem;"><span>写作输出</span><span>${report.writingScore}%</span></div>
                            <div style="height:6px; background: rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;"><div style="width:${report.writingScore}%; height:100%; background:#ffb74d;"></div></div>
                        </div>
                    </div>

                    <div style="padding: 1rem; background: rgba(255,82,82,0.05); border: 1px solid rgba(255,82,82,0.2); border-radius: 12px;">
                        <div style="font-weight: 700; color: #ffb74d; margin-bottom: 0.45rem;">当前最大风险</div>
                        <div style="font-size: 0.9rem; line-height: 1.6; color: #f4f4f4;">${report.biggestRisk}</div>
                    </div>

                    <div style="padding: 1rem; background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.2); border-radius: 12px;">
                        <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 0.45rem;">下一个 30 天建议</div>
                        <div style="font-size: 0.9rem; line-height: 1.8; color: #f4f4f4;">${report.nextMonthFocus.map(item => `• ${item}`).join('<br>')}</div>
                    </div>

                    <div style="text-align:center; font-size:0.9rem; color: var(--text-dim);">综合训练得分：<strong style="color: var(--accent-secondary);">${report.averageScore}%</strong></div>
                </div>
            `;
        }
    }, 1000);
}

// --- 7. Reading View ---
function parseReadingAnswerText(question) {
    const explanation = question.explanation || '';
    const match = explanation.match(/Answer:\s*([^\n\r]+)/i);
    return match ? match[1].trim() : '';
}

function normalizeReadingAnswer(value) {
    const text = String(value || '').trim().toLowerCase();
    if (!text) return '';
    if (/not given/.test(text)) return 'not given';
    if (/\b(false|no|incorrect)\b/.test(text)) return 'false';
    if (/\b(true|yes|correct)\b/.test(text)) return 'true';
    return text;
}

function buildReadingSessionForCurrentDay() {
    const day = getCurrentDay();
    const content = state.curriculum[day]?.reading || state.curriculum[1].reading;
    const rawQuestions = (content.questions || []).slice(0, 3);
    const questions = rawQuestions.map((q, index) => {
        const prompt = q.q || q.question || `Question ${index + 1}`;
        const answerKey = q.a || q.answer || '';
        const answerText = parseReadingAnswerText(q);
        const isHeadingTask = /^Paragraph\s+[A-Z]/i.test(prompt);
        const isTfng = (q.options || []).some(opt => /True|False|Not Given|Yes|No|Correct|Incorrect/i.test(opt));

        return {
            id: `reading-${index}`,
            prompt,
            answerKey,
            answerText,
            options: q.options || [],
            explanation: q.explanation || '',
            type: isHeadingTask ? 'heading' : (isTfng ? 'tfng' : 'choice')
        };
    });

    return {
        day,
        content,
        stage: day <= 10 ? '阶段 1：主旨与定位' : day <= 20 ? '阶段 2：细节判断' : '阶段 3：信息整合',
        questions
    };
}

function renderReadingView() {
    const session = buildReadingSessionForCurrentDay();
    const content = session.content;

    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; animation: fadeIn 0.4s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 0.2rem;">DAY ${session.day} 阅读单元</div>
                    <h3 style="color: var(--accent-secondary);">📖 阅读专项：${content.title}</h3>
                </div>
                <span style="font-size: 0.75rem; color: var(--accent-secondary); background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px;">${session.stage}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                <div style="background: rgba(255, 183, 77, 0.05); border: 1px solid rgba(255, 183, 77, 0.2); padding: 1.1rem; border-radius: 12px;">
                    <h4 style="color: #ffb74d; margin-bottom: 0.7rem; font-size: 0.9rem;">今日任务量</h4>
                    <p style="font-size: 0.88rem; line-height: 1.6;">今天固定做 <strong>1 篇文章 + 3 题</strong>，重点先抓主线，再做细节判断。</p>
                </div>
                <div style="background: rgba(124, 77, 255, 0.08); border: 1px solid rgba(124, 77, 255, 0.22); padding: 1.1rem; border-radius: 12px;">
                    <h4 style="color: var(--accent-primary); margin-bottom: 0.7rem; font-size: 0.9rem;">阅读重点</h4>
                    <p style="font-size: 0.88rem; line-height: 1.6;">先判断每段在讲什么，再去原文定位，不要一上来逐词翻译。</p>
                </div>
                <div style="background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.2); padding: 1.1rem; border-radius: 12px;">
                    <h4 style="color: var(--accent-secondary); margin-bottom: 0.7rem; font-size: 0.9rem;">完成标准</h4>
                    <p style="font-size: 0.88rem; line-height: 1.6;">做完后你应该知道：自己是卡在主旨、细节，还是定位依据。</p>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; line-height: 1.8; color: #e0e0e0; font-size: 1.02rem; white-space: pre-wrap; max-height: 40vh; overflow-y: auto;">${content.text}</div>
            <div id="reading-questions" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem;">
                ${session.questions.map((q, i) => `
                    <div class="reading-q" style="padding: 1rem; border: 1px solid var(--glass-border); border-radius: 12px; background: rgba(255,255,255,0.03);">
                        <div style="display:flex; justify-content:space-between; gap:1rem; margin-bottom:0.7rem;">
                            <p style="font-weight: 600; margin:0;">Q${i + 1}. ${q.prompt}</p>
                            <span style="font-size:0.75rem; color:var(--text-dim);">${q.type === 'heading' ? '段落主旨' : q.type === 'tfng' ? '细节判断' : '选择题'}</span>
                        </div>
                        ${q.type === 'heading'
                            ? `<input id="reading-q-${i}" type="text" placeholder="输入你认为的答案，例如 ii / v / main idea" style="width:100%; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 8px; color: white; padding: 10px; outline: none;">`
                            : `<div style="display: flex; flex-direction: column; gap: 0.8rem;">
                                ${q.options.map((opt, oi) => `
                                    <label style="cursor:pointer; display:flex; align-items:center; gap:0.5rem;">
                                        <input type="radio" name="reading-q-${i}" value="${opt}"> ${opt}
                                    </label>
                                `).join('')}
                            </div>`
                        }
                    </div>
                `).join('')}
                <button onclick="checkReadingAnswers()" style="background: var(--accent-primary); border: none; padding: 12px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">提交并检查</button>
            </div>
            <div id="reading-feedback" style="display: none;"></div>
        </div>
    `;
}

function checkReadingAnswers() {
    const session = buildReadingSessionForCurrentDay();
    const feedback = document.getElementById('reading-feedback');
    let answered = 0;
    let correctCount = 0;

    const rows = session.questions.map((q, index) => {
        const userAnswer = q.type === 'heading'
            ? (document.getElementById(`reading-q-${index}`)?.value || '').trim()
            : (document.querySelector(`input[name="reading-q-${index}"]:checked`)?.value || '').trim();

        if (userAnswer) answered++;

        let isCorrect = false;
        if (q.type === 'heading') {
            isCorrect = userAnswer && q.answerText && normalizeReadingAnswer(userAnswer) === normalizeReadingAnswer(q.answerText);
        } else if (q.type === 'tfng') {
            isCorrect = userAnswer && normalizeReadingAnswer(userAnswer) === normalizeReadingAnswer(q.answerText || q.answerKey);
        } else if (q.answerText) {
            isCorrect = userAnswer && normalizeReadingAnswer(userAnswer) === normalizeReadingAnswer(q.answerText);
        } else {
            const optionIndex = q.options.findIndex(opt => opt === userAnswer);
            const key = ['a', 'b', 'c', 'd'][optionIndex];
            isCorrect = key && key === q.answerKey;
        }

        if (isCorrect) correctCount++;

        return `
            <div style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 4px solid ${isCorrect ? 'var(--accent-secondary)' : '#ff5252'};">
                <div style="font-weight: 600; color: ${isCorrect ? 'var(--accent-secondary)' : '#ff5252'}; margin-bottom: 0.3rem;">Q${index + 1} ${isCorrect ? '正确' : '还需回看'}</div>
                <div style="font-size: 0.92rem; line-height: 1.6;">你的答案：${userAnswer || '未作答'}</div>
                <div style="font-size: 0.92rem; line-height: 1.6; color: var(--text-dim);">参考答案：${q.answerText || q.answerKey || '请结合原文核对'}</div>
                <div style="font-size: 0.86rem; line-height: 1.6; color: var(--text-dim); margin-top: 0.45rem;">${q.explanation}</div>
            </div>
        `;
    }).join('');

    if (!answered) return alert('请先至少回答一题。');

    const weakness = correctCount === session.questions.length
        ? '这篇文章的主线和细节你都抓得比较稳。'
        : correctCount === 0
            ? '这次主要问题更像是主旨和定位都还不够稳，建议按段落回看。'
            : '你已经抓到一部分信息了，下一步重点是回到原文找依据。';

    feedback.style.display = 'block';
    feedback.innerHTML = `
        <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--glass-border); margin-top: 1rem; display:flex; flex-direction:column; gap:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="color: var(--accent-secondary); margin:0;">阅读反馈</h4>
                <span style="font-size:0.85rem; color:var(--accent-secondary);">${correctCount}/${session.questions.length} 正确</span>
            </div>
            <div style="padding: 1rem; background: rgba(0,229,255,0.05); border-radius: 10px; border: 1px solid rgba(0,229,255,0.2); font-size: 0.92rem; line-height:1.6;">${weakness}</div>
            ${rows}
        </div>
    `;

    if (correctCount >= 2) markTaskComplete('reading');
}

// --- 8. Vocabulary View ---
function sanitizeVocabularyItem(raw) {
    const fixes = {
        'carbon dioxied': 'carbon dioxide',
        'vagetation': 'vegetation',
        'pretail': 'reptile'
    };
    const meaningFixes = {
        education: '教育',
        primary: '初级的；小学教育的',
        secondary: '中等的；中学教育的',
        university: '大学',
        civilization: '文明',
        language: '语言'
    };
    const posFixes = {
        language: 'n.'
    };
    const exampleFixes = {
        'The crust on the snow was thick enough for to walk on it': 'The crust on the snow was thick enough to walk on.',
        'There is not much vagetation in deserts': 'There is not much vegetation in deserts.',
        'Parents often use mantles for their babies to keep warm': 'Parents often use blankets to keep their babies warm.'
    };

    const word = fixes[raw.word] || raw.word || '-';
    const baseMeaning = raw.meaning && raw.meaning !== '-' ? raw.meaning : (meaningFixes[word] || '-');
    const basePos = (raw.pos || raw.partOfSpeech || posFixes[word] || '-').replace(/\x08/g, '');
    const example = exampleFixes[raw.example] || raw.example || raw.ex || generateFallbackVocabExample(word, baseMeaning);

    return {
        ...raw,
        word,
        meaning: raw.definition || baseMeaning,
        pos: basePos,
        example
    };
}

function generateFallbackVocabExample(word, meaning) {
    if (!word || word === '-') return 'Example unavailable.';
    if (meaning.includes('大学') || meaning.includes('教育')) return `Education experts often mention ${word} when discussing learning and schools.`;
    if (meaning.includes('文明') || meaning.includes('文化')) return `The lecture explained how ${word} shaped the history of the region.`;
    if (meaning.includes('技术') || meaning.includes('发明')) return `Modern companies invest in ${word} to improve efficiency.`;
    if (meaning.includes('语言') || meaning.includes('语义')) return `Students need to understand ${word} when learning how language works.`;
    if (meaning.includes('动物')) return `Researchers studied the ${word} in its natural environment.`;
    if (meaning.includes('植物') || meaning.includes('生态')) return `Scientists observed how ${word} affects the local environment.`;
    return `This lesson introduces the word ${word} in an academic context.`;
}

function getVocabularySessionForCurrentDay() {
    const day = getCurrentDay();
    const content = state.curriculum[day] || state.curriculum[1];
    state.vocabSRS = state.vocabSRS || [];

    const reviewWords = state.vocabSRS
        .filter(v => v.nextReviewDay <= day && !v.mastered)
        .slice(0, 4)
        .map(sanitizeVocabularyItem);

    const newWords = (content.vocabulary || [])
        .map(sanitizeVocabularyItem)
        .slice(0, 6);

    return {
        day,
        theme: content.theme || 'Daily Vocabulary',
        reviewWords,
        newWords,
        target: {
            newCount: newWords.length,
            reviewCount: reviewWords.length
        }
    };
}

function encodeVocabPayload(item) {
    return encodeURIComponent(JSON.stringify(item));
}

function renderVocabularyView() {
    const session = getVocabularySessionForCurrentDay();

    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 0.2rem;">DAY ${session.day} 词汇单元</div>
                    <h3 style="color: var(--accent-secondary);">📚 核心词汇：${session.theme}</h3>
                </div>
                <span style="font-size: 0.8rem; color: var(--accent-primary); border: 1px solid var(--accent-primary); padding: 2px 8px; border-radius: 10px;">新词 ${session.target.newCount} + 复习 ${session.target.reviewCount}</span>
            </div>
            <div style="padding: 1rem 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 14px;">
                <div style="font-size: 0.82rem; color: var(--accent-primary); margin-bottom: 0.45rem;">今日节奏</div>
                <div style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">今天先学 <strong>${session.target.newCount}</strong> 个新词，再复习 <strong>${session.target.reviewCount}</strong> 个旧词。目标不是把词看一遍，而是至少能认出释义、听出发音，并知道它大概出现在哪个主题里。</div>
            </div>
            ${session.reviewWords.length ? `
                <div>
                    <h4 style="margin-bottom: 0.8rem; color: var(--accent-primary);">先复习旧词</h4>
                    <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 1rem;">这些是你之前标过难的词，今天先把它们过一遍。</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                        ${session.reviewWords.map(w => `
                            <div class="card" style="background: rgba(124,77,255,0.06); border: 1px solid rgba(124,77,255,0.22); position: relative;">
                                <span style="position:absolute; top:10px; right:10px; background:var(--accent-primary); font-size:0.7rem; padding:2px 5px; border-radius:5px;">SRS 复习</span>
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                    <h4 style="color: var(--accent-secondary); font-size: 1.2rem;">${w.word}</h4>
                                    <button onclick="playText('${w.word}', 'en-US')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">🔊</button>
                                </div>
                                <p style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;"><span style="color: var(--text-dim);">释义:</span> ${w.meaning}</p>
                                <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.8rem;">词性: <span style="color: var(--accent-secondary);">${w.pos}</span></p>
                                <p style="font-size: 0.9rem; font-style: italic; color: #e0e0e0; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem; margin-bottom: 1rem;">" ${w.example || '暂无例句'} "</p>
                                <button onclick="markVocabMastered('${w.word}')" class="btn-primary" style="width:100%; padding: 8px; font-size: 0.85rem; background: var(--accent-primary); border:none; border-radius:8px; color:white; cursor:pointer;">✅ 这次记住了</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            <div>
                <h4 style="margin-bottom: 0.8rem; color: var(--accent-secondary);">再学新词</h4>
                <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 1rem;">新词先控制数量，优先保证今天真的看懂、听过、标过难点。</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                    ${session.newWords.map(w => `
                        <div class="card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); position: relative;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                <h4 style="color: var(--accent-secondary); font-size: 1.2rem;">${w.word}</h4>
                                <button onclick="playText('${w.word}', 'en-US')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">🔊</button>
                            </div>
                            <p style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;"><span style="color: var(--text-dim);">释义:</span> ${w.meaning}</p>
                            <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.8rem;">词性: <span style="color: var(--accent-secondary);">${w.pos}</span></p>
                            <p style="font-size: 0.9rem; font-style: italic; color: #e0e0e0; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem; margin-bottom: 1rem;">" ${w.example || '暂无例句'} "</p>
                            <button onclick="markVocabHard('${w.word.replace(/'/g, "\\'")}', decodeURIComponent('${encodeVocabPayload(w)}'))" class="btn-secondary" style="width:100%; padding: 8px; font-size: 0.85rem; border: 1px solid var(--accent-primary); color: var(--accent-primary); background:transparent; border-radius:8px; cursor:pointer;">🧠 标记为今天难词</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <button onclick="markTaskComplete('vocabulary'); switchView('daily-plan');" style="background: var(--accent-primary); border: none; padding: 14px; border-radius: 12px; color: white; cursor: pointer; font-weight: 700; margin-top: 20px;">今日词汇已掌握</button>
        </div>
    `;
}

window.markVocabHard = (word, vocabData) => {
    state.vocabSRS = state.vocabSRS || [];
    if (!state.vocabSRS.find(v => v.word === word)) {
        const parsed = typeof vocabData === 'string' ? JSON.parse(vocabData) : vocabData;
        state.vocabSRS.push({ ...sanitizeVocabularyItem(parsed || { word }), nextReviewDay: getCurrentDay() + 2, mastered: false });
        saveState();
        alert(`已将 "${word}" 加入复习序列！它将在 2 天后再次出现。`);
        renderVocabularyView();
    }
};

window.markVocabMastered = (word) => {
    state.vocabSRS = state.vocabSRS || [];
    const item = state.vocabSRS.find(v => v.word === word);
    if (item) {
        item.mastered = true;
        saveState();
        renderVocabularyView();
    }
};

function addError(type, content, correction) {
    state.errorBank.push({
        id: Date.now(),
        type: type,
        content: content,
        correction: correction,
        date: new Date().toLocaleDateString()
    });
    saveState();
}

// --- 9. Error Re-Quiz System ---
function renderErrorQuiz() {
    if (state.errorBank.length === 0) return switchView('error-bank');
    
    // Pick 5 random errors
    const pool = [...state.errorBank].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; animation: slideUp 0.4s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--accent-secondary);">🎯 错题清零重测 (5题)</h3>
                <button onclick="switchView('error-bank')" style="background:none; border:none; color:var(--text-dim); cursor:pointer;">取消</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${pool.map((e, i) => `
                    <div class="card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border);">
                        <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem;">Q${i+1} | 类别: ${e.type}</div>
                        <div style="font-size: 1.1rem; margin-bottom: 1rem;">${e.content}</div>
                        <input type="text" id="quiz-input-${e.id}" placeholder="输入正确形式..." style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); padding: 12px; border-radius: 8px; color: white;">
                    </div>
                `).join('')}
            </div>
            <button onclick='checkErrorQuiz(${JSON.stringify(pool.map(p => p.id))})' style="background: var(--accent-primary); border: none; padding: 14px; border-radius: 12px; color: white; cursor: pointer; font-weight: 700;">提交重测结果</button>
        </div>
    `;
}

window.checkErrorQuiz = (ids) => {
    let correctedCount = 0;
    ids.forEach(id => {
        const input = document.getElementById(`quiz-input-${id}`);
        const errorItem = state.errorBank.find(e => e.id === id);
        if (input && errorItem && input.value.trim().toLowerCase() === errorItem.correction.toLowerCase()) {
            // Remove from error bank
            state.errorBank = state.errorBank.filter(e => e.id !== id);
            correctedCount++;
        }
    });
    
    saveState();
    alert(`重测结束！您成功纠正了 ${correctedCount} 个错误。这些错误已从错题库中移除。`);
    switchView('error-bank');
};

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ielts_coach_backup_${new Date().toLocaleDateString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function renderSettingsView() {
    const savedToken = safeGetItem('ghToken', '') || '';
    const savedRepo = safeGetItem('ghRepo', 'jojo19841023/ielts-coach') || 'jojo19841023/ielts-coach';
    const storageHint = persistentStorageAvailable
        ? '当前浏览器支持本地保存，同步配置会保留在这台设备上。'
        : '当前浏览器不允许本地保存。你这次填写的同步信息只在本次打开期间有效。';
    appView.innerHTML = `
        <div class="card" style="display:flex; flex-direction:column; gap:1rem;">
            <h3 style="margin:0;">☁️ 电脑 / 手机同步</h3>
            <p style="font-size:0.9rem; color:var(--text-dim); line-height:1.6;">把学习状态同步到 GitHub 后，你就可以在电脑端和手机端之间继续同一份进度。</p>
            <div style="font-size:0.82rem; color:${persistentStorageAvailable ? 'var(--text-dim)' : '#ffb74d'}; line-height:1.6;">${storageHint}</div>
            <div id="sync-current-status" style="font-size:0.85rem; color:var(--text-dim);"></div>
            <label style="font-size:0.8rem; color:var(--text-dim);">GitHub Token</label>
            <input type="password" id="gh-token" style="width:100%; padding:12px; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:8px; color:white;">
            <label style="font-size:0.8rem; color:var(--text-dim);">仓库路径</label>
            <input type="text" id="gh-repo" style="width:100%; padding:12px; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); border-radius:8px; color:white;">
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:0.5rem;">
                <button onclick="saveSettings()" style="flex:1; min-width:160px; background:var(--accent-primary); border:none; padding:14px; border-radius:10px; color:white; font-weight:600; cursor:pointer;">保存配置</button>
                <button onclick="syncToCloud()" style="flex:1; min-width:160px; background:var(--accent-secondary); border:none; padding:14px; border-radius:10px; color:#000; font-weight:700; cursor:pointer;">上传到云端</button>
                <button onclick="syncFromCloud()" style="flex:1; min-width:160px; background:#fff; border:none; padding:14px; border-radius:10px; color:#000; font-weight:700; cursor:pointer;">从云端下载</button>
            </div>
            <div id="sync-status" style="text-align:center; font-size:0.82rem; color:var(--text-dim); margin-top:0.5rem;"></div>
        </div>
    `;

    const tokenInput = document.getElementById('gh-token');
    const repoInput = document.getElementById('gh-repo');
    const currentStatus = document.getElementById('sync-current-status');
    if (tokenInput) tokenInput.value = savedToken;
    if (repoInput) repoInput.value = savedRepo;
    if (currentStatus) {
        currentStatus.textContent = savedToken ? '当前状态：已保存同步凭证，可直接同步。' : '当前状态：还没有保存同步凭证。';
    }
}

function saveSettings() {
    safeSetItem('ghToken', document.getElementById('gh-token').value);
    safeSetItem('ghRepo', document.getElementById('gh-repo').value);
    alert(persistentStorageAvailable ? "✅ 配置已保存！" : "✅ 配置已暂存到当前会话！");
}

async function syncToCloud() {
    const token = safeGetItem('ghToken', '');
    const repo = safeGetItem('ghRepo', '');
    const status = document.getElementById('sync-status');
    if (!token || !repo) return alert("请先配置 Token 和仓库路径！");

    status.textContent = "正在上传...";
    try {
        const path = "db.json";
        const url = `https://api.github.com/repos/${repo}/contents/${path}`;
        
        // Get existing file sha if it exists
        let sha = null;
        const getRes = await fetch(url, { headers: { "Authorization": `token ${token}` } });
        if (getRes.ok) {
            const getData = await getRes.json();
            sha = getData.sha;
        }

        const leanState = createLeanState();
        const payload = {
            message: "sync: update study progress",
            content: btoa(unescape(encodeURIComponent(JSON.stringify(leanState))))
        };
        if (sha) payload.sha = sha;

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            status.innerHTML = `<span style="color: #4caf50;">✅ 上传成功！已保存 ${formatChineseDate()} 的学习状态。</span>`;
        } else {
            status.innerHTML = `<span style="color: #ff5252;">❌ 上传失败: ${res.statusText}</span>`;
        }
    } catch (err) {
        status.innerHTML = `<span style="color: #ff5252;">❌ 网络错误</span>`;
    }
}

async function syncFromCloud() {
    const token = safeGetItem('ghToken', '');
    const repo = safeGetItem('ghRepo', '');
    const status = document.getElementById('sync-status');
    if (!token || !repo) return alert("请先配置 Token 和仓库路径！");

    status.textContent = "正在从云端拉取...";
    try {
        const url = `https://api.github.com/repos/${repo}/contents/db.json`;
        const res = await fetch(url, { headers: { "Authorization": `token ${token}` } });
        
        if (res.ok) {
            const data = await res.json();
            const decoded = decodeURIComponent(escape(atob(data.content)));
            const newState = JSON.parse(decoded);
            state = hydrateState(newState);
            resetDailyTaskStateIfNeeded();
            saveState();
            status.innerHTML = `<span style="color: #4caf50;">✅ 下载并同步成功！当前页面将按本地日期刷新状态。</span>`;
            setTimeout(() => location.reload(), 1000);
        } else {
            status.innerHTML = `<span style="color: #ff5252;">❌ 未在云端找到记录</span>`;
        }
    } catch (err) {
        status.innerHTML = `<span style="color: #ff5252;">❌ 同步出错，请检查 Token、仓库权限或云端数据格式</span>`;
    }
}

init();
