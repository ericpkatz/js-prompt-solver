const app = require('express').Router();
const { Cohort, User, Course, PromptAttempt } = require('../db');

module.exports = app;

const isLoggedIn = async(req, res,next)=> {
  try {
    if(!req.cookies.authorization || req.cookies.authorization === 'deleted'){
      const error = new Error('not authorized');
      error.status = 401;
      throw error;
    }
    const user = await User.byToken(req.cookies.authorization); 
    if(!user){
      const error = new Error('not authorized');
      error.status = 401;
      throw error;
    }
    req.user = user;
    next();
  }
  catch(ex){
    res.setHeader('Set-Cookie', `authorization=deleted; HttpOnly; path=/`);
    next(ex);
  }
};

const isAdmin = async(req, res, next)=> {
  if(req.user && req.user.isAdmin){
    return next();
  }
  const error = new Error('not authorized');
  error.status = 401;
  next(error);
};

app.get('/assignments', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getAssignments());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/feedbacks', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getFeedbacks());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/cohorts', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getCohorts({
      include: [Course]
    }));
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

/*
app.get('/prompts', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.attemptPrompt(req.body));
  }
  catch(ex){
    next(ex);
  }
});
*/

app.get('/admin/users', isLoggedIn, isAdmin, async(req, res, next)=> {
  try {
    res.send(await User.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/admin/courses', isLoggedIn, isAdmin, async(req, res, next)=> {
  try {
    res.send(await Course.findAll({
      include: [
        {
          model: Cohort,
          include: [
            {
              model: User
            }
          ]
        }
      ]
    }));
  }
  catch(ex){
    res.setHeader('Set-Cookie', `authorization=deleted; HttpOnly; path=/`);
    next(ex);
  }
});

app.get('/admin/promptAttempts', isLoggedIn, isAdmin, async(req, res, next)=> {
  try {
    res.send(await PromptAttempt.findAll({
      include: [
      ]
    }));
  }
  catch(ex){
    res.setHeader('Set-Cookie', `authorization=deleted; HttpOnly; path=/`);
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
