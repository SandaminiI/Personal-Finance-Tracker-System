import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    }, // e.g., "Buy a Car"
    targetAmount: { 
        type: Number, 
        required: true 
    }, // Goal amount
    savedAmount: { 
        type: Number, 
        default: 0 
    }, // Current saved amount
    deadline: { 
        type: Date, 
        required: true 
    },
    autoSavePercentage: { 
        type: Number, 
        default: 0 
    }, // % of income to auto-save
  },
  { timestamps: true }
);

export default mongoose.model("goals", goalSchema);
