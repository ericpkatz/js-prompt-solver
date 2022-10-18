const conn = require('./conn');
const { STRING } = conn.Sequelize;
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
});

module.exports = Course;
