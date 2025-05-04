addMdToPage(`
  ## CPGA

  ________________
  `);

addMdToPage(`<br>`);

/*
drawGoogleChart({
  type: 'PieChart',
  data: makeChartFriendly(sleepingHabits1),
  options: {
    title: 'Sleeping Habits',
    height: 600,
    vAxis: { title: 'ssometing' },
    hAxis: { title: 'sometj' },
    colors: ['#b3e0ff', '#80ccff', '#1aa3ff', '006bb3'] // olika nyanser av blå
  }
});
*/

addMdToPage(`__________`);



// sorterar bort others i diet

let newthing = await dbQuery(`
SELECT profession AS Profession,
  CASE 
    WHEN cgpa < 6 THEN 'Needs Improvement'
    WHEN cgpa BETWEEN 6 and 7 THEN 'Average'
    WHEN cgpa BETWEEN 7 and 8 THEN 'Good'
    WHEN cgpa BETWEEN 8 AND 9 THEN 'Very Good'
    WHEN cgpa > 9 THEN 'Excellent'
  END AS cgpa_range,
  COUNT(*) AS Amount_Of_Students,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE dietary_habits = 'Healthy' AND cgpa !=0
GROUP BY profession, cgpa_range
ORDER BY profession, cgpa_range
  `);

tableFromData({ data: newthing });

/*
drawGoogleChart({
  type: 'PieChart',
  data: makeChartFriendly(newthing),
  options: {
    title: 'anything',
    height: 600,
    vAxis: { title: 'ssometing' },
    hAxis: { title: 'sometj' },
    colors: ['#00bfff', '#0080ff', '#0000ff', '#0080ff', '#0000ff'] // olika nyanser av blå
  }
});
*/

addMdToPage(`<br>`);

/*
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(newthing),
  options: {
    title: 'Samband mellan CGPA och depression',
    height: 400,
    vAxis: { title: 'Depression (0–1)' },
    hAxis: { title: 'CGPA-intervall' },
    colors: ['#3366cc']
  }
});
*/
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

tableFromData({ data: foodhabits })

let foodhabitsanddepression = await dbQuery(`
SELECT 
  profession AS Profession,
  COUNT(*) AS Amount_Of_Students,
  CASE
    WHEN dietary_habits = 'Healthy' THEN 'Healthy Diet'
    WHEN dietary_habits = 'Moderate' THEN 'Moderate Diet'
    WHEN dietary_habits = 'Unhealthy' THEN 'Unhealthy Diet'
  END AS Diet_Habits,
  AVG(depression) AS Depression,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE dietary_habits != 'Others'
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

tableFromData({ data: foodhabitsanddepression })

addMdToPage(`Low Study Satisfaction`)

let lowFoodHabitsDepStudy = await dbQuery(`
SELECT 
  profession AS Profession,
  COUNT(*) AS Amount_Of_Students,
  CASE
    WHEN dietary_habits = 'Healthy' THEN 'Healthy Diet'
    WHEN dietary_habits = 'Moderate' THEN 'Moderate Diet'
    WHEN dietary_habits = 'Unhealthy' THEN 'Unhealthy Diet'
  END AS Diet_Habits,
  AVG(depression) AS Depression,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE study_satisfaction IN (1, 2) 
AND dietary_habits != 'Others' 
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

tableFromData({ data: lowFoodHabitsDepStudy })

addMdToPage(`Medium Study Satisfaction`)

let mediumFoodHabitsDepStudy = await dbQuery(`
SELECT 
  profession AS Profession,
  COUNT(*) AS Amount_Of_Students,
  CASE
    WHEN dietary_habits = 'Healthy' THEN 'Healthy Diet'
    WHEN dietary_habits = 'Moderate' THEN 'Moderate Diet'
    WHEN dietary_habits = 'Unhealthy' THEN 'Unhealthy Diet'
  END AS Diet_Habits,
  AVG(depression) AS Depression,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE study_satisfaction = 3
AND dietary_habits != 'Others' 
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

tableFromData({ data: mediumFoodHabitsDepStudy })

addMdToPage(`Great Study Satisfaction`)

let greatFoodHabitsDepStudy = await dbQuery(`
SELECT 
  profession AS Profession,
  COUNT(*) AS Amount_Of_Students,
  CASE
    WHEN dietary_habits = 'Healthy' THEN 'Healthy Diet'
    WHEN dietary_habits = 'Moderate' THEN 'Moderate Diet'
    WHEN dietary_habits = 'Unhealthy' THEN 'Unhealthy Diet'
  END AS Diet_Habits,
  AVG(depression) AS Depression,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
FROM results
WHERE study_satisfaction IN (4, 5)
AND dietary_habits != 'Others' 
GROUP BY profession, dietary_habits
ORDER BY profession, dietary_habits;
  `);

tableFromData({ data: greatFoodHabitsDepStudy })

/*
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(foodhabits, 'CGPA-intervall', 'Genomsnittlig depression'),
  options: {
    title: 'Samband mellan CGPA och depression',
    height: 400,
    vAxis: { title: 'Depression (0–1)' },
    hAxis: { title: 'CGPA-intervall' },
    colors: ['#3366cc']
  }
});
*/
addMdToPage(`____________`)
