import Joi from "joi";
import {
  ICreateProduct,
  IDeleteProduct,
  createItemList,
  deleteItem,
  findItemListByUserId,
} from "./items.repository.js";
import { BadRequestError, ServerError } from "../../errors/index.js";

export const userIdSchema = Joi.string().guid({ version: "uuidv4" }).required();
export const nameSchema = Joi.string().required();
export const typeSchema = Joi.string().required();
export const lengthSchema = Joi.number().positive().required();
export const quantitySchema = Joi.number().positive().required();
export const costSchema = Joi.number().positive().required();

interface IItemListContainer {
  name: string;
  type: string;
  length: number;
  quantity: number;
  cost: number;
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
      itemLength.map(({ length, quantity, cost }) => {
        itemListFlattened.push({
          name,
          type,
          length,
          quantity,
          cost,
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
  editStock,
}: ICreateProduct) => {
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

  await createItemList({
    userId,
    name: name.toLowerCase(),
    type: type.toLowerCase(),
    length,
    quantity,
    cost,
    editStock,
  });
};

const updateProduct = async ({
  userId,
  name,
  type,
  length,
  quantity,
  cost,
  editStock,
}: ICreateProduct) => {
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
    await createItemList({
      userId,
      name: name.toLowerCase(),
      type: type.toLowerCase(),
      length,
      quantity,
      cost,
      editStock,
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
}: IDeleteProduct) => {
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

  await deleteItem({ userId, name, type, length, cost });
};

export { getAllProduct, createProduct, deleteProduct, updateProduct };
