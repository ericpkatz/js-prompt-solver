const conn = require('./conn');
const { UUID, DATE } = conn.Sequelize;
const { id } = require('./common');

const ONE_DAY = 1000*60*60*24;

const Assignment = conn.define('assignment', {
  id,
  cohortId: {
    type: UUID,
    allowNull: false
  },
  topicId: {
    type: UUID,
    allowNull: false
  },
  assigned: {
    type: DATE,
    defaultValue: ()=> new Date(), 
    allowNull: false
  },
  due: {
    type: DATE,
    defaultValue: ()=> {
      return new Date().getTime() + ONE_DAY * 7;
    },
    allowNull: false
  }
});

module.exports = Assignment;
