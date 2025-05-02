addMdToPage(`
  ## About this project
  Welcome reader, this is a school project where I use SQLite and JavaScript to show the results of a dataset regarding students in India and depression. 

  _______________

  ### Some information about the data
  * The orginal data has been cleaned due to some answers being not relevant, such as profession being anything else than *Student*. The data is from a survey where students answered questions about their mental health and other relevant factors. About 31 of the answers were therefore not relevant and have been removed.

  * Other than that I have changed answers in some coloumns, such as *Suidical Thoughts*, to be 0 and 1, instead of Yes and No. The same change has been made to the coloumn that regards *Family History of Mental Illness*.

  * I have decided to not change *Sleeping Duration* column's data as I did not think it fair as there is no way of know what the students actually meant with their answers, as the datatype is string with a timespan. Simply put, as an example, if the answer was 8+ hours, it could be anything from 8 hours to 24 hours.

  __________

  ### The story
  As a student myself, I also face challenges with mental health, trying to balance school, work, sleep, and a social life. On top of that, I often struggle with feeling satisfied with my academic performance, while trying to maintain healthy habits, stay on top of my finances, and take care of my dog.

  There is much more to discuss about this topic, but looking at the data I start wondering about a few things, some more complex than others:
   * How is the gender distibution amoing the students that are depressed? 
   * Are the students with financial stress more likely to be depressed?
  * How many of the students say they are depressed? And how many of them have suicidal thoughts? Is there any difference if the person has a family history of mental illness?
  * Does the students' sleeping duration affect their study satisfaction? Or their CGPA (Cumulative Grade Point Average)?
  * How many of the students feel academic pressure? And how does that affect their study satisfaction?

  ### Hypothesis
  Students with Financial Stress are more likely to be depressed, and more likley to have Sucidial Thoughts.<br>
  Students with low Study Satisfaction are more likely to be depressed. <br>
  Students with good Dietary Habits are less likely to have a low CGPA. <br>
  Students with good Sleeping Habits are less likely to have a low CGPA, and less Sucidial Thoughts.
  `);