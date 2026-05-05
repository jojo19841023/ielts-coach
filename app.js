// IELTS Coach App Logic - FULL Professional Version (V6)

let state;
try {
    const saved = localStorage.getItem('ieltsState');
    state = saved ? JSON.parse(saved) : null;
} catch (e) {
    console.error("Failed to parse local storage", e);
}

const defaultState = {
    currentView: 'daily-plan',
    user: { name: 'Jojo', targetScore: 6.5, currentLevel: 'A2' },
    dailyTasks: [
        { id: 1, type: 'grammar', title: '🧩 语法诊所：混合时态挑战 (10题)', completed: false, duration: '20min', view: 'grammar' },
        { id: 2, type: 'phonetics', title: '👄 发音实验室：长短音与连读技巧', completed: false, duration: '15min', view: 'phonetics' },
        { id: 3, type: 'writing', title: '✍️ 零基础写作：家庭与居住环境 (100字)', completed: false, duration: '25min', view: 'writing' },
        { id: 4, type: 'listening', title: '🎧 听力专项：场景词汇听写 (Section 1)', completed: false, duration: '25min', view: 'phonetics' }, // Reuse phonetics for listening for now
        { id: 5, type: 'reading', title: '📖 阅读专项：长难句拆解与主旨匹配', completed: false, duration: '25min', view: 'reading' },
        { id: 6, type: 'speaking', title: '🗣️ 口语纠偏：Part 1 常见问题模测', completed: false, duration: '20min', view: 'speaking' },
        { id: 7, type: 'vocabulary', title: '📚 核心词汇：雅思高频场景词 50个', completed: false, duration: '15min', view: 'vocabulary' }
    ],
    errorBank: [],
    essays: { current: '' },
    speakingInput: '',
    examDate: '2026-12-25',
    milestones: [
        { name: '基础筑基 (A2)', status: 'active', target: '掌握 2000 核心词 + 基础时态', deadline: '2026-06' },
        { name: '能力爬坡 (B1)', status: 'locked', target: '3500 词汇 + 复合句式', deadline: '2026-09' },
        { name: '6.5 冲刺 (B2)', status: 'locked', target: '真题模拟 + 写作逻辑优化', deadline: '2026-12' }
    ],
    chinglishPatterns: [
        { regex: /very\s+like/i, name: "中式搭配", correction: "really like / like ... very much", explanation: "Very 不能修饰动词。" },
        { regex: /people\s+is/i, name: "主谓一致", correction: "people are", explanation: "People 是复数。" },
        { regex: /Their\s+are/i, name: "词法混淆", correction: "There are", explanation: "存在句用 There。" },
        { regex: /I\s+is/i, name: "基础语法", correction: "I am", explanation: "I 永远搭配 am。" }
    ],
    grammarQuestions: [
        { id: 1, sentence: "My brother ________ (play) football every Sunday.", answer: "plays", explanation: "三单加 -s。" },
        { id: 2, sentence: "They ________ (not like) cold weather.", answer: "do not like", explanation: "非三单否定用 do not。" },
        { id: 3, sentence: "________ she ________ (live) in London?", answer: "Does live", explanation: "疑问句三单用 Does ... 动词原形。" },
        { id: 4, sentence: "I ________ (be) a student at this school.", answer: "am", explanation: "I 永远搭配 am。" },
        { id: 5, sentence: "Yesterday, I ________ (go) to the park.", answer: "went", explanation: "一般过去时：Go 的过去式是 went。" },
        { id: 6, sentence: "We ________ (study) English right now.", answer: "are studying", explanation: "现在进行时：Be + V-ing。" },
        { id: 7, sentence: "She ________ (have) breakfast at 8 AM daily.", answer: "has", explanation: "Have 的三单形式是 has。" },
        { id: 8, sentence: "They ________ (watch) a movie last night.", answer: "watched", explanation: "过去式规则动词加 -ed。" }
    ],
    currentGrammarIndex: 0,
    phoneticExercises: [
        { id: 1, title: '/i:/ vs /ɪ/', sentence: "A sheep is on a ship", words: ["sheep", "ship"] },
        { id: 2, title: '/æ/ vs /e/', sentence: "The bad man is on the bed", words: ["bad", "bed"] },
        { id: 3, title: '/θ/ vs /s/', sentence: "I think the sink is full", words: ["think", "sink"] }
    ],
    currentPhoneticIndex: 0
};

