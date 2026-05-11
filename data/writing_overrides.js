(function applyWritingOverrides() {
    if (!window.IELTS_DATA || !window.IELTS_DATA.curriculum) return;

    const prompts = {
        1: {
            task: "The line graph shows changes in the number of international tourists visiting three mountain regions between 2005 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        2: {
            task: "Some people believe that governments should spend more money protecting forests and plant life, while others think this money should be used for housing and transport.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        3: {
            task: "The charts show the populations of three endangered animal species in one country in 2000 and 2025, and the amount of money spent on their protection in 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        4: {
            task: "Some people think space exploration is a waste of money, while others believe it brings long-term benefits to life on Earth.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        5: {
            task: "The table compares the average number of hours secondary school students in four countries spend each week on homework, sports and part-time work.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        6: {
            task: "New technologies make many traditional skills less necessary. Some people think schools should stop teaching old practical skills, while others believe they are still important.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        7: {
            task: "The bar chart shows the number of visitors to four historical sites over a ten-year period, while the pie chart shows the reasons tourists gave for visiting them in the final year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        8: {
            task: "Some people believe that children should learn foreign languages from the earliest years of school, while others think it is better to wait until they are older.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        9: {
            task: "The charts show the percentage of young people in five countries who took part in three different types of sport in 2010 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        10: {
            task: "Many consumer products are replaced too quickly, even when they still work. Some people think this is mainly caused by fashion and advertising, while others think technology is the main reason.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        11: {
            task: "The line chart shows the proportion of sales made through physical shops and online platforms in the fashion industry from 2008 to 2028.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        12: {
            task: "Some people think that children should spend more time learning about the natural world, while others believe schools should focus more on science and technology skills for future jobs.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        13: {
            task: "The diagrams show how a vertical garden is used in one city building, and the chart gives the percentage reduction in summer energy use after installation.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        14: {
            task: "Zoos and wildlife parks are often used to educate the public about animals. Some people think this is a good way to protect wildlife, while others think animals should not be kept in captivity for this purpose.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        15: {
            task: "The graphs show the number of private companies launching satellites, the cost per launch, and the proportion of satellites used for communication, research and navigation over a 20-year period.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        16: {
            task: "Some people think schools should spend more time teaching practical life skills, while others think academic subjects should remain the main focus.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        17: {
            task: "The table shows how often adults in five age groups use four different digital devices each day, while the bar chart shows the main purpose for using them.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        18: {
            task: "Museums and historical sites increasingly use digital experiences instead of traditional displays. Some people think this improves public understanding, while others think it weakens authentic cultural experience.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        19: {
            task: "The chart shows the number of minority languages taught in schools in six regions between 2000 and 2025, while the table shows student enrolment in bilingual programmes in the final year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        20: {
            task: "Some people think governments should spend more money on public sports facilities, while others believe the arts and entertainment deserve more support.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        21: {
            task: "The diagram shows the process used to recycle glass containers, and the chart compares the percentage of recycled glass in three cities over ten years.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        22: {
            task: "Fashion trends change quickly, and many people buy clothes they only wear a few times. Some people think individuals should change their habits, while others think clothing companies should be more responsible.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        23: {
            task: "The charts compare rainfall levels, freshwater use, and the percentage of water reused in three regions over a 15-year period.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        24: {
            task: "Some people believe that cities should replace decorative urban spaces with more areas for growing food and plants, while others think city land should be used mainly for housing and business.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        25: {
            task: "The line graph shows changes in the number of wild animals recorded in three protected regions, and the table shows the annual budget for each region in the final year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        26: {
            task: "Space tourism is likely to become more common in the future. Some people believe this will bring important benefits, while others think it is a wasteful use of money and resources.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        27: {
            task: "The table shows the percentage of teachers in four school subjects who used online tools every day in 2012 and 2026, while the bar chart shows student satisfaction with these tools in 2026.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        28: {
            task: "Some people think people rely too heavily on modern devices and applications to solve everyday problems, while others think this dependence allows people to live more efficiently.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        },
        29: {
            task: "The charts show the number of visitors to three types of cultural events over twelve years and the proportion of attendees in different age groups in the final year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordCount: 170
        },
        30: {
            task: "Some people believe that smaller languages will disappear and that this is a natural part of global development. Others think governments and communities should protect them.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
            wordCount: 260
        }
    };

    Object.entries(prompts).forEach(([dayKey, writing]) => {
        const day = window.IELTS_DATA.curriculum[dayKey];
        if (!day) return;
        day.writing = { ...writing };
    });
})();
