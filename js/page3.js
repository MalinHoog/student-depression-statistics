addMdToPage(`
  ## Sleeping habits and CGPA

  __________________

  Another significant factor that greatly impacts a student's well-being is sleep. Sleep plays a vital role in maintaining both physical and mental health, and is essential for concentration, memory retention, and emotional regulation. For students, who often juggle tight schedules, academic demands, and personal responsibilities, getting enough sleep can be a challenge.

  Lack of sufficient rest doesn't just lead to tiredness — it can contribute to increased stress levels, weakened immune function, and even long-term health issues. Despite its importance, sleep is often sacrificed in favor of late-night study sessions or trying to keep up with deadlines, ultimately affecting not only academic performance but overall quality of life.

  Therefore we are taking a look at how students sleeping habits can affect their grades. 

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
  ORDER BY sleep_duration;
  `);

let sleepingHabits1 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa < 6 
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

let sleepingHabits2 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 6 and 7
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

let sleepingHabits3 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 7 and 8
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

let sleepingHabits4 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 8 and 9
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

let sleepingHabits5 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa > 9
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

let combinedData, title;
if (cgpa == 'Below 6.0') { combinedData = sleepingHabits1; title = 'Sleeping habits of students with cgpa below 6'; }

else if (cgpa == 'Between 6 and 7') { combinedData = sleepingHabits2; title = 'Sleeping habits of students with cgpa between 6 and 7'; }

else if (cgpa == 'Between 7 and 8') { combinedData = sleepingHabits3; title = 'Sleeping habits of students with cgpa between 7 and 8'; }

else if (cgpa == 'Between 8 and 9') { combinedData = sleepingHabits3; title = 'Sleeping habits of students with cgpa between 8 and 9'; }

else if (cgpa == 'Above 9') { combinedData = sleepingHabits4; title = 'Sleeping habits of students with cgpa above 9'; }

else { combinedData = sleepingHabits; title = 'All CGPA'; };


let chartData = [
  ['Sleeping Habits', 'Percentage']
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
    vAxis: { title: 'no title' },
    hAxis: { title: 'no title' },
    colors: ['#80ccff', '#1aa3ff', '#b3e0ff', '006bb3'] // olika nyanser av blå
  }
});

tableFromData({ data: combinedData });

addMdToPage(`<br>`);

addMdToPage(`
  The data suggests that many students are not getting sufficient sleep on a regular basis. This may not always be a matter of poor time management - often, elevated stress levels or symptoms of depression can interfere with the ability to fall asleep or maintain restful sleep. Unfortunately, the majority of students appear to be sleeping fewer than six hours per night, which is a concerning trend considering the vital role sleep plays in cognitive function and emotional resilience.

  Interestingly, even students with a CGPA above 9.0 seem to get less sleep than their peers with lower academic scores. This could indicate that high-performing students sacrifice rest in order to maintain their academic standing. Meanwhile, students with mid-range grades - those scoring between 6 and 7 - appear to prioritize sleep slightly more, potentially recognizing its importance for sustaining performance over time.
  `);

addMdToPage(`<br>`);

addMdToPage(`_________________`);

addMdToPage(`
  ## Conclusion

  * *Students with good Sleeping Habits are less likely to have a low CGPA.*

  Surprisingly, the hypothesis that better sleep leads to better academic performance does not align with the data. In fact, students with the highest CGPA scores often report sleeping fewer hours than those with lower grades. This suggests that many high-achieving students may be sacrificing sleep - and even diet - for the sake of academic success.

  Across the board, we see a recurring theme: health and well-being are often deprioritized in student life. While performance is important, these results highlight the need for better balance between academic goals and personal health.
  `);

