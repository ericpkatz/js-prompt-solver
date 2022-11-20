const conn = require('./conn');
const { UUID, STRING, ENUM, TEXT } = conn.Sequelize;
const { id } = require('./common');

const PromptAttemptTest = conn.define('promptAttemptTest', {
  id,
  testId: {
    type: UUID,
    allowNull: false
  },
  promptAttemptId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = PromptAttemptTest;
