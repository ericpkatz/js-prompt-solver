const conn = require('./conn');
const { id } = require('./common');

const Enrollment = conn.define('enrollment', {
  id
});

module.exports = Enrollment;
