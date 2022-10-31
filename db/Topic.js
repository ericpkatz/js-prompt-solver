const conn = require('./conn');
const { STRING, UUID } = conn.Sequelize;
const { id } = require('./common');

const Topic = conn.define('topic', {
  id,
  title: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  courseId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = Topic;
