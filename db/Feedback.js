const conn = require('./conn');
const { INTEGER, STRING, TEXT, UUID, BOOLEAN } = conn.Sequelize;
const { id } = require('./common');

const Feedback = conn.define('feedback', {
  id,
  promptAttemptId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = Feedback;
