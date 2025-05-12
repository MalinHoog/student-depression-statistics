addMdToPage(`
  ## Sleeping Habits and CGPA

  __________________

  Another significant factor that greatly impacts a student's well-being is sleep. Sleep plays a vital role in maintaining both physical and mental health, and is essential for concentration, memory retention, and emotional regulation. For students, who often juggle tight schedules, academic demands, and personal responsibilities, getting enough sleep can be a challenge.

  Lack of sufficient rest doesn't just lead to tiredness - it can contribute to increased stress levels, weakened immune function, and even long-term health issues. Despite its importance, sleep is often sacrificed in favor of late-night study sessions or trying to keep up with deadlines, ultimately affecting not only academic performance but overall quality of life.

  Therefore we are taking a look at how students sleeping habits can affect their grades. 

  In the survey some students reported a 0 on their CGPA. Also in this case, after reviewing the data, I concluded that these responses were not relevant, as they appeared to come from students who likely did not take the survey seriously or did not complete it properly.

  ### Hypothesis
  * *Students with good Sleeping Habits are less likely to have a low CGPA.** <br>
  **CGPA = Cumulative Grade Point Average.* 
  _______________
  `);


let cgpa = addDropdown('Check the sleeping habits based on students CGPA', ['Needs Improvement', 'Average', 'Good', 'Very Good', 'Excellent', 'All CGPA']);

// all students 
let sleepingHabits = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 5 AND 10
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

// students that "needs improvment" in their studies
let sleepingHabits1 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 5 AND 5.99
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

// students with "Average" grades
let sleepingHabits2 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 6 and 6.99
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

// students with "Good" grades
let sleepingHabits3 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 7 and 7.99
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

// students with "Very Good" grades
let sleepingHabits4 = await dbQuery(`
  SELECT sleep_duration, COUNT(*) AS Amount_Of_Students, 
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY profession), 1) AS Percentage
  FROM results
  WHERE sleep_duration != 'Others'
  AND cgpa BETWEEN 8 and 8.99
  GROUP BY sleep_duration
  ORDER BY sleep_duration;
  `);

// // students with "Excellent" grades
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
if (cgpa == 'Needs Improvement') { combinedData = sleepingHabits1; title = 'Sleeping habits of students with CGPA between 5.0 and 5.99'; }

else if (cgpa == 'Average') { combinedData = sleepingHabits2; title = 'Sleeping habits of students with CGPA between 6.0 and 6.99'; }

else if (cgpa == 'Good') { combinedData = sleepingHabits3; title = 'Sleeping habits of students with CGPA between 7.0 and 7.99'; }

else if (cgpa == 'Very Good') { combinedData = sleepingHabits4; title = 'Sleeping habits of students with CGPA between 8.0 and 8.99'; }

else if (cgpa == 'Excellent') { combinedData = sleepingHabits5; title = 'Sleeping habits of students with cgpa above 9.0'; }

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
    colors: ['#80ccff', '#1aa3ff', '#b3e0ff', '006bb3'] // olika nyanser av blå
  }
});

tableFromData({ data: combinedData });

addMdToPage(`<br>`);

addMdToPage(`
  **Understanding CGPA Levels** <br>
  While interpretations can vary, the following serves as a general guideline that I've used in this project:

  * **Excellent** – 9.0 and above:
  Reflects top academic performance and access to elite opportunities.

  * **Very Good** – 8.0 to 8.99:
  Strong results, typically enough for competitive programs or positions.

  * **Good** – 7.0 to 7.99:
  Solid academic standing, suitable for most career and study paths.

  * **Average** – 6.0 to 6.99:
  Moderate performance; may require extra credentials to stand out.

  * **Needs Improvement** – Below 6.0:
  Indicates academic struggles; focus on improving grades or gaining experience.
  `);

addMdToPage(`<br>`);


addMdToPage(`
  The data suggests that many students are not getting sufficient sleep on a regular basis. This may not always be a matter of poor time management - often, elevated stress levels or symptoms of depression can interfere with the ability to fall asleep or maintain restful sleep. Unfortunately, the majority of students appear to be sleeping fewer than six hours per night, which is a concerning trend considering the vital role sleep plays in cognitive function and emotional resilience.

  Interestingly, even students with a CGPA above 9.0 seem to get less sleep than their peers with lower academic scores. This could indicate that high-performing students sacrifice rest in order to maintain their academic standing. Meanwhile, students with mid-range grades - those scoring between 6 and 7 - appear to prioritize sleep slightly more, potentially recognizing its importance for sustaining performance over time.
  `);
