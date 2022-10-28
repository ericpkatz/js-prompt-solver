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

module.exports = Course;
