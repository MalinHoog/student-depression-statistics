addMdToPage(`
  ## CPGA
  `);



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