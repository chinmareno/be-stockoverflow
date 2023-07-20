var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Joi from "joi";
import { createInvoice, deleteInvoice, getInvoiceByDate, getUnpaidInvoicesByUserId, updatePaidStatus, createInvoiceHistory, getInvoiceHistory, } from "./invoice.repository.js";
import { costSchema, createProduct, userIdSchema, } from "../items/items.service.js";
import { BadRequestError } from "../../errors/index.js";
import { decreaseItemQuantity, updateSellerByUserId, } from "../items/items.repository.js";
import { addProfit, decreaseProfit } from "../profit/profit.repository.js";
const idSchema = Joi.string().required();
const buyerSchema = Joi.string().required();
const sellerSchema = Joi.string().required();
const singleInvoiceItemSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    length: Joi.number().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
});
const invoiceItemSchema = Joi.array().items(singleInvoiceItemSchema);
const stringSchema = Joi.string().required();
const paidStatusSchema = Joi.string().valid("PAID", "UNPAID").required();
const dateSchema = Joi.string().required();
const makeInvoice = ({ userId, date, buyer, seller, totalPrice, invoiceItem, paidStatus, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: userIdError } = userIdSchema.validate(userId);
    const { error: dateError } = dateSchema.validate(date);
    const { error: buyerError } = buyerSchema.validate(buyer);
    const { error: sellerError } = sellerSchema.validate(seller);
    const { error: totalPriceError } = costSchema.validate(totalPrice);
    const invoicesItemForRepo = invoiceItem.map(({ length, name, price, quantity, type }) => ({
        length: Number(length),
        name,
        price: Number(price),
        type,
        quantity: Number(quantity),
    }));
    const { error: invoiceItemError } = invoiceItemSchema.validate(invoicesItemForRepo);
    if (userIdError) {
        throw new BadRequestError("incorrect userid format :" + userId);
    }
    if (dateError) {
        throw new BadRequestError("incorrect date format :" + date);
    }
    if (buyerError) {
        throw new BadRequestError("incorrect buyer format :" + buyer);
    }
    if (sellerError) {
        throw new BadRequestError("incorrect seller format :" + seller);
    }
    if (totalPriceError) {
        throw new BadRequestError("incorrect total price format :" + totalPrice);
    }
    if (invoiceItemError) {
        throw new BadRequestError("incorrect invoice item format :" + invoiceItem);
    }
    yield updateSellerByUserId({ userId, seller });
    const { id } = yield createInvoice({
        userId,
        buyer,
        seller,
        date,
        totalPrice,
        invoiceItem: invoicesItemForRepo,
        paidStatus,
    });
    yield Promise.all(invoiceItem.map(({ name, price, quantity, type, length }) => __awaiter(void 0, void 0, void 0, function* () {
        const profitItem = { name, type, totalProfit: price * quantity };
        const totalCostUnreduce = yield decreaseItemQuantity({
            length: Number(length),
            name,
            quantity,
            type,
            userId,
        });
        const totalCostReduced = totalCostUnreduce.reduce((acc, curr) => curr.totalCost + acc, 0);
        const totalProfit = yield addProfit({
            date: date.slice(3),
            userId,
            profitItem,
            totalCost: totalCostReduced,
        });
        yield createInvoiceHistory({
            invoiceId: id,
            length: Number(length),
            name,
            price: Number(price),
            quantity: Number(quantity),
            type,
            userId,
            totalProfit,
            date: date.slice(3),
        });
    })));
});
const removeInvoice = ({ id, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: idError } = idSchema.validate(id);
    const { error: userIdError } = userIdSchema.validate(userId);
    if (idError) {
        throw new BadRequestError("incorrect id format :" + id);
    }
    if (userIdError) {
        throw new BadRequestError("incorrect user id format :" + userId);
    }
    const invoiceHistory = yield getInvoiceHistory({ invoiceId: id, userId });
    yield Promise.all(invoiceHistory.map(({ length, name, price, quantity, type, date, totalProfit }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createProduct({
            cost: price,
            editStock: false,
            length,
            name,
            quantity,
            type,
            userId,
        });
        yield decreaseProfit({
            date,
            profitItem: { name, type, totalProfit },
            totalPrice: totalProfit,
            userId,
        });
    })));
    return yield deleteInvoice({ id, userId });
});
const getUnpaidInvoices = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: invoiceIdError } = userIdSchema.validate(userId);
    if (invoiceIdError) {
        throw new BadRequestError("Incorrect user id format :" + userId);
    }
    const unpaidInvoices = yield getUnpaidInvoicesByUserId(userId);
    return unpaidInvoices;
});
const getInvoices = ({ date, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: dateError } = stringSchema.validate(date);
    const { error: userIdError } = userIdSchema.validate(userId);
    if (userIdError) {
        throw new BadRequestError("incorrect user id format :" + userIdError);
    }
    if (dateError) {
        throw new BadRequestError("incorrect date format :" + dateError);
    }
    const invoices = yield getInvoiceByDate({ date, userId });
    return invoices;
});
const changePaidStatus = ({ userId, invoiceId, paidStatus, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: userIdError } = userIdSchema.validate(userId);
    const { error: invoiceIdError } = idSchema.validate(invoiceId);
    const { error: paidStatusError } = paidStatusSchema.validate(paidStatus);
    if (userIdError) {
        throw new BadRequestError("incorrect user id format :" + userIdError);
    }
    if (invoiceIdError) {
        throw new BadRequestError("incorrect invoice id format :" + invoiceId);
    }
    if (paidStatusError) {
        throw new BadRequestError("incorrect paid status format :" + paidStatus);
    }
    yield updatePaidStatus({ invoiceId, paidStatus, userId });
});
export { makeInvoice, removeInvoice, getInvoices, getUnpaidInvoices, changePaidStatus, };
//# sourceMappingURL=invoice.service.js.map