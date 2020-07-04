import multer from 'multer';
import fsExtra from 'fs-extra';
import {
    message
} from '../services/index';
import {
    app
} from './../config/app';
import {
    transError,
    transSuccess
} from './../../lang/en';

const addNewTextEmoji = async (req, res) => {
    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }

        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;

        let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

        return res.status(200).send({
            message: newMessage
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

const storageImageChat = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.image_message_directory);
    },
    filename: (req, file, callback) => {
        let math = app.image_message_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transError.avatar_type, null);
        }

        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
})

const imageMessageUploadFile = multer({
    storage: storageImageChat,
    limits: {
        fileSize: app.image_message_limit_size
    }
}).single("my-image-chat");

const addNewImage = (req, res) => {
    imageMessageUploadFile(req, res, async (err) => {
        if (err) {
            if (err.message) {
                return res.status(500).send(transError.avatar_size);
            }
            return res.status(500).send(err);
        }
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            }

            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;

            let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);

            await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);

            return res.status(200).send({
                message: newMessage
            })
        } catch (error) {
            return res.status(500).send(error);
        }
    })
}

const storageAttachmentChat = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.attachment_message_directory);
    },
    filename: (req, file, callback) => {
        let attachmentName = `${Date.now()}-${file.originalname}`;
        callback(null, attachmentName);
    }
})

const attachmentMessageUploadFile = multer({
    storage: storageAttachmentChat,
    limits: {
        fileSize: app.attachment_message_limit_size
    }
}).single("my-attach-chat");

const addNewAttachment = (req, res) => {
    attachmentMessageUploadFile(req, res, async (err) => {
        if (err) {
            if (err.message) {
                return res.status(500).send(transError.attachment_size);
            }
            return res.status(500).send(err);
        }
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            }

            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;

            let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);

            await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);

            return res.status(200).send({
                message: newMessage
            })
        } catch (error) {
            return res.status(500).send(error);
        }
    })
}

module.exports = {
    addNewTextEmoji,
    addNewImage,
    addNewAttachment
};