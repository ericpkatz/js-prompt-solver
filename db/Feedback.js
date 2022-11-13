const conn = require('./conn');
const { INTEGER, STRING, TEXT, UUID, BOOLEAN } = conn.Sequelize;
const { id } = require('./common');

const Feedback = conn.define('feedback', {
  id,
  promptAttemptId: {
    type: UUID,
    allowNull: false
  },
  enrollmentId: {
    type: UUID,
    allowNull: false
  },
  comments: {
    type: TEXT
  },
  reviewed: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

Feedback.addHook('beforeSave', async(feedback)=> {
  //you cant feedback your own promptAttempt
  const promptAttempt = await conn.models.promptAttempt.findByPk(feedback.promptAttemptId);
  console.log(promptAttempt.enrollmentId, feedback.enrollmentId);
  if(feedback.enrollmentId === promptAttempt.enrollmentId){
    throw 'you cant write your own feedback';
  }
  if(feedback.isNewRecord && !!(await Feedback.findOne({
    where: {
      enrollmentId: feedback.enrollmentId,
      promptAttemptId: feedback.promptAttemptId,
    }
  }))){
    throw Error('Feedback exists for this enrollment and promptAttempt');
  }
});

module.exports = Feedback;
