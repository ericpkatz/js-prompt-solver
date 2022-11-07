const conn = require('./conn');
const { id } = require('./common');
const { UUID } = conn.Sequelize;

const Enrollment = conn.define('enrollment', {
  id,
  userId: {
    type: UUID,
    allowNull: false
  },
  cohortId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = Enrollment;
