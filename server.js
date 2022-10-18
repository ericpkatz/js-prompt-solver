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
const { conn, Course, Prompt, Test } = require('./db');
const app = require('./app');

const init = async()=> {
  try {
    if(process.env.SYNC){
      await conn.sync({ force: true });
      const [ javaScript ] = await Promise.all([
        Course.create({ title: 'Introduction to JavaScript' })
      ]);
      const [sum, multiply] = await Promise.all([
        Prompt.create({
          title: 'Sum Two Numbers',
          scaffold: `
const a = 2;
const b = 5;
const c = 3;
          `,
          courseId: javaScript.id
        }),
        Prompt.create({
          title: 'Multiply Two Numbers',
          scaffold: `
const a = 4;
const b = 5;
const c = 6;
          `,
          courseId: javaScript.id
        })
      ]);
      await Promise.all([
        Test.create({
          input: 'add(a,b)',
          output: '7',
          operator: 'EQUALS',
          promptId: sum.id
        }),
        Test.create({
          input: 'add(b, c)',
          output: '11',
          operator: 'EQUALS',
          promptId: sum.id
        })
      ]);

    }
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

init();
