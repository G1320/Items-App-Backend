const validateUser = require('./validation/validateUser');
const validateCollection = require('./validation/validateCollection.js');
const logRequestsMw = require('./logging/logRequestsMw');
const handleDbErrorMw = require('./errorHandling/handleDbErrorMw');
const handleErrorMw = require('./errorHandling/handleErrorMw');
const verifyTokenMw = require('./auth/verifyTokenMw');

module.exports = {
  validateUser,
  validateCollection,
  logRequestsMw,
  handleDbErrorMw,
  handleErrorMw,
  verifyTokenMw,
};
