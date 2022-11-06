const conn = require('./conn');
const { STRING, TEXT } = conn.Sequelize;
const { id } = require('./common');

const Course = conn.define('course', {
  id,
  title: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: TEXT,
  },
});

Course.seed = async function(data){
  const course = await this.create({ title: data.title });
  let topics = data.topics.map( topic => {
    return {
      title: topic.title,
      courseId: course.id
    };
  });
  topics = await Promise.all(topics.map(topic => conn.models.topic.create(topic)));
  let codePrompts = [];
  data.topics.forEach((topic, idx) => {
    topic.codePrompts.forEach((codePrompt)=> {
      console.log(topics[idx].id, codePrompt);
      codePrompts.push({
        ...codePrompt,
        topicId: topics[idx].id
      });
    });
  });
  console.log(codePrompts);
  codePrompts = await Promise.all(codePrompts.map( codePrompt => conn.models.codePrompt.create(codePrompt)));
}

module.exports = Course;
