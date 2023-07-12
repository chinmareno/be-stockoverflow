import { Router } from "express";
import { userController } from "../auth/auth.controller.js";
import { itemController } from "../items/items.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.use("/user", userController);
router.use("/items", authMiddleware, itemController);
export { router };
