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
import { changeProfit, getProfit } from "./profit.service.js";
import { getAllProfit } from "./profit.repository.js";
const router = express.Router();
router.patch("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { date, profitItem } = req.body;
        yield changeProfit({ date, profitItem, userId });
        res.status(200).send("Total profit changed successfully");
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:date", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { date } = req.params;
        const thisMonthProfits = yield getProfit({ date, userId });
        console.log(thisMonthProfits);
        res.status(200).send(thisMonthProfits);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allProfit = yield getAllProfit();
        res.send(allProfit);
        res;
    }
    catch (error) { }
}));
const profitController = router;
export default profitController;
//# sourceMappingURL=profit.controller.js.map