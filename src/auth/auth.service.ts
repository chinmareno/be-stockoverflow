import {
  createUser,
  findUserById,
  findUserByUsername,
  updateUsernamePassword,
} from "./auth.repository.js";
import { compareHashPassword, hashing } from "../middleware/hashing.js";
import {
  BadRequestError,
  ServerError,
  UnauthorizedError,
  UniqueError,
} from "../errors/index.js";
import Joi from "joi";

const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
const usernameSchema = Joi.string().min(4).max(20).required();
const passwordSchema = Joi.string().min(8).max(128).required();

interface IUserData {
  username: string;
  password: string;
}
interface IUserProfile {
  username: string;
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
  const { username } = user as IUserProfile;
  return { username };
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

export { signup, login, changeUsernamePassword, getUserProfile };
