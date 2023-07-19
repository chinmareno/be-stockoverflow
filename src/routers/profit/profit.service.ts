import { BadRequestError } from "../../errors/index.js";
import {
  IAddProfit,
  IGetProfileByMonth,
  editProfit,
  getProfitByMonth,
} from "./profit.repository.js";
import Joi from "joi";

type ProfitItem = {
  name: string;
  type: string;
  totalProfit: number;
};
interface IChangeProfit {
  date: string;
  userId: string;
  profitItem: ProfitItem;
}

const stringSchema = Joi.string().required();
const numberSchema = Joi.number().positive().required();

const changeProfit = async ({ date, userId, profitItem }: IChangeProfit) => {
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
  await editProfit({ date, profitItem, userId });
};

const getProfit = async ({ date, userId }: IGetProfileByMonth) => {
  const { error: errorDate } = stringSchema.validate(date);
  const { error: errorUserId } = stringSchema.validate(userId);
  if (errorDate) {
    throw new BadRequestError("Incorrect date format: " + date);
  }
  if (errorUserId) {
    throw new BadRequestError("Incorrect user id format: " + userId);
  }
  return await getProfitByMonth({ date, userId });
};

export { changeProfit, getProfit };
