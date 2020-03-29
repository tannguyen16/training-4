const express = require('express');
const bcrypt = require('bcrypt');
const yup = require('yup');
const shortid = require('shortid');
const db = require('../models');
const penRepositories = require('../repositories/penRepositories');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const penUri = shortid.generate();
    const userId = req.session.user.UserId;
    if (!req.body.penId) {
      await penRepositories.insertPen(userId, penUri, req.body);
      res.redirect(`/pen/${penUri}`);
    } else {
      await penRepositories.updatePen(req.body.penId, req.body);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:penUri', async (req, res, next) => {
  try {
    res.render('pen', { title: 'Pen', penId: '' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
