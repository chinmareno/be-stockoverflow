import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  createUser,
  findUserById,
  findUserByUsername,
  updatePassword,
  updateTheme,
  updateUserName,
} from "./auth.repository";
import {
  compareHash,
  compareHashPassword,
  hashing,
} from "../middleware/hashing";
import {
  BadRequestError,
  ServerError,
  UnauthorizedError,
  UniqueError,
} from "../errors";

export type Theme = "dark" | "light";

interface IUserProfile {
  username: string;
  theme: Theme;
}
interface IUserData {
  username: string;
  password: string;
}
interface IUserDataChangeUsername {
  username: string;
  password: string;
  newusername: string;
}
interface IUserDataChangePassword {
  username: string;
  password: string;
  newpassword: string;
}

const signup = async ({ username, password }: IUserData) => {
  const checkUserame = await findUserByUsername(username);
  if (checkUserame) {
    throw new UniqueError("Username has been taken.");
  }
  const hashedPassword = await hashing(password);
  try {
    const user = await createUser(username, hashedPassword);
    return user;
  } catch (error) {
    throw new ServerError("Failed to signup due to server");
  }
};

const login = async ({ username, password }: IUserData) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError("Username not found");
  }
  compareHashPassword(password, user.password);
  return user;
};

const getUserProfile = async (userId: string): Promise<IUserProfile> => {
  const user = await findUserById(userId);
  const { username, theme } = user as IUserProfile;
  return { username, theme };
};

const changeUserName = async ({
  username,
  password,
  newusername,
}: IUserDataChangeUsername) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError("Username incorrect");
  }
  compareHashPassword(password, user.password);
  try {
    await updateUserName(username, newusername);
  } catch (error) {
    throw new ServerError("Failed to change username due to server");
  }
  return user;
};

const changePassword = async ({
  username,
  password,
  newpassword,
}: IUserDataChangePassword) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError("username incorrect");
  }
  compareHashPassword(password, user.password);
  try {
    await updatePassword(username, newpassword);
  } catch (error) {
    throw new ServerError("Failed to change password due to server");
  }

  return user;
};

const changeTheme = async (userId: string, theme: Theme) => {
  try {
    const user = await updateTheme(userId, theme);
    return user;
  } catch (error) {
    throw new ServerError("Failed to change theme due to server");
  }
};

export {
  signup,
  login,
  changeUserName,
  changePassword,
  changeTheme,
  getUserProfile,
};
