const conn = require('./conn');
const User = require('./User');
const Course = require('./Course');
const CodePrompt = require('./CodePrompt');
const Topic = require('./Topic');
const Enrollment = require('./Enrollment');
const Assignment = require('./Assignment');
const Cohort = require('./Cohort');
const PromptAttempt = require('./PromptAttempt');

User.belongsToMany(Cohort, { through: Enrollment });
Cohort.belongsToMany(User, { through: Enrollment });

Cohort.belongsTo(Course);
Course.hasMany(Cohort);

Topic.belongsTo(Course);
Course.hasMany(Topic);

Assignment.belongsTo(Topic);
Assignment.belongsTo(Cohort);

Cohort.hasMany(Assignment);
Topic.hasMany(Assignment);

CodePrompt.belongsTo(Topic);
Topic.hasMany(CodePrompt);

PromptAttempt.belongsTo(Enrollment);
PromptAttempt.belongsTo(Assignment);
PromptAttempt.belongsTo(CodePrompt);

Enrollment.hasMany(PromptAttempt);
Assignment.hasMany(PromptAttempt);
CodePrompt.hasMany(PromptAttempt);

const syncAndSeed = async()=> {
    await conn.sync({ force: true });
    const [user, course, user2] = await Promise.all([
      User.create({ login: 'prof-katz'}),
      Course.create({ title: 'JavaScript'}),
      User.create({ login: 'ericpkatz'})
    ]);
    const cohort = await Cohort.create({ name: 'A_COHORT', courseId: course.id});
    const cohort2 = await Cohort.create({ name: 'B_COHORT', courseId: course.id});

    await user2.addCohort(cohort);
    
    const [ enrollment ] = await user.addCohort(cohort);
    const topic = await Topic.create({ title: 'JavaScript Generating Arrays'});
    const assignment1 = await Assignment.create({ topicId: topic.id, cohortId: cohort.id});
    const codePrompt2 = await CodePrompt.create({
      topicId: topic.id,
      title: 'Generate An Array of n numbers',
      rank: 2
    });
    const codePrompt1 = await CodePrompt.create({
      topicId: topic.id,
      title: 'Generate An Array of three numbers',
      rank: 1
    });
    const topic2 = await Topic.create({ title: 'JavaScript Generating Arrays from Other Arrays'});
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const assignment2 = await Assignment.create({ topicId: topic2.id, cohortId: cohort.id, assigned: new Date().getTime() + ONE_DAY});
    const codePrompt3 = await CodePrompt.create({
      topicId: topic2.id,
      title: 'Generate An Array which doubles the values of an existing array'
    });
    const codePrompt4 = await CodePrompt.create({
      topicId: topic.id,
      title: 'Generate An Array of n numbers starting from x',
      rank: 3
    });
  await PromptAttempt.create({ enrollmentId: enrollment.id, codePromptId: codePrompt1.id, attempt: `
  console.log('fizz bar bazz');
  `, assignmentId: assignment1.id});
  return { course, user, cohort };
};

module.exports = {
  conn,
  User,
  Course,
  CodePrompt,
  Topic,
  Enrollment,
  Assignment,
  Cohort,
  syncAndSeed
};
