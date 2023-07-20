var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../configs/db.js";
import { UnauthorizedError } from "../../errors/index.js";
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findMany();
    return user;
});
const createUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.create({
        data: {
            username,
            password,
        },
    });
    return user;
});
const editUser = ({ userId, username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { id: userId },
        data: {
            username,
            password,
        },
    });
});
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    return user;
});
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            username,
        },
    });
    return user;
});
const findPasswordByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            username,
        },
    });
    if (!user) {
        throw new UnauthorizedError("username not ");
    }
    return user;
});
const updateUsernamePassword = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: {
            username,
        },
        data: { username, password },
    });
    return user;
});
const updateTheme = (userId, theme) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: {
            id: userId,
        },
        data: { theme },
    });
});
const updateImage = ({ userId, image, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: {
            id: userId,
        },
        data: { image },
    });
});
export { createUser, findPasswordByUsername, findUserByUsername, updateUsernamePassword, findAll, findUserById, updateTheme, editUser, updateImage, };
//# sourceMappingURL=auth.repository.js.map