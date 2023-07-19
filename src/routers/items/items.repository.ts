import prisma from "../../configs/db.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

export interface ICreateProduct {
  userId: string;
  name: string;
  type: string;
  length: number;
  quantity: number;
  cost: number;
  editStock: boolean;
}
export interface IDecreaseItemQuantity {
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
  cost: number;
}

const DeleteAllItemList = async (userId: string) => {
  const itemList = await prisma.itemList.deleteMany({
    where: { userId },
  });
  return itemList;
};

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
        },
      },
    },
  });
  return itemList;
};

const updateSellerByUserId = async ({
  userId,
  seller,
}: {
  userId: string;
  seller: string;
}) => {
  await prisma.user.update({
    where: { id: userId },
    data: { seller: seller },
  });
};
const createItemList = async ({
  userId,
  name,
  type,
  length,
  quantity,
  cost,
  editStock,
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

  const sameDayItem = await prisma.itemLength.findUnique({
    where: { length_itemTypeId_cost: { itemTypeId, length, cost } },
  });

  let quantityAddOrCreate = quantity;
  if (sameDayItem) {
    if (!editStock) {
      quantityAddOrCreate += sameDayItem.quantity;
    }
  }
  await prisma.itemLength.upsert({
    where: { length_itemTypeId_cost: { itemTypeId, length, cost } },
    create: {
      length,
      itemTypeId,
      quantity: quantityAddOrCreate,
      cost,
    },
    update: { quantity: quantityAddOrCreate },
  });
};

const deleteItem = async ({
  userId,
  name,
  type,
  length,
  cost,
}: IDeleteProduct) => {
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
  const itemLength = await prisma.itemLength.findUnique({
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
  await prisma.itemLength.delete({
    where: {
      length_itemTypeId_cost: {
        itemTypeId: itemType.id,
        length,
        cost,
      },
    },
  });
};

const decreaseItemQuantity = async ({
  userId,
  name,
  type,
  length,
  quantity,
}: IDecreaseItemQuantity) => {
  const { id: itemListId } = await prisma.itemList.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  const { id: itemNameId, name: selectedName } = await prisma.itemName.upsert({
    where: { name_itemListId: { itemListId, name } },
    create: { name, itemListId },
    update: {},
    select: { id: true, name: true },
  });
  const { id: itemTypeId, type: selectedType } = await prisma.itemType.upsert({
    where: { type_itemNameId: { itemNameId, type } },
    create: { type, itemNameId },
    update: {},
    select: { id: true, type: true },
  });

  let selectedItem = await prisma.itemLength.findFirst({
    where: { itemTypeId, length },
  });
  let quantityNeeded = quantity;
  const productNameTypeTotalCost = [];
  while (selectedItem.quantity < quantityNeeded) {
    const { cost, quantity } = await prisma.itemLength.delete({
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
    selectedItem = await prisma.itemLength.findFirst({
      where: { itemTypeId, length },
    });
  }
  if (selectedItem.quantity == quantityNeeded) {
    const { cost, quantity } = await prisma.itemLength.delete({
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
  const { cost } = await prisma.itemLength.update({
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
};

export {
  updateSellerByUserId,
  findItemListByUserId,
  createItemList,
  deleteItem,
  DeleteAllItemList,
  decreaseItemQuantity,
};
