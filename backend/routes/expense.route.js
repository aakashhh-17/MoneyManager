import express from "express"
import { addExpense, getTransactions } from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', protectRoute, getTransactions);
router.post('/add', protectRoute, addExpense);


export default router;