const app = require('express').Router();
const { Test, conn, CodePrompt, Topic, Enrollment, Cohort, User, Course, PromptAttempt, Feedback, CodePromptTest, PromptAttemptTest } = require('../db');
const { Op } = conn.Sequelize; 

module.exports = app;

app.get('/', async(req, res, next)=> {
  try{
    const enrollments = await Enrollment.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Feedback,
          include: [ 
            {
              model: PromptAttempt,
              include: [
                {
                  model: Enrollment,
                  include: [
                    {
                      model: User,
                      attributes: ['login']
                    }
                  ]
                }
              ] 
            }
          ]
        },
        {
          model: PromptAttempt,
          include: [
            {
              model: PromptAttemptTest,
              include: [ Test ]
            },
            {
              model: CodePrompt,
              include: [ Topic ]
            },
            {
              model: Feedback,
              include: [
                {
                  model: Enrollment,
                  include: [
                    {
                      model: User,
                      attributes: ['login']
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Cohort,
          include: [
            {
              model: Course
            },
            {
              model: Topic,
              include: [
                {
                  model: CodePrompt,
                  include: [
                    {
                      model: CodePromptTest,
                      include: [Test]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    res.send(enrollments);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/:enrollmentId/topics/:topicId', async(req, res, next)=> {
  try{
    await req.user.reset(req.params.enrollmentId, req.params.topicId);
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});
