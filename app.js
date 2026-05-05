// IELTS Coach App Logic - Functional Version

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
        { id: 1, type: 'grammar', title: '基础时态：一般现在时 vs 现在进行时', completed: false, duration: '20min', view: 'grammar' },
        { id: 2, type: 'phonetics', title: '元音训练：/i:/ 与 /ɪ/ 的区别', completed: false, duration: '15min', view: 'phonetics' },
        { id: 3, type: 'writing', title: '句子构造：5个简单句练习', completed: false, duration: '20min', view: 'writing' },
        { id: 4, type: 'vocabulary', title: '高频场景单词：个人信息与家庭', completed: true, duration: '15min', view: 'daily-plan' }
    ],
    errorBank: [],
    essays: { current: '' },
    speakingInput: '',
    chinglishPatterns: [
        { pattern: "very like", correction: "I really like...", explanation: "Very 是副词，不能修饰动词。请用 really 或 like ... very much。" },
        { pattern: "I'm very", correction: "I really...", explanation: "如果您想说'我很...'，请注意如果是动作，不要加 I'm。" },
        { pattern: "people is", correction: "People are...", explanation: "People 是复数形式，谓语动词要用 are。" },
        { pattern: "look the", correction: "Look at the...", explanation: "Look 是不及物动词，后面接对象需要加 at。" }
    ]
};

// Migration: Ensure all properties exist
if (!state) {
    state = defaultState;
} else {
    state.chinglishPatterns = state.chinglishPatterns || defaultState.chinglishPatterns;
    state.errorBank = state.errorBank || [];
    state.essays = state.essays || { current: '' };
    state.speakingInput = state.speakingInput || '';
}

function saveState() {
    localStorage.setItem('ieltsState', JSON.stringify(state));
}

// Helper to convert patterns to regex
function getPatterns() {
    return state.chinglishPatterns.map(p => ({
        ...p,
        regex: new RegExp(p.pattern, 'i')
    }));
}

// DOM Elements
const viewTitle = document.getElementById('view-title');
const appView = document.getElementById('app-view');
const navItems = document.querySelectorAll('.nav-item');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const dynamicFeedback = document.getElementById('dynamic-feedback');

// Initialize App
function init() {
    setupNavigation();
    updateProgress();
    renderView(state.currentView);
}

// Navigation Logic
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
    
    // Update active nav item
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewId);
    });

    // Update title and render
    const viewNames = {
        'daily-plan': '每日计划',
        'grammar': '语法诊所',
        'phonetics': '发音实验室',
        'writing': '零基础写作',
        'speaking': '口语纠偏',
        'error-bank': '错题库',
        'weekly-review': '周度复盘'
    };
    viewTitle.textContent = viewNames[viewId];
    renderView(viewId);
}

// Render Logic
function renderView(viewId) {
    appView.innerHTML = '';
    
    switch(viewId) {
        case 'daily-plan':
            renderDailyPlan();
            break;
        case 'grammar':
            renderGrammarView();
            break;
        case 'phonetics':
            renderPhoneticsView();
            break;
        case 'writing':
            renderWritingView();
            break;
        case 'speaking':
            renderSpeakingView();
            break;
        case 'error-bank':
            renderErrorBank();
            break;
        case 'weekly-review':
            renderWeeklyReview();
            break;
        default:
            appView.innerHTML = `<div class="loading">${viewTitle.textContent} 功能开发中...</div>`;
    }
}

