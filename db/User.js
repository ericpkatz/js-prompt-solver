const { JWT } = process.env;
const conn = require('./conn');
const { id } = require('./common');
const { VIRTUAL, Op, STRING, JSON, BOOLEAN } = conn.Sequelize;
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
  email: {
    type: STRING
  },
  firstName: {
    type: STRING
  },
  lastName: {
    type: STRING
  },
  avatar_url: {
    type: STRING
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
  },
  token: {
    type: VIRTUAL,
    get: function(){
      return this.generateToken();
    }
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

User.prototype.updateFeedback = async function(feedback){
  if(await !this.isYourEnrollment(feedback.enrollmentId)){
    throw Error(`enrollment mismatch for user ${this.id} and enrollmentId ${feedback.enrollmentId}`);
  }
  const comments = feedback.comments;
  feedback = await conn.models.feedback.findByPk(feedback.id);
  return await feedback.update({ comments });
}

User.prototype.attemptPrompt = async function(promptAttempt){
  const isYours = await this.isYourEnrollment(promptAttempt.enrollmentId);
  if(!isYours){
    throw Error(`enrollment mismatch for user ${this.id} and enrollmentId ${promptAttempt.enrollmentId}`);
  }

  if(!promptAttempt.id){
    return conn.models.promptAttempt.create(promptAttempt);
  }
  const _promptAttempt = await conn.models.promptAttempt.findByPk(promptAttempt.id);
  await _promptAttempt.update(promptAttempt);
  return _promptAttempt;
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

  let { login, email, name, avatar_url, ...data } = response.data;
  let user = await User.findOne({
    where: {
      login
    }
  });
  console.log(data);
  const parts = (name || '').split(' ');
  let firstName = parts.length >= 1 ? parts[0]: null;
  let lastName = parts.length >= 2 ? parts[1]: null;
  email = email || null;
  if(!user){
    user = await User.create({ login, githubData: data, access_token, isAdmin: adminList().includes(login), firstName, lastName, email, avatar_url});
  }
  else {
    let isAdmin = user.isAdmin;
    if(!isAdmin && adminList().includes(login)){
      isAdmin = true;
    }
    await user.update({githubData: data, access_token, isAdmin , firstName, lastName, email, avatar_url});
  }
  return user.generateToken();;
e};

User.prototype.isYourEnrollment = async function(enrollmentId){
  const enrollment = await conn.models.enrollment.findOne({
    where: {
      userId: this.id,
      id: enrollmentId
    }
  });
  return enrollment !== null;
}

/*
User.prototype.getPromptAttempts = async function(){
  const enrollmentIds = (await this.getCohorts()).map( cohort => cohort.enrollment.id );
  return conn.models.promptAttempt.findAll({
    include: [
      conn.models.codePrompt,
      conn.models.feedback,
    ],
    where: {
      enrollmentId: {
        [Op.in]: enrollmentIds 
      }
    }
  });
  return cohorts
};
*/

User.prototype.getFeedbacks = async function(){
  const enrollmentIds = (await this.getCohorts()).map( cohort => cohort.enrollment.id );
  return conn.models.feedback.findAll({
    include: [
      {
        model: conn.models.promptAttempt
      }
    ],
    where: {
      enrollmentId: {
        [Op.in]: enrollmentIds 
      }
    }
  });
};

User.prototype.getAssignments = async function(){
  return conn.models.assignment.findAll({
    include: [
      {
        model: conn.models.topic,
        include: [
          conn.models.codePrompt
        ]
      },
      {
        model: conn.models.cohort,
        include: [
          {
            model: conn.models.user,
            where: {
              id: this.id
            }
          }
        ]
      }
    ]
  });
};

User.prototype.getPrompts = async function(){
  const cohorts = (await this.getCohorts()).map( cohort => cohort.id);
  const assignments = await conn.models.assignment.findAll({
    where: {
      assigned: {
        [Op.lte]: new Date()
      },
      due: {
        [Op.gte]: new Date()
      },
      cohortId: {
        [Op.in]: cohorts
      }
    }
  });
  const topicIds = assignments.map(assignment => assignment.topicId);
  return conn.models.codePrompt.findAll({
    order: [['rank']],
    include: [
      conn.models.topic
    ],
    where: {
      topicId: {
        [Op.in]: topicIds
      }
    }
  }); 
}
module.exports = User;
