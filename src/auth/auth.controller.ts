import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware.js";
import { createToken } from "../middleware/createToken.js";
import express from "express";
import { findAll } from "./auth.repository.js";
import { getUserProfile, login, signup } from "./auth.service.js";
import { errorHandler } from "../middleware/errorHandler.js";
import prisma from "../configs/db.js";

const router = express.Router();

type UserId = string;

const cookieName = process.env.COOKIE_NAME as string;

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
      res.status(200).send(userProfile);
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
        .cookie(cookieName, token)
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
      res.cookie(cookieName, token).status(201).send("Login Success");
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
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      await login(userData);
      if (userData) {
        res.send("Change username and password success");
      }
    } catch (err) {
      next(err);
    }
  }
);

router.use(errorHandler);

const userController = router;
export { userController };
