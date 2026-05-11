(function () {
  const singularSubjects = [
    "My brother",
    "My father",
    "The teacher",
    "Our coach",
    "Her friend",
    "The student",
    "My cousin",
    "The nurse",
    "His manager",
    "The driver"
  ];

  const presentHabits = [
    { base: "drink", third: "drinks", object: "coffee at home", time: "morning" },
    { base: "walk", third: "walks", object: "to school", time: "weekday" },
    { base: "read", third: "reads", object: "English articles online", time: "evening" },
    { base: "take", third: "takes", object: "the bus to work", time: "day" },
    { base: "watch", third: "watches", object: "the news", time: "night" },
    { base: "do", third: "does", object: "her homework", time: "afternoon" },
    { base: "write", third: "writes", object: "new words in a notebook", time: "week" },
    { base: "cook", third: "cooks", object: "dinner for the family", time: "weekend" },
    { base: "study", third: "studies", object: "grammar for one hour", time: "day" },
    { base: "play", third: "plays", object: "badminton after class", time: "Friday" }
  ];

  const pastActions = [
    { base: "visit", past: "visited", object: "my grandmother", time: "last weekend" },
    { base: "watch", past: "watched", object: "a movie at home", time: "yesterday" },
    { base: "clean", past: "cleaned", object: "my room", time: "last night" },
    { base: "finish", past: "finished", object: "the report", time: "two days ago" },
    { base: "call", past: "called", object: "my teacher", time: "this morning" },
    { base: "cook", past: "cooked", object: "dinner for my parents", time: "last Sunday" },
    { base: "open", past: "opened", object: "the email", time: "yesterday afternoon" },
    { base: "review", past: "reviewed", object: "my notes", time: "before bed" },
    { base: "pack", past: "packed", object: "my bag", time: "before school" },
    { base: "answer", past: "answered", object: "three questions", time: "in class yesterday" }
  ];

  const continuousActions = [
    { be: "are", verb: "playing", subject: "The children", place: "in the park" },
    { be: "is", verb: "studying", subject: "My sister", place: "in her room" },
    { be: "are", verb: "waiting", subject: "The students", place: "outside the library" },
    { be: "is", verb: "cooking", subject: "My mother", place: "in the kitchen" },
    { be: "are", verb: "running", subject: "The players", place: "on the field" },
    { be: "is", verb: "talking", subject: "The teacher", place: "to the class" },
    { be: "are", verb: "watching", subject: "My friends", place: "a video online" },
    { be: "is", verb: "writing", subject: "Our manager", place: "an email now" },
    { be: "are", verb: "practicing", subject: "The singers", place: "for tonight's show" },
    { be: "is", verb: "reading", subject: "His cousin", place: "the instructions" }
  ];

  const presentPerfectScenarios = [
    { subject: "I", incorrect: "have went", correct: "have gone", rest: "to that cafe three times" },
    { subject: "She", incorrect: "has visit", correct: "has visited", rest: "London twice" },
    { subject: "We", incorrect: "have see", correct: "have seen", rest: "this movie before" },
    { subject: "He", incorrect: "has finish", correct: "has finished", rest: "his homework already" },
    { subject: "They", incorrect: "have speak", correct: "have spoken", rest: "to the manager" },
    { subject: "I", incorrect: "have never try", correct: "have never tried", rest: "Japanese snacks" },
    { subject: "She", incorrect: "has just arrive", correct: "has just arrived", rest: "at the station" },
    { subject: "We", incorrect: "have not start", correct: "have not started", rest: "the meeting yet" },
    { subject: "He", incorrect: "has live", correct: "has lived", rest: "here for five years" },
    { subject: "They", incorrect: "have already eat", correct: "have already eaten", rest: "lunch" }
  ];

  const agreementScenarios = [
    { subject: "My teacher", incorrect: "give", correct: "gives", rest: "us useful feedback" },
    { subject: "The bus", incorrect: "stop", correct: "stops", rest: "near my office" },
    { subject: "Her brother", incorrect: "study", correct: "studies", rest: "engineering" },
    { subject: "The shop", incorrect: "open", correct: "opens", rest: "at nine o'clock" },
    { subject: "Our coach", incorrect: "encourage", correct: "encourages", rest: "the team every day" },
    { subject: "The student", incorrect: "need", correct: "needs", rest: "more time" },
    { subject: "My cousin", incorrect: "enjoy", correct: "enjoys", rest: "reading history books" },
    { subject: "The restaurant", incorrect: "serve", correct: "serves", rest: "healthy meals" },
    { subject: "His manager", incorrect: "check", correct: "checks", rest: "the report carefully" },
    { subject: "The driver", incorrect: "leave", correct: "leaves", rest: "early every morning" }
  ];

  const beVerbScenarios = [
    { subject: "I", answer: "am", rest: "tired after my English class" },
    { subject: "She", answer: "is", rest: "ready for the interview" },
    { subject: "They", answer: "are", rest: "late again today" },
    { subject: "We", answer: "are", rest: "happy with the result" },
    { subject: "He", answer: "is", rest: "at the doctor's office" },
    { subject: "My parents", answer: "are", rest: "at home now" },
    { subject: "The soup", answer: "is", rest: "too hot to eat" },
    { subject: "You", answer: "are", rest: "very patient" },
    { subject: "The children", answer: "are", rest: "in the classroom" },
    { subject: "Her phone", answer: "is", rest: "on the table" }
  ];

  const articleScenarios = [
    { article: "a", rest: "new dictionary for school" },
    { article: "an", rest: "apple before class" },
    { article: "the", rest: "sun in the afternoon" },
    { article: "a", rest: "small gift for my friend" },
    { article: "an", rest: "English podcast on my phone" },
    { article: "the", rest: "kitchen in our apartment" },
    { article: "a", rest: "useful website for grammar practice" },
    { article: "an", rest: "old umbrella near the door" },
    { article: "the", rest: "library next to the bank" },
    { article: "a", rest: "quiet place to study" }
  ];

  const prepositionScenarios = [
    { answer: "at", sentence: "We usually have dinner ____ 7 o'clock." },
    { answer: "in", sentence: "My parents moved here ____ 2018." },
    { answer: "on", sentence: "The meeting is ____ Monday morning." },
    { answer: "to", sentence: "She walked ____ the station after work." },
    { answer: "for", sentence: "I studied English ____ two hours last night." },
    { answer: "from", sentence: "This email is ____ our new teacher." },
    { answer: "in", sentence: "There is some milk ____ the fridge." },
    { answer: "at", sentence: "He is waiting ____ the bus stop." },
    { answer: "on", sentence: "My notebook is ____ the desk." },
    { answer: "to", sentence: "We listened ____ the manager carefully." }
  ];

  const conjunctionScenarios = [
    { answer: "because", sentence: "I stayed at home ____ it was raining heavily." },
    { answer: "although", sentence: "____ she was tired, she finished her homework." },
    { answer: "when", sentence: "Please call me ____ you arrive at the station." },
    { answer: "if", sentence: "You can improve faster ____ you practice every day." },
    { answer: "but", sentence: "He wanted to go out, ____ he had too much work." },
    { answer: "because", sentence: "She was happy ____ she passed the test." },
    { answer: "when", sentence: "I was making notes ____ the teacher explained the rule." },
    { answer: "if", sentence: "____ you need help, ask your coach." },
    { answer: "although", sentence: "____ the task was hard, they completed it on time." },
    { answer: "but", sentence: "The room is small, ____ it is very comfortable." }
  ];

  const pronounScenarios = [
    { incorrect: "Mary likes her teacher because she is kind. She always listens to the lesson carefully. (the first 'She' refers to Mary)", correct: "Mary likes her teacher because the teacher is kind. She always listens to the lesson carefully." },
    { incorrect: "Tom spoke to Jack after he finished the class. (he = Tom)", correct: "Tom spoke to Jack after Tom finished the class." },
    { incorrect: "My sister gave my mother her bag before she left. (she = my sister)", correct: "My sister gave my mother her bag before my sister left." },
    { incorrect: "The students thanked the coach because they was helpful.", correct: "The students thanked the coach because he was helpful." },
    { incorrect: "My parents said she would arrive at six, but they meant my aunt.", correct: "My parents said my aunt would arrive at six." },
    { incorrect: "The boy met the doctor after he called. (he = the doctor)", correct: "The boy met the doctor after the doctor called." },
    { incorrect: "Linda told Anna that she should rest more. (she = Anna)", correct: "Linda told Anna that Anna should rest more." },
    { incorrect: "The manager emailed the designer because she needed a new file. (she = the manager)", correct: "The manager emailed the designer because the manager needed a new file." },
    { incorrect: "My cousin helped my brother when he was sick. (he = my brother)", correct: "My cousin helped my brother when my brother was sick." },
    { incorrect: "The teacher reminded the student to bring their book.", correct: "The teacher reminded the student to bring his or her book." }
  ];

  function buildSimplePresent(id, seed) {
    const subject = singularSubjects[seed % singularSubjects.length];
    const action = presentHabits[seed % presentHabits.length];
    return {
      id,
      level: "A2",
      category: "Simple Present",
      grammarPoint: "simple_present",
      skillTarget: "speaking_accuracy",
      theme: "daily_life",
      promptType: "fill_blank",
      sentence: `${subject} ____ ${action.object} every ${action.time}. (${action.base})`,
      answer: action.third,
      explanation: `Use the simple present for habits. '${subject}' is third-person singular, so the verb should be '${action.third}'.`,
      commonMistake: `Using '${action.base}' instead of the third-person singular form '${action.third}'.`,
      sourceType: "curated",
      status: "active"
    };
  }

  function buildSimplePast(id, seed) {
    const action = pastActions[seed % pastActions.length];
    return {
      id,
      level: "A2",
      category: "Simple Past",
      grammarPoint: "simple_past",
      skillTarget: "speaking_accuracy",
      theme: "past_experience_and_change",
      promptType: "error_correction",
      sentence: `Correct the sentence: I ${action.base} ${action.object} ${action.time}.`,
      answer: `I ${action.past} ${action.object} ${action.time}.`,
      explanation: `The time phrase '${action.time}' shows that the action is finished in the past, so the verb should be in the simple past: '${action.past}'.`,
      commonMistake: `Keeping the verb in the base form '${action.base}' even when the sentence has a clear past-time signal.`,
      sourceType: "curated",
      status: "active"
    };
  }

  function buildPresentContinuous(id, seed) {
    const action = continuousActions[seed % continuousActions.length];
    return {
      id,
      level: "A2",
      category: "Present Continuous",
      grammarPoint: "present_continuous",
      skillTarget: "speaking_accuracy",
      theme: "health_and_habits",
      promptType: "fill_blank",
      sentence: `Look! ${action.subject} ____ ${action.place}. (${action.verb.replace(/ing$/, "")})`,
      answer: `${action.be} ${action.verb}`,
      explanation: `The signal word 'Look!' shows the action is happening now. Use the present continuous: '${action.be} ${action.verb}'.`,
      commonMistake: "Forgetting the be verb or using the base verb instead of the -ing form.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildPresentPerfect(id, seed) {
    const action = presentPerfectScenarios[seed % presentPerfectScenarios.length];
    return {
      id,
      level: "B1",
      category: "Present Perfect",
      grammarPoint: "present_perfect",
      skillTarget: "writing_accuracy",
      theme: "past_experience_and_change",
      promptType: "sentence_improvement",
      sentence: `Improve the sentence: ${action.subject} ${action.incorrect} ${action.rest}.`,
      answer: `${action.subject} ${action.correct} ${action.rest}.`,
      explanation: `Use the present perfect for experience, recent change, or actions connected to the present. The correct form here is '${action.correct}'.`,
      commonMistake: "Using the wrong past participle or leaving the verb in its base form after 'have' or 'has'.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildAgreement(id, seed) {
    const action = agreementScenarios[seed % agreementScenarios.length];
    return {
      id,
      level: "A2",
      category: "Subject-Verb Agreement",
      grammarPoint: "subject_verb_agreement",
      skillTarget: "writing_accuracy",
      theme: "school_and_learning",
      promptType: "error_correction",
      sentence: `Correct the sentence: ${action.subject} ${action.incorrect} ${action.rest}.`,
      answer: `${action.subject} ${action.correct} ${action.rest}.`,
      explanation: `The subject '${action.subject}' is singular, so the verb must agree with it. Use '${action.correct}' in the simple present tense.`,
      commonMistake: "Forgetting to change the verb when the subject is singular.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildBeVerb(id, seed) {
    const action = beVerbScenarios[seed % beVerbScenarios.length];
    return {
      id,
      level: "A2",
      category: "Be Verb Usage",
      grammarPoint: "be_verb_usage",
      skillTarget: "speaking_accuracy",
      theme: "daily_life",
      promptType: "fill_blank",
      sentence: `${action.subject} ____ ${action.rest}.`,
      answer: action.answer,
      explanation: `Choose the be verb that matches the subject. '${action.subject}' takes '${action.answer}' in this sentence.`,
      commonMistake: "Mixing up 'am', 'is', and 'are' because the subject-be verb pairing is not yet automatic.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildArticles(id, seed) {
    const action = articleScenarios[seed % articleScenarios.length];
    return {
      id,
      level: "A2",
      category: "Articles",
      grammarPoint: "articles",
      skillTarget: "writing_accuracy",
      theme: "school_and_learning",
      promptType: "fill_blank",
      sentence: `She wants to buy ____ ${action.rest}.`,
      answer: action.article,
      explanation: `Use the article that matches the noun phrase. Here '${action.article}' is needed before the singular noun phrase.`,
      commonMistake: "Leaving the article out or choosing 'the' when the noun is not specific yet.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildPrepositions(id, seed) {
    const action = prepositionScenarios[seed % prepositionScenarios.length];
    return {
      id,
      level: "A2",
      category: "Basic Prepositions",
      grammarPoint: "basic_prepositions",
      skillTarget: "writing_accuracy",
      theme: "daily_life",
      promptType: "fill_blank",
      sentence: action.sentence,
      answer: action.answer,
      explanation: `Use '${action.answer}' because it is the natural preposition in this context.`,
      commonMistake: "Using another common preposition that looks familiar but does not fit this time or place expression.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildConjunctions(id, seed) {
    const action = conjunctionScenarios[seed % conjunctionScenarios.length];
    return {
      id,
      level: "A2",
      category: "Basic Conjunctions",
      grammarPoint: "basic_conjunctions",
      skillTarget: "writing_accuracy",
      theme: "past_experience_and_change",
      promptType: "fill_blank",
      sentence: action.sentence,
      answer: action.answer,
      explanation: `Use '${action.answer}' because it shows the logical relationship needed in the sentence.`,
      commonMistake: "Choosing a linker that is grammatically possible in other sentences but does not express the meaning here.",
      sourceType: "curated",
      status: "active"
    };
  }

  function buildPronouns(id, seed) {
    const action = pronounScenarios[seed % pronounScenarios.length];
    return {
      id,
      level: "B1",
      category: "Pronouns and Reference",
      grammarPoint: "pronouns_and_reference",
      skillTarget: "speaking_accuracy",
      theme: "family_and_home",
      promptType: "sentence_improvement",
      sentence: `Improve the sentence: ${action.incorrect}`,
      answer: action.correct,
      explanation: "The original sentence has an unclear or incorrect pronoun reference. Rewrite it so the reader can clearly understand who or what the pronoun refers to.",
      commonMistake: "Using 'he', 'she', 'they', or 'it' when the listener cannot tell the exact reference.",
      sourceType: "curated",
      status: "active"
    };
  }

  const builders = [
    buildSimplePresent,
    buildSimplePast,
    buildPresentContinuous,
    buildPresentPerfect,
    buildAgreement,
    buildBeVerb,
    buildArticles,
    buildPrepositions,
    buildConjunctions,
    buildPronouns
  ];

  const questions = [];
  let id = 1001;

  for (let day = 1; day <= 30; day += 1) {
    for (let slot = 0; slot < builders.length; slot += 1) {
      const seed = (day - 1) + slot;
      const question = builders[slot](id, seed);
      question.day = day;
      questions.push(question);
      id += 1;
    }
  }

  window.IELTS_GRAMMAR_QUESTIONS_V2 = questions;

  if (window.IELTS_DATA && Array.isArray(window.IELTS_DATA.grammarQuestions)) {
    window.IELTS_DATA.grammarQuestions = questions;
  }

  if (typeof module !== "undefined") {
    module.exports = questions;
  }
})();
