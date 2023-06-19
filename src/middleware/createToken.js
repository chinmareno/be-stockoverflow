const jwt = require("jsonwebtoken");

const createToken = (id) => {
  const token = jwt.sign({ id }, "secret");
  return token;
};

module.exports = createToken;
