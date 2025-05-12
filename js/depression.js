addMdToPage(`
  ## Depression and Study Satisfaction
 
  _______________

  ### Hypothesis:
  * *Students with low Study Satisfaction are more likely to be depressed.*
  
  On this page we will look into the data that concerns the student's study satsfaction and the correlation with reported depression. 

  _____________
`);

addMdToPage(`
   *Disclaimer:*
  To make things more clear I will divide the student's answers into 3 groups, regarding their study satisfaction. In the original dataset, responses were given on a scale from 1 to 5, where 1 indicated a low rating and 5 a high one. However, some entries had a value of 0. After reviewing the data, I concluded that these responses were not relevant, as they appeared to come from students who likely did not take the survey seriously or did not complete it properly.
  * **Low**: 1 - 2
  * **Medium**: 3
  * **High**: 4 - 5

  In this first piechart we can compare the study satisfaction between the genders mentioned in the data: *Female*, *Male* and look at the combined data between the two. 
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




