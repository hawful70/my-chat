import userModel from '../models/user';
import bcrypt from 'bcrypt';
import {
    v4 as uuidv4
} from 'uuid';
import {
    transError,
    transSuccess,
    transMail
} from '../../lang/en';
import sendMail from './../config/mailer';

const saltRounds = 7;
const register = ({
    email,
    gender,
    password,
    protocol,
    host
}) => {
    return new Promise(async (resolve, reject) => {
        let userByEmail = await userModel.findByEmail(email)
        if (userByEmail) {
            reject(transError.email_in_use)
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const verifyToken = uuidv4();
        const userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: hash,
                verifyToken: verifyToken
            }
        }
        const userCreated = await userModel.createNew(userItem);
        let linkVerify = `${protocol}://${host}/verify/${userCreated.local.verifyToken}`
        const htmlContent = transMail.template(linkVerify)
        sendMail({
            to: email,
            subject: transMail.subject,
            htmlContent
        }).then(success => {
            resolve(transSuccess.userCreated(userCreated.local.email));
        }).catch(async (error) => {
            console.log(error)
            await userModel.removeById(userCreated._id)
            reject(transMail.send_failed)
        });

    })

}
const verifyAccount = (token) => {
    return new Promise(async (resolve, reject) => {
        let userByToken = await userModel.findByToken(token);
        if (!userByToken) {
            reject(transError.token_undefined)
        }
        await userModel.verify(token);
        resolve(transSuccess.account_active_success);
    })
}
module.exports = {
    register,
    verifyAccount
};