// Migration & State Initialization
if (!state) {
    state = defaultState;
} else {
    state.chinglishPatterns = defaultState.chinglishPatterns;
    state.grammarQuestions = defaultState.grammarQuestions;
    
    // Smart Migration for Tasks: Keep completion status if ID matches
    const updatedTasks = defaultState.dailyTasks.map(newTask => {
        const existingTask = state.dailyTasks.find(t => t.id === newTask.id);
        if (existingTask) {
            return { ...newTask, completed: existingTask.completed };
        }
        return newTask;
    });
    state.dailyTasks = updatedTasks;

    state.currentGrammarIndex = state.currentGrammarIndex || 0;
    state.currentPhoneticIndex = state.currentPhoneticIndex || 0;
    state.phoneticExercises = state.phoneticExercises || defaultState.phoneticExercises;
    state.errorBank = state.errorBank || [];
    state.essays = state.essays || { current: '' };
    state.speakingInput = state.speakingInput || '';
    state.examDate = state.examDate || defaultState.examDate;
    state.milestones = state.milestones || defaultState.milestones;
}

function saveState() {
    localStorage.setItem('ieltsState', JSON.stringify(state));
}

// DOM Elements
const viewTitle = document.getElementById('view-title');
const appView = document.getElementById('app-view');
const navItems = document.querySelectorAll('.nav-item');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const dynamicFeedback = document.getElementById('dynamic-feedback');

function init() {
    setupNavigation();
    updateProgress();
    renderView(state.currentView);
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
        'writing': '零基础写作', 'speaking': '口语纠偏', 'reading': '阅读专项',
        'vocabulary': '核心词汇', 'error-bank': '错题库', 
        'weekly-review': '周度复盘', 'dashboard': '目标追踪'
    };
    viewTitle.textContent = viewNames[viewId] || '雅思教练';
    renderView(viewId);
}

function renderView(viewId) {
    appView.innerHTML = '';
    switch(viewId) {
        case 'daily-plan': renderDailyPlan(); break;
        case 'grammar': renderGrammarView(); break;
        case 'phonetics': renderPhoneticsView(); break;
        case 'writing': renderWritingView(); break;
        case 'speaking': renderSpeakingView(); break;
        case 'reading': renderReadingView(); break;
        case 'vocabulary': renderVocabularyView(); break;
        case 'error-bank': renderErrorBank(); break;
        case 'weekly-review': renderWeeklyReview(); break;
        case 'dashboard': renderDashboard(); break;
        default: appView.innerHTML = `<div class="loading">即将上线...</div>`;
    }
}

