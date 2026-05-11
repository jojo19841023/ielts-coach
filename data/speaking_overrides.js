(function applySpeakingOverrides() {
    if (!window.IELTS_DATA || !window.IELTS_DATA.curriculum) return;

    const sessions = {
        1: {
            topic: 'Nature and Places',
            chinese: '自然与地点',
            questions: ['Is there any natural place you like near your home?', 'Do you prefer mountains, rivers or parks?', 'Would you like to spend more time in nature in the future?'],
            goal: '练习描述地点、表达偏好，并补一个未来计划。',
            focus: 'there is/there are + because + future plan',
            phrases: ['There is a...', 'I prefer...', 'In the future, I would like to...']
        },
        2: {
            topic: 'Plants and Green Spaces',
            chinese: '植物与绿色空间',
            questions: ['Do you like keeping plants at home?', 'Why do some people enjoy gardens and green spaces?', 'Do you think cities need more green areas?'],
            goal: '围绕植物和城市环境表达个人看法。',
            focus: '个人偏好 + 简单观点表达',
            phrases: ['Personally, I like...', 'One reason is that...', 'I think cities should...']
        },
        3: {
            topic: 'Animals',
            chinese: '动物',
            questions: ['Did you like animals when you were a child?', 'What animals are common in your city or country?', 'Should children learn more about protecting animals?'],
            goal: '把过去经历、现在观察和观点连起来说。',
            focus: '过去与现在对比 + should 表达',
            phrases: ['When I was a child...', 'Nowadays, I often see...', 'I think children should...']
        },
        4: {
            topic: 'Space and Curiosity',
            chinese: '太空与好奇心',
            questions: ['Were you interested in space when you were younger?', 'Why are some people fascinated by space exploration?', 'Would you like to visit a science museum or space exhibition?'],
            goal: '练习讲兴趣来源和个人选择。',
            focus: '兴趣来源 + would like to',
            phrases: ['I have always been interested in...', 'Many people like it because...', 'I would love to visit...']
        },
        5: {
            topic: 'School Memories',
            chinese: '学校回忆',
            questions: ['What subject did you enjoy most at school?', 'Did you prefer studying alone or with classmates?', 'What do you think makes a good teacher?'],
            goal: '从个人经历过渡到一般观点。',
            focus: '过去时 + 观点展开',
            phrases: ['At school, I really enjoyed...', 'I usually preferred...', 'A good teacher should...']
        },
        6: {
            topic: 'Technology in Daily Life',
            chinese: '日常科技',
            questions: ['What piece of technology do you use most every day?', 'Has technology made your life easier?', 'Do you find it easy to learn new apps or devices?'],
            goal: '说清具体使用场景和带来的变化。',
            focus: '现在时 + has changed my life',
            phrases: ['I use... every day', 'It has made my life...', 'I find it...']
        },
        7: {
            topic: 'History and Old Places',
            chinese: '历史与老地方',
            questions: ['Do you enjoy visiting old buildings?', 'Are there any famous historical places in your area?', 'Why should people learn about history?'],
            goal: '描述地点，再补价值和原因。',
            focus: '地点描述 + because + should',
            phrases: ['There is a famous...', 'People visit it because...', 'I think history is important because...']
        },
        8: {
            topic: 'Languages',
            chinese: '语言',
            questions: ['Do you enjoy learning languages?', 'What is difficult about learning a new language?', 'Do you think children should start learning languages early?'],
            goal: '练习谈困难、方法和观点。',
            focus: 'difficulty + reason + opinion',
            phrases: ['One difficult part is...', 'This is because...', 'In my opinion...']
        },
        9: {
            topic: 'Sports and Free Time',
            chinese: '运动与休闲',
            questions: ['Do you play any sports now?', 'What sports are popular where you live?', 'Do you think children should do more physical exercise?'],
            goal: '从个人习惯延伸到社会观察。',
            focus: '频率表达 + 社会观察',
            phrases: ['I sometimes...', 'In my city, many people...', 'Children should...']
        },
        10: {
            topic: 'Objects and Things You Use',
            chinese: '日常物品',
            questions: ['Is there any object you use every day?', 'Why is it important to you?', 'Do you usually keep things for a long time or replace them quickly?'],
            goal: '练习描述物品用途和个人习惯。',
            focus: '功能描述 + habit explanation',
            phrases: ['I use... every day', 'It is important because...', 'I usually keep it for...']
        },
        11: {
            topic: 'Clothes and Style',
            chinese: '穿着与风格',
            questions: ['Do you usually think a lot about what you wear?', 'Do clothes affect how people feel?', 'Has your style changed over time?'],
            goal: '表达习惯、感受和变化。',
            focus: '现在与过去对比',
            phrases: ['Usually, I wear...', 'I think clothes can...', 'Compared with the past...']
        },
        12: {
            topic: 'Environment',
            chinese: '环境',
            questions: ['Do environmental problems concern you?', 'What small things do people do to protect the environment?', 'Should schools teach more about nature and the environment?'],
            goal: '练习表达担忧和简单建议。',
            focus: '观点 + 建议表达',
            phrases: ['Yes, they do concern me because...', 'Some people try to...', 'Schools should...']
        },
        13: {
            topic: 'Travel and Scenery',
            chinese: '旅行与风景',
            questions: ['What kind of places do you like visiting?', 'Do you prefer quiet natural places or busy cities?', 'Would you like to travel more in the future?'],
            goal: '围绕偏好做对比，再补未来计划。',
            focus: 'prefer A or B + future plan',
            phrases: ['I prefer...', 'Compared with..., I think...', 'In the future, I hope to...']
        },
        14: {
            topic: 'Gardens and Outdoor Spaces',
            chinese: '花园与户外空间',
            questions: ['Did you spend much time outside when you were young?', 'Do you like public parks?', 'Why are outdoor spaces important in cities?'],
            goal: '练习过去经历和城市观点。',
            focus: '过去经历 + 城市功能',
            phrases: ['When I was younger...', 'I like parks because...', 'They are important for...']
        },
        15: {
            topic: 'Science and Discovery',
            chinese: '科学与发现',
            questions: ['Did you enjoy science at school?', 'Why are some people interested in scientific discovery?', 'Do you think science should be made easier for children?'],
            goal: '把个人经历和教育观点结合起来。',
            focus: 'school memory + opinion',
            phrases: ['At school, I found science...', 'People are interested in it because...', 'I think it should be...']
        },
        16: {
            topic: 'Learning and Skills',
            chinese: '学习与技能',
            questions: ['Is there any practical skill you want to learn?', 'Do you learn better by yourself or from a teacher?', 'What skills should schools teach more often?'],
            goal: '从个人目标过渡到教育建议。',
            focus: 'want to learn + advice',
            phrases: ['I would like to learn...', 'I learn better when...', 'Schools should teach...']
        },
        17: {
            topic: 'Apps and Devices',
            chinese: '应用与设备',
            questions: ['What app do you use most often?', 'Why do people depend so much on their phones?', 'Do you think this dependence is a good thing?'],
            goal: '表达使用场景，再补优缺点。',
            focus: 'daily use + advantage/disadvantage',
            phrases: ['I use... most often', 'People depend on it because...', 'On the one hand...']
        },
        18: {
            topic: 'Culture and Traditions',
            chinese: '文化与传统',
            questions: ['Is there any tradition in your family or city that you like?', 'Do young people still care about traditions?', 'How can traditions be kept alive?'],
            goal: '练习具体例子和建议表达。',
            focus: 'example + suggestion',
            phrases: ['One tradition I like is...', 'Some young people still...', 'It can be kept alive by...']
        },
        19: {
            topic: 'Communication and Languages',
            chinese: '交流与语言',
            questions: ['Do you prefer talking face to face or by message?', 'Has technology changed the way people communicate?', 'What makes communication difficult sometimes?'],
            goal: '练习偏好比较和原因分析。',
            focus: 'compare + reason',
            phrases: ['I prefer... because...', 'Technology has changed...', 'Sometimes communication is difficult when...']
        },
        20: {
            topic: 'Music and Entertainment',
            chinese: '音乐与娱乐',
            questions: ['What do you do for entertainment?', 'Has your taste in music or films changed?', 'Do you think entertainment is necessary in daily life?'],
            goal: '表达爱好，再补变化和观点。',
            focus: 'taste change + opinion',
            phrases: ['For entertainment, I usually...', 'My taste has changed because...', 'I think it is necessary because...']
        },
        21: {
            topic: 'Recycling and Habits',
            chinese: '回收与习惯',
            questions: ['Do you recycle at home?', 'Why do some people find it hard to change daily habits?', 'Should governments do more to encourage recycling?'],
            goal: '练习习惯表达和责任观点。',
            focus: 'habit + should',
            phrases: ['At home, I usually...', 'Some people find it hard because...', 'Governments should...']
        },
        22: {
            topic: 'Fashion and Shopping',
            chinese: '时尚与购物',
            questions: ['Do you enjoy shopping for clothes?', 'Why do some people follow fashion closely?', 'Do you think people buy too many clothes nowadays?'],
            goal: '表达个人习惯，再补社会现象看法。',
            focus: 'personal habit + social opinion',
            phrases: ['I do / I do not really enjoy...', 'Some people follow fashion because...', 'Nowadays, I think...']
        },
        23: {
            topic: 'Weather and Water',
            chinese: '天气与水资源',
            questions: ['Does the weather affect what you do each day?', 'Do people in your area talk about water or weather problems?', 'Should people change their habits to save water?'],
            goal: '从日常影响过渡到公共问题。',
            focus: 'daily effect + public issue',
            phrases: ['It affects me because...', 'People often talk about...', 'I think people should...']
        },
        24: {
            topic: 'Cities and Green Living',
            chinese: '城市与绿色生活',
            questions: ['Would you like to live in a greener city?', 'What makes a city feel more comfortable?', 'Should cities give more space to plants and public areas?'],
            goal: '练习理想城市描述和建议表达。',
            focus: 'would like + city features',
            phrases: ['I would like to live in...', 'A comfortable city should...', 'Cities should give more space to...']
        },
        25: {
            topic: 'Wildlife and Protection',
            chinese: '野生动物与保护',
            questions: ['Have you ever visited a place where wild animals live?', 'Why do people care about protecting animals?', 'What can schools do to raise awareness about wildlife?'],
            goal: '练习经历、原因和建议三步回答。',
            focus: 'experience + reason + suggestion',
            phrases: ['I once visited...', 'People care because...', 'Schools can...']
        },
        26: {
            topic: 'Future Travel',
            chinese: '未来旅行',
            questions: ['Would you like to travel in an unusual way one day?', 'Why do some people enjoy adventure travel?', 'Do you think future travel will become easier or more difficult?'],
            goal: '表达未来想法和预测。',
            focus: 'future tense + prediction',
            phrases: ['One day, I would like to...', 'Some people enjoy it because...', 'In the future, I think...']
        },
        27: {
            topic: 'Teachers and Learning Tools',
            chinese: '老师与学习工具',
            questions: ['What learning tools help you most?', 'Do online tools make learning easier?', 'Will teachers always be important in the future?'],
            goal: '练习工具评价和教育判断。',
            focus: 'helpful tool + future importance',
            phrases: ['The most helpful tool for me is...', 'It makes learning easier because...', 'Teachers will still be important because...']
        },
        28: {
            topic: 'Daily Problem Solving',
            chinese: '日常解决问题',
            questions: ['When you have a problem, do you usually solve it alone?', 'Do people rely too much on devices to solve problems?', 'What skills help people solve problems better?'],
            goal: '表达个人习惯，再补方法和观点。',
            focus: 'habit + evaluation',
            phrases: ['Usually, I try to...', 'Some people rely too much on...', 'A useful skill is...']
        },
        29: {
            topic: 'Events and Community Life',
            chinese: '活动与社区生活',
            questions: ['Do you enjoy public events or cultural activities?', 'What kinds of events are popular in your area?', 'Do these events help communities become closer?'],
            goal: '练习描述活动和社区影响。',
            focus: 'describe + effect',
            phrases: ['I enjoy...', 'In my area, people often...', 'These events help because...']
        },
        30: {
            topic: 'Language and Identity',
            chinese: '语言与身份',
            questions: ['Is language an important part of identity?', 'Why do some smaller languages disappear?', 'Should communities try to protect local languages?'],
            goal: '练习抽象观点题的基本表达。',
            focus: 'abstract opinion + support',
            phrases: ['I think language is important because...', 'Some languages disappear when...', 'Communities should try to...']
        }
    };

    Object.entries(sessions).forEach(([dayKey, speaking]) => {
        const day = window.IELTS_DATA.curriculum[dayKey];
        if (!day) return;
        day.speaking = { ...speaking };
    });
})();
