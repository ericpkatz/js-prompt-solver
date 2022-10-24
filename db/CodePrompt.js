const conn = require('./conn');
const { INTEGER, STRING, TEXT, UUID } = conn.Sequelize;
const { id } = require('./common');

const CodePrompt = conn.define('codePrompt', {
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
  topicId: {
    type: UUID,
    allowNull: false
  },
  rank: {
    type: INTEGER,
    defaultValue: 5
  }
});

module.exports = CodePrompt;
