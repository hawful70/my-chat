import express from 'express';
import {
  homeController,
  authController,
  userController,
  contactController,
  notificationController,
  messageController,
  groupChatController
} from '../controllers/index';
import {
  authValid,
  userValid
} from '../validation/index';
import passport from 'passport';

const router = express.Router();

const initRoutes = (app) => {
  router.get('/login-register', authController.checkLoggedOut, authController.loginRegister);
  router.post('/register', authController.checkLoggedOut, authValid.register, authController.register);
  router.get('/verify/:token', authController.checkLoggedOut, authController.verifyAccount);
  router.post('/login', authController.checkLoggedOut, passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true
  }));
  router.get('/auth/facebook', passport.authenticate("facebook", {
    scope: ["email"]
  }))
  router.get('/auth/facebook/callback', passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: '/login-register',
  }))

  router.get('/', authController.checkLoggedIn, homeController.home);
  router.get("/logout", authController.checkLoggedIn, authController.logOut);

  router.put("/user/update-avatar", authController.checkLoggedIn, userController.updateAvatar);
  router.put("/user/update-info", authController.checkLoggedIn, userValid.updateInfo, userController.updateInfo);
  router.put("/user/update-password", authController.checkLoggedIn, userValid.updatePassword, userController.updatePassword);

  router.get("/contact/find-users/:keyword", authController.checkLoggedIn, contactController.findUsersContact);
  router.get("/contact/search-friends/:keyword", authController.checkLoggedIn, contactController.searchFriends);
  router.get("/contact/read-more-contacts", authController.checkLoggedIn, contactController.readMoreContacts);
  router.get("/contact/read-more-contacts-sent", authController.checkLoggedIn, contactController.readMoreContactsSent);
  router.get("/contact/read-more-contacts-receive", authController.checkLoggedIn, contactController.readMoreContactsReceive);
  router.post("/contact/add-new", authController.checkLoggedIn, contactController.addNew);
  router.delete("/contact/remove-request-contact-sent", authController.checkLoggedIn, contactController.removeRequestContactSent);
  router.delete("/contact/remove-request-contact-received", authController.checkLoggedIn, contactController.removeRequestContactReceived);
  router.delete("/contact/remove-contact", authController.checkLoggedIn, contactController.removeContact);
  router.put("/contact/approve-request-contact-received", authController.checkLoggedIn, contactController.approveRequestContactReceived);


  router.get("/notification/read-more", authController.checkLoggedIn, notificationController.readMore);
  router.put("/notification/mark-all-as-read", authController.checkLoggedIn, notificationController.markAllNotification);

  router.post("/message/add-new-text-emoji", authController.checkLoggedIn, messageController.addNewTextEmoji);
  router.post("/message/add-new-image", authController.checkLoggedIn, messageController.addNewImage);
  router.post("/message/add-new-attachment", authController.checkLoggedIn, messageController.addNewAttachment);

  router.post("/group-chat/add-new", authController.checkLoggedIn, groupChatController.addNewGroup);
  return app.use('/', router);
};

module.exports = initRoutes;