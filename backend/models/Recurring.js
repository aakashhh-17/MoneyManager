import mongoose from "mongoose";

const recurringSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
  },
  nextRunDate: Date,
});
