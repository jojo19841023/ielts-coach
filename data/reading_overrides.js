(function applyReadingOverrides() {
    if (!window.IELTS_DATA || !window.IELTS_DATA.curriculum) return;

    const tfngOptions = ['True/Yes/Correct', 'False/No/Incorrect', 'Not Given'];
    const assignQuestions = (dayKeys, questions) => {
        dayKeys.forEach((dayKey) => {
            overrides[dayKey] = {
                questions: questions.map((question) => ({
                    ...question,
                    options: Array.isArray(question.options) ? [...question.options] : []
                }))
            };
        });
    };

    const overrides = {
        1: {
            questions: [
                {
                    question: 'What was the main problem that pushed Charles Pearson to propose an underground railway?',
                    options: [
                        'Severe traffic congestion on London streets',
                        'A shortage of private investors',
                        'Smoke from deep-level electric trains',
                        'Damage caused by wartime bombing'
                    ],
                    explanation: 'Answer: Severe traffic congestion on London streets'
                },
                {
                    question: 'The cut-and-cover construction method severely disrupted street-level businesses.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'Who later unified most of the separate underground companies and accelerated electrification?',
                    options: [
                        'Charles Yerkes',
                        'Benjamin Libet',
                        'Valerios Stais',
                        'James Henry Greathead'
                    ],
                    explanation: 'Answer: Charles Yerkes'
                }
            ]
        },
        2: {
            questions: [
                {
                    question: 'What discovery made Wallace Clement Sabine a key figure in modern room acoustics?',
                    options: [
                        'He showed that reverberation time depends on room volume and surface absorption',
                        'He proved vineyard halls always outperform shoebox halls',
                        'He invented electric traction for underground trains',
                        'He found that psychology has no effect on sound perception'
                    ],
                    explanation: 'Answer: He showed that reverberation time depends on room volume and surface absorption'
                },
                {
                    question: 'A longer reverberation time is usually preferred for rapid speech because it increases clarity.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'Why do traditional shoebox concert halls often sound especially spacious to listeners?',
                    options: [
                        'Their side walls create helpful lateral reflections',
                        'They remove all reflected sound from the ceiling',
                        'They rely entirely on digital sound processing',
                        'Their concrete surfaces absorb almost every echo'
                    ],
                    explanation: 'Answer: Their side walls create helpful lateral reflections'
                }
            ]
        },
        3: {
            questions: [
                {
                    question: 'Why did evolutionary biologists originally find animal play puzzling?',
                    options: [
                        'It appears costly and risky despite natural selection favouring efficient behaviour',
                        'It only happens in captivity and never in the wild',
                        'It prevents young animals from forming social groups',
                        'It is always more useful than hunting practice'
                    ],
                    explanation: 'Answer: It appears costly and risky despite natural selection favouring efficient behaviour'
                },
                {
                    question: 'Burghardt’s framework says true play should be voluntary and repeated when the animal is healthy.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'According to the cognitive flexibility hypothesis, what is play mainly preparing animals for?',
                    options: [
                        'Recovering from unexpected shocks and instability',
                        'Avoiding all social contact in adulthood',
                        'Reducing dopamine release during stress',
                        'Living only in highly predictable environments'
                    ],
                    explanation: 'Answer: Recovering from unexpected shocks and instability'
                }
            ]
        },
        4: {
            questions: [
                {
                    question: 'What first revealed that the corroded Antikythera object was a mechanical device rather than a statue fragment?',
                    options: [
                        'A small gear wheel noticed by Valerios Stais',
                        'A Roman inscription describing its use',
                        'A fully preserved wooden casing',
                        'A replica built by modern engineers'
                    ],
                    explanation: 'Answer: A small gear wheel noticed by Valerios Stais'
                },
                {
                    question: 'The article says early scholars thought ancient Greeks definitely had the engineering skill to build the mechanism.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'What broader historical point does the article make about the mechanism?',
                    options: [
                        'It forces historians to rethink the technological sophistication of the ancient world',
                        'It proves Roman warfare directly improved Greek astronomy',
                        'It shows all later European clocks copied one surviving machine',
                        'It confirms the device was made only for religious ceremonies'
                    ],
                    explanation: 'Answer: It forces historians to rethink the technological sophistication of the ancient world'
                }
            ]
        },
        7: {
            questions: [
                {
                    question: 'Which technological advance in 2006 allowed researchers to see tiny internal details without dismantling the mechanism?',
                    options: [
                        'Microfocus X-ray CT and polynomial texture mapping',
                        'Steam-powered excavation tools',
                        'Satellite navigation software',
                        'Digital audio reconstruction'
                    ],
                    explanation: 'Answer: Microfocus X-ray CT and polynomial texture mapping'
                },
                {
                    question: 'The rear dials of the mechanism included cycles linked to eclipses and even the Panhellenic Games.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'What unresolved issue is highlighted at the end of the article?',
                    options: [
                        'Whether the device was unique or the lone survivor of a wider tradition',
                        'Whether the wreck actually belonged to medieval traders',
                        'Whether the mechanism used electricity to move its gears',
                        'Whether archaeologists refused to study the inscriptions'
                    ],
                    explanation: 'Answer: Whether the device was unique or the lone survivor of a wider tradition'
                }
            ]
        },
        8: {
            questions: [
                {
                    question: 'What is the article’s central point about epigenetics?',
                    options: [
                        'Gene expression can be altered without changing the DNA sequence itself',
                        'All inherited traits are fixed permanently at birth',
                        'Epigenetics disproves the existence of histones',
                        'Only psychological stress affects the epigenome'
                    ],
                    explanation: 'Answer: Gene expression can be altered without changing the DNA sequence itself'
                },
                {
                    question: 'People exposed to famine before birth in the Dutch Hunger Winter were later found to have higher rates of several diseases.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'Why are epi-drugs seen as a promising medical frontier?',
                    options: [
                        'Because some harmful epigenetic changes can potentially be reversed',
                        'Because they permanently replace the entire genome',
                        'Because they remove the need for any cancer screening',
                        'Because they stop all inheritance between generations'
                    ],
                    explanation: 'Answer: Because some harmful epigenetic changes can potentially be reversed'
                }
            ]
        },
        9: {
            questions: [
                {
                    question: 'What does the article suggest about the brain’s handling of time perception?',
                    options: [
                        'It relies on distributed neural systems rather than one single master clock',
                        'It depends only on the hippocampus for all timing tasks',
                        'It is unaffected by dopamine or emotional state',
                        'It works the same way across all cultures and situations'
                    ],
                    explanation: 'Answer: It relies on distributed neural systems rather than one single master clock'
                },
                {
                    question: 'A frightening event can seem longer because the brain records it with unusually dense memories.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'According to the article, how may digital hyper-connectivity affect temporal experience?',
                    options: [
                        'It can fragment attention and weaken deep temporal immersion',
                        'It restores long flow states in almost all users',
                        'It eliminates anxiety about urgency and waiting',
                        'It makes routine years feel denser with memory'
                    ],
                    explanation: 'Answer: It can fragment attention and weaken deep temporal immersion'
                }
            ]
        },
        10: {
            questions: [
                {
                    question: 'Which evidence gave Desset’s team a reliable phonetic starting point for decipherment?',
                    options: [
                        'Bilingual inscriptions on the gunagi vessels',
                        'A newly discovered Rosetta Stone',
                        'Agricultural tax records from Susa',
                        'Greek translations written on clay tablets'
                    ],
                    explanation: 'Answer: Bilingual inscriptions on the gunagi vessels'
                },
                {
                    question: 'The decipherment supported the idea that writing developed only once in southern Mesopotamia.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'After the script was unlocked, what major challenge still remained?',
                    options: [
                        'Reconstructing the Elamite lexicon and syntax',
                        'Finding proof that Linear Elamite never existed',
                        'Replacing cuneiform with a more modern script',
                        'Demonstrating that the inscriptions were forged'
                    ],
                    explanation: 'Answer: Reconstructing the Elamite lexicon and syntax'
                }
            ]
        },
        11: {
            questions: [
                {
                    question: 'What is the main point of paragraph C in the article about the attention economy?',
                    options: [
                        'Random rewards keep users checking platforms compulsively',
                        'European lawmakers already banned social media notifications',
                        'The human brain can process unlimited digital information',
                        'Advertising has disappeared from major platforms'
                    ],
                    explanation: 'Answer: Random rewards keep users checking platforms compulsively'
                },
                {
                    question: 'The article says the human brain can process an unlimited amount of sensory input without overload.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'Which response is described in paragraph F?',
                    options: [
                        'Proposals such as a Right to Disconnect and tighter rules on persuasive design',
                        'A plan to replace all algorithms with human editors',
                        'A decision to reward apps only for longer screen time',
                        'A global agreement to end digital advertising immediately'
                    ],
                    explanation: 'Answer: Proposals such as a Right to Disconnect and tighter rules on persuasive design'
                }
            ]
        },
        12: {
            questions: [
                {
                    question: 'According to the article, how do birds such as the European Robin detect the Earth’s magnetic field?',
                    options: [
                        'Through entangled electrons in the cryptochrome protein',
                        'Through pressure changes in the inner ear',
                        'By memorising visual landmarks alone',
                        'By converting magnetic waves into body heat'
                    ],
                    explanation: 'Answer: Through entangled electrons in the cryptochrome protein'
                },
                {
                    question: 'Quantum tunneling helps some essential biological processes proceed at workable speeds.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'What controversial idea is mentioned about the sense of smell?',
                    options: [
                        'Olfactory receptors may work like tiny quantum spectrometers',
                        'Smell depends only on the colour of molecules',
                        'Humans lost the ability to smell isotopes',
                        'All odours are processed in the same receptor'
                    ],
                    explanation: 'Answer: Olfactory receptors may work like tiny quantum spectrometers'
                }
            ]
        },
        19: {
            questions: [
                {
                    question: 'Valerios Stais noticed a gear wheel in the bronze fragments two years after the shipwreck was discovered.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'Derek J. de Solla Price physically dismantled the bronze fragments before beginning his analysis.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'Researchers have conclusively proved that the mechanism was manufactured on Rhodes.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                }
            ]
        },
        20: {
            questions: [
                {
                    question: 'Epigenetic changes work by altering the underlying DNA sequence itself.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'People exposed to famine before birth in the Dutch Hunger Winter were later found to have higher rates of several diseases.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'Some epigenetic drugs are already being used in clinical medicine.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                }
            ]
        },
        21: {
            questions: [
                {
                    question: 'Human time perception is controlled by one central biological clock in the brain.',
                    options: tfngOptions,
                    answer: 1,
                    explanation: 'Answer: FALSE'
                },
                {
                    question: 'A frightening event can seem longer because the brain records it with unusually dense memories.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                },
                {
                    question: 'In polychronic cultures, relationships often matter more than strict schedules.',
                    options: tfngOptions,
                    answer: 0,
                    explanation: 'Answer: TRUE'
                }
            ]
        }
    };

    assignQuestions([13, 25], overrides[1].questions);
    assignQuestions([14, 26], overrides[2].questions);
    assignQuestions([15, 27], overrides[3].questions);
    assignQuestions([16, 28], overrides[4].questions);
    assignQuestions([5, 17, 29], [
        {
            question: 'What is the main benefit mycorrhizal fungi provide to plants in the article?',
            options: [
                'They extend access to water and chemically bound minerals beyond the roots',
                'They replace the need for sunlight during photosynthesis',
                'They prevent all crop diseases without exception',
                'They turn synthetic fertiliser directly into glomalin'
            ],
            explanation: 'Answer: They extend access to water and chemically bound minerals beyond the roots'
        },
        {
            question: 'Heavy use of synthetic fertilisers can cause plants to reduce the root exudates that feed their microbial partners.',
            options: tfngOptions,
            answer: 0,
            explanation: 'Answer: TRUE'
        },
        {
            question: 'What short-term difficulty is mentioned when farmers switch to regenerative methods?',
            options: [
                'Crop yields often drop before the soil system recovers',
                'Healthy soil immediately becomes hydrophobic',
                'Farmers must stop using all roots and cover crops',
                'Microbial mapping becomes impossible to apply'
            ],
            explanation: 'Answer: Crop yields often drop before the soil system recovers'
        }
    ]);
    assignQuestions([6, 18, 30], [
        {
            question: 'What did Libet detect before participants reported conscious awareness of deciding to move?',
            options: [
                'A readiness potential in the motor cortex',
                'A complete shutdown of cortical activity',
                'A spoken verbal explanation from participants',
                'A measurable drop in heart rate'
            ],
            explanation: 'Answer: A readiness potential in the motor cortex'
        },
        {
            question: 'Libet completely rejected the possibility of any conscious veto over an action.',
            options: tfngOptions,
            answer: 1,
            explanation: 'Answer: FALSE'
        },
        {
            question: 'Why do some critics remain cautious about deterministic conclusions from these experiments?',
            options: [
                'Because simple lab tasks may not reflect complex real-life decisions',
                'Because EEG and fMRI can only study language, not action',
                'Because legal systems already abandoned the idea of free will',
                'Because no participants ever moved during the studies'
            ],
            explanation: 'Answer: Because simple lab tasks may not reflect complex real-life decisions'
        }
    ]);
    assignQuestions([19], overrides[7].questions);
    assignQuestions([20], overrides[8].questions);
    assignQuestions([21], overrides[9].questions);
    assignQuestions([22], overrides[10].questions);
    assignQuestions([23], overrides[11].questions);
    assignQuestions([24], overrides[12].questions);

    Object.values(window.IELTS_DATA.curriculum).forEach((day) => {
        if (!day || !day.reading || !Array.isArray(day.reading.questions)) return;
        if (day.reading.questions.length > 3) {
            day.reading.questions = day.reading.questions.slice(0, 3);
        }
    });

    Object.entries(overrides).forEach(([dayKey, patch]) => {
        const day = window.IELTS_DATA.curriculum[dayKey];
        if (!day || !day.reading) return;
        day.reading.questions = patch.questions;
    });
})();
