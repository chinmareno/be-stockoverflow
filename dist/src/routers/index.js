import { Router } from "express";
import { userController } from "./auth/auth.controller.js";
import { itemController } from "./items/items.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import invoiceController from "./invoice/invoice.controller.js";
import profitController from "./profit/profit.controller.js";
const router = Router();
router.use("/user", userController);
router.use("/items", authMiddleware, itemController);
router.use("/invoice", authMiddleware, invoiceController);
router.use("/profit", authMiddleware, profitController);
export { router };
//# sourceMappingURL=index.js.map