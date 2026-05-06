import json

themes = ["Remote Work", "Sustainable Cities", "AI in Education", "Space Exploration", "Global Tourism", "Modern Health", "Wildlife Conservation", "Digital Privacy", "Renewable Energy", "Future of Transport", "Cultural Heritage", "Ocean Preservation", "Social Media Impact", "Fast Fashion", "Food Security", "Aging Population", "Gig Economy", "Space Debris", "Universal Basic Income", "Genetic Engineering", "Urban Sprawl", "Water Scarcity", "Cybersecurity", "Mental Health", "Automation & Jobs", "E-Waste", "Microplastics", "Alternative Medicine", "Cryptocurrency", "Space Tourism"]

grammar_categories = ["Tense", "Agreement", "Clause", "Voice", "Preposition"]

curriculum = {}
for i in range(1, 31):
    curriculum[i] = {
        "theme": themes[i-1],
        "reading": {
            "title": f"The Evolution of {themes[i-1]}",
            "text": f"Passage about {themes[i-1]} goes here. This is a placeholder for Day {i}.",
            "level": "B1" if i <= 10 else ("B2" if i <= 20 else "C1"),
            "questions": [{"q": "What is the main topic?", "options": [themes[i-1], "Other", "Unknown"], "a": "a"}]
        },
        "writing": { "prompt": f"Discuss the advantages and disadvantages of {themes[i-1]}." },
        "vocab": [
            {"word": f"Vocab{i}_1", "meaning": "释义1", "syn": "Syn1", "ex": "Example 1"},
            {"word": f"Vocab{i}_2", "meaning": "释义2", "syn": "Syn2", "ex": "Example 2"},
            {"word": f"Vocab{i}_3", "meaning": "释义3", "syn": "Syn3", "ex": "Example 3"},
            {"word": f"Vocab{i}_4", "meaning": "释义4", "syn": "Syn4", "ex": "Example 4"},
            {"word": f"Vocab{i}_5", "meaning": "释义5", "syn": "Syn5", "ex": "Example 5"}
        ]
    }

grammar_questions = []
for i in range(1, 301):
    category = grammar_categories[(i-1) % 5]
    grammar_questions.append({
        "id": i,
        "category": category,
        "sentence": f"Question {i} focusing on {category} ________.",
        "answer": "answer",
        "explanation": f"Explanation for {category} rule."
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

print("Generated data/data.js with 30 days of content and 300 grammar questions.")
