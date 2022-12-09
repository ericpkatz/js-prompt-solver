const conn = require('./conn');
const User = require('./User');
const Course = require('./Course');
const CodePrompt = require('./CodePrompt');
const Topic = require('./Topic');
const Enrollment = require('./Enrollment');
const Cohort = require('./Cohort');
const PromptAttempt = require('./PromptAttempt');
const Feedback = require('./Feedback');
const Test = require('./Test');
const CodePromptTest = require('./CodePromptTest');
const PromptAttemptTest = require('./PromptAttemptTest');

Enrollment.belongsTo(User);
Enrollment.belongsTo(Cohort);

Cohort.hasMany(Enrollment);
User.hasMany(Enrollment);

Cohort.belongsTo(Course);
Course.hasMany(Cohort);

Topic.belongsTo(Course);
Course.hasMany(Topic);

Cohort.belongsTo(Topic);

CodePrompt.belongsTo(Topic);
Topic.hasMany(CodePrompt);

PromptAttempt.belongsTo(Enrollment);
PromptAttempt.belongsTo(CodePrompt);

Enrollment.hasMany(Feedback);
Enrollment.hasMany(PromptAttempt);
CodePrompt.hasMany(PromptAttempt);

Feedback.belongsTo(PromptAttempt);
Feedback.belongsTo(Enrollment);

PromptAttempt.hasMany(Feedback);

CodePromptTest.belongsTo(Test);
CodePromptTest.belongsTo(CodePrompt);
CodePrompt.hasMany(CodePromptTest);

PromptAttemptTest.belongsTo(PromptAttempt);
PromptAttemptTest.belongsTo(Test);
PromptAttempt.hasMany(PromptAttemptTest);

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  if(process.env.SEED){
    const javascriptCohorts = require('./seed/courses/javascript');
    const javascriptCourse = require('./seed/courses/javascript_course.json');
    return await Course.seed(javascriptCohorts, javascriptCourse);
  }
  
};

module.exports = {
  conn,
  User,
  Course,
  CodePrompt,
  Topic,
  Enrollment,
  Cohort,
  PromptAttempt,
  syncAndSeed,
  Test,
  Feedback,
  CodePromptTest,
  PromptAttemptTest
};
