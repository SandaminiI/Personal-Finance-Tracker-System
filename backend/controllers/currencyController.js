import userModel from "../models/userModel.js";

// Update preferred currency
export const updateCurrencyController = async (req, res) => {
  try {
    const { currency } = req.body;
    const validCurrencies = ["USD", "EUR", "GBP", "LKR", "INR"]; // Add more as needed

    if (!validCurrencies.includes(currency)) {
      return res.status(400).send({ success: false, message: "Invalid currency" });
    }

    await userModel.findByIdAndUpdate(req.user._id, { currency });

    res.status(200).send({ success: true, message: "Currency updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error updating currency", error });
  }
};
