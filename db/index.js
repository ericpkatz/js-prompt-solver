const conn = require('./conn');
const User = require('./User');
const Course = require('./Course');
const CodePrompt = require('./CodePrompt');
const Topic = require('./Topic');
const Enrollment = require('./Enrollment');
const Assignment = require('./Assignment');
const Cohort = require('./Cohort');
const PromptAttempt = require('./PromptAttempt');
const Feedback = require('./Feedback');

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

Feedback.belongsTo(PromptAttempt);
Feedback.belongsTo(Enrollment);

PromptAttempt.hasMany(Feedback);

const syncAndSeed = async()=> {
    await conn.sync({ force: true });
    //create two users and a course
    const [pk, javaScript, epk, fooBarBazz] = await Promise.all([
      User.create({ login: 'prof-katz'}),
      Course.create({ title: 'JavaScript', description: `
Welcome to JavaScript!

These code prompts will guide you through some important JavaScript concepts.
      `}),
      User.create({ login: 'ericpkatz'}),
      Course.create({ title: 'FooBarBazz', description: `
FooBarBazz is a course which will test your knowledge of Foo Bar Bazz.
      `}),
    ]);

    //create 2 cohorts
    const cohortJSA = await Cohort.create({ name: 'A COHORT', courseId: javaScript.id});
    const cohortJSB = await Cohort.create({ name: 'B COHORT', courseId: javaScript.id});

    //both users are in cohortA
    const [enrollmentEpk] = await epk.addCohort(cohortJSA);
    
    const [ enrollmentPk ] = await pk.addCohort(cohortJSA);

    //create a Topic
    const arrayGeneration = await Topic.create({ title: 'JavaScript Generating Arrays using functions.', courseId: javaScript.id});
    const arrayOfN = await CodePrompt.create({
      topicId: arrayGeneration.id,
      title: `Generate An Array of n numbers.
      The numbers should start at 1 and go up to n.
      console.log(generateArray(3));//shold log [1, 2, 3]
      `,
      rank: 2
    });
    const arrayOf3 = await CodePrompt.create({
      topicId: arrayGeneration.id,
      title: `Generate An Array of three numbers 1, 2, 3
console.log(generateArray());//[1, 2, 3]
`,
      rank: 1
    });
    const arrayOfNFromX = await CodePrompt.create({
      topicId: arrayGeneration.id,
      title: `Generate An Array of n numbers starting from x
The numbers should start at x
It should return n numbers
console.log(generateArray(3, 5));//[3, 4, 5, 6, 7]
console.log(generateArray(2, 4));//[2, 3, 4, 5]
      `,
      rank: 3
    });
    const arrayGenerationAssignmentA = await Assignment.create({ topicId: arrayGeneration.id, cohortId: cohortJSA.id});

    const arrayGenerationFromArrays = await Topic.create({ title: 'JavaScript Generating Arrays from Other Arrays', courseId: javaScript.id});
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const newArrayWhichIsDouble = await CodePrompt.create({
      topicId: arrayGenerationFromArrays.id,
      title: 'Generate An Array which doubles the values of an existing array'
    });

    const futureAssignment = await Assignment.create({ topicId: arrayGenerationFromArrays.id, cohortId: cohortJSA.id, assigned: new Date().getTime() + ONE_DAY});
  if(!process.env.NO_PROMPT){
  await PromptAttempt.create({ enrollmentId: enrollmentEpk.id, codePromptId: arrayOf3.id, attempt: `
  const generateArray = ()=> {
    let ret = [];
    for(let i = 0; i < 3; i++){
      ret.push(i);
      return ret;
    }
  };
  const arr = generateArray();
  console.log(arr);
  `, assignmentId: arrayGenerationAssignmentA.id, submitted: true});

  //This will result in Pk having to review Epks prompt
  await PromptAttempt.create({ enrollmentId: enrollmentPk.id, codePromptId: arrayOf3.id, attempt: `
  const generateArray = ()=> {
    return [1, 2, 3];
  };
  const arr = generateArray();
  console.log(arr);
  `, assignmentId: arrayGenerationAssignmentA.id, submitted: true});
  }

  //TODO - now that there is a new prompt, should this prompt also be assigned to a user for review?

  const feedbacks = await Feedback.findAll();

    const fooBarBazzTopic = await Topic.create({ title: 'foo bar bazz', courseId: fooBarBazz.id});

  /*
    const assignmentmentFooBar = await Assignment.create({ topicId: topic3.id, cohortId: cohort2.id, assigned: new Date().getTime() + ONE_DAY});
    const codePrompt5 = await CodePrompt.create({
      topicId: topic3.id,
      title: 'whatever dude'
    });
    */
  return { course: javaScript, user: pk, cohort: cohortJSA };
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
  PromptAttempt,
  syncAndSeed
};
