import Category from "../models/Category.js";
import Expense from "../models/Expense.js";

export const addExpense = async (req, res, next) => {
  try {
    const {
      amount,
      type,
      category,
      description,
      paymentMethod,
      isRecurring,
      date,
    } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });

    if (!["income", "expense"].includes(type))
      return res.status(400).json({ success: false, message: "Invalid type" });

    if (!category?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Category required" });

    let categoryDoc = await Category.findOne({
      user: userId,
      type,
      name: category,
    });
    if (!categoryDoc) {
      categoryDoc = await Category.create({
        user: userId,
        name: category,
        type,
      });
    }

    const newExpense = await Expense.create({
      user: userId,
      amount,
      type,
      category: categoryDoc._id,
      description: description || "",
      paymentMethod,
      date: date || Date.now(),
      isRecurring,
    });

    return res
      .status(201)
      .json({ data: newExpense, success: true, message: "New expense added" });
  } catch (error) {
    console.log("Error in addExpense controller ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type } = req.query; // expense or income

    const filter = { user: userId };

    if (type) {
      filter.type = type;
    }

    const transactions = await Expense.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const {
      amount,
      type,
      category,
      description,
      paymentMethod,
      isRecurring,
      date,
    } = req.body;

    const updateData = {};

    if (amount !== undefined) updateData.amount = amount;
    if (type) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
    if (date) updateData.date = date;

    if (category) {
      let categoryDoc = await Category.findOne({
        user: userId,
        name: category,
      });

      if (!categoryDoc) {
        categoryDoc = await Category.create({
          user: userId,
          name: category,
          type: type || "expense",
        });
      }

      updateData.category = categoryDoc._id;
    }

    const updated = await Expense.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true },
    ).populate("category");

    if (!updated)
      return res.status(404).json({
        success: false,
        message: "No transaction found",
      });

    return res.status(200).json({
      success: true,
      message: "Transaction updated",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating transactions: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await Expense.findOneAndDelete({ user: userId, _id: id });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "No transaction found" });

    return res
      .status(200)
      .json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    console.log("Error deleting transaction ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
