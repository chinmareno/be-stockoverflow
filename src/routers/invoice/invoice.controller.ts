import express from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  changePaidStatus,
  getInvoices,
  getUnpaidInvoices,
  makeInvoice,
  removeInvoice,
} from "./invoice.service.js";
import { ICreateInvoice, getAllInvoice } from "./invoice.repository.js";
import { errorHandler } from "../../middleware/errorHandler.js";

const router = express.Router();

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const invoices = await getAllInvoice(userId);
    res.status(200).send(invoices);
  } catch (error) {
    next(error);
  }
});

router.get("/:date", async (req: AuthRequest, res, next) => {
  try {
    const date = req.params.date;
    const userId = req.userId as string;

    const invoices = await getInvoices({ date, userId });
    res.status(200).send(invoices);
  } catch (error) {
    next(error);
  }
});

router.get("/unpaid", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const unpaidInvoices = await getUnpaidInvoices(userId);
    res.status(200).send(unpaidInvoices);
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const {
      buyer,
      date,
      invoiceItem,
      seller,
      totalPrice,
      paidStatus,
    }: ICreateInvoice = req.body;

    await makeInvoice({
      buyer,
      date,
      invoiceItem,
      seller,
      totalPrice,
      userId,
      paidStatus,
    });
    res.status(201).send("Invoice created successfully");
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const { invoiceId, paidStatus } = req.body;
    await changePaidStatus({ invoiceId, paidStatus, userId });
    res.status(200).send("Paid status changed successfully");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const invoiceId = req.params.id;

    await removeInvoice({ id: invoiceId, userId });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

const invoiceController = router;
export default invoiceController;
