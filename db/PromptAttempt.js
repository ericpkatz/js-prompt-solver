const conn = require('./conn');
const { VIRTUAL, Op, INTEGER, STRING, TEXT, UUID, BOOLEAN } = conn.Sequelize;
const { id } = require('./common');

const PromptAttempt = conn.define('promptAttempt', {
  id,
  attempt: {
    type: TEXT,
    allowNull: false
  },
  enrollmentId: {
    type: UUID,
    allowNull: false
  },
  codePromptId: {
    type: UUID,
    allowNull: false
  },
  submitted: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});


PromptAttempt.addHook('beforeSave', async(promptAttempt)=> {
  /*
  if(promptAttempt.isNewRecord && !!(await PromptAttempt.findOne({
    where: {
      codePromptId: promptAttempt.codePromptId,
      enrollmentId: promptAttempt.enrollmentId,
    }
  }))){
    throw Error('This promptAttempt exists for this enrollment, codePromptId');
  }
  const [enrollment, codePrompt] = await Promise.all([
    conn.models.enrollment.findByPk(promptAttempt.enrollmentId),
    conn.models.codePrompt.findByPk(promptAttempt.codePromptId),
  ]);
  */
});

module.exports = PromptAttempt;
