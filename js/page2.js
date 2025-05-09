addMdToPage(`
  ## Dietary Habits and CGPA

  ### Hypothesis
  * *Students with good Dietary Habits are less likely to have a low CGPA.*
  ________________
  `)

addMdToPage(`
  One aspect of student life that often goes overlooked is diet.
  While it’s widely known that a healthy diet contributes to improved well-being and longevity, maintaining good eating habits can be particularly challenging for students. Between academic pressures, time constraints, and limited budgets, prioritizing nutritious meals isn't always easy. In times of stress, many — myself included — turn to fast food or delivery apps as a way to save time and stay focused on studies.

  However, this raises an important question: How does a student’s diet influence their academic performance, particularly their average CGPA?
  
  Understanding the relationship between dietary habits and academic outcomes may provide valuable insights into how students can better support their mental and cognitive well-being.
  `);


addMdToPage(`<br>`);

let overview = await dbQuery(`
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
ORDER BY 
CASE 
WHEN cgpa > 9 THEN 1
WHEN cgpa BETWEEN 8 AND 9 THEN 2
WHEN cgpa BETWEEN 7 and 8 THEN 3
WHEN cgpa BETWEEN 6 and 7 THEN 4
WHEN cgpa < 6 THEN 5
END;
  `);

tableFromData({ data: overview });

addMdToPage(`
  For starters, let's just have a look at the grades among the students. Many of them seem to be doing pretty well in their studies. But further more, let's see if their diet habits can affect their studies: 
  `);

let cgpadiet = addDropdown(`Compare diet habits based on CGPA`, ['Below 6.0', 'Between 6 and 7', 'Between 7 and 8', 'Between 8 and 9', 'Above 9', 'All CGPA']);

// sorterar bort others i diet
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
  ['Diet Habits', 'Percentage of students']
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

addMdToPage(`
In the data above reveals a somewhat unexpected trend regarding students’ dietary habits and academic performance. Contrary to what one might assume, there appears to be little variation in diet quality based on students' CGPA. While the majority of students report following an unhealthy diet, their academic performance remains relatively close to the average—suggesting that poor dietary choices do not immediately translate to lower grades.

Interestingly, even among high-achieving students with a CGPA above 9.0, unhealthy eating habits are still prevalent. These students often prioritize academic success over personal health, choosing to sacrifice a balanced diet in order to devote more time and energy to their studies.

On the other hand, students with lower grades tend to be more committed to maintaining a healthy lifestyle. While their academic results may not be as strong, their dedication to healthier eating suggests a different set of priorities—perhaps aiming for long-term well-being over short-term academic pressure.
  `);

addMdToPage(`<br>`);

addMdToPage(`______________`);

addMdToPage(`
  ## Conclusion

  ### Hypothesis
  * *Students with good Dietary Habits are less likely to have a low CGPA.*

  From the data that we've taken a look at we can conclude that this hypothesis is not true, quite the oppisite, which is suprising for me. But also makes sense as perhaps a lot of students that wants to keep a above average grade decided to spend less time on making sure they eat healthy and propably more time on their studies. 
  `);
