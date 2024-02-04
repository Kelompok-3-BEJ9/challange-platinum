const { v4: uuidv4 } = require('uuid');

const randomToken = () => {
  const id = uuidv4();
  return id;
};

module.exports = {
  randomToken,
};