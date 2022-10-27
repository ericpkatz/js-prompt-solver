const conn = require('./conn');
const { INTEGER, STRING, TEXT, UUID } = conn.Sequelize;
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
  assignmentId: {
    type: UUID,
    allowNull: false
  },
  codePromptId: {
    type: UUID,
    allowNull: false
  },
});

PromptAttempt.addHook('beforeSave', async(promptAttempt)=> {
  console.log(promptAttempt.get());
  const [assignment, enrollment, codePrompt] = await Promise.all([
    conn.models.assignment.findByPk(promptAttempt.assignmentId),
    conn.models.enrollment.findByPk(promptAttempt.enrollmentId),
    conn.models.codePrompt.findByPk(promptAttempt.codePromptId),
  ]);
  if(assignment.cohortId !== enrollment.cohortId){
    throw Error(`assignment cohortId (${ assignment.cohortId }) does not match enrollment cohortId (${ enrollment.cohortId })`);
  }
  if(codePrompt.topicId !== assignment.topicId){
    throw Error(`assignment.topicId (${ assignment.topicId }) does not match codePrompt.topicId (${ codePrompt.topicId })`);
  }
  //todo is the assignment date within the valid range for assignment?
});

module.exports = PromptAttempt;
