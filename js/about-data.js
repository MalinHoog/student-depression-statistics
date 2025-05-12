addMdToPage(`
  ## About this project
  Welcome reader, this is a school project where I use SQLite, MongoDB, Neo4j, Simple Statistics, Google Charts and JavaScript to show the results of a dataset regarding students in India and depression. 

  _______________________

  ### The Indian School System 
  For students in India the cost of higher education varies signigicantly. Deciding to study at a government institutions instead of a private cost much less. The laws in India states that State-recognized educational institutions are run on a non-profit basis, and the purpose is to make sure more people can afford to educate themselves. Only Indian citizens are accepted into government-driven/public colleges. The fee is minimal, but even if a student-to-be is too poor to afford it it can be written off. 

  Meanwhile, the private schools are operated on a profit busniess model, they receive no funding from the goverment. It is not uncommon that private institutions are more driven by making money than providing a high standard of education and high quality academic programs which, in some cases, makes the newly graduated student unable to be hired. Many of these so-called "education shops" operate without proper accreditation, offering unrecognized courses that mislead students. Despite efforts from regulatory bodies like UGC (University Grants Commission) and AICTE (All India Council of Technical Education) to address the issue, weak legislation and alleged corruption have made it difficult to enforce quality standards. As a result, there is a growing need for institutions to take greater responsibility and implement stronger self-regulation. In fact, a lot of Indians instead resort into studying abroad, often in Australia or the United States. 

  But, India's college system often focuses on science and technology. A lot of the country’s tech schools are famous around the world for being great and having tough academic standards. The Indian Institutes of Technology (IITs) offer programs to over 4,000 students every year, and they’ve become successful thanks to the achievements of their former students in both government and private jobs.

  The Indian Institutes of Technology (IIT) are considered by many to be among the most prestigious schools in the world for engineering, especially in the field of information technology. When people in the West talk about skilled immigration, graduates from these elite institutions are often brought up as examples. One well-known success story is Sabeer Bhatia, an Indian entrepreneur who founded Hotmail - one of the world’s first major web-based email services - which was later sold to Microsoft.

  ### The Student Life
  Overall the cost of living as a student in India is pretty cheap, compared to Europe at least, and the student social life varies depending on where you are. India is a country with a rich history and diverse culture, with 22 official languages and a population of over 1.4 billion people. It is known for its vibrant festivals, delicious cuisine, and beautiful landscapes. However, India also faces significant challenges, including poverty, inequality, and a complex political landscape.

  The education system in India is highly competitive, with a strong emphasis on academic performance. Students often face immense pressure to excel in their studies, which can lead to high levels of stress and anxiety. Mental health issues are becoming increasingly recognized in India, but there is still a stigma surrounding them, making it difficult for students to seek help.

  Many children and teens around the world suffer from anxiety, but the symptoms often go unnoticed, affecting emotional well-being, academic performance, and long-term development. In India, high academic pressure from both society and parents contributes to widespread stress, leading to issues like depression, school avoidance, and even suicidal thoughts. In 2021 alone, 13,089 students in India died by suicide, with academic failure being a major cause - an average of 36 students per day (NCRB, 2022). Most victims were male. This highlights the urgent need for better mental health support in schools, including trained professionals and family counselling to help students cope with pressure both at home and in the classroom.

  Mental health support for students of younger age is often neglected in many Asian countries, including India, where policies rarely prioritize psychological care. There’s a serious shortage of psychologists and social workers, and mental health is usually handled by psychiatrists - if at all. As a result, abused and traumatized children often don’t get the help they need when growing up. In 2020, the Indian government launched the Manodarpan initiative to support students’ mental health during the pandemic, offering a helpline and online resources. However, implementation is uneven, especially in rural areas, and most schools rely on regular teachers instead of trained psychologists.

  _______________

  ### Some information about the data
  * The orginal data has been cleaned due to some answers being not relevant, such as profession being anything else than *Student*. The data is from a survey where Indian students answered questions about their mental health and other relevant factors. About 31 of the answers were therefore not relevant and have been removed.

  * Other than that I have changed answers in some coloumns, such as *Suidical Thoughts*, to be 1 and 0, instead of Yes and No. 

  * I have decided to not change *Sleeping Duration* column's data as I did not think it fair as there is no way of know what the students actually meant with their answers, as the datatype is string with a timespan. Simply put, as an example, if the answer was 8+ hours, it could be anything from 8 hours to 24 hours.

  __________

  ### The story
  As a student myself, I also face challenges with mental health, trying to balance school, work, sleep, and a social life. On top of that, I often struggle with feeling satisfied with my academic performance, while trying to maintain healthy habits, stay on top of my finances, and take care of my dog.

  That’s why I’ve chosen the theme *"The Balance of Being a Student"*, to explore how different aspects of student life - like sleep, diet, financial stress and academic pressure - impact mental health, study satisfaction, and the likelihood of experiencing depression.

  ### Hypothesis
  * Students with low Study Satisfaction are more likely to be depressed. 
  * Students with Financial Stress are more likely to be depressed, and more likely to have Sucidial Thoughts.
  * Students with good Dietary Habits are less likely to have a low CGPA.
  * Students with good Sleeping Habits are less likely to have a low CGPA.
  `);