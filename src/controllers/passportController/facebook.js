import passport from 'passport';
import passportFacebook from 'passport-facebook';
import UserModel from './../../models/user';
import ChatModel from './../../models/chat-group';
import {
    transError,
    transSuccess
} from './../../../lang/en';

const facebookStrategy = passportFacebook.Strategy;


const initPassportFacebook = () => {
    passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"]
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findByFacebookUid(profile.id);
            if (user) {
                return done(null, user, req.flash("success", transSuccess.login_success(user.username)))
            }

            console.log(profile);
            let userItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {
                    isActive: true
                },
                facebook: {
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value
                }
            }

            let userCreated = await UserModel.createNew(userItem);
            return done(null, userCreated, req.flash("success", transSuccess.login_success(userCreated.username)))

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
            let user = await UserModel.findUserByIdForSession(id);
            let chatGroupIds = await ChatModel.getGroupIdsByUser(user._id);
            user = user.toObject();
            user.chatGroupIds = chatGroupIds;
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    })
}

module.exports = initPassportFacebook;