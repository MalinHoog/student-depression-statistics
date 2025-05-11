addMdToPage(`
  ## Student's depression and study satisfaction
 
  _______________

  ### Hypothesis:
  * *Students with low Study Satisfaction are more likely to be depressed*
  
  On this page we will look into the data that concerns the student's study satsfaction and the correlation with reported depression. 

  _____________
`);

addMdToPage(`
  ### Comparing between the genders

  *Disclaimer:*
  To make things more clear I will divide the student's answers into 3 groups, regarding their study satisfaction. In the original dataset, responses were given on a scale from 1 to 5, where 1 indicated a low rating and 5 a high one. However, some entries had a value of 0. After reviewing the data, I concluded that these responses were not relevant, as they appeared to come from students who likely did not take the survey seriously or did not complete it properly.
  * **Low**: 1 - 2
  * **Medium**: 3
  * **High**: 4 - 5

  In this first piechart we can compare the study satisfaction between the genders mentioned in the data: *Female* and *Male*, both also look at the combined data between the two. 
  `);

let gender = addDropdown('Choose what gender to show', ['Male', 'Female', 'Both']);

let femalestudySatisfaction = await dbQuery(`
  SELECT profession AS Profession,
  CASE
    WHEN study_satisfaction IN (1, 2) THEN 'Low Study Satisfaction (1-2)'
    WHEN study_satisfaction = 3 THEN 'Medium Study Satisfaction (3)'
    WHEN study_satisfaction IN (4, 5) THEN 'High Study Satisfaction (4-5)'
  END AS Satisfaction_Level,
  COUNT(*) AS Amount_Of_Students,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE gender = 'Female' AND study_satisfaction != 0 AND study_satisfaction IS NOT NULL AND gender IS NOT NULL
  GROUP BY profession, Satisfaction_Level
  ORDER BY 
  CASE 
      WHEN study_satisfaction IN (1, 2) THEN 1
      WHEN study_satisfaction = 3 THEN 2
      WHEN study_satisfaction IN (4, 5) THEN 3
    END
`);

let malestudySatisfaction = await dbQuery(`
  SELECT profession AS Profession,
  CASE
    WHEN study_satisfaction IN (1, 2) THEN 'Low Study Satisfaction (1-2)'
    WHEN study_satisfaction = 3 THEN 'Medium Study Satisfaction (3)'
    WHEN study_satisfaction IN (4, 5) THEN 'High Study Satisfaction (4-5)'
  END AS Satisfaction_Level,
  COUNT(*) AS Amount_Of_Students,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE gender = 'Male' AND study_satisfaction != 0 AND study_satisfaction IS NOT NULL AND gender IS NOT NULL
  GROUP BY profession, Satisfaction_Level
  ORDER BY   
  CASE 
      WHEN study_satisfaction IN (1, 2) THEN 1
      WHEN study_satisfaction = 3 THEN 2
      WHEN study_satisfaction IN (4, 5) THEN 3
    END
`);

let bothstudySatisfaction = await dbQuery(`
  SELECT profession AS Profession,
  CASE
    WHEN study_satisfaction IN (1, 2) THEN 'Low Study Satisfaction (1-2)'
    WHEN study_satisfaction = 3 THEN 'Medium Study Satisfaction (3)'
    WHEN study_satisfaction IN (4, 5) THEN 'High Study Satisfaction (4-5)'
  END AS Satisfaction_Level,
  COUNT(*) AS Amount_Of_Students,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE gender IN ('Female', 'Male')
  AND study_satisfaction != 0 AND study_satisfaction IS NOT NULL AND gender IS NOT NULL
  GROUP BY profession, Satisfaction_Level
  ORDER BY 
  CASE 
      WHEN study_satisfaction IN (1, 2) THEN 1
      WHEN study_satisfaction = 3 THEN 2
      WHEN study_satisfaction IN (4, 5) THEN 3
    END
`);

let combinedData, title;
if (gender == 'Female') { combinedData = femalestudySatisfaction; title = 'Female students'; }

else if (gender == 'Male') { combinedData = malestudySatisfaction; title = 'Male students'; }

