const { syncAndSeed, conn } = require('./db');

syncAndSeed()
  .then(()=> 'SYNC')
  .then(()=> {
    return conn.close();
  })
  .catch(ex => console.log(ex));