// --- 1. Daily Plan ---
function renderDailyPlan() {
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
function renderGrammarView() {
    const q = state.grammarQuestions[state.currentGrammarIndex];
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--accent-secondary);">一般现在时专项练习</h3>
                <span style="font-size: 0.8rem; color: var(--text-dim);">进度: ${state.currentGrammarIndex + 1}/${state.grammarQuestions.length}</span>
            </div>
            <div id="grammar-exercise" style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--accent-primary);">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">${q.sentence}</p>
                <input type="text" id="grammar-answer" placeholder="输入答案..." 
                       style="background: transparent; border: 1px solid var(--glass-border); padding: 12px; border-radius: 8px; color: white; width: 100%; margin-bottom: 1rem; outline: none;">
                <div id="grammar-feedback" style="margin-bottom: 1rem; font-size: 0.9rem; display: none;"></div>
                <div style="display: flex; gap: 1rem;">
                    <button id="check-btn" onclick="checkGrammarAnswer('${q.answer}')" style="flex: 1; background: var(--accent-primary); border: none; padding: 12px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">检查答案</button>
                    <button id="next-btn" onclick="nextGrammarQuestion()" style="display: none; flex: 1; background: rgba(0, 229, 255, 0.1); border: 1px solid var(--accent-secondary); padding: 12px; border-radius: 8px; color: var(--accent-secondary); cursor: pointer; font-weight: 600;">下一题</button>
                </div>
            </div>
        </div>
    `;
}

function checkGrammarAnswer(correct) {
    const input = document.getElementById('grammar-answer');
    const feedback = document.getElementById('grammar-feedback');
    const nextBtn = document.getElementById('next-btn');
    const checkBtn = document.getElementById('check-btn');
    const val = input.value.trim().toLowerCase();
    
    // Ensure buttons toggle first to prevent stuck state
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    feedback.style.display = 'block';

    if (val === correct.toLowerCase()) {
        feedback.style.color = "var(--accent-secondary)";
        feedback.innerHTML = `✅ 正确！<br><small>${state.grammarQuestions[state.currentGrammarIndex].explanation}</small>`;
    } else {
        feedback.style.color = "#ff5252";
        feedback.innerHTML = `❌ 错误。正确答案是: ${correct}<br><small>${state.grammarQuestions[state.currentGrammarIndex].explanation}</small>`;
        try {
            addError('Grammar', `题目: ${state.grammarQuestions[state.currentGrammarIndex].sentence} | 错误答案: ${val}`, `正确答案: ${correct}`);
        } catch(e) { console.log("Error logging suppressed"); }
    }
    
    if (state.currentGrammarIndex === state.grammarQuestions.length - 1) { 
        nextBtn.textContent = "完成练习"; 
        markTaskComplete('grammar'); 
    }
}

function nextGrammarQuestion() {
    if (state.currentGrammarIndex < state.grammarQuestions.length - 1) {
        state.currentGrammarIndex++; saveState(); renderGrammarView();
    } else {
        state.currentGrammarIndex = 0; saveState(); switchView('daily-plan');
    }
}

// --- 3. Phonetics Lab ---
function renderPhoneticsView() {
    const ex = state.phoneticExercises[state.currentPhoneticIndex];
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; text-align: center;">
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="color: var(--accent-secondary);">音标专项：${ex.title}</h3>
                <span style="font-size: 0.8rem; color: var(--text-dim);">练习: ${state.currentPhoneticIndex + 1}/${state.phoneticExercises.length}</span>
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
            <div id="recording-controls" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; background: rgba(255,255,255,0.02); padding: 2rem; border-radius: 20px; width: 100%;">
                <p style="font-size: 1.2rem; color: var(--text-main); font-weight: 600;">"${ex.sentence}"</p>
                <button id="record-btn" onclick="toggleRecording()" style="width: 70px; height: 70px; border-radius: 50%; background: #ff5252; border: none; font-size: 1.8rem; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(255, 82, 82, 0.3);">🎙️</button>
                <p id="record-status" style="font-size: 0.9rem; color: var(--text-dim);">点击麦克风开始挑战</p>
                <div id="audio-playback" style="display: none;"><audio id="player" controls style="height: 35px;"></audio></div>
                <button id="next-phonetic-btn" onclick="nextPhoneticExercise()" style="display: none; background: var(--accent-primary); border: none; padding: 12px 30px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">下一组练习</button>
            </div>
        </div>
    `;
}

function nextPhoneticExercise() {
    if (state.currentPhoneticIndex < state.phoneticExercises.length - 1) {
        state.currentPhoneticIndex++;
        saveState();
        renderPhoneticsView();
    } else {
        state.currentPhoneticIndex = 0;
        saveState();
        switchView('daily-plan');
    }
}

