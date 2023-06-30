import prisma from "../configs/db.config";
import { UnauthorizedError } from "../errors";

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

const updateUserName = async (username: string, newusername: string) => {
  const user = await prisma.user.update({
    where: {
      username,
    },
    data: { username: newusername },
  });
  return user;
};

const updatePassword = async (username: string, newpassword: string) => {
  const user = await prisma.user.update({
    where: {
      username,
    },
    data: {
      password: newpassword,
    },
  });
  return user;
};

const updateTheme = async (userId: string, theme: "dark" | "light") => {
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

export {
  createUser,
  findPasswordByUsername,
  findUserByUsername,
  updateUserName,
  updatePassword,
  findAll,
  updateTheme,
  findUserById,
};
