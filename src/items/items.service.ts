import Joi from "joi";
import {
  ICreateProduct,
  createItemList,
  findItemListByUserId,
} from "./items.repository.js";
import { BadRequestError, ServerError } from "../errors/index.js";

const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
const nameSchema = Joi.string().required();
const typeSchema = Joi.string().required();
const lengthSchema = Joi.number().positive().required();
const quantitySchema = Joi.number().positive().required();

interface IItemListContainer {
  name: string;
  type: string;
  length: number;
  quantity: number;
}

const getAllProduct = async (userId: string) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  if (userIdError) {
    throw new BadRequestError("incorrect userId format");
  }
  const itemList = await findItemListByUserId(userId);
  const itemListContainer: IItemListContainer[] = [];
  const name = itemList?.itemName.map(({ name, itemType }) =>
    itemType.map(({ type, itemLength }) =>
      itemLength.map(({ length, quantity }) =>
        itemListContainer.push({ name, type, length, quantity })
      )
    )
  );
  return itemListContainer;
};

const createProduct = async ({
  userId,
  name,
  type,
  length,
  quantity,
}: ICreateProduct) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  const { error: nameError } = nameSchema.validate(name);
  const { error: typeError } = typeSchema.validate(type);
  const { error: quantityError } = quantitySchema.validate(quantity);
  const { error: lengthError } = lengthSchema.validate(length);
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
  try {
    await createItemList({ userId, name, type, length, quantity });
  } catch (error) {
    throw new ServerError("Failed to create product due to server");
  }
};

export { getAllProduct, createProduct };
