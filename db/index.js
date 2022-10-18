const conn = require('./conn');
const User = require('./User');
const Course = require('./Course');
const Prompt = require('./Prompt');
const Test = require('./Test');

Prompt.belongsTo(Course);
Course.hasMany(Prompt);
Test.belongsTo(Prompt);

Prompt.belongsTo(User, { as: 'createdBy' });
Prompt.belongsTo(User, { as: 'editedBy' });
Course.belongsTo(User, { as: 'createdBy' });
Course.belongsTo(User, { as: 'editedBy' });
Test.belongsTo(User, { as: 'createdBy' });
Test.belongsTo(User, { as: 'editedBy' });

module.exports = {
  conn,
  User,
  Course,
  Prompt,
  Test
};
