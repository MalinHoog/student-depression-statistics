addMdToPage(`
  ## About this project
  Welcome reader, this is a school project where I use SQLite, MongoDB, Neo4j, Simple Statistics, Google Charts and JavaScript to show the results of a dataset regarding students in India and depression. 

  ### India and the education system
  India is a country with a rich history and diverse culture, with 22 official languages and a population of over 1.4 billion people. It is known for its vibrant festivals, delicious cuisine, and beautiful landscapes. However, India also faces significant challenges, including poverty, inequality, and a complex political landscape.
  
  The education system in India is highly competitive, with a strong emphasis on academic performance. Students often face immense pressure to excel in their studies, which can lead to high levels of stress and anxiety. Mental health issues are becoming increasingly recognized in India, but there is still a stigma surrounding them, making it difficult for students to seek help.

  _______________

  ### Some information about the data
  * The orginal data has been cleaned due to some answers being not relevant, such as profession being anything else than *Student*. The data is from a survey where Indian students answered questions about their mental health and other relevant factors. About 31 of the answers were therefore not relevant and have been removed.

  * Other than that I have changed answers in some coloumns, such as *Suidical Thoughts*, to be 1 and 0, instead of Yes and No. 

  * I have decided to not change *Sleeping Duration* column's data as I did not think it fair as there is no way of know what the students actually meant with their answers, as the datatype is string with a timespan. Simply put, as an example, if the answer was 8+ hours, it could be anything from 8 hours to 24 hours.

  __________

  ### The story
  As a student myself, I also face challenges with mental health, trying to balance school, work, sleep, and a social life. On top of that, I often struggle with feeling satisfied with my academic performance, while trying to maintain healthy habits, stay on top of my finances, and take care of my dog.

  That’s why I’ve chosen the theme *"The Balance of Being a Student"*, to explore how different aspects of student life — like sleep, diet, financial stress and academic pressure — impact mental health, study satisfaction, and the likelihood of experiencing depression.

  ### Hypothesis
  * Students with low Study Satisfaction are more likely to be depressed. 
  * Students with Financial Stress are more likely to be depressed, and more likely to have Sucidial Thoughts.
  * Students with good Dietary Habits are less likely to have a low CGPA.
  * Students with good Sleeping Habits are less likely to have a low CGPA.
  `);