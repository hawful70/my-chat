import multer from 'multer';
import {
    validationResult
} from 'express-validator/check';
import {
    app
} from './../config/app';
import {
    transError,
    transSuccess
} from './../../lang/en';
import {
    v4 as uuidv4
} from 'uuid';
import fsExtra from 'fs-extra';

import {
    user
} from './../services/index';

const storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback) => {
        let math = app.avatar_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transError.avatar_type, null);
        }

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    }
})

const avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {
        fileSize: app.avatar_limit_size
    }
}).single("avatar");

const updateAvatar = (req, res) => {
    avatarUploadFile(req, res, async (err) => {
        if (err) {
            if (err.message) {
                return res.status(500).send(transError.avatar_size);
            }
            return res.status(500).send(err);
        }
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
            }
            const userUpdated = await user.updateUser(req.user._id, updateUserItem);
            // await fsExtra.remove(`${app.avatar_directory}/${userUpdated.avatar}`);

            let result = {
                message: transSuccess.user_info_updated,
                imageSrc: `/images/users/${req.file.filename}`,
            }
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error);
        }
    })
};

const updateInfo = async (req, res) => {
    let errorArr = []
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        })

        return res.status(500).send(errorArr)
    }

    try {
        const updateUserItem = req.body;
        await user.updateUser(req.user._id, updateUserItem);

        const result = {
            message: transSuccess.user_info_updated
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const updatePassword = async (req, res) => {
    let errorArr = []
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        })

        return res.status(500).send(errorArr)
    }

    try {
        const updateUserItem = req.body;
        await user.updatePassword(req.user._id, updateUserItem);

        let result = {
            message: transSuccess.user_password_updated
        }

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    updateAvatar,
    updateInfo,
    updatePassword
};