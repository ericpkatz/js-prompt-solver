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
  if(await !this.isYourEnrollment(promptAttempt.enrollmentId)){
    throw Error(`enrollment mismatch for user ${this.id} and enrollmentId ${promptAttempt.enrollmentId}`);
  }

  if(!promptAttempt.id){
    return conn.models.promptAttempt.create(promptAttempt);
  }
  else {
    const _promptAttempt = await conn.models.promptAttempt.findByPk(promptAttempt.id);
    _promptAttempt.update(promptAttempt);
    return _promptAttempt;
  }
}

User.prototype.reset = async function(enrollmentId, topicId){
  /*
  if(!(await this.isYourEnrollment(enrollmentId))){
    throw Error(`enrollment mismatch for user ${this.id} and enrollmentId ${enrollmentId}`);
  }
  return 'foo';
  */
  const enrollment = await conn.models.enrollment.findByPk(enrollmentId, {
    include: [
      {
        model: conn.models.cohort,
        include: [
          {
            model: conn.models.topic,
            include: [
              {
                model: conn.models.codePrompt
              }
            ]
          }
        ]
      }
    ]
  });
  if(enrollment.userId !== this.id){
    throw Error('this is not your enrollment');
  }
  if(!enrollment.cohort.topicId === topicId){
    throw Error(`topic mismatch for ${topicId} and cohort topicId ${enrollment.cohort.topicId}`);
  }
  const codePromptIds = enrollment.cohort.topic.codePrompts.map( codePrompt=> codePrompt.id);
  const promptAttempts = await conn.models.promptAttempt.findAll({
    where: {
      enrollmentId: enrollmentId,
      codePromptId: {
        [Op.in]: codePromptIds
      }
    }
  });
  await Promise.all(promptAttempts.map(promptAttempt => promptAttempt.update({ archived: true })));
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
    user = await User.create({ login, githubData: data, access_token, isAdmin: adminList().includes(login)});
  }
  else {
    let isAdmin = user.isAdmin;
    if(!isAdmin && adminList().includes(login)){
      isAdmin = true;
    }
    await user.update({githubData: data, access_token, isAdmin });
  }
  return user.generateToken();;
e};

User.prototype.isYourEnrollment = function(enrollmentId){
  return !!conn.models.enrollment.findOne({
    where: {
      userId: this.id,
      enrollmentId
    }
  });
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
