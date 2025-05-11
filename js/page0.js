
addMdToPage(`
  ## Financial Stress and Sucidial Thoughts 

  __________________

  ### Hypothesis:
  * *Students with Financial Stress are more likely to be depressed, and more likley to have Sucidial Thoughts.*
  _____________
`);

addMdToPage(`
  Another factor that can weigh heavily on a student's mind is financial stress.
  Being a student often means living on a tight budget, which can significantly impact mental well-being. A majority of students report that financial concerns are a constant source of stress - especially in a country like India, where education comes at a cost. The pressure of managing expenses while trying to focus on studies can take a serious toll on mental health.
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

