import prisma from "../configs/db.js";
import { UnauthorizedError } from "../errors/index.js";

const findAll = async () => {
  const user = await prisma.user.findMany();
  return user;
};

const createUser = async (username: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });
  return user;
};

const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
};

const findPasswordByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    throw new UnauthorizedError("username not ");
  }
  return user;
};

const updateUsernamePassword = async (username: string, password: string) => {
  const user = await prisma.user.update({
    where: {
      username,
    },
    data: { username, password },
  });
  return user;
};

const updateTheme = async (userId: string, theme: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: { theme },
  });
};

export {
  createUser,
  findPasswordByUsername,
  findUserByUsername,
  updateUsernamePassword,
  findAll,
  findUserById,
  updateTheme,
};
