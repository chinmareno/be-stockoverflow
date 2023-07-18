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
const createInvoice = async ({
  userId,
  date,
  seller,
  buyer,
  invoiceItem,
  totalPrice,
  paidStatus,
}: ICreateInvoice) => {
  const { id: invoiceId } = await prisma.invoice.create({
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
        invoiceId,
        userId,
        name,
        type,
        length,
        price,
        quantity,
      };
    }),
  });
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

const deleteInvoice = async ({ id, userId }: IDeleteInvoice) => {
  await prisma.invoice.delete({ where: { id_userId: { id, userId } } });
};

export {
  createInvoice,
  getInvoiceByDate,
  deleteInvoice,
  getAllInvoice,
  getUnpaidInvoicesByUserId,
  updatePaidStatus,
};
