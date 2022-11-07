const app = require('express').Router();
const { Test, CodePrompt, Topic, Enrollment, Cohort, User, Course, PromptAttempt } = require('../db');
const { isLoggedIn, isAdmin } = require('./middleware');

module.exports = app;

app.get('/users', async(req, res, next)=> {
  try {
    res.send(await User.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/topics', async(req, res, next)=> {
  try {
    res.send(await Topic.findAll({
      include: [{
        model: CodePrompt,
        include: [
          { model: Test }
        ]
      }]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/users', async(req, res, next)=> {
  try {
    res.send(await User.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/cohorts/:id', async(req, res, next)=> {
  try {
    const cohort = await Cohort.findByPk(req.params.id);
    await cohort.update(req.body);
    res.send(cohort);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/cohorts', async(req, res, next)=> {
  try {
    res.send(await Cohort.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/enrollments', async(req, res, next)=> {
  try {
    res.send(await Enrollment.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/cohorts/:id', async(req, res, next)=> {
  try {
    const cohort = await Cohort.findByPk(req.params.id);
    await cohort.destroy();
    res.sendStatus(201);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/users/:id', async(req, res, next)=> {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.sendStatus(201);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/enrollments/:id', async(req, res, next)=> {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    await enrollment.destroy();
    res.sendStatus(201);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/courses', async(req, res, next)=> {
  try {
    res.send(await Course.findAll({
      include: [
        {
          model: Cohort,
          include: [
            {
              model: Topic
            },
            {
              model: Enrollment,
              include: [
                {
                  model: User,
                },
                {
                  model: PromptAttempt,
                }
              ]
            }
          ]
        }
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/promptAttempts', async(req, res, next)=> {
  try {
    res.send(await PromptAttempt.findAll({
      include: [
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});
