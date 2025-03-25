import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const EXCHANGE_RATE_API_URL = "https://v6.exchangerate-api.com/v6/";

export const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      throw new Error("Exchange Rate API key is missing in .env file");
    }

    const response = await axios.get(
      `${EXCHANGE_RATE_API_URL}${apiKey}/latest/${fromCurrency}`
    );

    if (response.data.result !== "success") {
      throw new Error("Invalid API response");
    }

    return response.data.conversion_rates[toCurrency];
  } catch (error) {
    console.error("Error fetching exchange rate:", error.message);
    return null;
  }
};