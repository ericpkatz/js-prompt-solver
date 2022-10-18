const Sequelize = require('sequelize');
const { UUID, UUIDV4 } = Sequelize;

const id = {
  type: UUID,
  defaultValue: UUIDV4,
  primaryKey: true
};

module.exports = {
  id
};
