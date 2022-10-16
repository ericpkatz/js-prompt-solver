try {
  require('./secrets');
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  if(!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET){
    console.log(`
    //add to secrets.js
    process.env.GITHUB_CLIENT_ID = YOUR_VALUE;
    process.env.GITHUB_CLIENT_SECRET = YOUR_VALUE;
    `);
  }
  throw Error('configure github for authentication');
}
catch(ex){
  console.log('If running locally add secrets.js with GIT_CLIENT_ID and GIT_CLIENT_SECRET');
}
const { conn } = require('./db');
const app = require('./app');

const init = async()=> {
  try {
    if(process.env.SYNC){
      await conn.sync({ force: true });

    }
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

init();
