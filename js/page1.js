addMdToPage(`
  ## Student's depression and study satisfaction
 
  _______________

  ### Hypothesis:
  * *Students with low Study Satisfaction are more likely to be depressed*
  
  On this page we will look into the data that concerns the student's study satsfaction and the correlation with reported depression. 

  To make things more clear I will devide the student's answers into 3 groups, regarding their study satisfaction:
  * **Low**: 1 - 2
  * **Medium**: 3
  * **High**: 4 - 5

  _____________
`);

addMdToPage(`
  ### Comparing between the genders
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
  Percentagewise there is not much differenting the genders in their study satisfaction. Both groups show low and medium satisfaction when it comes to their studies. And just about a fifth of all students report that they have high study satisfaction. 
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
  "WHEN study_satisfaction IN (4, 5) THEN 1 " +
  "WHEN study_satisfaction = 3 THEN 2 " +
  "WHEN study_satisfaction IN (1, 2) THEN 3 " +
  "END"
);

tableFromData({ data: studySatisfaction });

addMdToPage(`
  <br>`);

addMdToPage(`
  When we instead look into "the correlation between Study Satisfaction and Depression" diagram we can determine that the more unsatisfied the student's are with their study perfomance, more students report feeling depressed. Which might not be suprising, but even the students with high study satisfaction show that they experience depression. 
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
  data: makeChartFriendly(studySatFac, 'Study Satisfaction', 'Average Depression'),
  options: {
    title: 'The correlation between Study Satisfaction and Depression',
    height: 500,
    vAxis: {
      title: 'Depression (0–1)',
      viewWindow: { min: 0 }
    },
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

addMdToPage(`
  Another factor that can play tricks on the mind of the student is the burden of finacial stress. Being a student usually means that the budget is pretty tight to go around, which can lead to mental health struggling even more. The mayority of the students report that they struggle from thinking about the financial stress. Escpecially since studying in India isn't free. 
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
/*
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
*/
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
  data: makeChartFriendly(combinedSucidialData, 'Financial Stress', 'Avg Dep'),
  options: {
    title: 'The correlation between Financial Stress, Sucidical Thoughts and Depression',
    height: 500,
    vAxis: {
      title: 'Avg Dep',
      viewWindow: { min: 0 }
    },
    hAxis: { title: 'Financial Stress' },
    colors: ['#3366cc']
  }
});
tableFromData({ data: combinedSucidialData });