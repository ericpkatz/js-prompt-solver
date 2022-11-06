const conn = require('./conn');
const { UUID, DATE, BOOLEAN } = conn.Sequelize;
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
  active: {
    type: BOOLEAN,
    defaultValue: false,
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

Assignment.addHook('beforeSave', async(assignment)=> {
  const [cohort, topic] = await Promise.all([
    conn.models.cohort.findByPk(assignment.cohortId),
    conn.models.topic.findByPk(assignment.topicId)
  ]);
  if(cohort.courseId !== topic.courseId){
    throw `Cohort course is ${course.id} and Topic course is ${topic.courseId}`;
  }
});

module.exports = Assignment;
