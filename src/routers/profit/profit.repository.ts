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
  await prisma.profitItem.upsert({
    where: { profitId_name_type: { name, profitId, type } },
    create: { name, totalProfit: Number(totalProfit), type, profitId },
    update: { totalProfit: Number(totalProfit) },
  });
};

export { addProfit, editProfit, getProfitByMonth, getAllProfit };
