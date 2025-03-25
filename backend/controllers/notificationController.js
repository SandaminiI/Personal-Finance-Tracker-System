import Notification from "../models/notificationModel.js";

/**
 * Get all notifications for a user.
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id, isRead: false }).sort({ createdAt: -1 }).select("-userId -_id");
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error });
  }
};

/**
 * Mark notifications as read.
 */
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notifications", error });
  }
};
