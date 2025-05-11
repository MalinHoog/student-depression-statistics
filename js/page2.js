addMdToPage(`
  ## Dietary Habits and CGPA

  ### Hypothesis
  * *Students with good Dietary Habits are less likely to have a low CGPA.*
  ________________
  `)

addMdToPage(`
  One aspect of student life that often goes overlooked is diet.
  While it’s widely known that a healthy diet contributes to improved well-being and longevity, maintaining good eating habits can be particularly challenging for students. Between academic pressures, time constraints, and limited budgets, prioritizing nutritious meals isn't always easy. In times of stress, many - myself included - turn to fast food or delivery apps as a way to save time and stay focused on studies.

  However, this raises an important question: How does a student’s diet influence their academic performance, particularly their average CGPA*? <br>
  **CGPA = Cumulative Grade Point Average.* <br>

  In the survey some students reported a 0 on their CGPA. Also in this case, after reviewing the data, I concluded that these responses were not relevant, as they appeared to come from students who likely did not take the survey seriously or did not complete it properly.
  
  Understanding the relationship between dietary habits and academic outcomes may provide valuable insights into how students can better support their mental and cognitive well-being.
  `);

addMdToPage(`____________`);

addMdToPage(`
  For starters, let's just have a look at the grades among the students, without taking the diet into account. Many of them seem to be doing pretty well in their studies. 
  `);

addMdToPage(`<br>`);

let overview = await dbQuery(`
SELECT profession AS Profession,
  CASE 
    WHEN cgpa BETWEEN 5 AND 5.99 THEN 'Needs Improvement'
    WHEN cgpa BETWEEN 6 and 6.99 THEN 'Average'
    WHEN cgpa BETWEEN 7 and 7.99 THEN 'Good'
    WHEN cgpa BETWEEN 8 AND 8.99 THEN 'Very Good'
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
WHEN cgpa BETWEEN 8 AND 8.99 THEN 2
WHEN cgpa BETWEEN 7 and 7.99 THEN 3
WHEN cgpa BETWEEN 6 and 6.99 THEN 4
WHEN cgpa BETWEEN 5 AND 5.99 THEN 5
END;
  `);

tableFromData({ data: overview });

addMdToPage(`
  **Understanding CGPA Levels** <br>
  While interpretations can vary, the following serves as a general guideline that I've used in this project:

  * **Excellent** – 9.0 and above:
  Reflects top academic performance and access to elite opportunities.

  * **Very Good** – 8.0 to 8.9:
  Strong results, typically enough for competitive programs or positions.

  * **Good** – 7.0 to 7.9:
  Solid academic standing, suitable for most career and study paths.

  * **Average** – 6.0 to 6.9:
  Moderate performance; may require extra credentials to stand out.

  * **Needs Improvement** – Below 6.0:
  Indicates academic struggles; focus on improving grades or gaining experience.
  `);

addMdToPage(`<br>`);

addMdToPage(`But further more, let's see if their diet habits can affect their studies: `);

let cgpadiet = addDropdown(`Compare diet habits based on CGPA`, ['Needs Improvement', 'Average', 'Good', 'Very Good', 'Excellent', 'All CGPA']);

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
AND cgpa BETWEEN 5 AND 5.99
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
AND cgpa BETWEEN 6 AND 6.99
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
AND cgpa BETWEEN 7 and 7.99
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
AND cgpa BETWEEN 8 and 8.99
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
if (cgpadiet == 'Needs Improvement') { combinedData = foodhabitscgpa1; title = 'Diet habits of students with cgpa below 5.99'; }

else if (cgpadiet == 'Average') { combinedData = foodhabitscgpa2; title = 'Diet habits of students with cgpa between 6 and 6.99'; }

else if (cgpadiet == 'Good') { combinedData = foodhabitscgpa3; title = 'Diet habits of students with cgpa between 7 and 7.99'; }

else if (cgpadiet == 'Very Good') { combinedData = foodhabitscgpa4; title = 'Diethabits of students with cgpa between 8 and 8.99'; }

else if (cgpadiet == 'Excellent') { combinedData = foodhabitscgpa5; title = 'Diet habits of students with cgpa above 9.0'; }

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
In the data above reveals a somewhat unexpected trend regarding students’ dietary habits and academic performance. Contrary to what one might assume, there appears to be little variation in diet quality based on students' CGPA. While the majority of students report following an unhealthy diet, their academic performance remains relatively close to the average - suggesting that poor dietary choices do not immediately translate to lower grades.

Interestingly, even among high-achieving students with a CGPA above 9.0, unhealthy eating habits are still prevalent. These students often prioritize academic success over personal health, choosing to sacrifice a balanced diet in order to devote more time and energy to their studies.

On the other hand, students with lower grades tend to be more committed to maintaining a healthy lifestyle. While their academic results may not be as strong, their dedication to healthier eating suggests a different set of priorities - perhaps aiming for long-term well-being over short-term academic pressure.
  `);

addMdToPage(`<br>`);