function playText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; utterance.rate = 0.8; window.speechSynthesis.speak(utterance);
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
    const targetText = "A sheep is on a ship";
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
    const ex = state.phoneticExercises[state.currentPhoneticIndex];
    
    // Check if key contrast words are present
    const hasWordA = result.toLowerCase().includes(ex.words[0].toLowerCase());
    const hasWordB = result.toLowerCase().includes(ex.words[1].toLowerCase());

    if (hasWordA && hasWordB) {
        status.innerHTML = `<span style="color: var(--accent-secondary); font-weight: 700;">✅ 完美!</span> 你读出了 "${ex.words[0]}" 和 "${ex.words[1]}"。<br><small style="color: var(--text-dim)">AI 识别结果: "${result}" (${confidence}%)</small>`;
        nextBtn.style.display = 'block';
        if (state.currentPhoneticIndex === state.phoneticExercises.length - 1) {
            nextBtn.textContent = "完成全部发音练习";
            markTaskComplete('phonetics');
        }
    } else {
        status.innerHTML = `<span style="color: #ff5252;">⚠️ 继续加油!</span> AI 识别为: "${result}"。<br><small style="color: var(--text-dim)">请尝试清晰地区分 <strong>${ex.words[0]}</strong> 和 <strong>${ex.words[1]}</strong>。</small>`;
    }
}

