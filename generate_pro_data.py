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
