import Joi from "joi";
import {
  ICreateProduct,
  IDeleteProduct,
  createItemList,
  deleteItem,
  findItemListByUserId,
} from "./items.repository.js";
import { BadRequestError, ServerError } from "../errors/index.js";
import toLocaleDate from "../helper/toLocaleDate.js";

const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
const nameSchema = Joi.string().required();
const typeSchema = Joi.string().required();
const lengthSchema = Joi.number().positive().required();
const quantitySchema = Joi.number().positive().required();
const costSchema = Joi.number().positive().required();
const dateSchema = Joi.date().required();

interface IItemListContainer {
  name: string;
  type: string;
  length: number;
  quantity: number;
  cost: number;
  date: string | Date;
}

const getAllProduct = async (userId: string) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  if (userIdError) {
    throw new BadRequestError("incorrect userId format");
  }
  const itemList = await findItemListByUserId(userId);
  //flattening the itemList
  const itemListFlattened: IItemListContainer[] = [];
  itemList?.itemName.map(({ name, itemType }) =>
    itemType.map(({ type, itemLength }) =>
      itemLength.map(({ length, quantity, cost, date }) => {
        itemListFlattened.push({
          name,
          type,
          length,
          quantity,
          cost,
          date,
        });
      })
    )
  );
  return itemListFlattened;
};

const createProduct = async ({
  userId,
  name,
  type,
  length,
  quantity,
  cost,
  date,
}: ICreateProduct) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  const { error: nameError } = nameSchema.validate(name);
  const { error: typeError } = typeSchema.validate(type);
  const { error: quantityError } = quantitySchema.validate(quantity);
  const { error: lengthError } = lengthSchema.validate(length);
  const { error: costError } = costSchema.validate(cost);
  const { error: dateError } = dateSchema.validate(date);

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
  if (dateError) {
    throw new BadRequestError("incorrect date format");
  }
  const localeDate = toLocaleDate(date);

  await createItemList({
    userId,
    name: name.toLowerCase(),
    type: type.toLowerCase(),
    length,
    quantity,
    cost,
    date: localeDate,
  });
};

const updateProduct = async ({
  userId,
  name,
  type,
  length,
  quantity,
  cost,
  date,
}: ICreateProduct) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  const { error: nameError } = nameSchema.validate(name);
  const { error: typeError } = typeSchema.validate(type);
  const { error: quantityError } = quantitySchema.validate(quantity);
  const { error: lengthError } = lengthSchema.validate(length);
  const { error: dateError } = dateSchema.validate(date);
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
  if (dateError) {
    throw new BadRequestError("incorrect date format");
  }
  const localeDate = toLocaleDate(date);

  try {
    await createItemList({
      userId,
      name: name.toLowerCase(),
      type: type.toLowerCase(),
      length,
      quantity,
      cost,
      date: localeDate,
    });
  } catch (error) {
    throw new ServerError("Failed to update product quantity due to server");
  }
};

const deleteProduct = async ({
  userId,
  name,
  type,
  length,
  cost,
  date,
}: IDeleteProduct) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  const { error: nameError } = nameSchema.validate(name);
  const { error: typeError } = typeSchema.validate(type);
  const { error: lengthError } = lengthSchema.validate(length);
  const { error: costError } = costSchema.validate(cost);
  const { error: dateError } = dateSchema.validate(date);
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
  if (dateError) {
    throw new BadRequestError("incorrect date format");
  }
  if (costError) {
    throw new BadRequestError("incorrect cost format");
  }
  const localeDate = toLocaleDate(date);

  await deleteItem({ userId, name, type, length, cost, date: localeDate });
};

export { getAllProduct, createProduct, deleteProduct, updateProduct };
