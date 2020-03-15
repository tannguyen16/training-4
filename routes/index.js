const express = require('express');
const router = express.Router();

const personalPens = require('./PersonalPens.json');
const projectPens = require('./ProjectPens.json');
const collectionPens = require('./CollectionPens.json');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {title: 'CodePen'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'CodePen Login'});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'CodePen Signup'});
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {title: 'Dashboard', personalPens, projectPens, collectionPens});
});

router.get('/pen', function(req, res, next) {
  res.render('pen', {title: 'Pen'});
});

module.exports = router;
