const conn = require('./conn');
const User = require('./User');
const Course = require('./Course');
const CodePrompt = require('./CodePrompt');
const Topic = require('./Topic');
const Enrollment = require('./Enrollment');
const Assignment = require('./Assignment');
const Cohort = require('./Cohort');

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

module.exports = {
  conn,
  User,
  Course,
  CodePrompt,
  Topic,
  Enrollment,
  Assignment,
  Cohort
};
