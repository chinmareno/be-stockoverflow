const { UniqueError, ServerError, BadRequestError } = require("../errors");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { compareHash, hashing } = require("../middleware/hashing");
const {
  createUser,
  findUserByUserName,
  updateUserName,
  updatePassword,
  updateTheme,
  findUserById,
} = require("./auth.repository");

const signup = async (userData) => {
  const { username, password } = userData;
  const checkUserame = await findUserByUserName(username);
  if (checkUserame) {
    throw new UniqueError("Username has been taken.");
  }
  const hashedPassword = await hashing(password);
  const user = await createUser(username, hashedPassword);
  return user;
};

const login = async (userData) => {
  const { username, password } = userData;
  const data = await findUserByUserName(username);
  if (!data) {
    throw new BadRequestError("Username not found");
  }
  const match = compareHash(password, data.password);
  if (!match) {
    throw new UnauthorizedError("Incorrect password");
  }
  return data;
};

const getUserProfile = async (userId) => {
  const user = await findUserById(userId);
  const { username, theme } = user;
  return { username, theme };
};

const changeUserName = async (userData) => {
  const { username, password, newusername } = userData;
  const user = await updateUserName(username, password, newusername);
  if (!user) {
    throw new ClientError("Please check your username and password correctly");
  }
  return user;
};

const changePassword = async (userData) => {
  const { username, password, newpassword } = userData;
  const user = await updatePassword(username, password, newpassword);

  if (!user) {
    throw new ClientError("Please check your username and password correctly");
  }
  return user;
};

const changeTheme = async (userId, theme) => {
  const user = await updateTheme(userId, theme);
  return user;
};

module.exports = {
  signup,
  login,
  changeUserName,
  changePassword,
  changeTheme,
  getUserProfile,
};
