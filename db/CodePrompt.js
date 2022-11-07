const conn = require('./conn');
const { BOOLEAN, INTEGER, STRING, TEXT, UUID } = conn.Sequelize;
const { id } = require('./common');

const CodePrompt = conn.define('codePrompt', {
  id,
  title: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  scaffold: {
    type: TEXT,
    get: function(){
      return this.getDataValue('scaffold') || '';
    }
  },
  scaffoldAfter: {
    type: TEXT,
    get: function(){
      return this.getDataValue('scaffoldAfter') || '';
    }
  },
  topicId: {
    type: UUID,
    allowNull: false
  },
  rank: {
    type: INTEGER,
    defaultValue: 5
  },
});

module.exports = CodePrompt;
