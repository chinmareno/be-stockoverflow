import { Router } from "express";
import { userController } from "../auth/auth.controller.js";
import { itemController } from "../items/items.controller.js";

const router = Router();
router.use("/user", userController);
router.use("/items", itemController);
export { router };
