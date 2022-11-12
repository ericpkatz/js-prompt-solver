const conn = require('./conn');
const { STRING, TEXT } = conn.Sequelize;
const { id } = require('./common');

const Course = conn.define('course', {
  id,
  title: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: TEXT,
  },
});

Course.seed = async function(data){
  const course = await this.create({ title: data.title });
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
          return conn.models.test.create({ ...test, codePromptId: _created.id });

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
                  return conn.models.promptAttempt.create({
                    attempt: promptAttempt.attempt,
                    submitted: promptAttempt.submitted,
                    enrollmentId: enrollment.id,
                    codePromptId: (await conn.models.codePrompt.findOne({
                      where: {
                        title: `the add function with two numbers`
                      }
                    })).id
                  })
                }));
              });
            });
        })
      );
    });
  }));

  //console.log(codePrompts);
  //codePrompts = await Promise.all(codePrompts.map( codePrompt => conn.models.codePrompt.create(codePrompt)));
}

module.exports = Course;
