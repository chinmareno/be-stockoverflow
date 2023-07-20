var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BadRequestError } from "../../errors/index.js";
import { editProfit, getProfitByMonth, } from "./profit.repository.js";
import Joi from "joi";
const stringSchema = Joi.string().required();
const numberSchema = Joi.number().positive().required();
const changeProfit = ({ date, userId, profitItem }) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, totalProfit, type } = profitItem;
    const { error: errorDate } = stringSchema.validate(date);
    const { error: errorUserId } = stringSchema.validate(userId);
    const { error: errorName } = stringSchema.validate(name);
    const { error: errorType } = stringSchema.validate(type);
    const { error: errorTotalProfit } = numberSchema.validate(totalProfit);
    if (errorDate) {
        throw new BadRequestError("Incorrect date format: " + date);
    }
    if (errorUserId) {
        throw new BadRequestError("Incorrect user id format: " + userId);
    }
    if (errorName) {
        throw new BadRequestError("Incorrect name format: " + name);
    }
    if (errorType) {
        throw new BadRequestError("Incorrect type format: " + type);
    }
    if (errorTotalProfit) {
        throw new BadRequestError("Incorrect total profit format: " + totalProfit);
    }
    yield editProfit({ date, profitItem, userId });
});
const getProfit = ({ date, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: errorDate } = stringSchema.validate(date);
    const { error: errorUserId } = stringSchema.validate(userId);
    if (errorDate) {
        throw new BadRequestError("Incorrect date format: " + date);
    }
    if (errorUserId) {
        throw new BadRequestError("Incorrect user id format: " + userId);
    }
    return yield getProfitByMonth({ date, userId });
});
export { changeProfit, getProfit };
//# sourceMappingURL=profit.service.js.map