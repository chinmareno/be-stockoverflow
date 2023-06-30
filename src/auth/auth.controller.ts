import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.config";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { createToken } from "../middleware/createToken";
import express from "express";
import { findAll } from "./auth.repository";
import {
  Theme,
  changeTheme,
  getUserProfile,
  login,
  signup,
} from "./auth.service";
import { errorHandler } from "../middleware/errorHandler";

const router = express.Router();

type UserId = string;

router.delete("/", async (req: Request, res: Response) => {
  await prisma.user.deleteMany();
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
      console.log("userProfile");
      res.send(userProfile);
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
      res.cookie("jwt", token).status(201).send("Account created successfully");
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
      if (req.cookies.jwt) {
        res.clearCookie("jwt");
      }
      const token = createToken(user.id);
      res.cookie("jwt", token).status(201).send("Login Success");
    } catch (err) {
      next(err);
    }
  }
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).clearCookie("jwt").send("bye jwt");
});

router.patch(
  "/change-theme",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const { theme } = req.body;
      console.log(theme);
      await changeTheme(userId as UserId, theme);
      res.status(200).send("theme changed");
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/change-username",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      await login(userData);
      if (userData) {
        res.send("Change username success");
      }
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/change-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      await login(userData);
      res.send("Change password success");
    } catch (err) {
      next(err);
    }
  }
);

router.use(errorHandler);

const userController = router;
export { userController };
