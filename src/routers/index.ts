import { Router } from "express";
import { userController } from "../auth/auth.controller.js";

const router = Router();
router.use("/user", userController);
// router.use("/items", );
export { router };
