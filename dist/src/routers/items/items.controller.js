var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { createProduct, deleteProduct, getAllProduct, } from "./items.service.js";
import { DeleteAllItemList } from "./items.repository.js";
import { errorHandler } from "../../middleware/errorHandler.js";
const router = express.Router();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemList = yield getAllProduct(req.userId);
        res.status(200).send(itemList);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { name, type, length, quantity, cost, editStock = false, } = req.body;
        yield createProduct({
            userId,
            name,
            type,
            length,
            quantity,
            cost,
            editStock,
        });
        res.status(201).send("New product created");
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { name, type, length, quantity, cost, editStock = false, } = req.body;
        yield createProduct({
            userId,
            name,
            type,
            length: Number(length),
            quantity: Number(quantity),
            cost: Number(cost),
            editStock,
        });
        res.status(200).send("Product quantity changed");
    }
    catch (error) {
        next(error);
    }
}));
router.post("/delete", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    yield DeleteAllItemList(userId);
    res.status(200).send("success delete");
}));
router.delete("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { name, type, length, cost } = req.query;
        yield deleteProduct({
            userId,
            name,
            type,
            length: parseInt(length),
            cost: parseInt(cost),
        });
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
}));
router.use(errorHandler);
const itemController = router;
export { itemController };
//# sourceMappingURL=items.controller.js.map