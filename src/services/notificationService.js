import {
    notificationModel,
    notificationContents
} from './../models/notification';
import UserModel from './../models/user';

const LIMIT_NUMBER_TAKEN = 10;

const getNotification = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await notificationModel.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);
            let notificationMap = notifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserById(notification.senderId);
                return notificationContents.getContent(sender._id, sender.username, sender.avatar, notification.isRead, notification.type);
            });
            let notiContents = await Promise.all(notificationMap);

            resolve(notiContents);
        } catch (error) {
            reject(error);
        }
    })
}

const countNotiUnread = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notificationsUnread = await notificationModel.countNotiUnread(currentUserId);
            resolve(notificationsUnread);
        } catch (error) {
            reject(error);
        }
    })
}

const readMore = (currentUserId, skipNumberNoti) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotifications = await notificationModel.readMore(currentUserId, skipNumberNoti, LIMIT_NUMBER_TAKEN);
            let notificationMap = newNotifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserById(notification.senderId);
                return notificationContents.getContent(sender._id, sender.username, sender.avatar, notification.isRead, notification.type);
            });
            let notiContents = await Promise.all(notificationMap);

            resolve(notiContents);

        } catch (error) {
            reject(error);
        }
    })
}

const markAllNotification = (currentUserId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await notificationModel.markAllNotification(currentUserId, targetUsers);
            resolve(true);
        } catch (error) {
            console.log("error markAllNotification", error);
            reject(false);
        }
    })
}


module.exports = {
    getNotification,
    countNotiUnread,
    readMore,
    markAllNotification
}