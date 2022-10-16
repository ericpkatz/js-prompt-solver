const express = require('express');
const app = express();
const path = require('path');
app.engine('html', require('ejs').renderFile);

app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res, next)=> res.render(path.join(__dirname, 'index.html'), {}));

module.exports = app;
