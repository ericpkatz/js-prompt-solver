const conn = require('./conn');
const { STRING, TEXT } = conn.Sequelize;
const { id } = require('./common');
const seed = require('./seed');

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

//move this
Course.seed = async function(data){
  return seed({ conn, data });
}

module.exports = Course;
