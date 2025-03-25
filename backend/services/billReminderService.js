import cron from "node-cron";
import transactionModel from "../models/transactionModel.js";
import { sendNotification } from "./notificationService.js";

/**
 * Scheduled job to send bill payment reminders.
 * Runs every day at 9 AM.
 */
cron.schedule("0 9 * * *", async () => {
  console.log("Running bill reminder service...");
  const today = new Date().toISOString().split("T")[0];

  const bills = await transactionModel.find({ category: "Bills", date: { $gte: today } });

  for (let bill of bills) {
    sendNotification(bill.userId, "bill_reminder", `Reminder: Your bill for ${bill.category} is due today.`);
  }
});
