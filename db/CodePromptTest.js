const conn = require('./conn');
const { UUID, STRING, ENUM, TEXT } = conn.Sequelize;
const { id } = require('./common');

const CodePromptTest = conn.define('codePromptTest', {
  id,
  testId: {
    type: UUID,
    allowNull: false
  },
  codePromptId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = CodePromptTest;
