import express from "express"
import { addExpense, deleteTransaction, getTransactions, updateTransaction } from "../controllers/expense.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', protectRoute, getTransactions);
router.post('/add', protectRoute, addExpense);
router.post('/update/:id', protectRoute, updateTransaction)
router.post('/delete/:id', protectRoute, deleteTransaction);


export default router;