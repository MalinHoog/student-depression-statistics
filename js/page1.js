addMdToPage(`
  ## Indian Students

  In the data there is a column called *study_satisfaction*, which is a number between 0 and 5. The higher the number, the more satisfied the student is with their studies. But while looking over the data set, I noticed that there are some students that have set their CGPA, Study Satisfaction and Academic Pressure to 0. So when working with the data, I will not include these answers, as it seems they are not real answers. I can only assume that these students did not fill in the survey properly.

  So, to make things more clear I will devide the student's answers into 3 groups, regarding their study satisfaction:
  * **Low**: 1 - 2
  * **Medium**: 3
  * **High**: 4 - 5
`);

addMdToPage(`<br>`);

let studySatisfaction = await dbQuery(
  "SELECT profession AS Profession, " +
  "gender AS Gender, " +
  "CASE " +
  "WHEN study_satisfaction IN (1, 2) THEN 'Low (1-2)' " +
  "WHEN study_satisfaction = 3 THEN 'Medium (3)' " +
  "WHEN study_satisfaction IN (4, 5) THEN 'High (4-5)' " +
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

addMdToPage(`<br>`);

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

/*
let studentDepression2 = await dbQuery(
  "SELECT profession AS Profession, " +
  "gender AS Gender, " +
  "CASE " +
  "WHEN depression = 0 THEN 'Does Not Feel Depressed' " +
  "WHEN depression = 1 THEN 'Does Feel Depressed' " +
  "END AS Depression_Level, " +
  "ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession, gender), 1) AS Percentage " +
  "FROM results " +
  "WHERE depression IS NOT NULL AND gender IS NOT NULL " +
  "GROUP BY profession, gender, Depression_Level " +
  "ORDER BY profession, gender, Depression_Level"
);

studentDepression2 = studentDepression2.filter(row =>
  typeof row.Percentage === 'number' && !isNaN(row.Percentage)
);

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(studentDepression2, 'Profession', 'Percentage', 'Depression_Level'),
  options: {
    title: 'Depression Level by Profession and Gender',
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    },
    height: 600,
    chartArea: { left: 75, bottom: 150, width: '85%' },
    legend: { position: 'top' },
    vAxis: { title: 'Percentage (%)' },
    hAxis: {
      title: 'Profession',
      slantedText: true,
      slantedTextAngle: 45
    },
    colors: ['#66bb6a', '#ef5350'] // grönt = mår bra, rött = deprimerad
  }
});
*/
