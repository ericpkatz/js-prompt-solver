const seed = async function({ conn, data }){
  const course = await conn.models.course.create({ title: data.title });
  let topics = data.topics.map( topic => {
    return {
      title: topic.title,
      courseId: course.id
    };
  });
  topics = await Promise.all(topics.map(topic => conn.models.topic.create(topic)));
  let codePrompts = [];
  const promises = data.topics.map((topic, idx) => {
    return Promise.all(topic.codePrompts.map((codePrompt)=> {
      return conn.models.codePrompt.create({
        ...codePrompt,
        topicId: topics[idx].id
      })
      .then( _created => {
        return Promise.all(codePrompt.tests.map( test => {
          return conn.models.test.create(test)
            .then(_test => conn.models.codePromptTest.create({testId: _test.id, codePromptId: _created.id }));
        }));
      });
    }));
  });
  await Promise.all(promises);
  await Promise.all(data.cohorts.map( async(cohort) => {
    return conn.models.cohort.create({
      name: cohort.name,
      courseId: course.id,
      topicId: (await conn.models.topic.findOne({
        where: {
          title: 'Introduction to functions'
        }
      })).id
    })
    .then( _cohort => {
      return Promise.all(
        cohort.enrollments.map( user => {
          return conn.models.user.create(user)
            .then( _user => {
              return conn.models.enrollment.create({
                userId: _user.id,
                cohortId: _cohort.id
              })
              .then( enrollment => {
                return Promise.all((user.promptAttempts || []).map( async(promptAttempt) => {
                  const codePrompt = await conn.models.codePrompt.findOne({
                      where: {
                        title: promptAttempt.title 
                      }
                    });
                  if(!codePrompt){
                    throw `no code prompt for ${promptAttempt.title}`;
                  }
                  return conn.models.promptAttempt.create({
                    attempt: promptAttempt.attempt,
                    submitted: promptAttempt.submitted,
                    enrollmentId: enrollment.id,
                    codePromptId: codePrompt.id
                  })
                  .then(_promptAttempt => {
                    if(promptAttempt.tests){
                      return Promise.all(
                        promptAttempt.tests.map( test => {
                          return conn.models.test.create(test)
                            .then( test => {
                              return conn.models.promptAttemptTest.create({testId: test.id, promptAttemptId: _promptAttempt.id})
                            })
                        })
                      )
                      console.log(promptAttempt.tests);
                    }
                  })
                }));
              });
            });
        })
      );
    });
  }));
  console.log('map again for reviews');
  for(let i = 0; i < data.cohorts.length; i++){
    //get the cohort
    const cohort = await conn.models.cohort.findOne({
      where: {
        name: data.cohorts[i].name
      }
    });
    for(let j = 0; j < data.cohorts[i].reviews.length; j++){
      const { from, to, comments, title } = data.cohorts[i].reviews[j];
      const fromEnrollment = await conn.models.enrollment.findOne({
        include: [
          { 
            model: conn.models.user,
            where: {
              login: from
            }
          },
          {
            model: conn.models.cohort,
            where: {
              name: cohort.name
            }
          }
        ]
      }); 
      const toEnrollment = await conn.models.enrollment.findOne({
        include: [
          { 
            model: conn.models.user,
            where: {
              login: to
            }
          },
          {
            model: conn.models.cohort,
            where: {
              name: cohort.name
            }
          }
        ]
      }); 
      const promptAttempt = await conn.models.promptAttempt.findOne({
        where: {
          enrollmentId: toEnrollment.id
        },
        include: [
          { 
            model: conn.models.codePrompt,
            where: {
              title
            }
          },
        ]
      }); 
      await conn.models.feedback.create({
        promptAttemptId: promptAttempt.id,
        enrollmentId: fromEnrollment.id,
        comments
      });
    }
  }
  const users = (await conn.models.user.findAll()).map( user => {
    return {
      ...(user.get()),
      url: `http://localhost:3000/login/${user.generateToken()}`
    }
  });
  return users.reduce((acc, user)=> {
    acc[user.login] = user;
    return acc;
  }, {});

  //console.log(codePrompts);
  //codePrompts = await Promise.all(codePrompts.map( codePrompt => conn.models.codePrompt.create(codePrompt)));
}

module.exports = seed;
