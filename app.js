const express = require('express');
const app = express();
const path = require('path');
app.engine('html', require('ejs').renderFile);
app.use(require('cookie-parser')());
app.use(express.json());

app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use('/api', require('./api'));

app.get('/', (req, res, next)=> res.render(path.join(__dirname, 'index.html'), {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID
}));

app.use((req, res, next)=> {
  const err = new Error(`${req.url} not found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err});
});

module.exports = app;
