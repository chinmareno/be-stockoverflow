import prisma from "../configs/db.js";

export interface ICreateProduct {
  userId: string;
  name: string;
  type: string;
  length: number;
  quantity: number;
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
  });

  const { id: itemNameId } = await prisma.itemName.upsert({
    where: { name_itemListId: { itemListId, name } },
    create: { name, itemListId },
    update: {},
  });
  const { id: itemTypeId } = await prisma.itemType.upsert({
    where: { type_itemNameId: { itemNameId, type } },
    create: { type, itemNameId },
    update: {},
  });

  await prisma.itemLength.upsert({
    where: { length_itemTypeId: { itemTypeId, length } },
    create: { length, itemTypeId, quantity },
    update: {},
  });
};

export { findItemListByUserId, createItemList };
