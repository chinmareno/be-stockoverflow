import { NextFunction, Request, Response } from "express";
import {
  authMiddleware,
  AuthRequest,
} from "../../middleware/authMiddleware.js";
import { createToken } from "../../middleware/createToken.js";
import express from "express";
import { findAll } from "./auth.repository.js";
import {
  changeImage,
  changeTheme,
  editAccount,
  getUserProfile,
  getUserTheme,
  login,
  signup,
} from "./auth.service.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import prisma from "../../configs/db.js";
import { __dirname } from "../../../app.js";
import fs from "fs";

const router = express.Router();

type UserId = string;

const cookieName = process.env.COOKIE_NAME as string;

router.delete("/", async (req: Request, res: Response) => {
  await prisma.user.deleteMany();
  res.send("success delete all user");
});

router.get("/", async (req: Request, res: Response) => {
  const user = await findAll();
  res.json(user);
});

router.get(
  "/profile",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const userProfile = await getUserProfile(userId as UserId);
      res.status(200).send(userProfile);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/theme",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const userTheme = await getUserTheme(userId as UserId);
      res.status(200).send(userTheme);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user = await signup(userData);
      const token = createToken(user.id);
      res
        .cookie(cookieName, token, {
          domain: ".vercel.app",
          sameSite: "none",
          path: "/",
          secure: true,
        })
        .status(201)
        .send("Account created successfully");
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user = await login(userData);
      if (req.cookies[cookieName]) {
        res.clearCookie(cookieName);
      }
      const token = createToken(user.id);
      res
        .cookie(cookieName, token, {
          domain: ".vercel.app",
          sameSite: "none",
          path: "/",
          secure: true,
        })
        .status(201)
        .send("Login Success");
    } catch (err) {
      next(err);
    }
  }
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).clearCookie(cookieName).send("bye jwt");
});

router.patch(
  "/change-username-password",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId as string;
      const { username, password } = req.body;
      await editAccount({ userId, username, password });
      res.status(200).send("Change username and password success");
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/change-image",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId as string;
      //Delete old image
      const { image: oldImage } = await getUserProfile(userId);
      if (oldImage) {
        fs.unlinkSync(__dirname + "/" + oldImage);
      }
      // //Put new image
      const image = req.file?.path as string;
      await changeImage({ userId, image });
      res.status(200).send("Change image success");
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/change-theme",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { theme } = req.body;
      await changeTheme({ userId: req.userId as string, theme });
      res.status(200).send("Change theme success");
    } catch (err) {
      next(err);
    }
  }
);

router.use(errorHandler);

const userController = router;
export { userController };