else { combinedData = bothstudySatisfaction; title = 'All students'; };


let chartData = [
  ['Study Satisfaction', 'Percentage']
];
combinedData.forEach(row => {
  chartData.push([row.Satisfaction_Level, row.Percentage]);
});


drawGoogleChart({
  type: 'PieChart',
  data: chartData,
  options: {
    title,
    height: 600,
    vAxis: { title: 'Percentage' },
    hAxis: { title: 'Study Satisfaction' },
    colors: ['#00bfff', '#0080ff', '#0000ff'] // olika nyanser av blå
  }
});

addMdToPage(`<br>`);

addMdToPage(`
  Percentagewise there is not much differenting the genders in their study satisfaction. Both groups show low and medium satisfaction when it comes to their studies. And just about two fifths of all students report that they have high study satisfaction. 
  `);

addMdToPage(`<br>`);


let studySatisfaction = await dbQuery(
  "SELECT profession AS Profession, " +
  "gender AS Gender, " +
  "CASE " +
  "WHEN study_satisfaction IN (1, 2) THEN 'Low Study Satisfaction (1-2)' " +
  "WHEN study_satisfaction = 3 THEN 'Medium Study Satisfaction (3)' " +
  "WHEN study_satisfaction IN (4, 5) THEN 'High Study Satisfaction (4-5)' " +
  "END AS Satisfaction_Level, " +
  "COUNT(*) AS Amount_Of_Students, " +
  "ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession, gender), 1) AS Percentage " +
  "FROM results " +
  "WHERE study_satisfaction != 0 AND study_satisfaction IS NOT NULL AND gender IS NOT NULL " +
  "GROUP BY profession, gender, Satisfaction_Level " +
  "ORDER BY profession, gender, " +
  "CASE " +
  "WHEN study_satisfaction IN (4, 5) THEN 3 " +
  "WHEN study_satisfaction = 3 THEN 2 " +
  "WHEN study_satisfaction IN (1, 2) THEN 1 " +
  "END"
);

tableFromData({ data: studySatisfaction });

addMdToPage(`
  <br>`);

addMdToPage(`
  When we instead look into *"The correlation between Study Satisfaction and Depression"* diagram down below we can determine that the more unsatisfied the student's are with their study perfomance, more students report feeling depressed. Which might not be suprising, but even the students with high study satisfaction show that they experience depression, just not as many. 
  `);

addMdToPage(`
  <br>`);

let studySatFac = await dbQuery(`
  SELECT 
  CASE 
    WHEN study_satisfaction IN (1, 2) THEN 'Low Study Satisfaction (1-2)'
    WHEN study_satisfaction = 3 THEN 'Medium Study Satisfaction (3)'
    WHEN study_satisfaction IN (4, 5) THEN 'High Study Satisfaction (4-5)'
  END AS Satisfaction_Level,
  AVG(depression) AS Avg_Depression
  FROM results
  WHERE study_satisfaction != 0
  GROUP BY Satisfaction_Level
  ORDER BY 
     CASE 
      WHEN study_satisfaction IN (1, 2) THEN 1
      WHEN study_satisfaction = 3 THEN 2
      WHEN study_satisfaction IN (4, 5) THEN 3
    END
`);

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(studySatFac, 'Study Satisfaction', 'Average Depression*'),
  options: {
    title: 'The correlation between Study Satisfaction and Depression',
    height: 500,
    vAxis: {
      title: 'Depression (0–1)',
      viewWindow: { min: 0, max: 1 }
    },
    hAxis: { title: 'Study Satisfaction' },
    colors: ['#3366cc']
  }
});

addMdToPage(`**Average Depression represents the proportion of students who answered "Yes" (coded as 1) to experiencing feelings of depression. This is calculated as the average of all binary responses (1 = Yes, 0 = No) within each financial stress group. A higher average indicates a larger share of students reporting depressive feelings in that group.*`);

addMdToPage(`<br>`);

addMdToPage(`______________`);

addMdToPage(`
  ### Hypothesis:
  * *Students with Financial Stress are more likely to be depressed, and more likley to have Sucidial Thoughts.*
  _____________
`);

