import prisma from "../../configs/db.js";
import { NotFoundError } from "../../errors/index.js";

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
}: ICreateInvoice) => {
  const { id: invoiceId } = await prisma.invoice.create({
    data: {
      userId,
      date,
      seller,
      buyer,
      totalPrice,
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

const getInvoiceByDate = async ({ userId, date }: IGetInvoiceByDate) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId, date },
  });

  if (invoices.length === 0) {
    throw new NotFoundError("Invoices with that userId and date not found");
  }
  return invoices;
};

const deleteInvoice = async ({ id, userId }: IDeleteInvoice) => {
  await prisma.invoice.delete({ where: { id_userId: { id, userId } } });
};
export { createInvoice, getInvoiceByDate, deleteInvoice, getAllInvoice };
