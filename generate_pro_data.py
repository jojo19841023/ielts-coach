import json

def get_pro_day(day):
    if day == 1:
        return {
            "theme": "Remote Work",
            "reading": {
                "title": "The Rise of the Digital Nomad",
                "text": "The traditional nine-to-five office model is increasingly being challenged by the rise of remote work. Enabled by high-speed internet and cloud computing, millions of professionals are choosing to work from home or co-working spaces. While this flexibility offers a better work-life balance and reduces commuting time, it also poses challenges for team cohesion and mental health, as the boundaries between professional and personal life become blurred.",
                "level": "B2",
                "questions": [{"q": "What is a major challenge of remote work mentioned?", "options": ["Lower productivity", "Reduced commuting time", "Blurred life boundaries"], "a": "c"}]
            },
            "writing": { "prompt": "Some people believe that working from home is more productive, while others disagree. Discuss both views and give your opinion." },
            "vocab": [
                {"word": "Cohesion", "meaning": "凝聚力；团结", "syn": "Unity", "ex": "Team cohesion is essential for project success."},
                {"word": "Commuting", "meaning": "通勤", "syn": "Traveling to work", "ex": "Commuting costs have risen significantly."},
                {"word": "Blurred", "meaning": "模糊的", "syn": "Fuzzy", "ex": "The lines between work and home are often blurred."},
                {"word": "Autonomy", "meaning": "自主权", "syn": "Independence", "ex": "Remote workers often enjoy greater autonomy."},
                {"word": "Infrastructure", "meaning": "基础设施", "syn": "Framework", "ex": "High-speed internet is a vital part of digital infrastructure."}
            ]
        }
    elif day == 2:
        return {
            "theme": "Sustainable Cities",
            "reading": {
                "title": "Urban Planning for a Greener Future",
                "text": "As the global population becomes more urbanized, the concept of 'sustainable cities' has gained momentum. These cities prioritize eco-friendly infrastructure, such as green roofs, integrated public transport systems, and renewable energy sources. The goal is to minimize the environmental footprint of urban living while enhancing the quality of life for residents through better air quality and more green spaces.",
                "level": "B2",
                "questions": [{"q": "What is the primary goal of sustainable cities?", "options": ["To increase population", "To minimize environmental footprint", "To build more skyscrapers"], "a": "b"}]
            },
            "writing": { "prompt": "Discuss the importance of green spaces in modern urban environments." },
            "vocab": [
                {"word": "Urbanization", "meaning": "城市化", "syn": "Urban growth", "ex": "Rapid urbanization is changing the landscape."},
                {"word": "Sustainability", "meaning": "可持续性", "syn": "Viability", "ex": "Sustainability is the core of modern planning."},
                {"word": "Momentum", "meaning": "势头；动力", "syn": "Impetus", "ex": "The green movement is gaining momentum."},
                {"word": "Footprint", "meaning": "足迹（环境影响）", "syn": "Impact", "ex": "We must reduce our carbon footprint."},
                {"word": "Integrated", "meaning": "整合的", "syn": "Combined", "ex": "An integrated transport system saves time."}
            ]
        }
    # Add more pro days if needed, but for now 2 is a good start. 
    # Let's add Day 3 too for AI.
    elif day == 3:
        return {
            "theme": "AI in Education",
            "reading": {
                "title": "Artificial Intelligence in the Classroom",
                "text": "AI is revolutionizing education by providing personalized learning experiences. Intelligent tutoring systems can adapt to a student's pace, identifying areas where they struggle and offering tailored feedback. However, critics argue that excessive reliance on AI might diminish the role of teachers and reduce critical human interaction in the learning process.",
                "level": "C1",
                "questions": [{"q": "How does AI personalize learning?", "options": ["By replacing teachers", "By adapting to student pace", "By giving harder exams"], "a": "b"}]
            },
            "writing": { "prompt": "Will AI eventually replace human teachers? Discuss your perspective." },
            "vocab": [
                {"word": "Revolutionize", "meaning": "彻底变革", "syn": "Transform", "ex": "AI will revolutionize the healthcare industry."},
                {"word": "Tailored", "meaning": "定制的", "syn": "Customized", "ex": "The course offers tailored support for students."},
                {"word": "Diminish", "meaning": "削弱；减少", "syn": "Decrease", "ex": "Poor lighting can diminish the quality of life."},
                {"word": "Interactive", "meaning": "互动的", "syn": "Engaging", "ex": "The new software is highly interactive."},
                {"word": "Reliance", "meaning": "依赖", "syn": "Dependence", "ex": "Over-reliance on technology can be risky."}
            ]
        }
    elif day == 4:
        return {
            "theme": "Digital Privacy",
            "reading": {
                "title": "Protecting Data in the Age of Big Data",
                "text": "As we navigate an increasingly digital world, the issue of 'digital privacy' has moved to the forefront of global discourse. Corporations and governments now have the ability to collect and analyze vast amounts of personal information, from browsing habits to physical locations. While big data can improve services and security, it also raises ethical questions about consent and the potential for surveillance to infringe upon individual freedoms.",
                "level": "B2",
                "questions": [{"q": "What is a major ethical concern of big data?", "options": ["Better services", "Invasion of privacy", "Faster internet"], "a": "b"}]
            },
            "writing": { "prompt": "Should individuals have more control over their personal data? Discuss the pros and cons of data collection." },
            "vocab": [
                {"word": "Discourse", "meaning": "论述；讨论", "syn": "Discussion", "ex": "Digital privacy is a key topic in modern political discourse."},
                {"word": "Infringe", "meaning": "侵犯", "syn": "Encroach", "ex": "New laws must not infringe upon the rights of citizens."},
                {"word": "Surveillance", "meaning": "监视", "syn": "Monitoring", "ex": "Mass surveillance has become a controversial tool."},
                {"word": "Consent", "meaning": "同意", "syn": "Permission", "ex": "Data should only be collected with the user's explicit consent."},
                {"word": "Ethical", "meaning": "伦理的", "syn": "Moral", "ex": "There are many ethical dilemmas in AI development."}
            ]
        }
    elif day == 5:
        return {
            "theme": "Renewable Energy",
            "reading": {
                "title": "The Global Transition to Green Power",
                "text": "The urgent need to combat climate change is driving a global shift from fossil fuels to renewable energy sources. Solar, wind, and hydroelectric power are becoming increasingly cost-competitive, offering a sustainable alternative to coal and oil. However, the transition faces obstacles, including the intermittency of weather-dependent sources and the need for significant investment in grid infrastructure and energy storage technologies.",
                "level": "B2",
                "questions": [{"q": "What is a main obstacle for renewable energy mentioned?", "options": ["High costs", "Weather dependence", "Lack of wind"], "a": "b"}]
            },
            "writing": { "prompt": "Is it realistic for the world to rely 100% on renewable energy? Discuss the challenges and benefits." },
            "vocab": [
                {"word": "Hydroelectric", "meaning": "水力发电的", "syn": "Water-powered", "ex": "Hydroelectric dams provide a clean source of electricity."},
                {"word": "Intermittency", "meaning": "间歇性", "syn": "Irregularity", "ex": "The intermittency of solar power is a challenge for grid stability."},
                {"word": "Competitive", "meaning": "有竞争力的", "syn": "Challenging", "ex": "Renewable energy is now cost-competitive with fossil fuels."},
                {"word": "Alternative", "meaning": "替代品", "syn": "Substitute", "ex": "Electric vehicles are a sustainable alternative to petrol cars."},
                {"word": "Transition", "meaning": "过渡", "syn": "Shift", "ex": "The transition to a low-carbon economy will take decades."}
            ]
        }
    elif day == 6:
        return {
            "theme": "Space Exploration",
            "reading": {
                "title": "Beyond Earth: The Value of Space Travel",
                "text": "Space exploration has long captured the human imagination, leading to groundbreaking scientific discoveries. Proponents argue that investing in space research drives technological innovation, provides insights into our place in the universe, and could eventually lead to the colonization of other planets. Critics, however, suggest that the billions spent on space missions could be better used to solve pressing problems on Earth, such as poverty and disease.",
                "level": "C1",
                "questions": [{"q": "What is one argument in favor of space exploration?", "options": ["It solves poverty", "It drives technological innovation", "It is very cheap"], "a": "b"}]
            },
            "writing": { "prompt": "Should governments spend billions on space exploration when there are many problems on Earth? Discuss both sides." },
            "vocab": [
                {"word": "Groundbreaking", "meaning": "开创性的", "syn": "Innovative", "ex": "The researchers made a groundbreaking discovery in physics."},
                {"word": "Proponent", "meaning": "支持者", "syn": "Advocate", "ex": "Proponents of solar energy emphasize its sustainability."},
                {"word": "Colonization", "meaning": "殖民；定居", "syn": "Settlement", "ex": "Space colonization remains a distant goal for humanity."},
                {"word": "Innovation", "meaning": "创新", "syn": "Creativity", "ex": "Technological innovation is key to economic growth."},
                {"word": "Insight", "meaning": "见解；洞察力", "syn": "Understanding", "ex": "The study provides valuable insights into human behavior."}
            ]
        }
    elif day == 7:
        return {
            "theme": "Cultural Heritage",
            "reading": {
                "title": "Preserving the Past for the Future",
                "text": "Cultural heritage, including historical monuments and traditional customs, is vital for a community's identity and sense of belonging. In an era of globalization, many local traditions are at risk of disappearing. Preserving these sites and practices is not only about honoring history but also about fostering cultural diversity and promoting sustainable tourism that benefits local economies.",
                "level": "B2",
                "questions": [{"q": "Why is cultural heritage important for a community?", "options": ["For globalization", "For identity and belonging", "For building monuments"], "a": "b"}]
            },
            "writing": { "prompt": "To what extent should governments be responsible for preserving historical buildings?" },
            "vocab": [
                {"word": "Preservation", "meaning": "保存；保护", "syn": "Conservation", "ex": "The preservation of historical sites is a national priority."},
                {"word": "Heritage", "meaning": "遗产", "syn": "Legacy", "ex": "Language is a vital part of our cultural heritage."},
                {"word": "Identity", "meaning": "身份；特征", "syn": "Character", "ex": "Traditions help maintain a community's unique identity."},
                {"word": "Globalization", "meaning": "全球化", "syn": "Integration", "ex": "Globalization has led to the spread of diverse cultures."},
                {"word": "Diversity", "meaning": "多样性", "syn": "Variety", "ex": "Cultural diversity enriches our society."}
            ]
        }
    else:
        # Placeholder for other days
        return {
            "theme": f"Topic Day {day}",
            "reading": { "title": f"Title Day {day}", "text": f"Placeholder text for Day {day}.", "level": "B2", "questions": [{"q": "Q?", "options": ["A", "B", "C"], "a": "a"}] },
            "writing": { "prompt": f"Discuss Day {day} topic." },
            "vocab": [{"word": f"Word{day}_{j}", "meaning": "释义", "syn": "Syn", "ex": "Ex"} for j in range(1, 6)]
        }

