const express = require('express');
const bcrypt = require('bcrypt');
const yup = require('yup');
const shortid = require('shortid');
const db = require('../models');
const penRepositories = require('../repositories/penRepositories');
const requireLogin = require('../helpers/requireLogin');

const router = express.Router();

router.post('/', requireLogin, async (req, res, next) => {
  try {
    const penUri = shortid.generate();
    const userId = req.user.UserId;
    if (!req.body.penId) {
      await penRepositories.insertPen(userId, penUri, req.body);
      res.redirect(`/pen/${penUri}`);
    } else {
      console.log(req.body);
      await penRepositories.updatePen(req.body);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:penUri', requireLogin, async (req, res, next) => {
  try {
    const pen = await penRepositories.getPenByURI(req.params.penUri);
    const penId = pen.PenId;
    const penName = pen.PenName;
    const htmlCode = pen.HtmlCode;
    const cssCode = pen.CssCode;
    const jsCode = pen.JsCode;
    const htmlExternal = pen.HtmlExternal[0];
    const cssExternal = pen.CssExternal[0];
    const jsExternal = pen.JsExternal[0];

    res.render('pen', {
      title: 'Pen', penId, htmlCode, cssCode, jsCode, htmlExternal, cssExternal, jsExternal, penName,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
