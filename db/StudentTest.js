const conn = require('./conn');
const { UUID, STRING, ENUM, TEXT } = conn.Sequelize;
const { id } = require('./common');

const StudentTest = conn.define('studentTest', {
  id,
  input: {
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  output: {
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  operator: {
    type: ENUM('EQUALS', 'NEQUALS', 'EQLS'),
    allowNull: false,
  },
  outputDataType: {
    type: ENUM('NUMERIC', 'STRING'),
    allowNull: false,
  },
  promptAttemptId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = StudentTest;
