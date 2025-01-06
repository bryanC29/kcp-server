import notifications from "../model/notifications.js"

export const allNotification = async (req, res) => {
    const { userID } = req.body;

    if(!userID) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const newNotifications = await notifications.find({ userID: userID })
    
        if(!newNotifications) {
            return res.status(404).json({ message: "Notifications not found" });
        } else {
            return res.status(200).json(newNotifications);
        }
    }

    catch (err) {
        return res.status(500).json({ message: 'Notifications cannot be fetched. Try again later' });
    }
}

export const updateNotification = async (req, res) => {
    const { userID, notificationID } = req.body;

    if(!userID || !notificationID) {
        return res.status(400).json({ message: "User ID and notification ID are required" });
    }

    try {    
        const newNotifications = await notifications.findById( notificationID )
    
        if(!newNotifications) {
            return res.status(404).json({ message: "Notifications not found" });
        } else {
            newNotifications.readStatus = true;
            await newNotifications.save();

            return res.status(200).json(newNotifications);
        }
    }
    
    catch (err) {
        return res.status(500).json({ message: 'Notifications cannot be fetched. Try again later' });
    }
}