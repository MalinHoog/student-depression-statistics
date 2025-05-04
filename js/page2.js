addMdToPage(`
  ## Dietary Habits and CGPA

  ### Hypothesis
  * *Students with good Dietary Habits are less likely to have a low CGPA.*
  ________________
  `)

// sorterar bort others i diet

let newthing = await dbQuery(`
SELECT profession AS Profession,
  CASE 
    WHEN cgpa < 6 THEN 'Needs Improvement'
    WHEN cgpa BETWEEN 6 and 7 THEN 'Average'
    WHEN cgpa BETWEEN 7 and 8 THEN 'Good'
    WHEN cgpa BETWEEN 8 AND 9 THEN 'Very Good'
    WHEN cgpa > 9 THEN 'Excellent'
  END AS CGPA_range,
  COUNT(*) AS Amount_Of_Students,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE dietary_habits = 'Healthy' AND cgpa !=0
GROUP BY profession, CGPA_range
ORDER BY profession, CGPA_range
  `);

tableFromData({ data: newthing });

addMdToPage(`<br>`);


let foodhabits = await dbQuery(`
SELECT 
  profession AS Profession,
  COUNT(*) AS Amount_Of_Students,
  CASE
    WHEN dietary_habits = 'Healthy' THEN 'Healthy Diet'
    WHEN dietary_habits = 'Moderate' THEN 'Moderate Diet'
    WHEN dietary_habits = 'Unhealthy' THEN 'Unhealthy Diet'
  END AS Diet_Habits,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE dietary_habits != 'Others'
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);



let dietCategories = [...new Set(foodhabits.map(r => r.Diet_Habits))];
let professions = [...new Set(foodhabits.map(r => r.Profession))];


let lookup = {};
dietCategories.forEach(d => {
  lookup[d] = {};
});
foodhabits.forEach(row => {
  lookup[row.Diet_Habits][row.Profession] = row.Percentage;
});

let chartData = [['Diet_Habits', ...professions]];
dietCategories.forEach(diet => {
  let row = [diet];
  professions.forEach(prof => {
    row.push(lookup[diet][prof] || 0);
  });
  chartData.push(row);
});

drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: 'Diet Habits of the Students',
    height: 500,
    vAxis: {
      title: 'Percentage (%)',
      viewWindow: {
        min: 0,
        max: 40
      }
    },
    hAxis: { title: 'Diet Habits' },
    isStacked: false,
    colors: ['#3366cc'] // justera om du har fler professions
  }
});
tableFromData({ data: foodhabits })

addMdToPage(`<br>`);