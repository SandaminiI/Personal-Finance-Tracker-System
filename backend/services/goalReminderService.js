import cron from "node-cron";
import goalModel from "../models/goalModel.js";
import { sendNotification } from "./notificationService.js";

/**
 * Scheduled job to send goal reminders.
 * Runs every Monday at 8 AM.
 */
cron.schedule("0 8 * * 1", async () => {
  console.log("Running goal reminder service...");
  const upcomingGoals = await goalModel.find({ deadline: { $gte: new Date() } });

  for (let goal of upcomingGoals) {
    sendNotification(goal.userId, "goal_reminder", `Reminder: Your goal "${goal.title}" is due soon!`);
  }
});
