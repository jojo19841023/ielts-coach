(function applyVocabularyOverrides() {
    if (!window.IELTS_DATA || !window.IELTS_DATA.curriculum) return;

    const overrides = {
        1: {
            vocabulary: [
                { word: 'atmosphere', example: 'The classroom atmosphere became tense before the final exam.' },
                { word: 'hydrosphere', meaning: '水圈', example: 'The hydrosphere includes rivers, lakes, and oceans.' },
                { word: 'lithosphere', meaning: '岩石圈', example: 'Earthquakes affect the lithosphere beneath the surface.' },
                { word: 'oxygen', example: 'Plants release oxygen into the air during photosynthesis.' },
                { word: 'oxide', example: 'Scientists studied the metal oxide in the laboratory.' },
                { word: 'carbon dioxied', word_new: 'carbon dioxide', example: 'Carbon dioxide levels rise when more fossil fuels are burned.' },
                { word: 'hydrogen', example: 'Hydrogen is the lightest element in the universe.' },
                { word: 'core', example: 'The Earth has a hot core beneath the mantle.' },
                { word: 'crust', example: 'The Earth’s crust is thinner under the oceans than under the continents.' },
                { word: 'mantle', example: 'The mantle lies between the crust and the core.' }
            ]
        },
        2: {
            vocabulary: [
                { word: 'photosynthesis', example: 'Photosynthesis allows plants to turn sunlight into energy.' },
                { word: 'respire', example: 'All living organisms need to respire to survive.' },
                { word: 'dioxide', example: 'Carbon dioxide is one of the most common greenhouse gases.' },
                { word: 'vagetation', word_new: 'vegetation', example: 'There is very little vegetation in the driest deserts.' },
                { word: 'herb', example: 'The farmer grows each herb in a separate section of the garden.' },
                { word: 'perennial', example: 'This perennial plant can survive for many years.' },
                { word: 'botany', example: 'She decided to study botany at university.' },
                { word: 'ecology', example: 'Ecology examines how living things interact with their environment.' },
                { word: 'ecosystem', example: 'A healthy ecosystem depends on balance among plants, animals, and climate.' },
                { word: 'eco-friendly', example: 'Many shoppers now prefer eco-friendly packaging.' }
            ]
        },
        3: {
            vocabulary: [
                { word: 'biologist', example: 'The biologist recorded how the species adapted to its environment.' },
                { word: 'zoologist', example: 'A zoologist may spend years studying one animal group.' },
                { word: 'ecologist', example: 'The ecologist warned that pollution was damaging the wetland.' },
                { word: 'botanist', example: 'The botanist identified several rare plants in the forest.' },
                { word: 'mammal', example: 'A whale is a mammal even though it lives in the ocean.' },
                { word: 'primate', example: 'Humans belong to the primate family.' },
                { word: 'vertebrate', example: 'A fish is a vertebrate because it has a backbone.' },
                { word: 'pretail', word_new: 'reptile', meaning: '爬行动物', example: 'A snake is a reptile that depends on external heat.' },
                { word: 'amphibian', example: 'An amphibian can often live both in water and on land.' },
                { word: 'carnivore', example: 'A carnivore mainly eats other animals.' }
            ]
        },
        4: {
            vocabulary: [
                { word: 'galaxy', example: 'Our solar system is part of the Milky Way galaxy.' },
                { word: 'cosmos', example: 'Scientists still know little about the full scale of the cosmos.' },
                { word: 'universe', example: 'The universe contains countless stars and planets.' },
                { word: 'interstellar', example: 'The probe was designed to collect interstellar data.' },
                { word: 'terrestrial', example: 'Some terrestrial animals struggle in extreme desert climates.' },
                { word: 'celestial', example: 'Ancient people carefully observed celestial movements.' },
                { word: 'astronomy', example: 'Astronomy helps us understand planets, stars, and galaxies.' },
                { word: 'astrology', example: 'Astrology is not the same as scientific astronomy.' },
                { word: 'astronaut', example: 'The astronaut spent six months on the space station.' },
                { word: 'comet', example: 'The comet left a bright trail across the night sky.' }
            ]
        },
        5: {
            vocabulary: [
                { word: 'education', meaning: '教育', example: 'Education can expand opportunities for young people.' },
                { word: 'primary', meaning: '初级的；小学教育的', example: 'Most children begin primary education at an early age.' },
                { word: 'secondary', meaning: '中等的；中学教育的', example: 'Secondary students often prepare for major public exams.' },
                { word: 'university', meaning: '大学', example: 'She hopes to enter a top university next year.' },
                { word: 'college', example: 'Many students choose a local college before moving to a university.' },
                { word: 'institute', example: 'The institute provides training for future teachers.' },
                { word: 'academy', example: 'The academy is known for its strong music program.' },
                { word: 'learn', example: 'Children learn best when lessons are clear and engaging.' },
                { word: 'study', example: 'She plans to study engineering after high school.' },
                { word: 'acquire', example: 'Students acquire new skills through regular practice.' }
            ]
        },
        6: {
            vocabulary: [
                { word: 'technology', example: 'Technology is changing the way people work and communicate.' },
                { word: 'technique', example: 'A new farming technique can reduce water waste.' },
                { word: 'polytechnic', example: 'He chose a polytechnic because it offered practical courses.' },
                { word: 'engineer', example: 'The engineer designed a safer bridge for the city.' },
                { word: 'mechanic', example: 'A skilled mechanic quickly found the problem with the engine.' },
                { word: 'advance', example: 'Medical advances have improved life expectancy in many countries.' },
                { word: 'innovate', example: 'Small companies often need to innovate to stay competitive.' },
                { word: 'breakthrough', example: 'The discovery was described as a major scientific breakthrough.' },
                { word: 'gizmo', example: 'He bought a small kitchen gizmo that saves time.' },
                { word: 'patent', example: 'The inventor applied for a patent on the new device.' }
            ]
        },
        7: {
            vocabulary: [
                { word: 'culture', example: 'Food plays an important role in local culture.' },
                { word: 'civilization', meaning: '文明', example: 'The museum displays objects from an ancient civilization.' },
                { word: 'renaissance', example: 'The Renaissance changed art, science, and education in Europe.' },
                { word: 'epic', example: 'The poem became famous as a national epic.' },
                { word: 'ideology', example: 'Political ideology can shape public policy.' },
                { word: 'tradition', example: 'Families often pass down tradition from one generation to the next.' },
                { word: 'convention', example: 'By convention, people usually shake hands at formal meetings.' },
                { word: 'custom', example: 'It is a local custom to bring a gift when visiting someone’s home.' },
                { word: 'feudalism', example: 'Feudalism shaped social and economic life in medieval Europe.' },
                { word: 'slavery', example: 'Many countries now teach the history of slavery in schools.' }
            ]
        },
        8: {
            vocabulary: [
                { word: 'language', pos: 'n.', example: 'Language allows people to share ideas and emotions.' },
                { word: 'symbol', example: 'A dove is often used as a symbol of peace.' },
                { word: 'sign', example: 'The dark clouds were a sign that rain was coming.' },
                { word: 'gesture', example: 'A simple hand gesture can carry different meanings across cultures.' },
                { word: 'handwriting', meaning: '书写；笔迹', example: 'Clear handwriting makes notes easier to review later.' },
                { word: 'pictograph', example: 'Early societies used a pictograph to represent simple ideas.' },
                { word: 'wedge', example: 'Students learned how wedge-shaped symbols were carved into clay.' },
                { word: 'knot', example: 'Sailors tied a tight knot in the rope.' },
                { word: 'linguistics', example: 'Linguistics explores how languages develop and change.' },
                { word: 'semantic', example: 'The debate focused on a small semantic difference between the two terms.' }
            ]
        },
        9: {
            vocabulary: [
                { word: 'medium', example: 'Television remains a powerful medium for public communication.' },
                { word: 'press', example: 'The press questioned the minister after the announcement.' },
                { word: 'journalist', example: 'The journalist interviewed local residents about the issue.' },
                { word: 'critic', example: 'A film critic praised the director’s latest work.' },
                { word: 'commentator', example: 'The commentator explained the match to the audience.' },
                { word: 'exponent', example: 'She is a leading exponent of modern dance.' },
                { word: 'announcer', example: 'The announcer introduced the evening program.' },
                { word: 'correspondent', example: 'The foreign correspondent reported from the conflict zone.' },
                { word: 'messenger', example: 'A messenger delivered the document to the office.' },
                { word: 'editor', example: 'The editor checked the article before publication.' }
            ]
        },
        10: {
            vocabulary: [
                { word: 'stuff', example: 'Please put your stuff in the locker before class starts.' },
                { word: 'item', example: 'Each item on the list must be checked carefully.' },
                { word: 'merchandise', example: 'The store sells merchandise from local designers.' },
                { word: 'souvenir', example: 'She bought a small souvenir at the museum shop.' },
                { word: 'artifact', meaning: '人造物品；手工艺品', example: 'The archaeologist found a valuable artifact at the site.' },
                { word: 'material', example: 'The builders tested the material before using it.' },
                { word: 'raw', example: 'The factory imports raw materials from several countries.' },
                { word: 'crude', meaning: '天然的；未经加工的；粗糙的', example: 'Crude oil must be processed before it can be used as fuel.' },
                { word: 'necessity', example: 'Clean water is a basic human necessity.' },
                { word: 'outfit', pos: 'n.', example: 'She packed one warm outfit for the trip.' }
            ]
        },
        11: {
            vocabulary: [
                { word: 'fashion', example: 'Fashion trends often spread quickly through social media.' },
                { word: 'style', example: 'Her personal style is simple but elegant.' },
                { word: 'trend', example: 'This trend became popular among young consumers.' },
                { word: 'tendency', example: 'There is a growing tendency to buy sustainable clothing.' },
                { word: 'current', example: 'The current fashion market changes very quickly.' },
                { word: 'popularity', example: 'The popularity of online shopping continues to rise.' },
                { word: 'vogue', example: 'Vintage designs are back in vogue this season.' },
                { word: 'prevail', example: 'Practical styles often prevail during uncertain economic times.' },
                { word: 'model', example: 'The model introduced the new collection on stage.' },
                { word: 'icon', example: 'She became a fashion icon for a whole generation.' }
            ]
        },
        12: {
            vocabulary: [
                { word: 'atmosphere', example: 'The classroom atmosphere became tense before the final exam.' },
                { word: 'hydrosphere', meaning: '水圈', example: 'The hydrosphere includes rivers, lakes, and oceans.' },
                { word: 'lithosphere', meaning: '岩石圈', example: 'Earthquakes affect the lithosphere beneath the surface.' },
                { word: 'oxygen', example: 'Plants release oxygen into the air during photosynthesis.' },
                { word: 'oxide', example: 'Scientists studied the metal oxide in the laboratory.' },
                { word: 'carbon dioxied', word_new: 'carbon dioxide', example: 'Carbon dioxide levels rise when more fossil fuels are burned.' },
                { word: 'hydrogen', example: 'Hydrogen is the lightest element in the universe.' },
                { word: 'core', example: 'The Earth has a hot core beneath the mantle.' },
                { word: 'crust', example: 'The Earth’s crust is thinner under the oceans than under the continents.' },
                { word: 'mantle', example: 'The mantle lies between the crust and the core.' }
            ]
        },
        13: {
            vocabulary: [
                { word: 'photosynthesis', example: 'Photosynthesis allows plants to turn sunlight into energy.' },
                { word: 'respire', example: 'All living organisms need to respire to survive.' },
                { word: 'dioxide', example: 'Carbon dioxide is one of the most common greenhouse gases.' },
                { word: 'vagetation', word_new: 'vegetation', example: 'There is very little vegetation in the driest deserts.' },
                { word: 'herb', example: 'The farmer grows each herb in a separate section of the garden.' },
                { word: 'perennial', example: 'This perennial plant can survive for many years.' },
                { word: 'botany', example: 'She decided to study botany at university.' },
                { word: 'ecology', example: 'Ecology examines how living things interact with their environment.' },
                { word: 'ecosystem', example: 'A healthy ecosystem depends on balance among plants, animals, and climate.' },
                { word: 'eco-friendly', example: 'Many shoppers now prefer eco-friendly packaging.' }
            ]
        },
        14: {
            vocabulary: [
                { word: 'biologist', example: 'The biologist recorded how the species adapted to its environment.' },
                { word: 'zoologist', example: 'A zoologist may spend years studying one animal group.' },
                { word: 'ecologist', example: 'The ecologist warned that pollution was damaging the wetland.' },
                { word: 'botanist', example: 'The botanist identified several rare plants in the forest.' },
                { word: 'mammal', example: 'A whale is a mammal even though it lives in the ocean.' },
                { word: 'primate', example: 'Humans belong to the primate family.' },
                { word: 'vertebrate', example: 'A fish is a vertebrate because it has a backbone.' },
                { word: 'pretail', word_new: 'reptile', meaning: '爬行动物', example: 'A snake is a reptile that depends on external heat.' },
                { word: 'amphibian', example: 'An amphibian can often live both in water and on land.' },
                { word: 'carnivore', example: 'A carnivore mainly eats other animals.' }
            ]
        },
        15: {
            vocabulary: [
                { word: 'galaxy', example: 'Our solar system is part of the Milky Way galaxy.' },
                { word: 'cosmos', example: 'Scientists still know little about the full scale of the cosmos.' },
                { word: 'universe', example: 'The universe contains countless stars and planets.' },
                { word: 'interstellar', example: 'The probe was designed to collect interstellar data.' },
                { word: 'terrestrial', example: 'Some terrestrial animals struggle in extreme desert climates.' },
                { word: 'celestial', example: 'Ancient people carefully observed celestial movements.' },
                { word: 'astronomy', example: 'Astronomy helps us understand planets, stars, and galaxies.' },
                { word: 'astrology', example: 'Astrology is not the same as scientific astronomy.' },
                { word: 'astronaut', example: 'The astronaut spent six months on the space station.' },
                { word: 'comet', example: 'The comet left a bright trail across the night sky.' }
            ]
        },
        16: {
            vocabulary: [
                { word: 'education', meaning: '教育', example: 'Education can expand opportunities for young people.' },
                { word: 'primary', meaning: '初级的；小学教育的', example: 'Most children begin primary education at an early age.' },
                { word: 'secondary', meaning: '中等的；中学教育的', example: 'Secondary students often prepare for major public exams.' },
                { word: 'university', meaning: '大学', example: 'She hopes to enter a top university next year.' },
                { word: 'college', example: 'Many students choose a local college before moving to a university.' },
                { word: 'institute', example: 'The institute provides training for future teachers.' },
                { word: 'academy', example: 'The academy is known for its strong music program.' },
                { word: 'learn', example: 'Children learn best when lessons are clear and engaging.' },
                { word: 'study', example: 'She plans to study engineering after high school.' },
                { word: 'acquire', example: 'Students acquire new skills through regular practice.' }
            ]
        },
        17: {
            vocabulary: [
                { word: 'technology', example: 'Technology is changing the way people work and communicate.' },
                { word: 'technique', example: 'A new farming technique can reduce water waste.' },
                { word: 'polytechnic', example: 'He chose a polytechnic because it offered practical courses.' },
                { word: 'engineer', example: 'The engineer designed a safer bridge for the city.' },
                { word: 'mechanic', example: 'A skilled mechanic quickly found the problem with the engine.' },
                { word: 'advance', example: 'Medical advances have improved life expectancy in many countries.' },
                { word: 'innovate', example: 'Small companies often need to innovate to stay competitive.' },
                { word: 'breakthrough', example: 'The discovery was described as a major scientific breakthrough.' },
                { word: 'gizmo', example: 'He bought a small kitchen gizmo that saves time.' },
                { word: 'patent', example: 'The inventor applied for a patent on the new device.' }
            ]
        },
        18: {
            vocabulary: [
                { word: 'culture', example: 'Food plays an important role in local culture.' },
                { word: 'civilization', meaning: '文明', example: 'The museum displays objects from an ancient civilization.' },
                { word: 'renaissance', example: 'The Renaissance changed art, science, and education in Europe.' },
                { word: 'epic', example: 'The poem became famous as a national epic.' },
                { word: 'ideology', example: 'Political ideology can shape public policy.' },
                { word: 'tradition', example: 'Families often pass down tradition from one generation to the next.' },
                { word: 'convention', example: 'By convention, people usually shake hands at formal meetings.' },
                { word: 'custom', example: 'It is a local custom to bring a gift when visiting someone’s home.' },
                { word: 'feudalism', example: 'Feudalism shaped social and economic life in medieval Europe.' },
                { word: 'slavery', example: 'Many countries now teach the history of slavery in schools.' }
            ]
        },
        19: {
            vocabulary: [
                { word: 'language', pos: 'n.', example: 'Language allows people to share ideas and emotions.' },
                { word: 'symbol', example: 'A dove is often used as a symbol of peace.' },
                { word: 'sign', example: 'The dark clouds were a sign that rain was coming.' },
                { word: 'gesture', example: 'A simple hand gesture can carry different meanings across cultures.' },
                { word: 'handwriting', meaning: '书写；笔迹', example: 'Clear handwriting makes notes easier to review later.' },
                { word: 'pictograph', example: 'Early societies used a pictograph to represent simple ideas.' },
                { word: 'wedge', example: 'Students learned how wedge-shaped symbols were carved into clay.' },
                { word: 'knot', example: 'Sailors tied a tight knot in the rope.' },
                { word: 'linguistics', example: 'Linguistics explores how languages develop and change.' },
                { word: 'semantic', example: 'The debate focused on a small semantic difference between the two terms.' }
            ]
        },
        20: {
            vocabulary: [
                { word: 'medium', example: 'Television remains a powerful medium for public communication.' },
                { word: 'press', example: 'The press questioned the minister after the announcement.' },
                { word: 'journalist', example: 'The journalist interviewed local residents about the issue.' },
                { word: 'critic', example: 'A film critic praised the director’s latest work.' },
                { word: 'commentator', example: 'The commentator explained the match to the audience.' },
                { word: 'exponent', example: 'She is a leading exponent of modern dance.' },
                { word: 'announcer', example: 'The announcer introduced the evening program.' },
                { word: 'correspondent', example: 'The foreign correspondent reported from the conflict zone.' },
                { word: 'messenger', example: 'A messenger delivered the document to the office.' },
                { word: 'editor', example: 'The editor checked the article before publication.' }
            ]
        },
        21: {
            vocabulary: [
                { word: 'stuff', example: 'Please put your stuff in the locker before class starts.' },
                { word: 'item', example: 'Each item on the list must be checked carefully.' },
                { word: 'merchandise', example: 'The store sells merchandise from local designers.' },
                { word: 'souvenir', example: 'She bought a small souvenir at the museum shop.' },
                { word: 'artifact', meaning: '人造物品；手工艺品', example: 'The archaeologist found a valuable artifact at the site.' },
                { word: 'material', example: 'The builders tested the material before using it.' },
                { word: 'raw', example: 'The factory imports raw materials from several countries.' },
                { word: 'crude', meaning: '天然的；未经加工的；粗糙的', example: 'Crude oil must be processed before it can be used as fuel.' },
                { word: 'necessity', example: 'Clean water is a basic human necessity.' },
                { word: 'outfit', pos: 'n.', example: 'She packed one warm outfit for the trip.' }
            ]
        },
        22: {
            vocabulary: [
                { word: 'fashion', example: 'Fashion trends often spread quickly through social media.' },
                { word: 'style', example: 'Her personal style is simple but elegant.' },
                { word: 'trend', example: 'This trend became popular among young consumers.' },
                { word: 'tendency', example: 'There is a growing tendency to buy sustainable clothing.' },
                { word: 'current', example: 'The current fashion market changes very quickly.' },
                { word: 'popularity', example: 'The popularity of online shopping continues to rise.' },
                { word: 'vogue', example: 'Vintage designs are back in vogue this season.' },
                { word: 'prevail', example: 'Practical styles often prevail during uncertain economic times.' },
                { word: 'model', example: 'The model introduced the new collection on stage.' },
                { word: 'icon', example: 'She became a fashion icon for a whole generation.' }
            ]
        },
        23: {
            vocabulary: [
                { word: 'atmosphere', example: 'The classroom atmosphere became tense before the final exam.' },
                { word: 'hydrosphere', meaning: '水圈', example: 'The hydrosphere includes rivers, lakes, and oceans.' },
                { word: 'lithosphere', meaning: '岩石圈', example: 'Earthquakes affect the lithosphere beneath the surface.' },
                { word: 'oxygen', example: 'Plants release oxygen into the air during photosynthesis.' },
                { word: 'oxide', example: 'Scientists studied the metal oxide in the laboratory.' },
                { word: 'carbon dioxied', word_new: 'carbon dioxide', example: 'Carbon dioxide levels rise when more fossil fuels are burned.' },
                { word: 'hydrogen', example: 'Hydrogen is the lightest element in the universe.' },
                { word: 'core', example: 'The Earth has a hot core beneath the mantle.' },
                { word: 'crust', example: 'The Earth’s crust is thinner under the oceans than under the continents.' },
                { word: 'mantle', example: 'The mantle lies between the crust and the core.' }
            ]
        },
        24: {
            vocabulary: [
                { word: 'photosynthesis', example: 'Photosynthesis allows plants to turn sunlight into energy.' },
                { word: 'respire', example: 'All living organisms need to respire to survive.' },
                { word: 'dioxide', example: 'Carbon dioxide is one of the most common greenhouse gases.' },
                { word: 'vagetation', word_new: 'vegetation', example: 'There is very little vegetation in the driest deserts.' },
                { word: 'herb', example: 'The farmer grows each herb in a separate section of the garden.' },
                { word: 'perennial', example: 'This perennial plant can survive for many years.' },
                { word: 'botany', example: 'She decided to study botany at university.' },
                { word: 'ecology', example: 'Ecology examines how living things interact with their environment.' },
                { word: 'ecosystem', example: 'A healthy ecosystem depends on balance among plants, animals, and climate.' },
                { word: 'eco-friendly', example: 'Many shoppers now prefer eco-friendly packaging.' }
            ]
        },
        25: {
            vocabulary: [
                { word: 'biologist', example: 'The biologist recorded how the species adapted to its environment.' },
                { word: 'zoologist', example: 'A zoologist may spend years studying one animal group.' },
                { word: 'ecologist', example: 'The ecologist warned that pollution was damaging the wetland.' },
                { word: 'botanist', example: 'The botanist identified several rare plants in the forest.' },
                { word: 'mammal', example: 'A whale is a mammal even though it lives in the ocean.' },
                { word: 'primate', example: 'Humans belong to the primate family.' },
                { word: 'vertebrate', example: 'A fish is a vertebrate because it has a backbone.' },
                { word: 'pretail', word_new: 'reptile', meaning: '爬行动物', example: 'A snake is a reptile that depends on external heat.' },
                { word: 'amphibian', example: 'An amphibian can often live both in water and on land.' },
                { word: 'carnivore', example: 'A carnivore mainly eats other animals.' }
            ]
        },
        26: {
            vocabulary: [
                { word: 'galaxy', example: 'Our solar system is part of the Milky Way galaxy.' },
                { word: 'cosmos', example: 'Scientists still know little about the full scale of the cosmos.' },
                { word: 'universe', example: 'The universe contains countless stars and planets.' },
                { word: 'interstellar', example: 'The probe was designed to collect interstellar data.' },
                { word: 'terrestrial', example: 'Some terrestrial animals struggle in extreme desert climates.' },
                { word: 'celestial', example: 'Ancient people carefully observed celestial movements.' },
                { word: 'astronomy', example: 'Astronomy helps us understand planets, stars, and galaxies.' },
                { word: 'astrology', example: 'Astrology is not the same as scientific astronomy.' },
                { word: 'astronaut', example: 'The astronaut spent six months on the space station.' },
                { word: 'comet', example: 'The comet left a bright trail across the night sky.' }
            ]
        },
        27: {
            vocabulary: [
                { word: 'education', meaning: '教育', example: 'Education can expand opportunities for young people.' },
                { word: 'primary', meaning: '初级的；小学教育的', example: 'Most children begin primary education at an early age.' },
                { word: 'secondary', meaning: '中等的；中学教育的', example: 'Secondary students often prepare for major public exams.' },
                { word: 'university', meaning: '大学', example: 'She hopes to enter a top university next year.' },
                { word: 'college', example: 'Many students choose a local college before moving to a university.' },
                { word: 'institute', example: 'The institute provides training for future teachers.' },
                { word: 'academy', example: 'The academy is known for its strong music program.' },
                { word: 'learn', example: 'Children learn best when lessons are clear and engaging.' },
                { word: 'study', example: 'She plans to study engineering after high school.' },
                { word: 'acquire', example: 'Students acquire new skills through regular practice.' }
            ]
        },
        28: {
            vocabulary: [
                { word: 'technology', example: 'Technology is changing the way people work and communicate.' },
                { word: 'technique', example: 'A new farming technique can reduce water waste.' },
                { word: 'polytechnic', example: 'He chose a polytechnic because it offered practical courses.' },
                { word: 'engineer', example: 'The engineer designed a safer bridge for the city.' },
                { word: 'mechanic', example: 'A skilled mechanic quickly found the problem with the engine.' },
                { word: 'advance', example: 'Medical advances have improved life expectancy in many countries.' },
                { word: 'innovate', example: 'Small companies often need to innovate to stay competitive.' },
                { word: 'breakthrough', example: 'The discovery was described as a major scientific breakthrough.' },
                { word: 'gizmo', example: 'He bought a small kitchen gizmo that saves time.' },
                { word: 'patent', example: 'The inventor applied for a patent on the new device.' }
            ]
        },
        29: {
            vocabulary: [
                { word: 'culture', example: 'Food plays an important role in local culture.' },
                { word: 'civilization', meaning: '文明', example: 'The museum displays objects from an ancient civilization.' },
                { word: 'renaissance', example: 'The Renaissance changed art, science, and education in Europe.' },
                { word: 'epic', example: 'The poem became famous as a national epic.' },
                { word: 'ideology', example: 'Political ideology can shape public policy.' },
                { word: 'tradition', example: 'Families often pass down tradition from one generation to the next.' },
                { word: 'convention', example: 'By convention, people usually shake hands at formal meetings.' },
                { word: 'custom', example: 'It is a local custom to bring a gift when visiting someone’s home.' },
                { word: 'feudalism', example: 'Feudalism shaped social and economic life in medieval Europe.' },
                { word: 'slavery', example: 'Many countries now teach the history of slavery in schools.' }
            ]
        },
        30: {
            vocabulary: [
                { word: 'language', pos: 'n.', example: 'Language allows people to share ideas and emotions.' },
                { word: 'symbol', example: 'A dove is often used as a symbol of peace.' },
                { word: 'sign', example: 'The dark clouds were a sign that rain was coming.' },
                { word: 'gesture', example: 'A simple hand gesture can carry different meanings across cultures.' },
                { word: 'handwriting', meaning: '书写；笔迹', example: 'Clear handwriting makes notes easier to review later.' },
                { word: 'pictograph', example: 'Early societies used a pictograph to represent simple ideas.' },
                { word: 'wedge', example: 'Students learned how wedge-shaped symbols were carved into clay.' },
                { word: 'knot', example: 'Sailors tied a tight knot in the rope.' },
                { word: 'linguistics', example: 'Linguistics explores how languages develop and change.' },
                { word: 'semantic', example: 'The debate focused on a small semantic difference between the two terms.' }
            ]
        }
    };

    Object.entries(overrides).forEach(([dayKey, patch]) => {
        const day = window.IELTS_DATA.curriculum[dayKey];
        if (!day || !Array.isArray(day.vocabulary)) return;

        patch.vocabulary.forEach((item) => {
            const target = day.vocabulary.find((entry) => entry.word === item.word);
            if (!target) return;
            if (item.word_new) target.word = item.word_new;
            if (item.meaning) target.meaning = item.meaning;
            if (item.pos) target.pos = item.pos;
            if (item.example) target.example = item.example;
        });
    });
})();
