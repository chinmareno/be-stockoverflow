var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUser, editUser, findUserById, findUserByUsername, updateImage, updateTheme, updateUsernamePassword, } from "./auth.repository.js";
import { compareHashPassword, hashing } from "../../middleware/hashing.js";
import { BadRequestError, ServerError, UnauthorizedError, UniqueError, } from "../../errors/index.js";
import Joi from "joi";
const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
const usernameSchema = Joi.string().min(4).max(20).required();
const passwordSchema = Joi.string().min(8).max(128).required();
const themeSchema = Joi.string().valid("dark", "light");
const imageSchema = Joi.string().required();
const signup = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: errorUsername } = usernameSchema.validate(username);
    if (errorUsername) {
        throw new BadRequestError("Invalid username format");
    }
    const { error: errorPassword } = passwordSchema.validate(password);
    if (errorPassword) {
        throw new BadRequestError("Invalid password format");
    }
    const checkUserame = yield findUserByUsername(username);
    if (checkUserame) {
        throw new UniqueError("Username has been taken");
    }
    const hashedPassword = yield hashing(password);
    try {
        const user = yield createUser(username, hashedPassword);
        return user;
    }
    catch (error) {
        throw new ServerError("Failed to signup due to server");
    }
});
const login = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: errorUsername } = usernameSchema.validate(username);
    if (errorUsername) {
        throw new BadRequestError("Invalid username format");
    }
    const { error: errorPassword } = passwordSchema.validate(password);
    if (errorPassword) {
        throw new BadRequestError("Invalid password format");
    }
    const user = yield findUserByUsername(username);
    if (!user) {
        throw new UnauthorizedError("Username not found");
    }
    compareHashPassword(password, user.password);
    return user;
});
const editAccount = ({ userId, username, password }) => __awaiter(void 0, void 0, void 0, function* () {
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
        const hashedPassword = yield hashing(password);
        yield editUser({ userId, username, password: hashedPassword });
    }
    catch (error) {
        throw new ServerError("Failed to edit account due to server");
    }
});
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userIdSchema.validate(userId);
    if (error) {
        throw new BadRequestError("Invalid user id format");
    }
    const user = yield findUserById(userId);
    const { username, image, seller } = user;
    return { username, image, seller };
});
const getUserTheme = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userIdSchema.validate(userId);
    if (error) {
        throw new BadRequestError("Invalid user id format");
    }
    const user = yield findUserById(userId);
    const { theme } = user;
    return { theme };
});
const changeUsernamePassword = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: errorUsername } = usernameSchema.validate(username);
    const { error: errorPassword } = passwordSchema.validate(password);
    if (errorUsername) {
        throw new BadRequestError("Invalid username format");
    }
    if (errorPassword) {
        throw new BadRequestError("Invalid password format");
    }
    try {
        yield updateUsernamePassword(username, password);
    }
    catch (error) {
        throw new ServerError("Failed to change username due to server");
    }
});
const changeTheme = ({ userId, theme, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: errorUserId } = userIdSchema.validate(userId);
    const { error: errorTheme } = themeSchema.validate(theme);
    if (errorUserId) {
        throw new BadRequestError("Invalid userid format");
    }
    if (errorTheme) {
        throw new BadRequestError("Invalid theme format");
    }
    try {
        yield updateTheme(userId, theme);
    }
    catch (error) {
        throw new ServerError("Failed to change theme due to server");
    }
});
const changeImage = ({ userId, image, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: errorUserId } = userIdSchema.validate(userId);
    const { error: errorImage } = imageSchema.validate(image);
    if (errorUserId) {
        throw new BadRequestError("Invalid userid format");
    }
    if (errorImage) {
        throw new BadRequestError("Invalid image format");
    }
    try {
        yield updateImage({ userId, image });
    }
    catch (error) {
        throw new ServerError("Failed to change image due to server");
    }
});
export { signup, changeTheme, getUserTheme, login, changeUsernamePassword, getUserProfile, editAccount, changeImage, };
//# sourceMappingURL=auth.service.js.map