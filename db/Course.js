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

Course.createFromFile = async function({ data }){
  const _data = data.replace('data:application/json;base64,', '');
  const json = JSON.parse(Buffer.from(_data, 'base64').toString('utf-8')); 
  return seed({ conn, courseData: json});
}
//move this
Course.seed = async function(data, courseData){
  return seed({ conn, data, courseData});
}

module.exports = Course;