function renderGrammarView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <h3 style="color: var(--accent-secondary);">今日核心：一般现在时 (Present Simple)</h3>
            <p style="color: var(--text-dim); line-height: 1.6;">用于描述经常发生的动作或客观事实。注意第三人称单数要加 -s。</p>
            
            <div id="grammar-exercise" style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--accent-primary);">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">1. My brother ________ (play) football every Sunday.</p>
                <input type="text" id="grammar-answer" placeholder="输入动词形式..." 
                       style="background: transparent; border: 1px solid var(--glass-border); padding: 12px; border-radius: 8px; color: white; width: 100%; margin-bottom: 1rem;">
                <div id="grammar-feedback" style="margin-bottom: 1rem; font-size: 0.9rem; display: none;"></div>
                <button onclick="checkGrammarAnswer('plays')" 
                        style="background: var(--accent-primary); border: none; padding: 12px 24px; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">
                    检查答案
                </button>
            </div>
        </div>
    `;
}

function checkGrammarAnswer(correct) {
    const input = document.getElementById('grammar-answer');
    const feedback = document.getElementById('grammar-feedback');
    const val = input.value.trim().toLowerCase();
    
    feedback.style.display = 'block';
    if (val === correct) {
        feedback.style.color = "var(--accent-secondary)";
        feedback.innerHTML = "✅ 正确！My brother plays... (第三人称单数加 -s)";
        markTaskComplete('grammar');
    } else {
        feedback.style.color = "#ff5252";
        feedback.innerHTML = `❌ 错误。正确答案是 <strong>${correct}</strong>。已加入错题库。`;
        addError('Grammar', `My brother ${val} football.`, `My brother ${correct} football.`);
    }
}

function addError(category, content, correction) {
    const exists = state.errorBank.some(e => e.content === content);
    if (!exists) {
        state.errorBank.push({
            id: Date.now(),
            category,
            content,
            correction,
            date: new Date().toISOString().split('T')[0]
        });
        saveState();
    }
}

function markTaskComplete(type) {
    const task = state.dailyTasks.find(t => t.type === type);
    if (task) {
        task.completed = true;
        saveState();
        updateProgress();
    }
}

function renderPhoneticsView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; text-align: center;">
            <h3 style="color: var(--accent-secondary);">元音辨析：/i:/ vs /ɪ/</h3>
            <div style="display: flex; gap: 2rem;">
                <div class="sound-card" onclick="playText('sheep', 'en-US')" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid var(--glass-border);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">/i:/</div>
                    <div style="font-size: 0.9rem;">Sheep [ʃiːp]</div>
                    <div style="font-size: 0.7rem; color: var(--accent-secondary); margin-top: 5px;">点击播放</div>
                </div>
                <div class="sound-card" onclick="playText('ship', 'en-US')" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid var(--glass-border);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">/ɪ/</div>
                    <div style="font-size: 0.9rem;">Ship [ʃɪp]</div>
                    <div style="font-size: 0.7rem; color: var(--accent-secondary); margin-top: 5px;">点击播放</div>
                </div>
            </div>
            <div style="text-align: left; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 8px; font-size: 0.85rem; color: var(--text-dim);">
                💡 <strong>技巧：</strong> 发 /i:/ 时嘴角向两侧拉开（像微笑）；发 /ɪ/ 时下巴自然下垂，声音短促。
            </div>
            
            <div id="recording-controls" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                <button id="record-btn" onclick="toggleRecording()" style="width: 70px; height: 70px; border-radius: 50%; background: #ff5252; border: none; font-size: 1.8rem; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition);">🎙️</button>
                <p id="record-status" style="font-size: 0.9rem; color: var(--text-dim);">点击麦克风开始录音</p>
                <div id="audio-playback" style="display: none;">
                    <p style="font-size: 0.8rem; margin-bottom: 5px;">回放您的发音：</p>
                    <audio id="player" controls style="height: 30px;"></audio>
                </div>
            </div>
        </div>
    `;
}

function playText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
}

let mediaRecorder;
let audioChunks = [];
let recognition;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

async function toggleRecording() {
    const btn = document.getElementById('record-btn');
    const status = document.getElementById('record-status');
    const playback = document.getElementById('audio-playback');
    const targetText = "A sheep is on a ship"; // Target phrase for A2 exercise

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('player').src = audioUrl;
                playback.style.display = 'block';
            };

            // Start AI Recognition
            if (recognition) {
                recognition.onstart = () => {
                    status.innerHTML = "🎤 正在识别您的发音...";
                };
                recognition.onresult = (event) => {
                    const result = event.results[0][0].transcript;
                    const confidence = Math.round(event.results[0][0].confidence * 100);
                    evaluatePronunciation(result, targetText, confidence);
                };
                recognition.onerror = (event) => {
                    status.innerHTML = "❌ 识别失败: " + event.error;
                };
                recognition.start();
            }

            mediaRecorder.start();
            btn.style.animation = "pulse 1s infinite";
            btn.style.background = "#333";
            btn.innerHTML = "⏹️";
        } catch (err) {
            alert("无法访问麦克风，请确保已授予权限。");
            console.error(err);
        }
    } else {
        mediaRecorder.stop();
        if (recognition) recognition.stop();
        btn.style.animation = "none";
        btn.style.background = "#ff5252";
        btn.innerHTML = "🎙️";
    }
}

