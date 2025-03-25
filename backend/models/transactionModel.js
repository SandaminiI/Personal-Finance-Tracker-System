import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        type: { 
            type: String, 
            enum: ["income", "expense"], 
            required: true 
        },
        category: String,
        amount: Number,
        currency: { 
            type: String, 
            required: true, 
            default: "LKR" // Default currency is Sri Lankan Rupees
        },
        convertedAmount: { 
            type: Number // Amount converted to the user's preferred currency
        },
        exchangeRate: { 
            type: Number // Exchange rate used for conversion
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        tags: [String],
});

export default mongoose.model("transactions", transactionSchema);
