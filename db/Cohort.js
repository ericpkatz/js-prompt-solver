const conn = require('./conn');
const { Op, STRING, UUID } = conn.Sequelize;
const { id } = require('./common');

const Cohort = conn.define('cohort', {
  id,
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  courseId: {
    type: UUID,
    allowNull: false
  }
});

Cohort.prototype.getActiveAssignments = function(){
  return conn.models.assignment.findAll({
    where: {
      cohortId: this.id,
      assigned: {
        [Op.lte]: new Date()
      },
      due: {
        [Op.gte]: new Date()
      },
    }
  });
}

module.exports = Cohort;
