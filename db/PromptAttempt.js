const conn = require('./conn');
const { Op, INTEGER, STRING, TEXT, UUID, BOOLEAN } = conn.Sequelize;
const { id } = require('./common');

const PromptAttempt = conn.define('promptAttempt', {
  id,
  attempt: {
    type: TEXT,
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
  },
  archived: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

PromptAttempt.addHook('beforeSave', async(promptAttempt)=> {
  if(promptAttempt.isNewRecord && !!(await PromptAttempt.findOne({
    where: {
      codePromptId: promptAttempt.codePromptId,
      enrollmentId: promptAttempt.enrollmentId,
      archived: false
    }
  }))){
    throw Error('This promptAttempt exists for this enrollment, codePromptId');
  }
  const [enrollment, codePrompt] = await Promise.all([
    conn.models.enrollment.findByPk(promptAttempt.enrollmentId),
    conn.models.codePrompt.findByPk(promptAttempt.codePromptId),
  ]);
  //TODO check the active topic of the cohort
  //make sure the activeTopic of the cohort matches the topic of the codePrompt
});

module.exports = PromptAttempt;
