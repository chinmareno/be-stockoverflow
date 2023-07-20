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
const getProfitByMonth = ({ date, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.profit.findUnique({
        where: { userId_date: { date, userId } },
        include: { profitItem: true },
    });
});
const addProfit = ({ profitItem, userId, date, totalCost, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: profitId } = yield prisma.profit.upsert({
        where: { userId_date: { date, userId } },
        create: { date, userId },
        update: {},
    });
    const { name, totalProfit, type } = profitItem;
    yield prisma.profitItem.upsert({
        where: { profitId_name_type: { name, profitId, type } },
        create: { name, totalProfit: totalProfit - totalCost, type, profitId },
        update: { totalProfit: { increment: totalProfit - totalCost } },
    });
    return totalProfit - totalCost;
});
const decreaseProfit = ({ userId, date, totalPrice, profitItem, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = yield prisma.profit.findUnique({
        where: { userId_date: { date, userId } },
    });
    const { profitId, name, type, totalProfit } = yield prisma.profitItem.update({
        where: {
            profitId_name_type: {
                name: profitItem.name,
                type: profitItem.type,
                profitId: id,
            },
        },
        data: { totalProfit: { decrement: totalPrice } },
    });
    if (totalProfit == 0) {
        yield prisma.profitItem.delete({
            where: { profitId_name_type: { name, profitId, type } },
        });
    }
});
const getAllProfit = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.profit.findMany({ include: { profitItem: true } });
});
const editProfit = ({ profitItem, userId, date }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: profitId } = yield prisma.profit.upsert({
        where: { userId_date: { date, userId } },
        create: { date, userId },
        update: {},
    });
    const { name, totalProfit, type } = profitItem;
    const { id, totalProfit: afterTotalProfit } = yield prisma.profitItem.upsert({
        where: { profitId_name_type: { name, profitId, type } },
        create: { name, totalProfit: Number(totalProfit), type, profitId },
        update: { totalProfit: Number(totalProfit) },
    });
    if (afterTotalProfit == 0) {
        yield prisma.profitItem.delete({
            where: { profitId_name_type: { name, profitId: id, type } },
        });
    }
});
export { addProfit, editProfit, getProfitByMonth, getAllProfit, decreaseProfit, };
//# sourceMappingURL=profit.repository.js.map