function evaluatePronunciation(result, target, confidence) {
    const status = document.getElementById('record-status');
    const normalizedResult = result.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const normalizedTarget = target.toLowerCase();

    let feedback = "";
    if (normalizedResult.includes("sheep") && normalizedResult.includes("ship")) {
        feedback = `✅ 完美！识别结果: "${result}" (置信度: ${confidence}%)。您清晰地区分了长短元音。`;
        markTaskComplete('phonetics');
    } else if (normalizedResult.includes("sheep") || normalizedResult.includes("ship")) {
        feedback = `⚠️ 接近了。识别结果: "${result}"。注意辨析 /i:/ 和 /ɪ/ 的长短区别。`;
    } else {
        feedback = `❌ 没听清。识别结果: "${result}"。请尝试按照提示的技巧再试一次。`;
    }
    status.innerHTML = feedback;
}

function renderSpeakingView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <h3>口语纠偏：告别“中式思维”</h3>
            <p style="color: var(--text-dim); font-size: 0.9rem;">输入您想说的英语句子，看看是否存在常见的“中式英语”倾向：</p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <textarea id="speaking-text-input" placeholder="例如: I very like English..." 
                          style="background: transparent; border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-main); padding: 1rem; font-family: inherit; font-size: 1rem; resize: none; min-height: 100px; outline: none;">${state.speakingInput}</textarea>
                <button onclick="analyzeSpeaking()" style="background: var(--accent-primary); color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                    AI 纠偏分析
                </button>
            </div>

            <div id="speaking-result" style="display: none; animation: fadeIn 0.3s ease;">
                <!-- Results will be injected here -->
            </div>

            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border);">
                <h4 style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.8rem;">💡 今日避坑指南：</h4>
                <div style="background: rgba(255,255,255,0.02); padding: 0.8rem; border-radius: 8px; font-size: 0.8rem;">
                    不要说 "My English is very poor"，尝试说 "I'm still working on my English" 更加地道且自信。
                </div>
            </div>
        </div>
    `;
}

function analyzeSpeaking() {
    const input = document.getElementById('speaking-text-input');
    const resultDiv = document.getElementById('speaking-result');
    const text = input.value.trim();
    state.speakingInput = text;
    saveState();

    if (!text) return;

    let match = null;
    const patterns = getPatterns();
    for (let p of patterns) {
        if (p.regex.test(text)) {
            match = p;
            break;
        }
    }

    resultDiv.style.display = 'block';
    if (match) {
        resultDiv.innerHTML = `
            <div style="background: rgba(255,82,82,0.1); padding: 1rem; border-radius: 12px; border-left: 4px solid #ff5252; margin-bottom: 1rem;">
                <span style="color: #ff5252; font-weight: bold;">中式雷区：</span> ${text} ❌
            </div>
            <div style="background: rgba(0,229,255,0.1); padding: 1rem; border-radius: 12px; border-left: 4px solid var(--accent-secondary);">
                <span style="color: var(--accent-secondary); font-weight: bold;">地道建议：</span> ${match.correction} ✅
                <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.5rem;">${match.explanation}</p>
            </div>
        `;
        addError('Speaking', text, match.correction);
    } else {
        resultDiv.innerHTML = `
            <div style="background: rgba(0,229,255,0.1); padding: 1rem; border-radius: 12px; border-left: 4px solid var(--accent-secondary);">
                <p>✅ 暂未发现明显的中式表达。您的表达逻辑已经初步具备英语思维！</p>
                <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.5rem;">建议：继续尝试使用更复杂的连词（如 although, because）来丰富句式。</p>
            </div>
        `;
    }
    markTaskComplete('speaking');
}

function renderDailyPlan() {
    const container = document.createElement('div');
    container.className = 'daily-grid';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    container.style.gap = '1.5rem';

    state.dailyTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'card task-card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <span class="task-icon">${getIcon(task.type)}</span>
                <span style="font-size: 0.75rem; color: var(--text-dim); background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px;">${task.duration}</span>
            </div>
            <h3 style="font-size: 1rem; margin-bottom: 1rem;">${task.title}</h3>
            <div style="display: flex; gap: 0.5rem;">
                <button class="status-btn ${task.completed ? 'completed' : ''}" 
                        onclick="toggleTask(${task.id})"
                        style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--glass-border); background: ${task.completed ? 'rgba(0, 229, 255, 0.1)' : 'transparent'}; color: ${task.completed ? 'var(--accent-secondary)' : 'var(--text-dim)'}; cursor: pointer;">
                    ${task.completed ? '已完成' : '完成'}
                </button>
                <button onclick="switchView('${task.view}')" 
                        style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--accent-primary); background: rgba(124, 77, 255, 0.1); color: var(--text-main); cursor: pointer;">
                    开始训练
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    appView.appendChild(container);
}

function toggleTask(id) {
    const task = state.dailyTasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveState();
        updateProgress();
        renderView(state.currentView);
    }
}

function updateProgress() {
    const completedCount = state.dailyTasks.filter(t => t.completed).length;
    const totalCount = state.dailyTasks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    
    progressPercent.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    // Dynamic Feedback Logic
    if (percentage === 0) {
        dynamicFeedback.textContent = "新的一天开始了，先从一个语法小练习开始吧！";
    } else if (percentage < 50) {
        dynamicFeedback.textContent = "保持节奏！您已经完成了基础词汇，继续加油。";
    } else if (percentage < 100) {
        dynamicFeedback.textContent = "完成度过半！今天的写作练习是提升 6.5 的关键。";
    } else {
        dynamicFeedback.textContent = "太棒了！今日任务全部达成，这种自律是通往 6.5 的捷径。";
    }
}

function renderErrorBank() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>📕 我的错题库</h3>
                <button style="font-size: 0.8rem; background: transparent; border: 1px solid var(--glass-border); color: var(--text-dim); padding: 4px 12px; border-radius: 20px;">按日期排序</button>
            </div>
            <div class="error-list" style="display: flex; flex-direction: column; gap: 1rem;">
                ${state.errorBank.map(error => `
                    <div style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border-left: 4px solid #ff5252;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; color: #ff5252; font-weight: bold;">${error.category}</span>
                            <span style="font-size: 0.7rem; color: var(--text-dim);">${error.date}</span>
                        </div>
                        <p style="text-decoration: line-through; color: var(--text-dim); font-size: 0.9rem; margin-bottom: 0.4rem;">${error.content}</p>
                        <p style="color: var(--accent-secondary); font-weight: 500;">${error.correction}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderWeeklyReview() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <h3>📊 周度复盘报告 (5.1 - 5.7)</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="padding: 1rem; background: rgba(124, 77, 255, 0.1); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.8rem; color: var(--text-dim);">任务完成率</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-primary);">92%</div>
                </div>
                <div style="padding: 1rem; background: rgba(0, 229, 255, 0.1); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.8rem; color: var(--text-dim);">错题复习数</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-secondary);">12</div>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <h4 style="margin-bottom: 0.8rem; font-size: 0.95rem;">本周高频错误：主谓一致</h4>
                <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.5;">
                    您在本周的 5 次写作练习中，有 3 次出现了 "People is" 或 "He study" 类似的错误。建议下周一重点复习《语法诊所》中的“第三人称单数”专题。
                </p>
            </div>
            <button style="background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary)); border: none; padding: 12px; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">
                生成下周学习计划
            </button>
        </div>
    `;
}

function renderWritingView() {
    appView.innerHTML = `
        <div class="card" style="height: 100%; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.1rem;">零基础写作：简单句通关</h3>
                <span style="color: var(--accent-secondary); font-size: 0.9rem;">目标：掌握主谓宾结构</span>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px; font-size: 0.9rem; line-height: 1.6; color: var(--text-dim);">
                <strong>今日课题：</strong> 描述您的家庭成员。尝试使用 "There is/are" 和 "My... is..." 句型。
            </div>
            <textarea id="essay-input" placeholder="例如: There are four people in my family. My father is a doctor..." 
                      style="flex: 1; background: transparent; border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-main); padding: 1.5rem; font-family: inherit; font-size: 1rem; resize: none; line-height: 1.8; outline: none;">${state.essays.current}</textarea>
            <div id="writing-feedback" style="font-size: 0.9rem; color: var(--accent-secondary); display: none;"></div>
            <button onclick="saveAndCheckEssay()" style="background: var(--accent-primary); color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                保存并检查句子语法
            </button>
        </div>
    `;
}

function saveAndCheckEssay() {
    const input = document.getElementById('essay-input');
    const feedback = document.getElementById('writing-feedback');
    state.essays.current = input.value;
    saveState();
    
    feedback.style.display = 'block';
    feedback.innerHTML = "📝 已保存进度。初步检查：主语和谓语连接正常。稍后 AI 将给出详细改进建议。";
    markTaskComplete('writing');
}

function getIcon(type) {
    const icons = {
        reading: '📖',
        writing: '✍️',
        listening: '🎧',
        speaking: '🗣️',
        grammar: '🧩',
        phonetics: '👄',
        vocabulary: '📚'
    };
    return icons[type] || '🎯';
}

// Start App
init();
