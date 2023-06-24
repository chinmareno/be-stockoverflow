const prisma = require("../configs/db.config");
const hash = require("../middleware/hashing");

const findAll = async () => {
  const user = await prisma.user.findMany();
  return user;
};

const createUser = async (username, password) => {
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });
  return user;
};

const findUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

const findUserByUserName = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
};

const findUserByPassword = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
      password: password,
    },
  });

  return user;
};

const updateUserName = async (username, password, newusername) => {
  const user = await prisma.user.update({
    where: {
      username,
      password,
    },
    data: { username: newusername },
  });
  return user;
};

const updatePassword = async (username, password, newpassword) => {
  const user = await prisma.user.update({
    where: {
      username,
      password,
    },
    data: {
      password: newpassword,
    },
  });
  return user;
};

const updateTheme = async (userId, theme) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      theme: theme,
    },
  });
  return user;
};

module.exports = {
  createUser,
  findUserByPassword,
  findUserByUserName,
  updateUserName,
  updatePassword,
  findAll,
  updateTheme,
  findUserById,
};
