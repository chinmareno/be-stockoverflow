import Joi from "joi";
import {
  createInvoice,
  IDeleteInvoice,
  deleteInvoice,
  getInvoiceByDate,
} from "./invoice.repository.js";
import {
  costSchema,
  dateSchema,
  userIdSchema,
} from "../items/items.service.js";
import { BadRequestError } from "../../errors/index.js";
import { IGetInvoiceByDate } from "./invoice.repository.js";

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
}
const makeInvoice = async ({
  userId,
  date,
  buyer,
  seller,
  totalPrice,
  invoiceItem,
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
    throw new BadRequestError("incorrect userid format");
  }
  if (dateError) {
    throw new BadRequestError("incorrect date format");
  }
  if (buyerError) {
    throw new BadRequestError("incorrect buyer format");
  }
  if (sellerError) {
    throw new BadRequestError("incorrect seller format");
  }
  if (totalPriceError) {
    throw new BadRequestError("incorrect total price format");
  }
  if (invoiceItemError) {
    throw new BadRequestError("incorrect invoice item format");
  }
  await createInvoice({
    userId,
    buyer,
    seller,
    date,
    totalPrice,
    invoiceItem: invoicesItemForRepo,
  });
};

const removeInvoice = async ({ id, userId }: IDeleteInvoice) => {
  const { error: idError } = idSchema.validate(id);
  const { error: userIdError } = userIdSchema.validate(userId);
  if (idError) {
    throw new BadRequestError("incorrect id format");
  }
  if (userIdError) {
    throw new BadRequestError("incorrect user id format");
  }
  await deleteInvoice({ id, userId });
};

const getInvoices = async ({ date, userId }: IGetInvoiceByDate) => {
  const { error: dateError } = dateSchema.validate(date);
  const { error: userIdError } = userIdSchema.validate(userId);
  if (userIdError) {
    throw new BadRequestError("incorrect user id format");
  }
  if (dateError) {
    throw new BadRequestError("incorrect date format");
  }
  const invoices = await getInvoiceByDate({ date, userId });
  return invoices;
};

export { makeInvoice, removeInvoice, getInvoices };
