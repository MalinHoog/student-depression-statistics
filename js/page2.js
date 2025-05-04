addMdToPage(`
  ## Dietary Habits and CGPA

  ### Hypothesis
  * *Students with good Dietary Habits are less likely to have a low CGPA.*
  ________________
  `)

// sorterar bort others i diet

addMdToPage(`<br>`);

let cgpadiet = addDropdown(`Compare diet habits based on CGPA`, ['Below 6.0', 'Between 6 and 7', 'Between 7 and 8', 'Between 8 and 9', 'Above 9', 'All CGPA']);

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

let foodhabitscgpa1 = await dbQuery(`
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
AND cgpa <6
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

let foodhabitscgpa2 = await dbQuery(`
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
AND cgpa BETWEEN 6 and 7
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

let foodhabitscgpa3 = await dbQuery(`
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
AND cgpa BETWEEN 7 and 8
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

let foodhabitscgpa4 = await dbQuery(`
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
AND cgpa BETWEEN 8 and 9
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

let foodhabitscgpa5 = await dbQuery(`
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
AND cgpa > 9
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);


let combinedData, title;
if (cgpadiet == 'Below 6.0') { combinedData = foodhabitscgpa1; title = 'Diet habits of students with cgpa below 6'; }

else if (cgpadiet == 'Between 6 and 7') { combinedData = foodhabitscgpa2; title = 'Diet habits of students with cgpa between 6 and 7'; }

else if (cgpadiet == 'Between 7 and 8') { combinedData = foodhabitscgpa3; title = 'Diet habits of students with cgpa between 7 and 8'; }

else if (cgpadiet == 'Between 8 and 9') { combinedData = foodhabitscgpa4; title = 'Diethabits of students with cgpa between 8 and 9'; }

else if (cgpadiet == 'Above 9') { combinedData = foodhabitscgpa5; title = 'Diet habits of students with cgpa above 9'; }

else { combinedData = foodhabits; title = 'All CGPA'; };


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


let chartDatacgpa = [
  ['Diet Habits', 'Percentage of CGPA']
];
combinedData.forEach(row => {
  chartDatacgpa.push([row.Diet_Habits, row.Percentage]);
});

drawGoogleChart({
  type: 'ColumnChart',
  data: chartDatacgpa,
  options: {
    title: 'Diet Habits of the Students',
    height: 500,
    vAxis: {
      title: 'Percentage (%)',
      viewWindow: {
        min: 0,
        max: 50
      }
    },
    hAxis: { title: 'Diet Habits' },
    isStacked: false,
    colors: ['#3366cc']
  }
});
tableFromData({ data: combinedData })

addMdToPage(`<br>`);

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