addMdToPage(`
  Another factor that can weigh heavily on a student's mind is financial stress.
  Being a student often means living on a tight budget, which can significantly impact mental well-being. A majority of students report that financial concerns are a constant source of stress — especially in a country like India, where education comes at a cost. The pressure of managing expenses while trying to focus on studies can take a serious toll on mental health.
  `);

addMdToPage(`<br>`);

let finansStress = await dbQuery(`
  SELECT profession AS Profession,
    CASE 
     WHEN financial_stress = 1 THEN 'No Financial Stress'
     WHEN financial_stress = 2 THEN 'Minor Financial Stress'
     WHEN financial_stress = 3 THEN 'Moderate Financial Stress'
     WHEN financial_stress = 4 THEN 'Major Financial Stress'
     WHEN financial_stress = 5 THEN 'Severe Financial Stress'
    END AS Financial_Stress,
    COUNT(*) AS Student_Count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE financial_stress != '?'
  GROUP BY profession, financial_stress
  ORDER BY 
  CASE financial_stress
      WHEN 1 THEN 1
      WHEN 2 THEN 2
      WHEN 3 THEN 3
      WHEN 4 THEN 4
      WHEN 5 THEN 5
    END
`);

tableFromData({ data: finansStress });

addMdToPage(`<br>`);

let finansStressDepression = await dbQuery(`
  SELECT 
    CASE 
     WHEN financial_stress = 1 THEN 'No Financial Stress'
     WHEN financial_stress = 2 THEN 'Minor Financial Stress'
     WHEN financial_stress = 3 THEN 'Moderate Financial Stress'
     WHEN financial_stress = 4 THEN 'Major Financial Stress'
     WHEN financial_stress = 5 THEN 'Severe Financial Stress'
    END AS Financial_Stress,
    AVG(depression) AS Avg_Depression
    FROM results
    WHERE financial_stress != '?'
    GROUP BY financial_stress
    ORDER BY 
    CASE financial_stress
      WHEN 1 THEN 1
      WHEN 2 THEN 2
      WHEN 3 THEN 3
      WHEN 4 THEN 4
      WHEN 5 THEN 5
    END
`);

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(finansStressDepression, 'Finance', 'Average Depression*'),
  options: {
    title: 'The correlation between financial stress and depression',
    height: 500
  },
  chartArea: { left: 75, bottom: 150, width: '90%' },
  legend: { position: top }, // not working??
  vAxis: { title: 'Depression (0–1)' },
  hAxis: { title: 'Finance levels' },
  colors: ['#3366cc']
});
addMdToPage(`**Average Depression represents the proportion of students who answered "Yes" (coded as 1) to experiencing feelings of depression. This is calculated as the average of all binary responses (1 = Yes, 0 = No) within each financial stress group. A higher average indicates a larger share of students reporting depressive feelings in that group.*`);

addMdToPage(`<br>`);

addMdToPage(`
  It may not come as a surprise that financial stress and depression can influence suicidal thoughts among students. However, when comparing levels of financial stress and depression with the prevalence of suicidal ideation, the connection becomes even more evident. This highlights just how crucial it is to ensure students have the financial support they need in order to maintain both their academic focus and mental well-being.
  `);

addMdToPage(`<br>`);

let sucidical = addDropdown('Compare Financial Stress and Depression depending on Sucidial Thoughts', ['Students with Sucidial Thoughts', 'Students without Sucidial Thoughts', 'Both']);

let studentDepSucidial = await dbQuery(`
SELECT 
  CASE 
    WHEN financial_stress = 1 THEN 'No Financial Stress'
    WHEN financial_stress = 2 THEN 'Minor Financial Stress'
    WHEN financial_stress = 3 THEN 'Moderate Financial Stress'
    WHEN financial_stress = 4 THEN 'Major Financial Stress'
    WHEN financial_stress = 5 THEN 'Severe Financial Stress'
  END AS Financial_Stress,
  AVG(depression) AS Average_Depression
FROM results
WHERE financial_stress != '?' AND suidical_thoughts = 1
GROUP BY financial_stress
ORDER BY 
 CASE financial_stress
      WHEN 1 THEN 1
      WHEN 2 THEN 2
      WHEN 3 THEN 3
      WHEN 4 THEN 4
      WHEN 5 THEN 5
    END
`);

