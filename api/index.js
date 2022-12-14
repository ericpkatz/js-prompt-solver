const app = require('express').Router();
const { Test, conn, CodePrompt, Topic, Enrollment, Cohort, User, Course, PromptAttempt, Feedback, CodePromptTest, PromptAttemptTest } = require('../db');
const { Op } = conn.Sequelize; 
const { isLoggedIn, isAdmin } = require('./middleware');

module.exports = app;

app.use('/admin', isLoggedIn, isAdmin, require('./admin'));
app.use('/enrollments', isLoggedIn, require('./enrollments'));

app.get('/feedbacks', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getFeedbacks());
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/promptAttemptTests/:id', isLoggedIn, async(req, res, next)=> {
  try {
    const promptAttemptTest = await PromptAttemptTest.findOne({
      where: {
        id: req.params.id 
      },
      include: [
        {
          model: PromptAttempt,
          include: [
            {
              model: Enrollment,
              where: {
                userId: req.user.id
              }
            }
          ]
        }
      ]
    });
    await promptAttemptTest.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/promptAttemptTests/', isLoggedIn, async(req, res, next)=> {
  try {
    const test = await Test.create(req.body.test);
    const promptAttempt = await PromptAttempt.findByPk(req.body.promptAttempt.id, {
      include: [
        {
          model: Enrollment,
          where: {
            userId: req.user.id
          }
        }
      ]
    });
    const promptAttemptTest = await PromptAttemptTest.create({
      testId: test.id,
      promptAttemptId: promptAttempt.id
    });
    res.send(promptAttemptTest);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/promptAttemptTests/:id', isLoggedIn, async(req, res, next)=> {
  try {
    const promptAttemptTest = await PromptAttemptTest.findByPk(req.params.id, {
      include: [
        {
          model: Test
        },
        {
          model: PromptAttempt,
          include: [
            {
              model: Enrollment,
              where: {
                userId: req.user.id
              }
            }
          ]
        }
      ]
    });
    const test = await promptAttemptTest.test.update(req.body.test);
    res.send(test);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/feedbacks/availableFeedbackMap', isLoggedIn, async(req, res, next)=> {
  try{
    const promptAttempts = await PromptAttempt.findAll({
      where: {
        submitted: true,
      },
      include: [
        {
          model: Enrollment,
          where: {
            userId: req.user.id
          }
        }
      ]
    });
    const codePromptIds = promptAttempts.map(promptAttempt => promptAttempt.codePromptId);
    const otherCodePrompts = await PromptAttempt.findAll({
      where: {
        submitted: true,
        codePromptId: {
          [Op.in]:  promptAttempts.map(promptAttempt => promptAttempt.codePromptId)
        },
      },
      include: [
        Feedback,
        CodePrompt,
        {
          model: Enrollment,
          where: {
            userId: {
              [Op.ne]: req.user.id
            }
          },
          include: [
            { 
              model: User,
              attributes: ['login']
            }
          ]
        }
      ]
    });
    res.send(otherCodePrompts);
    /*
    const feedback = await Feedback.findAll({
      include: [
        {
          model: PromptAttempt,
          include: [
            {
              model: CodePrompt
            },
            {
              model: Enrollment,
              include: [
                {
                  model: User,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }
          ]
        }
      ]
    });
    res.send(feedback);
    */
  }
  catch(ex){
    next(ex);
  }
});
app.get('/feedbacks/to', isLoggedIn, async(req, res, next)=> {
  try{
    const feedback = await Feedback.findAll({
      include: [
        {
          model: Enrollment,
          include: [
            {
              model: User,
              attributes: ['login']
            }
          ]
        },
        {
          model: PromptAttempt,
          include: [
            {
              model: CodePrompt
            },
            {
              model: Enrollment,
              include: [
                {
                  model: User,
                  where: {
                    id: req.user.id
                  }
                }
              ]
            }
          ]
        }
      ]
    });
    res.send(feedback);
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

app.put('/feedbacks/to/:id/markAsReviewed', isLoggedIn, async(req, res, next)=> {
  try{
    const feedback = await Feedback.findByPk(req.params.id, {
        include: [
          { 
            model: PromptAttempt,
            include: [
              {
                model: Enrollment,
                include: [
                  {
                    model: User,
                    where: {
                      id: req.params.id
                    }
                  }
                ]
              }
            ]
          }
        ]
    });
    await feedback.update({ reviewed: true });
    res.send(feedback);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/promptAttempts/:promptAttemptId/feedbacks/:id', isLoggedIn, async(req, res, next)=> {
  try{
    //GET the promptAttempt
    const promptAttempt = await PromptAttempt.findByPk(req.params.promptAttemptId, {
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
    const feedback = await Feedback.findByPk(req.params.id, {
      enrollmentId: enrollment.id,
      promptAttemptId: req.params.promptAttemptId
    });
    await feedback.update(req.body);
    res.send(feedback);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/promptAttempts/:promptAttemptId/feedbacks/:id', isLoggedIn, async(req, res, next)=> {
  try{
    //GET the promptAttempt
    const promptAttempt = await PromptAttempt.findByPk(req.params.promptAttemptId, {
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
    const feedback = await Feedback.findByPk(req.params.id, {
      enrollmentId: enrollment.id,
      promptAttemptId: req.params.promptAttemptId
    });
    await feedback.destroy(); 
    res.sendStatus(204);
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
