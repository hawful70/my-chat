import UserModel from './../models/user';
import {
    transError
} from './../../lang/en';

import bcrypt from 'bcrypt';

const updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
}

const updatePassword = (id, {
    currentPassword,
    newPassword
}) => {
    return new Promise(async (resolve, reject) => {
        let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
        if (!currentUser) {
            return reject(transError.acount_undefined);
        }

        let checkCurrentPassword = await currentUser.comparePassword(currentPassword);
        if (!checkCurrentPassword) {
            return reject(transError.user_current_password);
        }

        const saltRounds = 7;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPasword = bcrypt.hashSync(newPassword, salt);
        await UserModel.updateUser(id, {
            "local.password": hashPasword
        })
        resolve(true);
    })
}

module.exports = {
    updateUser,
    updatePassword
}