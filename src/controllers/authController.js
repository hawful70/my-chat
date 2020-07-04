import {
  validationResult
} from 'express-validator/check';
import {
  auth
} from '../services/index';
import {
  transSuccess
} from './../../lang/en';

const loginRegister = (req, res) => {
  return res.render('auth/master', {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

const register = async (req, res) => {
  let errorArr = []
  let successArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    })

    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }

  try {
    let result = await auth.register({
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      protocol: req.protocol,
      host: req.get("host")
    });
    successArr.push(result);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
}

const verifyAccount = async (req, res) => {
  let errorArr = []
  let successArr = [];
  try {
    let verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifySuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
}

const logOut = (req, res) => {
  req.logout();
  req.flash("success", transSuccess.logout_success);
  return res.redirect('/login-register');
}

const checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login-register');
  }
  next();
}

const checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  loginRegister,
  register,
  verifyAccount,
  logOut,
  checkLoggedIn,
  checkLoggedOut
};