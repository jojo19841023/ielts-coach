// IELTS Coach App Logic

const state = {
    currentView: 'daily-plan',
    user: {
        name: 'Jojo',
        targetScore: 6.5,
        currentLevel: 'A2'
    },
    dailyTasks: [
        { id: 1, type: 'grammar', title: '基础时态：一般现在时 vs 现在进行时', completed: false, duration: '20min' },
        { id: 2, type: 'phonetics', title: '元音训练：/i:/ 与 /ɪ/ 的区别', completed: false, duration: '15min' },
        { id: 3, type: 'writing', title: '句子构造：5个简单句练习', completed: false, duration: '20min' },
        { id: 4, type: 'vocabulary', title: '高频场景单词：个人信息与家庭', completed: true, duration: '15min' }
    ]
};

// DOM Elements
const viewTitle = document.getElementById('view-title');
const appView = document.getElementById('app-view');
const navItems = document.querySelectorAll('.nav-item');

// Initialize App
function init() {
    setupNavigation();
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
        'speaking': '口语纠偏'
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
        default:
            appView.innerHTML = `<div class="loading">${viewTitle.textContent} 功能开发中...</div>`;
    }
}

function renderGrammarView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <h3 style="color: var(--accent-secondary);">今日核心：一般现在时 (Present Simple)</h3>
            <p style="color: var(--text-dim); line-height: 1.6;">用于描述经常发生的动作或客观事实。</p>
            <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--accent-primary);">
                <p style="font-style: italic; margin-bottom: 0.5rem;">"I usually <strong>study</strong> (study) English at 7 PM."</p>
                <p style="font-size: 0.85rem; color: var(--text-dim);">挑战：请将上面的动词填入正确的形式。</p>
            </div>
            <input type="text" placeholder="输入您的答案..." style="background: transparent; border: 1px solid var(--glass-border); padding: 12px; border-radius: 8px; color: white;">
            <button style="background: var(--accent-primary); border: none; padding: 10px; border-radius: 8px; color: white; cursor: pointer;">检查答案</button>
        </div>
    `;
}

function renderPhoneticsView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; text-align: center;">
            <h3 style="color: var(--accent-secondary);">元音辨析：/i:/ vs /ɪ/</h3>
            <div style="display: flex; gap: 2rem;">
                <div class="sound-card" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">/i:/</div>
                    <div style="font-size: 0.9rem;">Sheep</div>
                </div>
                <div class="sound-card" style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">/ɪ/</div>
                    <div style="font-size: 0.9rem;">Ship</div>
                </div>
            </div>
            <p style="color: var(--text-dim); font-size: 0.9rem;">点击上方卡片收听标准发音，然后点击下方录音进行对比。</p>
            <button style="width: 60px; height: 60px; border-radius: 50%; background: #ff5252; border: none; font-size: 1.5rem; color: white; cursor: pointer;">🎙️</button>
        </div>
    `;
}

function renderSpeakingView() {
    appView.innerHTML = `
        <div class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <h3>口语纠偏：告别“中式思维”</h3>
            <div style="background: rgba(255,82,82,0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #ff5252;">
                <span style="color: #ff5252; font-weight: bold;">中式表达：</span> I very like English. ❌
            </div>
            <div style="background: rgba(0,229,255,0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent-secondary);">
                <span style="color: var(--accent-secondary); font-weight: bold;">地道表达：</span> I really like English. / I'm very fond of English. ✅
            </div>
            <p style="font-size: 0.9rem; color: var(--text-dim);">原因：Very 是副词，不能直接修饰动词 Like。请试着大声朗读地道表达 3 遍。</p>
        </div>
    `;
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
            <button class="status-btn ${task.completed ? 'completed' : ''}" 
                    style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--glass-border); background: ${task.completed ? 'rgba(0, 229, 255, 0.1)' : 'transparent'}; color: ${task.completed ? 'var(--accent-secondary)' : 'var(--text-dim)'}; cursor: pointer;">
                ${task.completed ? '已完成' : '开始训练'}
            </button>
        `;
        container.appendChild(card);
    });

    appView.appendChild(container);
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
            <textarea placeholder="例如: There are four people in my family. My father is a doctor..." 
                      style="flex: 1; background: transparent; border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-main); padding: 1.5rem; font-family: inherit; font-size: 1rem; resize: none; line-height: 1.8; outline: none;"></textarea>
            <button style="background: var(--accent-primary); color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                检查句子语法
            </button>
        </div>
    `;
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
