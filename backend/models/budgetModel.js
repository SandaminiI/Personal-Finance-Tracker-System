import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    }, // Category-specific budget
    amount: { 
        type: Number, 
        required: true 
    },
    month: { 
        type: Number, 
        required: true 
    }, // Stores the month (1 = January, 2 = February, etc.)
    year: { 
        type: Number, 
        required: true 
    }, // Stores the year
  },
  { timestamps: true }
);

export default mongoose.model("budgets", budgetSchema);