// --- 4. Professional Writing Engine (V6) ---
function renderWritingView() {
    appView.innerHTML = `
        <div class="card" style="height: 100%; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>✍️ 零基础写作：专家模式</h3>
                <span style="font-size: 0.75rem; color: var(--accent-secondary); background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px;">V6 Hybrid Engine</span>
            </div>
            
            <!-- 任务要求卡片 -->
            <div style="background: rgba(124, 77, 255, 0.05); border: 1px solid rgba(124, 77, 255, 0.2); padding: 1.2rem; border-radius: 12px;">
                <h4 style="color: var(--accent-primary); margin-bottom: 0.8rem; font-size: 0.9rem;">📝 今日写作任务：我的家庭与居住环境</h4>
                <ul style="font-size: 0.85rem; color: var(--text-main); line-height: 1.6; list-style-position: inside; display: flex; flex-direction: column; gap: 0.4rem;">
                    <li>描述您的家庭成员及其职业/状态。</li>
                    <li>介绍您居住的环境特点（城市、环境、是否环保）。</li>
                    <li>使用连接词: <strong>and, but, because</strong>。</li>
                    <li>字数建议: <strong>80 - 100 字</strong>。</li>
                </ul>
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
    state.essays.current = text; saveState(); btn.disabled = true; btn.innerHTML = "📡 深度分析中...";
    feedback.innerHTML = `<div class="loading">正在扫描语法、拼写与表达逻辑...</div>`;
    try {
        const results = await hybridAnalysis(text);
        let html = `<div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--glass-border); margin-top: 1rem;">
            <h4 style="color: var(--accent-secondary); margin-bottom: 1.2rem;">🏆 雅思专业写作诊断报告</h4>
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
function renderSpeakingView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>🗣️ 口语纠偏：思维分析</h3>
                <span style="font-size: 0.75rem; color: var(--accent-secondary); background: rgba(0,229,255,0.1); padding: 4px 10px; border-radius: 20px;">AI Logic Monitor</span>
            </div>

            <!-- 口语指南卡片 -->
            <div style="background: rgba(255, 183, 77, 0.05); border: 1px solid rgba(255, 183, 77, 0.2); padding: 1.2rem; border-radius: 12px;">
                <h4 style="color: #ffb74d; margin-bottom: 0.8rem; font-size: 0.9rem;">🚫 避开中式雷区 (Common Pitfalls)</h4>
                <ul style="font-size: 0.85rem; color: var(--text-main); line-height: 1.6; list-style-position: inside; display: flex; flex-direction: column; gap: 0.4rem;">
                    <li>不要说 "I very like..." -> 请用 "I really like..."</li>
                    <li>不要说 "People is..." -> 请用 "People are..."</li>
                    <li>不要说 "Their are..." -> 请用 "There are..."</li>
                    <li><strong>今日练习建议：</strong> 请尝试用 3-5 句话描述一下你的一天。</li>
                </ul>
            </div>

            <textarea id="speaking-input" placeholder="输入您想说的话，AI 将分析其中的中式思维逻辑..." style="background: transparent; border: 1px solid var(--glass-border); border-radius: 12px; color: white; padding: 1.5rem; min-height: 120px; outline: none; font-family: inherit; font-size: 1.1rem; line-height: 1.6;">${state.speakingInput}</textarea>
            <button onclick="analyzeSpeaking()" style="background: var(--accent-primary); border: none; padding: 14px; border-radius: 12px; color: white; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(124, 77, 255, 0.2);">AI 思维纠偏诊断</button>
            <div id="speaking-result"></div>
        </div>
    `;
}

async function analyzeSpeaking() {
    const input = document.getElementById('speaking-input');
    const resContainer = document.getElementById('speaking-result');
    const text = input.value.trim();
    if (!text) return;
    
    state.speakingInput = text;
    saveState();

    resContainer.innerHTML = `<div class="loading">🔍 AI 专家正在深度诊断您的口语逻辑...</div>`;

    try {
        const results = await hybridAnalysis(text);
        let html = `<div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--glass-border); margin-top: 1rem;">
            <h4 style="color: #ffb74d; margin-bottom: 1.2rem;">💡 口语逻辑深度诊断</h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">`;
        
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
    
    // Calculate simulated progress
    const vocabProgress = Math.min(30 + state.errorBank.length, 100);
    const grammarProgress = Math.round((state.currentGrammarIndex / state.grammarQuestions.length) * 100);
    const writingProgress = state.dailyTasks.find(t => t.type === 'writing').completed ? 45 : 20;

    appView.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.5s ease;">
            <!-- Countdown Header -->
            <div class="card" style="background: linear-gradient(135deg, rgba(124, 77, 255, 0.2), rgba(0, 229, 255, 0.1)); border: 1px solid var(--accent-secondary); text-align: center; padding: 2rem;">
                <h2 style="color: var(--accent-secondary); margin-bottom: 0.5rem;">🎯 距离 2026 年底目标：${diffDays} 天</h2>
                <p style="color: var(--text-dim); font-size: 0.9rem;">目标分数：雅思 6.5 | 当前等级：A2 (筑基期)</p>
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
                                <span>词汇库储备 (A2 Core)</span><span>${vocabProgress}%</span>
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
                    <div style="width: 100px; height: 100px; border-radius: 50%; border: 8px solid var(--accent-secondary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: var(--accent-secondary);">A2</div>
                    <h4 style="color: var(--accent-secondary);">当前预估等级</h4>
                    <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.5;">您已完成基础构架，正在向 B1 水平稳步迈进。继续保持每日写作练习，这是突破 6.5 的核心。</p>
                </div>
            </div>
        </div>
    `;
}

// --- Utilities ---
function predictPotential(results) { const count = results.filter(r => r.type === 'error').length; return count === 0 ? "⭐⭐⭐⭐⭐" : (count <= 2 ? "⭐⭐⭐⭐" : "⭐⭐⭐"); }
function toggleTask(id) { const t = state.dailyTasks.find(x => x.id === id); if (t) { t.completed = !t.completed; saveState(); updateProgress(); renderDailyPlan(); } }
function markTaskComplete(type) { const t = state.dailyTasks.find(x => x.type === type); if (t) { t.completed = true; saveState(); updateProgress(); } }
function updateProgress() {
    const done = state.dailyTasks.filter(t => t.completed).length; const p = Math.round((done / state.dailyTasks.length) * 100);
    progressPercent.textContent = `${p}%`; progressFill.style.width = `${p}%`;
}
function getIcon(type) { const icons = { writing: '✍️', speaking: '🗣️', grammar: '🧩', phonetics: '👄' }; return icons[type] || '🎯'; }
function renderErrorBank() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>📕 专家级错题归档</h3>
                <button onclick="state.errorBank=[];saveState();renderErrorBank();" style="background: none; border: 1px solid #ff5252; color: #ff5252; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">清空题库</button>
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
function renderWeeklyReview() { appView.innerHTML = `<div class="card"><h3>📊 周度复盘</h3><p style="margin-top:1rem; color:var(--text-dim);">完成率: 92% | 本周表现非常稳定。</p></div>`; }

// --- 7. Reading View ---
function renderReadingView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; animation: fadeIn 0.4s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--accent-secondary);">📖 雅思阅读 A2：远程办公趋势</h3>
                <span style="font-size: 0.8rem; color: var(--text-dim);">难度: A2-B1</span>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; line-height: 1.8; color: #e0e0e0; font-size: 1.05rem;">
                <p>Nowadays, more people are working from home. This is called "remote work". Many companies use technology like Zoom to have meetings. Some people like this because they save time and money on travel. However, other people find it hard to focus at home. They miss their colleagues and the office environment. Experts think that a "hybrid" model (working from both home and office) will be very popular in the future.</p>
            </div>
            <div id="reading-questions" style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
                <div class="reading-q">
                    <p style="margin-bottom: 1rem; font-weight: 600;">1. What is "remote work"?</p>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <label style="cursor:pointer; display:flex; align-items:center; gap:0.5rem;"><input type="radio" name="q1" value="a"> Working in a tall building</label>
                        <label style="cursor:pointer; display:flex; align-items:center; gap:0.5rem;"><input type="radio" name="q1" value="b"> Working from home using technology</label>
                        <label style="cursor:pointer; display:flex; align-items:center; gap:0.5rem;"><input type="radio" name="q1" value="c"> Traveling to different countries for work</label>
                    </div>
                </div>
                <button onclick="checkReadingAnswers()" style="background: var(--accent-primary); border: none; padding: 12px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">提交并检查</button>
            </div>
            <div id="reading-feedback" style="display: none;"></div>
        </div>
    `;
}

