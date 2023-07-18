import express from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { changeProfit, getProfit } from "./profit.service.js";
import { getAllProfit } from "./profit.repository.js";

const router = express.Router();

router.patch("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const { date, profitItem } = req.body;
    await changeProfit({ date, profitItem, userId });
    res.status(200).send("Total profit changed successfully");
  } catch (error) {
    next(error);
  }
});

router.get("/:date", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const { date } = req.params;
    const thisMonthProfits = await getProfit({ date, userId });
    console.log(thisMonthProfits);
    res.status(200).send(thisMonthProfits);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const allProfit = await getAllProfit();
    res.send(allProfit);
    res;
  } catch (error) {}
});

const profitController = router;
export default profitController;
