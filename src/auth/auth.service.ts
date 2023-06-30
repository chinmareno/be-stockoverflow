import { Theme } from "./auth.service";
import {
  createUser,
  findUserById,
  findUserByUsername,
  updatePassword,
  updateTheme,
  updateUserName,
} from "./auth.repository.js";
import {
  compareHash,
  compareHashPassword,
  hashing,
} from "../middleware/hashing.js";
import {
  BadRequestError,
  ServerError,
  UnauthorizedError,
  UniqueError,
} from "../errors/index.js";
import Joi from "joi";

const usernameSchema = Joi.object({
  username: Joi.string().min(4).max(20).required(),
});
const passwordSchema = Joi.object({
  password: Joi.string().min(8).max(128).required(),
});

const userIdSchema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

const themeSchema = Joi.object({
  theme: Joi.string().valid("light", "dark").required(),
});

interface IUserData {
  username: string;
  password: string;
}
type Theme = "light" | "dark";

interface IUserProfile {
  username: string;
  theme: Theme;
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
  const { error: errorUsername } = usernameSchema.validate(username);
  if (errorUsername) {
    throw new BadRequestError("Invalid username format");
  }
  const { error: errorPassword } = passwordSchema.validate(password);
  if (errorPassword) {
    throw new BadRequestError("Invalid password format");
  }
  const checkUserame = await findUserByUsername(username);
  if (checkUserame) {
    throw new UniqueError("Username has been taken");
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
  const { error: errorUsername } = usernameSchema.validate(username);
  if (errorUsername) {
    throw new BadRequestError("Invalid username format");
  }
  const { error: errorPassword } = passwordSchema.validate(password);
  if (errorPassword) {
    throw new BadRequestError("Invalid password format");
  }

  const user = await findUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError("Username not found");
  }
  compareHashPassword(password, user.password);
  return user;
};

const getUserProfile = async (userId: string): Promise<IUserProfile> => {
  const { error } = userIdSchema.validate(userId);
  if (error) {
    throw new BadRequestError("Invalid user id format");
  }
  const user = await findUserById(userId);
  const { username, theme } = user as IUserProfile;
  return { username, theme };
};

const changeUsername = async ({
  username,
  password,
  newusername,
}: IUserDataChangeUsername) => {
  const { error: errorUsername } = usernameSchema.validate(username);
  const { error: errorPassword } = passwordSchema.validate(password);
  const { error: errorNewUsername } = usernameSchema.validate(newusername);
  if (errorUsername) {
    throw new BadRequestError("Invalid username format");
  }
  if (errorPassword) {
    throw new BadRequestError("Invalid password format");
  }
  if (errorNewUsername) {
    throw new BadRequestError("Invalid new username format");
  }

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
  const { error: errorUsername } = usernameSchema.validate(username);
  const { error: errorPassword } = passwordSchema.validate(password);
  const { error: errorNewPassword } = passwordSchema.validate(newpassword);
  if (errorUsername) {
    throw new BadRequestError("Invalid username format");
  }
  if (errorPassword) {
    throw new BadRequestError("Invalid password format");
  }
  if (errorNewPassword) {
    throw new BadRequestError("Invalid new password format");
  }

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
  const { error: errorUserId } = userIdSchema.validate(userId);
  const { error: errorTheme } = themeSchema.validate(theme);
  if (errorUserId) {
    throw new BadRequestError("Invalid user id format");
  }
  if (errorTheme) {
    throw new BadRequestError("Invalid theme format");
  }

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
  changeUsername,
  changePassword,
  changeTheme,
  getUserProfile,
};
