const conn = require('./conn');
const { STRING } = conn.Sequelize;
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
});

module.exports = Topic;
