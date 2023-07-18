import express from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
} from "./items.service.js";
import { DeleteAllItemList, ICreateProduct } from "./items.repository.js";
import { errorHandler } from "../../middleware/errorHandler.js";

const router = express.Router();

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const itemList = await getAllProduct(req.userId as string);
    res.status(200).send(itemList);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const {
      name,
      type,
      length,
      quantity,
      cost,
      editStock = false,
    }: ICreateProduct = req.body;
    await createProduct({
      userId,
      name,
      type,
      length,
      quantity,
      cost,
      editStock,
    });
    res.status(201).send("New product created");
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const {
      name,
      type,
      length,
      quantity,
      cost,
      editStock = false,
    }: ICreateProduct = req.body;
    await createProduct({
      userId,
      name,
      type,
      length: Number(length),
      quantity: Number(quantity),
      cost: Number(cost),
      editStock,
    });
    res.status(200).send("Product quantity changed");
  } catch (error) {
    next(error);
  }
});

router.post("/delete", async (req: AuthRequest, res, next) => {
  const userId = req.userId as string;
  await DeleteAllItemList(userId);
  res.status(200).send("success delete");
});

router.delete("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const { name, type, length, cost } = req.query as any;
    await deleteProduct({
      userId,
      name,
      type,
      length: parseInt(length),
      cost: parseInt(cost),
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

const itemController = router;
export { itemController };
