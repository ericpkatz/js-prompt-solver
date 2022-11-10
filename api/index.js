const app = require('express').Router();
const { Test, conn, CodePrompt, Topic, Enrollment, Cohort, User, Course, PromptAttempt, Feedback } = require('../db');
const { Op } = conn.Sequelize; 
const { isLoggedIn, isAdmin } = require('./middleware');

module.exports = app;

app.use('/admin', isLoggedIn, isAdmin, require('./admin'));

app.get('/feedbacks', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getFeedbacks());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/enrollments', isLoggedIn, async(req, res, next)=> {
  try{
    const enrollments = await Enrollment.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: PromptAttempt,
          include: [
            {
              model: CodePrompt,
            },
            {
              model: Feedback,
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
                    Test
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

app.put('/enrollments/:enrollmentId/topics/:topicId', isLoggedIn, async(req, res, next)=> {
  try{
    await req.user.reset(req.params.enrollmentId, req.params.topicId);
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/promptAttempts', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getPromptAttempts());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/promptAttempts/:id/feedbacks', isLoggedIn, async(req, res, next)=> {
  try{
    //GET the promptAttempt
    const promptAttempt = await PromptAttempt.findByPk(req.params.id, {
      include: [
        {
          model: Enrollment
        }
      ]
    });
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        cohortId: promptAttempt.enrollment.cohortId
      }
    });
    const feedback = await Feedback.create({
      ...req.body,
      enrollmentId: enrollment.id,
      promptAttemptId: req.params.id
    });
    res.send(feedback);
    //GET the enrollment and cohort for the prompt attempt
    //GET your enrollment for that cohort
    //CREATE the feedback with your enrollment and the comments

  }
  catch(ex){
    next(ex);
  }
});

app.get('/promptAttempts/:id/provideFeedback', isLoggedIn, async(req, res, next)=> {
  try{
    const promptAttempt = await PromptAttempt.findByPk(req.params.id, {
      include: [
        {
          model: Enrollment
        },
        {
          model: CodePrompt
        }
      ]
    });
    const enrollments = (await Enrollment.findAll({
      where: {
        userId: req.user.id
      }
    })).map( enrollment => enrollment.id);
    if(!enrollments.includes(promptAttempt.enrollmentId) || !promptAttempt.submitted){
      const error = Error('prompt attempt must be yours and submitted in order to provide feedback');
      error.status = 401;
      throw error;
    }

    const otherPromptAttempts = await PromptAttempt.findAll({
      where: {
        codePromptId: promptAttempt.codePromptId,
        submitted: true,
        archived: false,
        enrollmentId: {
          [Op.ne] : promptAttempt.enrollmentId
        }
      },
      include: [
        {
          model: Feedback
        },
        {
          model: Enrollment,
          required: true,//not sure I need this
          where: {
            cohortId: promptAttempt.enrollment.cohortId
          }
        }
      ]
    });
    //have I provided feedback already?
    //should we not look at promptAttempts which have been archived
    //has any feedbacks been provided?
    res.send({
      promptAttempt,
      otherPromptAttempts
    });
  }
  catch(ex){
    next(ex);
  }
});

app.post('/promptAttempts', isLoggedIn, async(req, res, next)=> {
  try{
    //TODO - make sure the user is the one who owns the enrollment
    //look at req.user's enrollments!
    const promptAttempt = await req.user.attemptPrompt(req.body);
    res.send(promptAttempt);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/feedbacks/:id', isLoggedIn, async(req, res, next)=> {
  try{
    //TODO - make sure the user is the one who owns the enrollment
    //look at req.user's enrollments!
    const feedback = await req.user.updateFeedback(req.body);
    res.send(feedback);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/auth', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await req.user);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/auth', async(req, res, next)=> {
  try {
    res.setHeader('Set-Cookie', `authorization=deleted; HttpOnly; path=/`);
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/github/callback', async(req, res, next)=> {
  try {
    res.setHeader('Set-Cookie', `authorization=${await User.authenticate(req.query.code)}; HttpOnly ; path=/`);
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }
});
