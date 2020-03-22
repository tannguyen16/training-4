const express = require('express');
const db = require('../models');

const router = express.Router();

const personalPens = require('./PersonalPens.json');
const projectPens = require('./ProjectPens.json');
const collectionPens = require('./CollectionPens.json');

const ERROR = {
  NO_USER: 'Cannot find username or email',
  WRONG_PASSWORD: 'Wrong Password',
  CONFIRM_PASSWORD: 'Password and Confirm password are not the same',
};
function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

/* GET home page. */
router.get('/', requireLogin, (req, res, next) => {
  res.render('dashboard', {
    title: 'Dashboard', personalPens, projectPens, collectionPens,
  });
});

router.get('/login', (req, res, next) => {
  let error = '';
  if (req.query.error) {
    error = ERROR[req.query.error];
  }

  res.render('login', { title: 'CodePen Login', error });
});

router.get('/signup', (req, res, next) => {
  let error = '';
  if (req.query.error) {
    error = ERROR[req.query.error];
  }
  res.render('signup', { title: 'CodePen Signup', error });
});

router.get('/dashboard', requireLogin, (req, res, next) => {
  res.render('dashboard', {
    title: 'Dashboard', personalPens, projectPens, collectionPens,
  });
});

router.get('/pen', requireLogin, (req, res, next) => {
  res.render('pen', { title: 'Pen' });
});

router.get('/logout', (req, res, next) => {
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
