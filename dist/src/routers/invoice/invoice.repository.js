var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../configs/db.js";
const createInvoice = ({ userId, date, seller, buyer, invoiceItem, totalPrice, paidStatus, }) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield prisma.invoice.create({
        data: {
            userId,
            date,
            seller,
            buyer,
            totalPrice,
            paidStatus,
        },
    });
    yield prisma.invoiceItem.createMany({
        data: invoiceItem.map(({ name, type, length, price, quantity }) => {
            return {
                invoiceId: invoice.id,
                userId,
                name,
                type,
                length,
                price,
                quantity,
            };
        }),
    });
    return invoice;
});
const getAllInvoice = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.invoice.findMany({
        where: { userId },
        include: { invoiceItem: true },
    });
});
const updatePaidStatus = ({ userId, invoiceId, paidStatus, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.invoice.update({
        where: { id_userId: { id: invoiceId, userId } },
        data: { paidStatus },
    });
});
const getUnpaidInvoicesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.invoice.findMany({
        where: { userId, paidStatus: "UNPAID" },
        include: { invoiceItem: true },
    });
});
const getInvoiceByDate = ({ userId, date }) => __awaiter(void 0, void 0, void 0, function* () {
    const invoices = yield prisma.invoice.findMany({
        where: { userId, date },
        include: { invoiceItem: true },
    });
    return invoices;
});
const createInvoiceHistory = ({ invoiceId, length, name, price, quantity, type, userId, date, totalProfit, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.invoiceHistory.create({
        data: {
            invoiceId,
            length,
            name,
            price,
            quantity,
            type,
            userId,
            date,
            totalProfit,
        },
    });
});
const getInvoiceHistory = ({ invoiceId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceHistory = yield prisma.invoiceHistory.findMany({
        where: { invoiceId, userId },
    });
    yield prisma.invoiceHistory.deleteMany({ where: { userId, invoiceId } });
    return invoiceHistory;
});
const deleteInvoice = ({ id, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.invoice.delete({ where: { id_userId: { id, userId } } });
});
export { createInvoiceHistory, createInvoice, getInvoiceByDate, deleteInvoice, getAllInvoice, getUnpaidInvoicesByUserId, updatePaidStatus, getInvoiceHistory, };
//# sourceMappingURL=invoice.repository.js.map