try {
  require('./secrets');
  const { GIT_CLIENT_ID, GIT_CLIENT_SECRET } = process.env;
  console.log(`
  //add to secrets.js
  process.env.GIT_CLIENT_ID = YOUR_VALUE;
  process.env.GIT_CLIENT_SECRET = YOUR_VALUE;
  `);
}
catch(ex){
  console.log('If running locally add secrets.js with GIT_CLIENT_ID and GIT_CLIENT_SECRET');
}
const app = require('./app');

const init = ()=> {
  try {
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

init();
