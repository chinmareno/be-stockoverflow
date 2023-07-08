import prisma from "../configs/db.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export interface ICreateProduct {
  userId: string;
  name: string;
  type: string;
  length: number;
  quantity: number;
}
export interface IDeleteProduct {
  userId: string;
  name: string;
  type: string;
  length: number;
}

const findItemListByUserId = async (userId: string) => {
  const itemList = await prisma.itemList.findUnique({
    where: { userId },
    include: {
      itemName: {
        include: {
          itemType: {
            include: {
              itemLength: true,
            },
          },
          // Include other nested relationships within itemName
        },
      },
      // Include other nested relationships within itemList
    },
  });
  return itemList;
};

const createItemList = async ({
  userId,
  name,
  type,
  length,
  quantity,
}: ICreateProduct) => {
  const { id: itemListId } = await prisma.itemList.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  const { id: itemNameId } = await prisma.itemName.upsert({
    where: { name_itemListId: { itemListId, name } },
    create: { name, itemListId },
    update: {},
    select: { id: true },
  });
  const { id: itemTypeId } = await prisma.itemType.upsert({
    where: { type_itemNameId: { itemNameId, type } },
    create: { type, itemNameId },
    update: {},
    select: { id: true },
  });

  await prisma.itemLength.upsert({
    where: { length_itemTypeId: { itemTypeId, length } },
    create: { length, itemTypeId, quantity },
    update: {},
    select: { id: true },
  });
};

const deleteItem = async ({ userId, name, type, length }: IDeleteProduct) => {
  const itemList = await prisma.itemList.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!itemList) {
    throw new NotFoundError("userId not found on itemList");
  }

  const itemName = await prisma.itemName.findUnique({
    where: { name_itemListId: { itemListId: itemList.id, name } },
    select: { id: true },
  });
  if (!itemName) {
    throw new NotFoundError("itemListId not found on itemName");
  }

  const itemType = await prisma.itemType.findUnique({
    where: { type_itemNameId: { itemNameId: itemName.id, type } },
    select: { id: true },
  });
  if (!itemType) {
    throw new NotFoundError("itemNameId not found on itemTypeId");
  }
  const itemLength = prisma.itemLength.findUnique({
    where: { length_itemTypeId: { itemTypeId: itemType.id, length } },
    select: { id: true },
  });
  if (!itemLength) {
    throw new NotFoundError("itemTypeId not found on itemLength");
  }
};

export { findItemListByUserId, createItemList, deleteItem };
