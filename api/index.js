const app = require('express').Router();
const { User } = require('../db');

module.exports = app;

app.get('/github/callback', async(req, res, next)=> {
  try {
    res.send(await User.authenticate(req.query.code));
  }
  catch(ex){
    next(ex);
  }
});


