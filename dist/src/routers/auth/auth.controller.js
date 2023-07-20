var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { authMiddleware, } from "../../middleware/authMiddleware.js";
import { createToken } from "../../middleware/createToken.js";
import express from "express";
import { findAll } from "./auth.repository.js";
import { changeImage, changeTheme, editAccount, getUserProfile, getUserTheme, login, signup, } from "./auth.service.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import prisma from "../../configs/db.js";
import { __dirname } from "../../../app.js";
import fs from "fs";
const router = express.Router();
const cookieName = process.env.COOKIE_NAME;
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.deleteMany();
    res.send("success delete all user");
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield findAll();
    res.json(user);
}));
router.get("/profile", authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const userProfile = yield getUserProfile(userId);
        res.status(200).send(userProfile);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/theme", authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const userTheme = yield getUserTheme(userId);
        res.status(200).send(userTheme);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const user = yield signup(userData);
        const token = createToken(user.id);
        res
            .cookie(cookieName, token, { httpOnly: true, secure: true })
            .status(201)
            .send("Account created successfully");
    }
    catch (err) {
        next(err);
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const user = yield login(userData);
        if (req.cookies[cookieName]) {
            res.clearCookie(cookieName);
        }
        const token = createToken(user.id);
        res
            .cookie(cookieName, token, { httpOnly: true, secure: true })
            .status(201)
            .send("Login Success");
    }
    catch (err) {
        next(err);
    }
}));
router.post("/logout", (req, res, next) => {
    res.status(200).clearCookie(cookieName).send("bye jwt");
});
router.patch("/change-username-password", authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { username, password } = req.body;
        yield editAccount({ userId, username, password });
        res.status(200).send("Change username and password success");
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/change-image", authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.userId;
        //Delete old image
        const { image: oldImage } = yield getUserProfile(userId);
        if (oldImage) {
            fs.unlinkSync(__dirname + "/" + oldImage);
        }
        // //Put new image
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        yield changeImage({ userId, image });
        res.status(200).send("Change image success");
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/change-theme", authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { theme } = req.body;
        yield changeTheme({ userId: req.userId, theme });
        res.status(200).send("Change theme success");
    }
    catch (err) {
        next(err);
    }
}));
router.use(errorHandler);
const userController = router;
export { userController };
//# sourceMappingURL=auth.controller.js.map