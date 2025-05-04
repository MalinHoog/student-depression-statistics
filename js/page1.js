addMdToPage(`
  ## Looking at the data, focusing on depression
  _______________

  ### Hypothesis:
  *Students with low Study Satisfaction are more likely to be depressed*

  In the data there is a column called *study_satisfaction*, which is a number between 0 and 5. The higher the number, the more satisfied the student is with their studies. But while looking over the data set, I noticed that there are some students that have set their CGPA, Study Satisfaction and Academic Pressure to 0. So when working with the data, I will not include these answers, as it seems they are not real answers. I can only assume that these students did not fill in the survey properly.

  So, to make things more clear I will devide the student's answers into 3 groups, regarding their study satisfaction:
  * **Low**: 1 - 2
  * **Medium**: 3
  * **High**: 4 - 5

  _____________
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
  "WHEN study_satisfaction IN (4, 5) THEN 1 " +
  "WHEN study_satisfaction = 3 THEN 2 " +
  "WHEN study_satisfaction IN (1, 2) THEN 3 " +
  "END"
);

tableFromData({ data: studySatisfaction });

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
  data: makeChartFriendly(studySatFac, 'Study Satisfaction', 'Average Depression'),
  options: {
    title: 'The correlation between Study Satisfaction and Depression',
    height: 500,
    vAxis: { title: 'Depression (0–1)' },
    hAxis: { title: 'Study Satisfaction' },
    colors: ['#3366cc']
  }
});

addMdToPage(`<br>`);

addMdToPage(`______________`);

addMdToPage(`
  ### Hypothesis:
  * *Students with Financial Stress are more likely to be depressed, and more likley to have Sucidial Thoughts.*
  _____________
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
  data: makeChartFriendly(finansStressDepression, 'Finance', 'Avrerage Depression'),
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

addMdToPage(`<br>`);

let studentDepression = await dbQuery(
  "SELECT profession AS Profession, " +
  "gender AS Gender, " +
  "CASE " +
  "WHEN depression = 0 THEN 'Does Not Feel Depressed' " +
  "WHEN depression = 1 THEN 'Does Feel Depressed' " +
  "END AS Depression_Level, " +
  "COUNT(*) AS Amount_Of_Students, " +
  "ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession, gender), 1) AS Percentage " +
  "FROM results " +
  "WHERE depression IS NOT NULL AND gender IS NOT NULL " +
  "GROUP BY profession, gender, Depression_Level " +
  "ORDER BY profession, gender, Depression_Level"
);

tableFromData({ data: studentDepression });

addMdToPage(`<br>`);

let sucidical = addDropdown('Compare Financial Stress and Depression depending on Sucidial Thoughts', ['Yes', 'No', 'Both']);

let studentDepSucidial = await dbQuery(`
SELECT 
  CASE 
    WHEN financial_stress = 1 THEN 'No Financial Stress'
    WHEN financial_stress = 2 THEN 'Minor Financial Stress'
    WHEN financial_stress = 3 THEN 'Moderate Financial Stress'
    WHEN financial_stress = 4 THEN 'Major Financial Stress'
    WHEN financial_stress = 5 THEN 'Severe Financial Stress'
  END AS Financial_Stress,
  AVG(depression) AS Avg_Dep
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
  AVG(depression) AS Avg_Dep
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
  AVG(depression) AS Avg_Dep
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
if (sucidical === 'Yes') {
  combinedSucidialData = studentDepSucidial;
  title1 = 'Students who have suicidal thoughts';
} else if (sucidical === 'No') {
  combinedSucidialData = studentDepNotSucidial;
  title1 = 'Students who do not have suicidal thoughts';
} else {
  combinedSucidialData = studentDepSucidicalBoth;
  title1 = 'All students';
};


// tableFromData({ data: studentDepSucidial });


drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(combinedSucidialData, 'Financial Stress', 'Avg Dep'),
  options: {
    title: 'The correlation between Financial Stress, Sucidical Thoughts and Depression',
    height: 500,
    vAxis: { title: 'Avg Dep' },
    hAxis: { title: 'Financial Stress' },
    colors: ['#3366cc']
  }
});