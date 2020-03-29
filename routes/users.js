const express = require('express');
const bcrypt = require('bcrypt');
const yup = require('yup');
const db = require('../models');
const userRepositories = require('../repositories/userRepositories');

const router = express.Router();

const ERROR = {
  NO_USER: 'Cannot find username or email',
  WRONG_PASSWORD: 'Wrong Password',
  CONFIRM_PASSWORD: 'Password and Confirm password are not the same',
};

const userSignupSchema = yup.object().shape({
  username: yup
    .string('Username must be a string')
    .min(3, 'Username must have more than 3 characters')
    .required('Username is a required field'),
  email: yup
    .string('Email must be a string')
    .email('Email is not in a correct format')
    .min(3, 'Email must be at least 3 characters')
    .required('Email is a required field'),
  password: yup
    .string()
    .min(8, 'Password must be at least 4 characters')
    .required('Password is a required field'),
  cfpassword: yup
    .string()
    .required('Confirm password is a required field'),
});

const userLoginSchema = yup.object().shape({
  username: yup
    .string('Username or email must be a string')
    .min(3, 'Username or email must have more than 3 characters')
    .required('Username or email is a required field'),
  password: yup
    .string()
    .min(8, 'Password must be at least 4 characters')
    .required('Password is a required field'),
});

router.post('/', async (req, res, next) => {
  const errors = {};
  const saltRounds = 10;
  try {
    const { password, cfpassword } = req.body;
    if (password !== cfpassword) {
      errors.message = ERROR.CONFIRM_PASSWORD;
      res.render('signup', {
        title: 'Sign Up', errors,
      });
    }
    await userSignupSchema.validate(req.body, { abortEarly: false });
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await userRepositories.insertUser(hash, req.body);
      res.redirect('/login');
    });
  } catch (err) {
    if (err.errors) {
      for (let i = 0; i < err.inner.length; i += 1) {
        const validationError = err.inner[i];
        errors[validationError.path] = validationError.message;
      }
      res.render('signup', {
        title: 'Sign Up', errors,
      });
    } else {
      next(err);
    }
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const errors = {};
  try {
    await userLoginSchema.validate(req.body, { abortEarly: false });
    let user = await userRepositories.getUserByUsername(username);
    if (user.length === 0) {
      user = await userRepositories.getUserByEmail(username);

      if (user.length === 0) {
        errors.message = ERROR.NO_USER;
        res.render('login', {
          title: 'Log In', errors,
        });
      }
    }

    bcrypt.compare(password, user[0].Password, (err, result) => {
      if (result) {
        req.session.user = user[0];
        res.redirect('/dashboard');
      } else {
        errors.message = ERROR.WRONG_PASSWORD;
        res.render('login', {
          title: 'Log In', errors,
        });
      }
    });
  } catch (err) {
    if (err.errors) {
      for (let i = 0; i < err.inner.length; i += 1) {
        const validationError = err.inner[i];
        errors[validationError.path] = validationError.message;
      }
      res.render('login', {
        title: 'Log In', errors,
      });
    } else {
      next(err);
    }
  }
});

module.exports = router;
