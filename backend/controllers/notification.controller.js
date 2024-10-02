import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "userName profileImage fullName",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });
    res.status(200).json({
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found",
      });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "You are not authorized to delete this notification",
      });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