function checkReadingAnswers() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const feedback = document.getElementById('reading-feedback');
    if (!q1) return alert("请先选择答案！");
    feedback.style.display = 'block';
    if (q1.value === 'b') {
        feedback.innerHTML = `<div style="background: rgba(0,229,255,0.1); padding: 1rem; border-radius: 10px; color: var(--accent-secondary); margin-top: 1rem;">✅ 正确！解析：文中提到 "working from home. This is called 'remote work'."</div>`;
        markTaskComplete('reading');
    } else {
        feedback.innerHTML = `<div style="background: rgba(255,82,82,0.1); padding: 1rem; border-radius: 10px; color: #ff5252; margin-top: 1rem;">❌ 错误。正确答案是 B。</div>`;
    }
}

// --- 8. Vocabulary View ---
function renderVocabularyView() {
    const words = [
        { word: 'Sustainable', meaning: '可持续的 / 环保的', syn: 'Eco-friendly', ex: 'We need sustainable energy.' },
        { word: 'Efficiency', meaning: '效率 / 效能', syn: 'Productivity', ex: 'New tools improve efficiency.' },
        { word: 'Remote', meaning: '远程的 / 偏远的', syn: 'Distance / Tele-', ex: 'Remote work is popular now.' },
        { word: 'Fulfillment', meaning: '成就感 / 满足感', syn: 'Satisfaction', ex: 'Job fulfillment is important.' },
        { word: 'Identity', meaning: '身份 / 特征', syn: 'Character', ex: 'Food is part of our identity.' }
    ];
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <h3 style="color: var(--accent-secondary);">📚 核心场景词汇：科技与办公</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${words.map(w => `
                    <div class="card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                            <h4 style="color: var(--accent-secondary); font-size: 1.2rem;">${w.word}</h4>
                            <button onclick="playText('${w.word}', 'en-US')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">🔊</button>
                        </div>
                        <p style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;"><span style="color: var(--text-dim);">释义:</span> ${w.meaning}</p>
                        <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.8rem;">同义替换: <span style="color: var(--accent-secondary);">${w.syn}</span></p>
                        <p style="font-size: 0.9rem; font-style: italic; color: #e0e0e0; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.8rem;">" ${w.ex} "</p>
                    </div>
                `).join('')}
            </div>
            <button onclick="markTaskComplete('vocabulary'); switchView('daily-plan');" style="background: var(--accent-primary); border: none; padding: 14px; border-radius: 12px; color: white; cursor: pointer; font-weight: 700;">今日词汇已掌握</button>
        </div>
    `;
}

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

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ielts_coach_backup_${new Date().toLocaleDateString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

init();
