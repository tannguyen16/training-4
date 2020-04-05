const express = require('express');
const db = require('../models');

const router = express.Router();

const requireLogin = require('../helpers/requireLogin');

/* GET home page. */
router.get('/', requireLogin, (req, res, next) => {
  res.render('dashboard', {
    title: 'Dashboard', personalPens, projectPens, collectionPens,
  });
});

router.get('/login', (req, res, next) => {
  const errors = {};
  res.render('login', { title: 'Log In', errors });
});

router.get('/signup', (req, res, next) => {
  const errors = {};
  res.render('signup', { title: 'Sign Up', errors });
});

router.get('/dashboard', requireLogin, (req, res, next) => {
  res.render('dashboard', {
    title: 'Dashboard', personalPens: [], projectPens: [], collectionPens: [],
  });
});

router.get('/pen', requireLogin, (req, res, next) => {
  res.render('pen', {
    title: 'Pen', penId: '', htmlCode: '', cssCode: '', jsCode: '', htmlClass: '', htmlHead: '', cssExternal: [], jsExternal: [], penName: 'Untitled',
  });
});

router.get('/logout', (req, res, next) => {
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
