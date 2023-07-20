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
import { changePaidStatus, getInvoices, getUnpaidInvoices, makeInvoice, removeInvoice, } from "./invoice.service.js";
import { getAllInvoice } from "./invoice.repository.js";
import { errorHandler } from "../../middleware/errorHandler.js";
const router = express.Router();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const invoices = yield getAllInvoice(userId);
        res.status(200).send(invoices);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/unpaid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const unpaidInvoices = yield getUnpaidInvoices(userId);
        res.status(200).send(unpaidInvoices);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:date", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = req.params.date;
        const userId = req.userId;
        const invoices = yield getInvoices({ date, userId });
        res.status(200).send(invoices);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { buyer, date, invoiceItem, seller, totalPrice, paidStatus, } = req.body;
        yield makeInvoice({
            buyer,
            date,
            invoiceItem,
            seller,
            totalPrice,
            userId,
            paidStatus,
        });
        res.status(201).send("Invoice created successfully");
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { invoiceId, paidStatus } = req.body;
        yield changePaidStatus({ invoiceId, paidStatus, userId });
        res.status(200).send("Paid status changed successfully");
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const invoiceId = req.params.id;
        yield removeInvoice({ id: invoiceId, userId });
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
}));
router.use(errorHandler);
const invoiceController = router;
export default invoiceController;
//# sourceMappingURL=invoice.controller.js.map