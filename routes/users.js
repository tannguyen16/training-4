const express = require('express');
const bcrypt = require('bcrypt');
const yup = require('yup');
const db = require('../models');

const router = express.Router();

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
  const insertQuery = `INSERT INTO "Users"
                            ("Username", "Email", "Password", "CreatedDate")
                            VALUES
                            (:username, :email, :password, :date);`;
  const saltRounds = 10;
  let error = '';

  try {
    const { password, cfpassword } = req.body;
    if (password !== cfpassword) {
      error = 'CONFIRM_PASSWORD';
      res.redirect(`/signup?error=${error}`);
    }
    await userSignupSchema.validate(req.body, { abortEarly: false });
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await db.sequelize.query(insertQuery, {
        replacements: {
          ...req.body,
          password: hash,
          date: new Date(),
        },
        type: db.sequelize.QueryTypes.INSERT,
      });
      res.redirect('/login');
    });
  } catch (err) {
    if (err.errors) {
      for (let i = 0; i < err.inner.length; i += 1) {
        const validationError = err.inner[i];
        errors[validationError.path] = validationError.message;
      }
      res.render('signup', {
        title: 'Sign Up', errors, error: '',
      });
    } else {
      next(err);
    }
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const selectUsernameQuery = 'SELECT * FROM "Users" WHERE "Username" = :username';
  const selectEmailQuery = 'SELECT * FROM "Users" WHERE "Email" = :username';

  const saltRounds = 10;
  const errors = {};
  try {
    await userLoginSchema.validate(req.body, { abortEarly: false });
    let user = await db.sequelize.query(selectUsernameQuery, {
      replacements: { username },
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (user.length === 0) {
      user = await db.sequelize.query(selectEmailQuery, {
        replacements: { username },
        type: db.sequelize.QueryTypes.SELECT,
      });

      if (user.length === 0) {
        const error = 'NO_USER';
        res.redirect(`/login?error=${error}`);
      }
    }

    bcrypt.compare(password, user[0].Password, (err, result) => {
      if (result) {
        req.session.user = user[0];
        res.redirect('/dashboard');
      } else {
        const error = 'WRONG_PASSWORD';
        res.redirect(`/login?error=${error}`);
      }
    });
  } catch (err) {
    if (err.errors) {
      for (let i = 0; i < err.inner.length; i += 1) {
        const validationError = err.inner[i];
        errors[validationError.path] = validationError.message;
      }
      res.render('login', {
        title: 'Log In', errors, error: '',
      });
    } else {
      next(err);
    }
  }
});

module.exports = router;
