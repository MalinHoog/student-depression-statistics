addMdToPage(`
  ## Sleeping Habits among students

  ### Hypothesis
  * *Students with good Sleeping Habits are less likely to have a low CGPA.*
  _______________
  `);



let cgpa = addDropdown('Check the sleeping habits based on students CGPA', ['Below 6.0', 'Between 6 and 7', 'Between 7 and 8', 'Between 8 and 9', 'Above 9', 'All CGPA']);

let sleepingHabits = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  GROUP BY sleep_duration
  ORDER BY 
  CASE
  WHEN sleep_duration = 'Less than 5 hours' THEN 1
  WHEN sleep_duration = '5-6 hours' THEN 2
  WHEN sleep_duration = '7-8 hours' THEN 3
  WHEN sleep_duration = 'More than 8 hours' THEN 4
  END;
  `);

let sleepingHabits1 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa < 6 
  GROUP BY sleep_duration
  ORDER BY 
  CASE
  WHEN sleep_duration = 'Less than 5 hours' THEN 1
  WHEN sleep_duration = '5-6 hours' THEN 2
  WHEN sleep_duration = '7-8 hours' THEN 3
  WHEN sleep_duration = 'More than 8 hours' THEN 4
  END;
  `);

let sleepingHabits2 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 6 and 7
  GROUP BY sleep_duration
  ORDER BY 
  CASE
  WHEN sleep_duration = 'Less than 5 hours' THEN 1
  WHEN sleep_duration = '5-6 hours' THEN 2
  WHEN sleep_duration = '7-8 hours' THEN 3
  WHEN sleep_duration = 'More than 8 hours' THEN 4
  END;
  `);

let sleepingHabits3 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 7 and 8
  GROUP BY sleep_duration
  ORDER BY 
  CASE
  WHEN sleep_duration = 'Less than 5 hours' THEN 1
  WHEN sleep_duration = '5-6 hours' THEN 2
  WHEN sleep_duration = '7-8 hours' THEN 3
  WHEN sleep_duration = 'More than 8 hours' THEN 4
  END;
  `);

let sleepingHabits4 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 8 and 9
  GROUP BY sleep_duration
  ORDER BY 
  CASE
  WHEN sleep_duration = 'Less than 5 hours' THEN 1
  WHEN sleep_duration = '5-6 hours' THEN 2
  WHEN sleep_duration = '7-8 hours' THEN 3
  WHEN sleep_duration = 'More than 8 hours' THEN 4
  END;
  `);

let sleepingHabits5 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa > 9
  GROUP BY sleep_duration
  ORDER BY 
  CASE
  WHEN sleep_duration = 'Less than 5 hours' THEN 1
  WHEN sleep_duration = '5-6 hours' THEN 2
  WHEN sleep_duration = '7-8 hours' THEN 3
  WHEN sleep_duration = 'More than 8 hours' THEN 4
  END;
  `);

let combinedData, title;
if (cgpa == 'Below 6.0') { combinedData = sleepingHabits1; title = 'Sleeping habits of students with cgpa below 6'; }

else if (cgpa == 'Between 6 and 7') { combinedData = sleepingHabits2; title = 'Sleeping habits of students with cgpa between 6 and 7'; }

else if (cgpa == 'Between 7 and 8') { combinedData = sleepingHabits3; title = 'Sleeping habits of students with cgpa between 7 and 8'; }

else if (cgpa == 'Between 8 and 9') { combinedData = sleepingHabits3; title = 'Sleeping habits of students with cgpa between 8 and 9'; }

else if (cgpa == 'Above 9') { combinedData = sleepingHabits4; title = 'Sleeping habits of students with cgpa above 9'; }

else { combinedData = sleepingHabits; title = 'All CGPA'; };


let chartData = [
  ['Sleeping Habits', 'Percentage of CGPA']
];
combinedData.forEach(row => {
  chartData.push([row.sleep_duration, row.Percentage]);
});


drawGoogleChart({
  type: 'PieChart',
  data: makeChartFriendly(combinedData),
  options: {
    title,
    height: 600,
    vAxis: { title: 'ssometing' },
    hAxis: { title: 'sometj' },
    colors: ['#b3e0ff', '#80ccff', '#1aa3ff', '006bb3'] // olika nyanser av blå
  }
});

tableFromData({ data: combinedData });
