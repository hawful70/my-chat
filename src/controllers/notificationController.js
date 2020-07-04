import {
    notification
} from './../services/index';

const readMore = async (req, res) => {
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        let newNotification = await notification.readMore(req.user._id, skipNumberNoti);
        return res.status(200).send(newNotification);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const markAllNotification = async (req, res) => {
    try {
        let mark = await notification.markAllNotification(req.user._id, req.body.targetUsers);
        return res.status(200).send(mark);
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    readMore,
    markAllNotification
}