import Notification from "../models/notificationModel.js";

export const sendNotification = async (userId, type, message) => {
  try {
    console.log(`🔔 Sending Notification: ${message} to User ID: ${userId}`); // Step 1 Log

    const notification = new Notification({ userId, type, message });
    await notification.save();

    console.log("✅ Notification saved successfully"); // Step 2 Log
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};
