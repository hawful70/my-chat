import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from './../../models/user';
import ChatModel from './../../models/chat-group';
import {
    transError,
    transSuccess
} from './../../../lang/en';

const localStrategy = passportLocal.Strategy;

const initPassportLocal = () => {
    passport.use(new localStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await userModel.findByEmail(email);
            if (!user) {
                return done(null, false, req.flash("errors", transError.login_fail));
            }
            if (!user.local.isActive) {
                return done(null, false, req.flash("errors", transError.account_not_active));
            }

            const checkPassword = await user.comparePassword(password);
            if (!checkPassword) {
                return done(null, false, req.flash("errors", transError.login_fail));
            };

            return done(null, user, req.flash("success", transSuccess.login_success(user.username)))
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash("errors", transError.server_error));
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findUserByIdForSession(id);
            let chatGroupIds = await ChatModel.getGroupIdsByUser(user._id);
            user = user.toObject();
            user.chatGroupIds = chatGroupIds;
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    })
}

module.exports = initPassportLocal;