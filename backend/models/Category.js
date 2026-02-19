import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["expense", "income"],
    required: true,
  },

  color: String,   // for frontend charts
  icon: String     // optional
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
