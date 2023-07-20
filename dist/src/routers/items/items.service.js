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
import { createItemList, deleteItem, findItemListByUserId, } from "./items.repository.js";
import { BadRequestError, ServerError } from "../../errors/index.js";
export const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
export const nameSchema = Joi.string().required();
export const typeSchema = Joi.string().required();
export const lengthSchema = Joi.number().positive().required();
export const quantitySchema = Joi.number().positive().required();
export const costSchema = Joi.number().positive().required();
const getAllProduct = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: userIdError } = userIdSchema.validate(userId);
    if (userIdError) {
        throw new BadRequestError("incorrect userId format");
    }
    const itemList = yield findItemListByUserId(userId);
    //flattening the itemList
    const itemListFlattened = [];
    itemList === null || itemList === void 0 ? void 0 : itemList.itemName.map(({ name, itemType }) => itemType.map(({ type, itemLength }) => itemLength.map(({ length, quantity, cost }) => {
        itemListFlattened.push({
            name,
            type,
            length,
            quantity,
            cost,
        });
    })));
    return itemListFlattened;
});
const createProduct = ({ userId, name, type, length, quantity, cost, editStock, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: userIdError } = userIdSchema.validate(userId);
    const { error: nameError } = nameSchema.validate(name);
    const { error: typeError } = typeSchema.validate(type);
    const { error: quantityError } = quantitySchema.validate(quantity);
    const { error: lengthError } = lengthSchema.validate(length);
    const { error: costError } = costSchema.validate(cost);
    if (userIdError) {
        throw new BadRequestError("incorrect userId format");
    }
    if (nameError) {
        throw new BadRequestError("incorrect name format");
    }
    if (typeError) {
        throw new BadRequestError("incorrect type format");
    }
    if (lengthError) {
        throw new BadRequestError("incorrect length format");
    }
    if (costError) {
        throw new BadRequestError("incorrect cost format");
    }
    if (quantityError) {
        throw new BadRequestError("incorrect quantity format");
    }
    yield createItemList({
        userId,
        name: name.toLowerCase(),
        type: type.toLowerCase(),
        length,
        quantity,
        cost,
        editStock,
    });
});
const updateProduct = ({ userId, name, type, length, quantity, cost, editStock, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: userIdError } = userIdSchema.validate(userId);
    const { error: nameError } = nameSchema.validate(name);
    const { error: typeError } = typeSchema.validate(type);
    const { error: quantityError } = quantitySchema.validate(quantity);
    const { error: lengthError } = lengthSchema.validate(length);
    const { error: costError } = costSchema.validate(cost);
    if (userIdError) {
        throw new BadRequestError("incorrect userId format");
    }
    if (nameError) {
        throw new BadRequestError("incorrect name format");
    }
    if (typeError) {
        throw new BadRequestError("incorrect type format");
    }
    if (lengthError) {
        throw new BadRequestError("incorrect length format");
    }
    if (quantityError) {
        throw new BadRequestError("incorrect quantity format");
    }
    if (costError) {
        throw new BadRequestError("incorrect cost format");
    }
    try {
        yield createItemList({
            userId,
            name: name.toLowerCase(),
            type: type.toLowerCase(),
            length,
            quantity,
            cost,
            editStock,
        });
    }
    catch (error) {
        throw new ServerError("Failed to update product quantity due to server");
    }
});
const deleteProduct = ({ userId, name, type, length, cost, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: userIdError } = userIdSchema.validate(userId);
    const { error: nameError } = nameSchema.validate(name);
    const { error: typeError } = typeSchema.validate(type);
    const { error: lengthError } = lengthSchema.validate(length);
    const { error: costError } = costSchema.validate(cost);
    if (userIdError) {
        throw new BadRequestError("incorrect userId format");
    }
    if (nameError) {
        throw new BadRequestError("incorrect name format" + name);
    }
    if (typeError) {
        throw new BadRequestError("incorrect type format");
    }
    if (lengthError) {
        throw new BadRequestError("incorrect length format");
    }
    if (costError) {
        throw new BadRequestError("incorrect cost format");
    }
    yield deleteItem({ userId, name, type, length, cost });
});
export { getAllProduct, createProduct, deleteProduct, updateProduct };
//# sourceMappingURL=items.service.js.map