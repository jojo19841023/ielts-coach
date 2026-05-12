# IELTS Coach Full Module Experience Report

Run time: 2026-05-12T05:10:09.385Z

## Scope

I walked through Day 8 of the IELTS Coach app in a browser-like VM harness because the current sandbox blocks both local port binding and `file://` browser access. The walkthrough opened each module, submitted answers or completion actions, and recorded state changes.

## Overall Result

The app flow is usable end to end. Day 8 loads as `语言演化`, the date displays `2026年5月12日`, and the main study loop can move through grammar, phonetics, listening, vocabulary, reading, writing, speaking, error bank, weekly review, monthly assessment, dashboard, and sync settings.

After completing the run, 7/7 daily tasks can be completed. The first automated pass completed 6/7 because the runner called a wrong helper name for writing; a follow-up writing-only pass confirmed the writing module itself works.

## Module Notes

### Daily Plan

- Loads Day 8 with 7 tasks and 0 completed at fresh start.
- The task list structure is clear and maps to real modules.
- Minor testing issue: in the VM harness, the image/header area appends DOM children rather than inner text, so the automated text snapshot is sparse. This is a test harness limitation, not an app failure.

### Grammar

- Day 8 grammar session rendered 10 questions.
- Sample questions covered simple present, simple past, and present continuous.
- Completing the set marks the grammar task complete.
- Wrong answers correctly enter the error bank.

Experience: solid and useful. The feedback is direct enough for daily drilling.

Adjustment: keep this module as the model for other modules: clear prompt, immediate check, explanation, and error-bank integration.

### Phonetics

- Day 8 exercise: `/t/ vs /d/`, words `two` and `dog`, sentence `Two dogs played in the mud.`
- Completion action marks the task complete.

Experience: the training plan is clear, but real recording quality could not be verified in this sandbox.

Adjustment: add a visible fallback path such as `完成跟读（未录音）` so mobile/browser permission issues do not make the module feel blocked.

### Listening

- Day 8 listening scene: 医生预约.
- Transcript: `Your appointment is at half past three with Doctor Brown this afternoon.`
- The 3-step structure works: keywords, cloze, full answer.
- Correct answers produce a clear 3/3 completion message and mark the task complete.

Experience: strong daily micro-practice. The task is short enough to complete.

Adjustment: show accepted answer formats near the input. For example, `half past three / Doctor Brown` versus full sentence answers.

### Vocabulary

- Day 8 theme: 语言演化.
- New words: language, symbol, sign, gesture, handwriting, pictograph.
- Marking `language` as a hard word adds it to SRS.
- Completing the module marks vocabulary complete.

Experience: clean and practical.

Adjustment: add a tiny “review due in 2 days” confirmation after marking a hard word, ideally inline rather than only through alert.

### Reading

- Article: `Epigenetics: Beyond the DNA Sequence`.
- 3 questions rendered and accepted answers correctly.
- Completion requires at least 2/3 correct and worked in the test.

Experience: the 1 article + 3 questions structure is good for daily use.

Adjustment: answer feedback should include source-location evidence, not only `Answer: ...`. Add paragraph references or a short quote-length paraphrase of the supporting sentence.

### Writing

- Day 8 prompt: children learning foreign languages early versus later.
- Task type: Task 2 观点论述.
- Target: 260 words.
- Submitting an 89-word essay saved the essay and marked writing complete.
- The feedback correctly flagged word count as `89/260+`.

Experience: usable, but this is the module with the biggest quality gap.

Adjustments:

- Do not mark writing complete only because the diagnostic ran if the essay is far below target. Consider `submitted` versus `completed`.
- Add off-topic detection. A test answer about charts and language-learning habits still received normal feedback, even though the prompt was an opinion essay about children learning languages.
- Fix the high-score rewrite rules. The current replacement can corrupt normal phrases, for example turning `For example` into awkward text because `for` is globally replaced.
- Add a clearer rubric: task response, coherence, vocabulary, grammar, word count.

### Speaking

- Day 8 topic: Languages.
- Questions rendered correctly:
  - Do you enjoy learning languages?
  - What is difficult about learning a new language?
  - Do you think children should start learning languages early?
- A 52-word answer completed the task.
- Feedback counted sentences, words, and connectors.

Experience: useful for getting the learner to expand answers.

Adjustments:

- The generated `IELTS Version` can become unnatural because broad replacement rules over-edit normal text.
- Add a Part 1 style answer length target, such as 3 answers x 2-3 sentences.
- Separate “written draft” feedback from “spoken performance” feedback when no audio is recorded.

### Error Bank

- The grammar mistake from the intentional wrong answer appeared correctly.
- Error-bank display is clear and actionable.

Adjustment: add a quick “retry now” flow that pre-fills or directly opens a mini correction input for each error.

### Weekly Review

- Generates a weekly task sheet successfully.
- Pulls completed module count, grammar error count, vocab SRS count, vocabulary prompts, and grammar retest item.

Experience: useful, but still somewhat generic.

Adjustment: base the review on the last 7 days of `activityLog`, not mainly today’s current state.

### Monthly Assessment

- Generates the 30-day diagnostic successfully.
- Shows active days, streak, vocabulary pool, writing words, dimension scores, biggest risk, and next 30-day advice.

Experience: a good motivational checkpoint.

Adjustment: because this is not an official band estimate, keep the disclaimer visible and add “data confidence” based on how many active days exist.

### Dashboard

- Shows target countdown, phase, current estimate, core dimensions, heatmap, and streak.
- After the run it reflected 86% completion in the first pass; after writing follow-up the flow supports 100%.

Adjustment: if a writing submission is too short, dashboard should not inflate writing progress too much.

### Sync Settings

- Settings page renders upload/download buttons.
- Missing credentials alert appears: `请先配置 Token 和仓库路径！`

Experience: the entry is discoverable.

Adjustment: do not rely only on alert. Also write the same error into the page’s sync status area so mobile users can see what happened after the alert closes.

## Highest Priority Fixes

1. Fix writing/speaking high-score rewrite rules so common phrases are not corrupted by broad replacements.
2. Split writing `submitted` from writing `completed`, especially when word count is far below the target.
3. Add off-topic detection for writing prompts.
4. Add source-location evidence to reading answer feedback.
5. Show sync errors inline, not only through alert.
6. Make weekly/monthly review use real recent history more deeply.

## Suggested Product Direction

The app is already stable enough for daily self-use. The next quality jump is not more content; it is better judgment. The modules should become stricter about whether a task was truly completed, and feedback should become more evidence-based, especially for writing, speaking, and reading.
