const { Test, CodePrompt, Topic, Enrollment, Cohort, User, Course, PromptAttempt } = require('../db');

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
    res.setHeader('Set-Cookie', `authorization=deleted; HttpOnly; path=/; Max-Age=0;`);
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

module.exports = {
  isLoggedIn,
  isAdmin
};
