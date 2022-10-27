const app = require('express').Router();
const { User, Course } = require('../db');

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

app.post('/codePrompts', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.body);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/promptAttempts', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.body);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/prompts', isLoggedIn, async(req, res, next)=> {
  try{
    res.send(await req.user.getPrompts());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/admin/courses', isLoggedIn, isAdmin, async(req, res, next)=> {
  try {
    if(!req.cookies.authorization || req.cookies.authorization === 'deleted'){
      const error = new Error('not authorized');
      error.status = 401;
      throw error;
    }
    res.send(await Course.findAll());
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
