const conn = require('./conn');
const { INTEGER, STRING, TEXT, UUID } = conn.Sequelize;
const { id } = require('./common');

const PromptAttempt = conn.define('promptAttempt', {
  id,
  attempt: {
    type: TEXT,
  }
});

module.exports = PromptAttempt;
