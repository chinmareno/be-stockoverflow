import express from "express";
import { AuthRequest, authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct, getAllProduct } from "./items.service.js";
import { ICreateProduct } from "./items.repository.js";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res, next) => {
  const itemList = await getAllProduct(req.userId as string);
  res.status(200).send(itemList);
});

router.post("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const { name, type, length, quantity }: ICreateProduct = req.body;
    await createProduct({ userId, name, type, length, quantity });
    res.status(201).send("New product created");
  } catch (error) {
    next(error);
  }
});

const itemController = router;
export { itemController };
