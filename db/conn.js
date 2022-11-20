const Sequelize = require('sequelize');
const config = {};
if(process.env.QUIET){
  config.logging = false
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/js_prompt_solver_db', config);

module.exports = conn;
