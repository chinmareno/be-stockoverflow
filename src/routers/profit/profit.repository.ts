import prisma from "../../configs/db.js";

type ProfitItem = {
  name: string;
  type: string;
  totalProfit: number;
};
export interface IAddProfit {
  date: string;
  userId: string;
  profitItem: ProfitItem;
  totalCost: number;
}
export interface IEditProfit {
  date: string;
  userId: string;
  profitItem: ProfitItem;
}

export interface IGetProfileByMonth {
  date: string;
  userId: string;
}

interface IDecreaseProfit {
  date: string;
  userId: string;
  totalPrice: number;
  profitItem: ProfitItem;
}

const getProfitByMonth = async ({ date, userId }: IGetProfileByMonth) => {
  return await prisma.profit.findUnique({
    where: { userId_date: { date, userId } },
    include: { profitItem: true },
  });
};

const addProfit = async ({
  profitItem,
  userId,
  date,
  totalCost,
}: IAddProfit) => {
  const { id: profitId } = await prisma.profit.upsert({
    where: { userId_date: { date, userId } },
    create: { date, userId },
    update: {},
  });
  const { name, totalProfit, type } = profitItem;
  await prisma.profitItem.upsert({
    where: { profitId_name_type: { name, profitId, type } },
    create: { name, totalProfit: totalProfit - totalCost, type, profitId },
    update: { totalProfit: { increment: totalProfit - totalCost } },
  });
  return totalProfit - totalCost;
};

const decreaseProfit = async ({
  userId,
  date,
  totalPrice,
  profitItem,
}: IDecreaseProfit) => {
  const { id } = await prisma.profit.findUnique({
    where: { userId_date: { date, userId } },
  });
  const { profitId, name, type, totalProfit } = await prisma.profitItem.update({
    where: {
      profitId_name_type: {
        name: profitItem.name,
        type: profitItem.type,
        profitId: id,
      },
    },
    data: { totalProfit: { decrement: totalPrice } },
  });
  if (totalProfit == 0) {
    await prisma.profitItem.delete({
      where: { profitId_name_type: { name, profitId, type } },
    });
  }
};

const getAllProfit = async () => {
  return await prisma.profit.findMany({ include: { profitItem: true } });
};

const editProfit = async ({ profitItem, userId, date }: IEditProfit) => {
  const { id: profitId } = await prisma.profit.upsert({
    where: { userId_date: { date, userId } },
    create: { date, userId },
    update: {},
  });
  const { name, totalProfit, type } = profitItem;
  const { id, totalProfit: afterTotalProfit } = await prisma.profitItem.upsert({
    where: { profitId_name_type: { name, profitId, type } },
    create: { name, totalProfit: Number(totalProfit), type, profitId },
    update: { totalProfit: Number(totalProfit) },
  });
  if (afterTotalProfit == 0) {
    await prisma.profitItem.delete({
      where: { profitId_name_type: { name, profitId: id, type } },
    });
  }
};

export {
  addProfit,
  editProfit,
  getProfitByMonth,
  getAllProfit,
  decreaseProfit,
};
