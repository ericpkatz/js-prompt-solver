const conn = require('./conn');
const { STRING, TEXT, UUID } = conn.Sequelize;
const { id } = require('./common');

const Prompt = conn.define('prompt', {
  id,
  title: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  scaffold: {
    type: TEXT
  },
  courseId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = Prompt;
