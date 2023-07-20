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
import { NotFoundError } from "../../errors/NotFoundError.js";
const DeleteAllItemList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const itemList = yield prisma.itemList.deleteMany({
        where: { userId },
    });
    return itemList;
});
const findItemListByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const itemList = yield prisma.itemList.findUnique({
        where: { userId },
        include: {
            itemName: {
                include: {
                    itemType: {
                        include: {
                            itemLength: true,
                        },
                    },
                },
            },
        },
    });
    return itemList;
});
const updateSellerByUserId = ({ userId, seller, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { id: userId },
        data: { seller: seller },
    });
});
const createItemList = ({ userId, name, type, length, quantity, cost, editStock, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: itemListId } = yield prisma.itemList.upsert({
        where: { userId },
        create: { userId },
        update: {},
        select: { id: true },
    });
    const { id: itemNameId } = yield prisma.itemName.upsert({
        where: { name_itemListId: { itemListId, name } },
        create: { name, itemListId },
        update: {},
        select: { id: true },
    });
    const { id: itemTypeId } = yield prisma.itemType.upsert({
        where: { type_itemNameId: { itemNameId, type } },
        create: { type, itemNameId },
        update: {},
        select: { id: true },
    });
    const sameDayItem = yield prisma.itemLength.findUnique({
        where: { length_itemTypeId_cost: { itemTypeId, length, cost } },
    });
    let quantityAddOrCreate = quantity;
    if (sameDayItem) {
        if (!editStock) {
            quantityAddOrCreate += sameDayItem.quantity;
        }
    }
    yield prisma.itemLength.upsert({
        where: { length_itemTypeId_cost: { itemTypeId, length, cost } },
        create: {
            length,
            itemTypeId,
            quantity: quantityAddOrCreate,
            cost,
        },
        update: { quantity: quantityAddOrCreate },
    });
});
const deleteItem = ({ userId, name, type, length, cost, }) => __awaiter(void 0, void 0, void 0, function* () {
    const itemList = yield prisma.itemList.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!itemList) {
        throw new NotFoundError("userId not found on itemList");
    }
    const itemName = yield prisma.itemName.findUnique({
        where: { name_itemListId: { itemListId: itemList.id, name } },
        select: { id: true },
    });
    if (!itemName) {
        throw new NotFoundError("itemListId not found on itemName");
    }
    const itemType = yield prisma.itemType.findUnique({
        where: { type_itemNameId: { itemNameId: itemName.id, type } },
        select: { id: true },
    });
    if (!itemType) {
        throw new NotFoundError("itemNameId not found on itemTypeId");
    }
    const itemLength = yield prisma.itemLength.findUnique({
        where: {
            length_itemTypeId_cost: {
                itemTypeId: itemType.id,
                length,
                cost,
            },
        },
        select: { id: true },
    });
    if (!itemLength) {
        throw new NotFoundError("itemTypeId not found on itemLength");
    }
    yield prisma.itemLength.delete({
        where: {
            length_itemTypeId_cost: {
                itemTypeId: itemType.id,
                length,
                cost,
            },
        },
    });
});
const decreaseItemQuantity = ({ userId, name, type, length, quantity, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: itemListId } = yield prisma.itemList.upsert({
        where: { userId },
        create: { userId },
        update: {},
        select: { id: true },
    });
    const { id: itemNameId, name: selectedName } = yield prisma.itemName.upsert({
        where: { name_itemListId: { itemListId, name } },
        create: { name, itemListId },
        update: {},
        select: { id: true, name: true },
    });
    const { id: itemTypeId, type: selectedType } = yield prisma.itemType.upsert({
        where: { type_itemNameId: { itemNameId, type } },
        create: { type, itemNameId },
        update: {},
        select: { id: true, type: true },
    });
    let selectedItem = yield prisma.itemLength.findFirst({
        where: { itemTypeId, length },
    });
    let quantityNeeded = quantity;
    const productNameTypeTotalCost = [];
    while (selectedItem.quantity < quantityNeeded) {
        const { cost, quantity } = yield prisma.itemLength.delete({
            where: { id: selectedItem.id },
        });
        productNameTypeTotalCost.push({
            totalCost: cost * quantity,
            name,
            type,
            length,
            cost,
            quantity,
        });
        quantityNeeded -= selectedItem.quantity;
        selectedItem = yield prisma.itemLength.findFirst({
            where: { itemTypeId, length },
        });
    }
    if (selectedItem.quantity == quantityNeeded) {
        const { cost, quantity } = yield prisma.itemLength.delete({
            where: { id: selectedItem.id },
        });
        productNameTypeTotalCost.push({
            totalCost: cost * quantity,
            name,
            type,
            length,
            cost,
            quantity,
        });
        return productNameTypeTotalCost;
    }
    const { cost } = yield prisma.itemLength.update({
        where: { id: selectedItem.id },
        data: { quantity: selectedItem.quantity - quantityNeeded },
    });
    productNameTypeTotalCost.push({
        totalCost: cost * quantityNeeded,
        name,
        type,
        length,
        cost,
        quantity,
    });
    return productNameTypeTotalCost;
});
export { updateSellerByUserId, findItemListByUserId, createItemList, deleteItem, DeleteAllItemList, decreaseItemQuantity, };
//# sourceMappingURL=items.repository.js.map