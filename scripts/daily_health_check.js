const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILES = [
    'data/data.js',
    'data/grammar_questions_v2.js',
    'data/vocabulary_overrides.js',
    'data/reading_overrides.js',
    'data/writing_overrides.js',
    'data/speaking_overrides.js'
];
const APP_FILES = [...DATA_FILES, 'app.js'];
const REPORT_DIR = path.join(ROOT, '.automation-reports', 'ielts-coach-daily-check');
const REPORT_MD = path.join(REPORT_DIR, 'memory.md');
const REPORT_JSON = path.join(REPORT_DIR, 'last-report.json');

class Element {
    constructor(id = '') {
        this.id = id;
        this.style = {};
        this.children = [];
        this.value = '';
        this.textContent = '';
        this.innerHTML = '';
        this.attributes = {};
        this.classList = {
            toggle() {},
            add() {},
            remove() {}
        };
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    addEventListener() {}
    click() {}
    remove() {}

    getAttribute(name) {
        return this.attributes[name] || this[name] || '';
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
        this[name] = value;
    }
}

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function assert(condition, message, details = undefined) {
    if (!condition) {
        const error = new Error(message);
        error.details = details;
        throw error;
    }
}

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatChineseDate(date = new Date()) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function createContext(seedState = null) {
    const elements = new Map();
    const element = (id) => {
        if (!elements.has(id)) elements.set(id, new Element(id));
        return elements.get(id);
    };

    [
        'view-title',
        'app-view',
        'progress-percent',
        'progress-fill',
        'dynamic-feedback',
        'current-date',
        'exam-container',
        'sync-current-status',
        'sync-status',
        'gh-token',
        'gh-repo'
    ].forEach(element);

    const navViews = [
        'daily-plan',
        'dashboard',
        'reading',
        'vocabulary',
        'grammar',
        'phonetics',
        'listening',
        'writing',
        'speaking',
        'error-bank',
        'weekly-review',
        'settings'
    ];
    const navItems = navViews.map((view) => {
        const item = new Element();
        item.getAttribute = (name) => (name === 'data-view' ? view : '');
        return item;
    });

    const alerts = [];
    const context = {
        console,
        window: null,
        document: {
            getElementById: element,
            querySelectorAll: (selector) => (selector === '.nav-item' ? navItems : []),
            querySelector: () => null,
            createElement: () => new Element(),
            body: new Element('body')
        },
        alert: (message) => alerts.push(String(message)),
        location: {
            reloaded: false,
            reload() {
                this.reloaded = true;
            }
        },
        setTimeout: (fn) => {
            if (typeof fn === 'function') fn();
            return 1;
        },
        clearTimeout: () => {},
        fetch: async () => ({ ok: false, statusText: 'Unavailable in health check', json: async () => ({}) }),
        SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {},
        speechSynthesis: { speaking: false, cancel() {}, speak() {} },
        navigator: { mediaDevices: null },
        btoa: (value) => Buffer.from(value, 'binary').toString('base64'),
        atob: (value) => Buffer.from(value, 'base64').toString('binary'),
        unescape,
        escape,
        encodeURIComponent,
        decodeURIComponent,
        module: undefined
    };

    context.window = context;
    context.localStorage = {
        store: seedState ? { ieltsState: JSON.stringify(seedState) } : {},
        getItem(key) {
            return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
        },
        setItem(key, value) {
            this.store[key] = String(value);
        },
        removeItem(key) {
            delete this.store[key];
        },
        clear() {
            this.store = {};
        }
    };

    vm.createContext(context);
    APP_FILES.forEach((file) => {
        vm.runInContext(read(file), context, { filename: file });
    });

    return { context, element, alerts };
}

function runSyntaxChecks(report) {
    APP_FILES.forEach((file) => {
        new vm.Script(read(file), { filename: file });
        report.syntax[file] = 'ok';
    });
}

function runDataChecks(report) {
    const { context } = createContext();
    const data = context.window.IELTS_DATA;
    const curriculum = data.curriculum || {};
    const missing = [];

    for (let day = 1; day <= 30; day += 1) {
        const entry = curriculum[String(day)] || curriculum[day];
        ['vocabulary', 'reading', 'writing', 'speaking'].forEach((key) => {
            if (!entry || !entry[key]) missing.push(`day ${day} ${key}`);
        });
        if (!entry?.reading?.questions || entry.reading.questions.length !== 3) {
            missing.push(`day ${day} reading question count`);
        }
    }

    assert(Object.keys(curriculum).length >= 30, 'Curriculum has fewer than 30 days');
    assert(Array.isArray(data.grammarQuestions) && data.grammarQuestions.length === 300, 'Grammar question v2 count is not 300');
    assert(Array.isArray(data.phoneticExercises) && data.phoneticExercises.length === 30, 'Phonetic exercise count is not 30');
    assert(missing.length === 0, 'Missing or malformed day content', missing);

    const currentDay = vm.runInContext('getCurrentDay()', context);
    report.data = {
        curriculumDays: Object.keys(curriculum).length,
        grammarQuestions: data.grammarQuestions.length,
        phoneticExercises: data.phoneticExercises.length,
        currentDay,
        currentTheme: curriculum[currentDay]?.theme,
        currentReadingTitle: curriculum[currentDay]?.reading?.title,
        currentWritingWordCount: curriculum[currentDay]?.writing?.wordCount,
        currentSpeakingTopic: curriculum[currentDay]?.speaking?.topic,
        missing
    };
}

function runRenderChecks(report) {
    const { context, element } = createContext();
    const expectedDate = formatChineseDate();
    const actualDate = element('current-date').textContent;
    assert(actualDate === expectedDate, `Top-right date mismatch: expected ${expectedDate}, got ${actualDate}`);

    const views = [
        'daily-plan',
        'grammar',
        'phonetics',
        'listening',
        'vocabulary',
        'reading',
        'writing',
        'speaking',
        'weekly-review',
        'dashboard',
        'settings'
    ];

    report.views = {};
    views.forEach((view) => {
        vm.runInContext(`switchView(${JSON.stringify(view)})`, context);
        report.views[view] = {
            title: element('view-title').textContent,
            rendered: Boolean(element('app-view').innerHTML || element('app-view').children.length)
        };
    });

    report.date = {
        expected: expectedDate,
        actual: actualDate,
        dateKey: vm.runInContext('getTodayDateString()', context),
        currentDay: vm.runInContext('getCurrentDay()', context)
    };
}

async function runInteractionChecks(report) {
    const oldState = {
        startDate: '2026-05-05',
        lastTaskResetDate: '2026-05-11',
        dailyTasks: [1, 2, 3, 4, 5, 6, 7].map((id) => ({ id, completed: true })),
        currentGrammarIndex: 5,
        currentPhoneticIndex: 3,
        adaptiveCompleted: [99],
        activityLog: { '2026-05-11': 7 },
        errorBank: [],
        vocabSRS: [],
        essays: { current: '' }
    };
    const { context, element, alerts } = createContext(oldState);
    const state = vm.runInContext('state', context);
    const today = getLocalDateKey();

    assert(state.lastTaskResetDate === today, 'Old saved state did not reset to today');
    assert(state.dailyTasks.filter((task) => task.completed).length === 0, 'Daily tasks were not cleared on date rollover');
    assert(state.currentGrammarIndex === 0, 'Grammar index was not reset');
    assert(state.currentPhoneticIndex === 0, 'Phonetic index was not reset');
    assert(state.adaptiveCompleted.length === 0, 'Adaptive completion state was not reset');

    vm.runInContext('toggleTask(1)', context);
    assert(vm.runInContext('state.dailyTasks.find(t => t.id === 1).completed', context), 'Task toggle did not mark task complete');
    assert(vm.runInContext('state.activityLog[getTodayDateString()]', context) === 1, 'Task toggle did not log today activity');
    assert(vm.runInContext('state.moduleActivityLog[getTodayDateString()].grammar', context) === 1, 'Task toggle did not log module activity');

    vm.runInContext('switchView("weekly-review")', context);
    vm.runInContext('startExam("weekly")', context);
    assert(/周度复盘任务单/.test(element('exam-container').innerHTML), 'Weekly review did not render task sheet');

    vm.runInContext('switchView("weekly-review")', context);
    vm.runInContext('startExam("monthly")', context);
    assert(/30 天训练诊断单/.test(element('exam-container').innerHTML), 'Monthly assessment did not render report');

    vm.runInContext('switchView("settings")', context);
    await vm.runInContext('syncToCloud()', context);
    assert(/上传到云端/.test(element('app-view').innerHTML), 'Sync upload button missing');
    assert(/从云端下载/.test(element('app-view').innerHTML), 'Sync download button missing');
    assert(alerts.includes('请先配置 Token 和仓库路径！'), 'Missing-credentials sync alert did not appear');

    const saved = JSON.parse(context.localStorage.store.ieltsState || '{}');
    assert(!Object.prototype.hasOwnProperty.call(saved, 'curriculum'), 'Lean saved state unexpectedly contains curriculum');
    assert(!Object.prototype.hasOwnProperty.call(saved, 'grammarQuestions'), 'Lean saved state unexpectedly contains grammarQuestions');

    report.interactions = {
        resetFromOldDate: 'ok',
        taskToggleAndActivityLog: 'ok',
        moduleActivityLog: 'ok',
        weeklyReview: 'ok',
        monthlyAssessment: 'ok',
        syncMissingCredentials: 'ok',
        leanStateSave: 'ok'
    };
}

function writeReport(report) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`);

    const lines = [
        '',
        `## ${report.runAt}`,
        `- Result: ${report.ok ? 'PASS' : 'FAIL'}`,
        `- Date: ${report.date?.actual || 'not reached'} (${report.date?.dateKey || 'not reached'})`,
        `- Day: ${report.date?.currentDay || report.data?.currentDay || 'not reached'}`,
        `- Current content: ${report.data?.currentTheme || 'n/a'} / ${report.data?.currentReadingTitle || 'n/a'} / speaking ${report.data?.currentSpeakingTopic || 'n/a'}`,
        `- Syntax files checked: ${Object.keys(report.syntax || {}).length}`,
        `- Rendered views: ${Object.keys(report.views || {}).join(', ') || 'not reached'}`,
        `- Interactions: ${Object.keys(report.interactions || {}).join(', ') || 'not reached'}`,
        report.error ? `- Error: ${report.error}` : ''
    ].filter(Boolean);

    const header = fs.existsSync(REPORT_MD) ? '' : '# IELTS Coach Local Automation Memory\n';
    fs.appendFileSync(REPORT_MD, `${header}${lines.join('\n')}\n`);
}

async function main() {
    const report = {
        ok: false,
        runAt: new Date().toISOString(),
        syntax: {},
        data: {},
        views: {},
        interactions: {}
    };

    try {
        runSyntaxChecks(report);
        runDataChecks(report);
        runRenderChecks(report);
        await runInteractionChecks(report);
        report.ok = true;
    } catch (error) {
        report.error = error.details ? `${error.message}: ${JSON.stringify(error.details)}` : error.message;
    }

    writeReport(report);
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.ok ? 0 : 1);
}

main();
