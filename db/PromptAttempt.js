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
  }
});

PromptAttempt.addHook('afterSave', async(promptAttempt)=> {
  //Two tasks need to be accomplished
  //This user needs to provide peer review
  //This prompt needs to be reviewed
  //see if there are promptAttempts with this enrollment and codePromptId
  //which have no feedback
  //STEP ONE: The other prompt attempts from this cohort
  const promptAttempts = await PromptAttempt.findAll({
    include: [
      conn.models.feedback
    ],
    where: {
      submitted: true,
      codePromptId: promptAttempt.codePromptId,
      id: {
        [Op.ne]: promptAttempt.id
      }
    }
  });
  const unreviewedPromptAttempts = promptAttempts.filter(promptAttempt => {
    return promptAttempt.feedbacks.length === 0;
  });
  
  //TODO: limit number of prompts for this prompt submitter all of these are being assigned to this prompt submitter
  await Promise.all(
    unreviewedPromptAttempts.map( async(_promptAttempt) => {
      const enrollment = await conn.models.enrollment.findByPk(_promptAttempt.enrollmentId, {
      });
      const user = await conn.models.user.findByPk(enrollment.userId);
      return conn.models.feedback.create({ promptAttemptId: _promptAttempt.id, enrollmentId: promptAttempt.enrollmentId })
    })
  );
  //TODO - should this prompt also be assigned to a user who has not reviewed this prompt?
  //Find users who have done this codePrompt who have not provided reviews
  const otherEnrollments = await conn.models.enrollment.findAll({
    where: {
      cohortId: (await conn.models.enrollment.findByPk(promptAttempt.enrollmentId)).cohortId,
      id: {
        [Op.ne]: promptAttempt.enrollmentId
      }
    }
  });
  await Promise.all(otherEnrollments.map(enrollment => {
    return conn.models.feedback.create({
      promptAttemptId: promptAttempt.id,
      enrollmentId: enrollment.id
    })
  }));
});

PromptAttempt.addHook('beforeSave', async(promptAttempt)=> {
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
  //TODO check the active topic of the cohort
  //make sure the activeTopic of the cohort matches the topic of the codePrompt
});

module.exports = PromptAttempt;
