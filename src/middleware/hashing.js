const bcrypt = require("bcrypt");

const hashing = async (unhashed) => {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(unhashed, salt);
  return hashed;
};

const compareHash = (unhash, hashed) => {
  return bcrypt.compareSync(unhash, hashed);
};
module.exports = { hashing, compareHash };
