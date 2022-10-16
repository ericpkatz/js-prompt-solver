const { JWT } = process.env;
if(!JWT){
  throw 'JWT environment variable needs to be defined';
}
const conn = require('./conn');
const { STRING, JSON } = conn.Sequelize;
const axios = require('axios');
const jwt = require('jsonwebtoken');

const User = conn.define('user', {
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
  }
});

User.prototype.generateToken = function(){
  return jwt.sign({ id: this.id}, JWT);
}


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
  if(!user){
    user = await User.create({ login, github_data: data, access_token });
  }
  else {
    await user.update({github_data, access_token});
  }
  return user.generateToken();;
e};

module.exports = User;
