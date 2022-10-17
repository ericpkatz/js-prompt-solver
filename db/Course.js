const conn = require('./conn');
const { STRING } = conn.Sequelize;

const Course = conn.define('course', {
  title: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Course;
