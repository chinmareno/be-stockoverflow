import prisma from "../../configs/db.js";

type InvoiceItem = {
  name: string;
  type: string;
  length: number;
  price: number;
  quantity: number;
};
export interface ICreateInvoice {
  userId: string;
  date: string;
  seller: string;
  buyer: string;
  invoiceItem: InvoiceItem[];
  totalPrice: number;
  paidStatus: "PAID" | "UNPAID";
}
export interface IGetInvoiceByDate {
  userId: string;
  date: string;
}
export interface IDeleteInvoice {
  id: string;
  userId: string;
}

interface ICreateInvoiceHistory {
  userId: string;
  invoiceId: string;
  name: string;
  type: string;
  length: number;
  price: number;
  quantity: number;
  date: string;
  totalProfit: number;
}

interface IGetInvoiceHistory {
  userId: string;
  invoiceId: string;
}

const createInvoice = async ({
  userId,
  date,
  seller,
  buyer,
  invoiceItem,
  totalPrice,
  paidStatus,
}: ICreateInvoice) => {
  const invoice = await prisma.invoice.create({
    data: {
      userId,
      date,
      seller,
      buyer,
      totalPrice,
      paidStatus,
    },
  });
  await prisma.invoiceItem.createMany({
    data: invoiceItem.map(({ name, type, length, price, quantity }) => {
      return {
        invoiceId: invoice.id,
        userId,
        name,
        type,
        length,
        price,
        quantity,
      };
    }),
  });
  return invoice;
};

const getAllInvoice = async (userId: string) => {
  return await prisma.invoice.findMany({
    where: { userId },
    include: { invoiceItem: true },
  });
};

const updatePaidStatus = async ({
  userId,
  invoiceId,
  paidStatus,
}: {
  userId: string;
  invoiceId: string;
  paidStatus: "PAID" | "UNPAID";
}) => {
  await prisma.invoice.update({
    where: { id_userId: { id: invoiceId, userId } },
    data: { paidStatus },
  });
};

const getUnpaidInvoicesByUserId = async (userId: string) => {
  return await prisma.invoice.findMany({
    where: { userId, paidStatus: "UNPAID" },
    include: { invoiceItem: true },
  });
};

const getInvoiceByDate = async ({ userId, date }: IGetInvoiceByDate) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId, date },
    include: { invoiceItem: true },
  });
  return invoices;
};

const createInvoiceHistory = async ({
  invoiceId,
  length,
  name,
  price,
  quantity,
  type,
  userId,
  date,
  totalProfit,
}: ICreateInvoiceHistory) => {
  await prisma.invoiceHistory.create({
    data: {
      invoiceId,
      length,
      name,
      price,
      quantity,
      type,
      userId,
      date,
      totalProfit,
    },
  });
};

const getInvoiceHistory = async ({ invoiceId, userId }: IGetInvoiceHistory) => {
  const invoiceHistory = await prisma.invoiceHistory.findMany({
    where: { invoiceId, userId },
  });
  await prisma.invoiceHistory.deleteMany({ where: { userId, invoiceId } });
  return invoiceHistory;
};

const deleteInvoice = async ({ id, userId }: IDeleteInvoice) => {
  await prisma.invoice.delete({ where: { id_userId: { id, userId } } });
};

export {
  createInvoiceHistory,
  createInvoice,
  getInvoiceByDate,
  deleteInvoice,
  getAllInvoice,
  getUnpaidInvoicesByUserId,
  updatePaidStatus,
  getInvoiceHistory,
};
