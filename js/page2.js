addMdToPage(`
  ## CPGA
  `);

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

tableFromData({ data: foodhabits })
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
addMdToPage(`<br>`)

let cgpaData = await dbQuery(`
  SELECT 
    CASE 
      WHEN cgpa < 6 THEN '< 6.0'
      WHEN cgpa BETWEEN 6 AND 7.5 THEN '6.0–7.5'
      ELSE '> 7.5'
    END AS cgpa_range,
  AVG(depression) AS avgDepression
  FROM results
  GROUP BY cgpa_range
  ORDER BY cgpa_range;
`);

tableFromData({ data: cgpaData });

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(cgpaData, 'CGPA-intervall', 'Genomsnittlig depression'),
  options: {
    title: 'Samband mellan CGPA och depression',
    height: 400,
    vAxis: { title: 'Depression (0–1)' },
    hAxis: { title: 'CGPA-intervall' },
    colors: ['#3366cc']
  }
});