curriculum = {str(i): get_pro_day(i) for i in range(1, 31)}

grammar_categories = ["Tense", "Agreement", "Clause", "Voice", "Preposition"]
grammar_questions = []
for i in range(1, 301):
    category = grammar_categories[(i-1) % 5]
    grammar_questions.append({
        "id": i,
        "category": category,
        "sentence": f"I ________ (go) to the library yesterday. [Focus: {category}]",
        "answer": "went" if category == "Tense" else "answer",
        "explanation": f"In {category}, we must follow specific rules. For example..."
    })

data = {
    "curriculum": curriculum,
    "grammarQuestions": grammar_questions,
    "phoneticExercises": [
        {"id": 1, "title": "/i:/ vs /ɪ/", "sentence": "A sheep is on a ship", "words": ["sheep", "ship"]},
        {"id": 2, "title": "/æ/ vs /e/", "sentence": "The bad man is on the bed", "words": ["bad", "bed"]},
        {"id": 3, "title": "/θ/ vs /s/", "sentence": "I think the sink is full", "words": ["think", "sink"]}
    ],
    "chinglishPatterns": [
        {"regex": "very\\\\s+like", "name": "中式搭配", "correction": "really like", "explanation": "Very 不能修饰动词。"}
    ]
}

with open("data/data.js", "w") as f:
    f.write("window.IELTS_DATA = " + json.dumps(data, indent=4) + ";\n")

print("Generated professional data for first few days.")
