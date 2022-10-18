const { JWT } = process.env;
if(!JWT){
  throw 'JWT environment variable needs to be defined';
}
const conn = require('./conn');
const { id } = require('./common');
const { STRING, JSON, BOOLEAN } = conn.Sequelize;
const axios = require('axios');
const jwt = require('jsonwebtoken');

const User = conn.define('user', {
  id,
  login: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  access_token: {
    type: STRING,
  },
  githubData: {
    type: JSON,
  },
  isAdmin: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

const adminList = ()=> {
  return (process.env.ADMINS || '').split(',');
};

User.prototype.generateToken = function(){
  return jwt.sign({ id: this.id}, JWT);
}

User.byToken = async(token)=> {
  const { id } = jwt.verify(token, JWT);
  const user = await User.findByPk(id, {
    attributes: {
      exclude: ['access_token']
    }
  });
  if(!user){
    const ex = Error('could not find user');
    ex.status = 401;
    throw ex;
  }
  return user;
};


User.authenticate = async(code)=> {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  let response = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code
  }, {
    headers: {
      accept: 'application/json'
    }
  });
  const { error, access_token } = response.data;
  if(error){
    const ex = Error(error);
    ex.status = 401;
    throw ex;
  }
  const headers = {
    Authorization: `Bearer ${ access_token}`
  }; 

  response = await axios.get(
    'https://api.github.com/user',
    { headers }
  );

  const { login, ...data } = response.data;
  let user = await User.findOne({
    where: {
      login
    }
  });
  console.log(adminList());
  if(!user){
    user = await User.create({ login, githubData: data, access_token, isAdmin: adminList().includes(login)});
  }
  else {
    const isAdmin = user.isAdmin;
    if(!isAdmin && adminList().includes(login)){
      isAdmin = true;
    }
    await user.update({githubData: data, access_token, isAdmin });
  }
  return user.generateToken();;
e};

module.exports = User;
