import Joi from "joi";
import {
  createInvoice,
  IDeleteInvoice,
  deleteInvoice,
  getInvoiceByDate,
  getUnpaidInvoicesByUserId,
  updatePaidStatus,
} from "./invoice.repository.js";
import { costSchema, userIdSchema } from "../items/items.service.js";
import { BadRequestError } from "../../errors/index.js";
import { IGetInvoiceByDate } from "./invoice.repository.js";
import {
  decreaseItemQuantity,
  updateSellerByUserId,
} from "../items/items.repository.js";
import { addProfit } from "../profit/profit.repository.js";

const idSchema = Joi.string().required();
const buyerSchema = Joi.string().required();
const sellerSchema = Joi.string().required();
const singleInvoiceItemSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  length: Joi.number().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
});
const invoiceItemSchema = Joi.array().items(singleInvoiceItemSchema);
const stringSchema = Joi.string().required();
const paidStatusSchema = Joi.string().valid("PAID", "UNPAID").required();
const dateSchema = Joi.string().required();

type InvoiceItem = {
  name: string;
  type: string;
  length: number;
  price: number;
  quantity: number;
};
interface IMakeInvoice {
  userId: string;
  date: string;
  seller: string;
  buyer: string;
  invoiceItem: InvoiceItem[];
  totalPrice: number;
  paidStatus: "PAID" | "UNPAID";
}

const makeInvoice = async ({
  userId,
  date,
  buyer,
  seller,
  totalPrice,
  invoiceItem,
  paidStatus,
}: IMakeInvoice) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  const { error: dateError } = dateSchema.validate(date);
  const { error: buyerError } = buyerSchema.validate(buyer);
  const { error: sellerError } = sellerSchema.validate(seller);
  const { error: totalPriceError } = costSchema.validate(totalPrice);
  const invoicesItemForRepo = invoiceItem.map(
    ({ length, name, price, quantity, type }) => ({
      length: Number(length),
      name,
      price: Number(price),
      type,
      quantity: Number(quantity),
    })
  );
  const { error: invoiceItemError } =
    invoiceItemSchema.validate(invoicesItemForRepo);
  if (userIdError) {
    throw new BadRequestError("incorrect userid format :" + userId);
  }
  if (dateError) {
    throw new BadRequestError("incorrect date format :" + date);
  }
  if (buyerError) {
    throw new BadRequestError("incorrect buyer format :" + buyer);
  }
  if (sellerError) {
    throw new BadRequestError("incorrect seller format :" + seller);
  }
  if (totalPriceError) {
    throw new BadRequestError("incorrect total price format :" + totalPrice);
  }
  if (invoiceItemError) {
    throw new BadRequestError("incorrect invoice item format :" + invoiceItem);
  }

  await updateSellerByUserId({ userId, seller });
  await createInvoice({
    userId,
    buyer,
    seller,
    date,
    totalPrice,
    invoiceItem: invoicesItemForRepo,
    paidStatus,
  });
  await Promise.all(
    invoiceItem.map(async ({ name, price, quantity, type, length }) => {
      const profitItem = { name, type, totalProfit: price * quantity };
      await addProfit({ date: date.slice(3), userId, profitItem });
      await decreaseItemQuantity({
        length: Number(length),
        name,
        quantity,
        type,
        userId,
      });
    })
  );
};

const removeInvoice = async ({ id, userId }: IDeleteInvoice) => {
  const { error: idError } = idSchema.validate(id);
  const { error: userIdError } = userIdSchema.validate(userId);
  if (idError) {
    throw new BadRequestError("incorrect id format :" + id);
  }
  if (userIdError) {
    throw new BadRequestError("incorrect user id format :" + userId);
  }
  return await deleteInvoice({ id, userId });
};

const getUnpaidInvoices = async (userId: string) => {
  const { error: invoiceIdError } = userIdSchema.validate(userId);
  if (invoiceIdError) {
    throw new BadRequestError("Incorrect user id format :" + userId);
  }
  const unpaidInvoices = await getUnpaidInvoicesByUserId(userId);
  return unpaidInvoices;
};

const getInvoices = async ({ date, userId }: IGetInvoiceByDate) => {
  const { error: dateError } = stringSchema.validate(date);
  const { error: userIdError } = userIdSchema.validate(userId);
  if (userIdError) {
    throw new BadRequestError("incorrect user id format :" + userIdError);
  }
  if (dateError) {
    throw new BadRequestError("incorrect date format :" + dateError);
  }
  const invoices = await getInvoiceByDate({ date, userId });
  return invoices;
};

const changePaidStatus = async ({
  userId,
  invoiceId,
  paidStatus,
}: {
  userId: string;
  invoiceId: string;
  paidStatus: "PAID" | "UNPAID";
}) => {
  const { error: userIdError } = userIdSchema.validate(userId);
  const { error: invoiceIdError } = idSchema.validate(invoiceId);
  const { error: paidStatusError } = paidStatusSchema.validate(paidStatus);
  if (userIdError) {
    throw new BadRequestError("incorrect user id format :" + userIdError);
  }
  if (invoiceIdError) {
    throw new BadRequestError("incorrect invoice id format :" + invoiceId);
  }
  if (paidStatusError) {
    throw new BadRequestError("incorrect paid status format :" + paidStatus);
  }
  await updatePaidStatus({ invoiceId, paidStatus, userId });
};

export {
  makeInvoice,
  removeInvoice,
  getInvoices,
  getUnpaidInvoices,
  changePaidStatus,
};