let studentDepNotSucidial = await dbQuery(`
SELECT 
  CASE 
    WHEN financial_stress = 1 THEN 'No Financial Stress'
    WHEN financial_stress = 2 THEN 'Minor Financial Stress'
    WHEN financial_stress = 3 THEN 'Moderate Financial Stress'
    WHEN financial_stress = 4 THEN 'Major Financial Stress'
    WHEN financial_stress = 5 THEN 'Severe Financial Stress'
  END AS Financial_Stress,
  AVG(depression) AS Average_Depression
FROM results
WHERE financial_stress != '?' AND suidical_thoughts = 0
GROUP BY financial_stress
ORDER BY 
 CASE financial_stress
      WHEN 1 THEN 1
      WHEN 2 THEN 2
      WHEN 3 THEN 3
      WHEN 4 THEN 4
      WHEN 5 THEN 5
    END
  `);

let studentDepSucidicalBoth = await dbQuery(`
SELECT 
  CASE 
    WHEN financial_stress = 1 THEN 'No Financial Stress'
    WHEN financial_stress = 2 THEN 'Minor Financial Stress'
    WHEN financial_stress = 3 THEN 'Moderate Financial Stress'
    WHEN financial_stress = 4 THEN 'Major Financial Stress'
    WHEN financial_stress = 5 THEN 'Severe Financial Stress'
  END AS Financial_Stress,
  AVG(depression) AS Average_Depression
FROM results
WHERE financial_stress != '?' AND suidical_thoughts IN (0, 1)
GROUP BY financial_stress
ORDER BY 
 CASE financial_stress
      WHEN 1 THEN 1
      WHEN 2 THEN 2
      WHEN 3 THEN 3
      WHEN 4 THEN 4
      WHEN 5 THEN 5
    END
  `);

let combinedSucidialData, title1;
if (sucidical === 'Students with Sucidial Thoughts') {
  combinedSucidialData = studentDepSucidial;
  title1 = 'Students with Sucidial Thoughts';
} else if (sucidical === 'Students without Sucidial Thoughts') {
  combinedSucidialData = studentDepNotSucidial;
  title1 = 'Students without Sucidial Thoughts';
} else {
  combinedSucidialData = studentDepSucidicalBoth;
  title1 = 'All students';
};


drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(combinedSucidialData, 'Financial Stress', 'Average Depression*'),
  options: {
    title: 'The correlation between Financial Stress, Sucidical Thoughts and Depression',
    height: 500,
    vAxis: {
      title: 'Avgerage Depression',
      viewWindow: {
        min: 0,
        max: 1
      }
    },
    hAxis: { title: 'Financial Stress' },
    colors: ['#3366cc']
  }
});
tableFromData({ data: combinedSucidialData });
addMdToPage(`**Average Depression represents the proportion of students who answered "Yes" (coded as 1) to experiencing feelings of depression. This is calculated as the average of all binary responses (1 = Yes, 0 = No) within each financial stress group. A higher average indicates a larger share of students reporting depressive feelings in that group.*`);

addMdToPage(`<br>`);

addMdToPage(`_______________`);

addMdToPage(`
  ## Conclusion

  The two hypothesis we have been looking at are these:
  * *Students with low Study Satisfaction are more likely to be depressed.* 
  * *Students with Financial Stress are more likely to be depressed, and more likely to have Sucidial Thoughts.*
  
  Regarding the **first hypothesis**, we can unfortunately observe that a general sense of depression exists among students. However, the data indicates a clear trend: higher levels of study satisfaction are associated with lower levels of depression. In fact, students who report being dissatisfied with their studies tend to experience significantly more depressive symptoms compared to those who are more content.

  As for the **second hypothesis**, the findings also support its validity. It becomes evident — though both surprising and understandable—just how profoundly financial dependence impacts students. The data underscores that financial stress is not a minor concern, but rather a major factor affecting students' overall mental health and academic well-being.

  `);
