import {
  createUser,
  editUser,
  findUserById,
  findUserByUsername,
  updateImage,
  updateTheme,
  updateUsernamePassword,
} from "./auth.repository.js";
import { compareHashPassword, hashing } from "../middleware/hashing.js";
import {
  BadRequestError,
  ServerError,
  UnauthorizedError,
  UniqueError,
} from "../errors/index.js";
import Joi, { string } from "joi";

const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
const usernameSchema = Joi.string().min(4).max(20).required();
const passwordSchema = Joi.string().min(8).max(128).required();
const themeSchema = Joi.string().valid("dark", "light");
const imageSchema = Joi.string().required();
interface IUserData {
  username: string;
  password: string;
}
interface IUserProfile {
  username: string;
  theme: string;
}

export interface IEditAccount {
  userId: string;
  username: string;
  password: string;
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

const editAccount = async ({ userId, username, password }: IEditAccount) => {
  const { error: errorUserId } = userIdSchema.validate(userId);
  const { error: errorUsername } = usernameSchema.validate(username);
  const { error: errorPassword } = passwordSchema.validate(password);
  if (errorUserId) {
    throw new BadRequestError("Invalid userid format");
  }
  if (errorUsername) {
    throw new BadRequestError("Invalid username format");
  }
  if (errorPassword) {
    throw new BadRequestError("Invalid password format");
  }
  try {
    const hashedPassword = await hashing(password);

    await editUser({ userId, username, password: hashedPassword });
  } catch (error) {
    throw new ServerError("Failed to edit account due to server");
  }
};

const getUserProfile = async (userId: string) => {
  const { error } = userIdSchema.validate(userId);
  if (error) {
    throw new BadRequestError("Invalid user id format");
  }
  const user = await findUserById(userId);
  const { username } = user as IUserProfile;
  return { username };
};

const getUserTheme = async (userId: string) => {
  const { error } = userIdSchema.validate(userId);
  if (error) {
    throw new BadRequestError("Invalid user id format");
  }
  const user = await findUserById(userId);
  const { theme } = user as { theme: string };
  return { theme };
};

const changeUsernamePassword = async ({ username, password }: IUserData) => {
  const { error: errorUsername } = usernameSchema.validate(username);
  const { error: errorPassword } = passwordSchema.validate(password);
  if (errorUsername) {
    throw new BadRequestError("Invalid username format");
  }
  if (errorPassword) {
    throw new BadRequestError("Invalid password format");
  }

  try {
    await updateUsernamePassword(username, password);
  } catch (error) {
    throw new ServerError("Failed to change username due to server");
  }
};

const changeTheme = async ({
  userId,
  theme,
}: {
  userId: string;
  theme: string;
}) => {
  const { error: errorUserId } = userIdSchema.validate(userId);
  const { error: errorTheme } = themeSchema.validate(theme);
  if (errorUserId) {
    throw new BadRequestError("Invalid userid format");
  }
  if (errorTheme) {
    throw new BadRequestError("Invalid theme format");
  }
  try {
    await updateTheme(userId, theme);
  } catch (error) {
    throw new ServerError("Failed to change theme due to server");
  }
};

const changeImage = async ({
  userId,
  image,
}: {
  userId: string;
  image: string;
}) => {
  const { error: errorUserId } = userIdSchema.validate(userId);
  const { error: errorImage } = imageSchema.validate(image);
  if (errorUserId) {
    throw new BadRequestError("Invalid userid format");
  }
  if (errorImage) {
    throw new BadRequestError("Invalid image format");
  }
  try {
    await updateImage({ userId, image });
  } catch (error) {
    throw new ServerError("Failed to change image due to server");
  }
};

export {
  signup,
  changeTheme,
  getUserTheme,
  login,
  changeUsernamePassword,
  getUserProfile,
  editAccount,
  changeImage,
};
