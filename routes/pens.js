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
    console.log(req.body);
    const penUri = shortid.generate();
    const userId = req.user.UserId;
    if (!req.body.penId) {
      await penRepositories.insertPen(userId, penUri, req.body);
      res.json(penUri);
    }
    await penRepositories.updatePen(req.body);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
});

router.get('/:penUri', requireLogin, async (req, res, next) => {
  try {
    const pen = await penRepositories.getPenByURI(req.params.penUri);
    const penId = pen.PenId;
    const penCode = await penRepositories.getPenCodeById(penId);
    const htmlClass = penCode[0].HtmlClass;
    const htmlHead = penCode[0].HtmlHead;
    const htmlCode = penCode[0].Body;
    const cssCode = penCode[1].Body;
    const jsCode = penCode[2].Body;
    const penName = pen.Name;
    console.log(htmlCode);
    const penExternalsCss = await penRepositories.getPenExternalsById(penId, penRepositories.PEN_EXTERNAL_TYPE.CSS);
    const penExternalsJs = await penRepositories.getPenExternalsById(penId, penRepositories.PEN_EXTERNAL_TYPE.JAVASCRIPT);
    const cssExternal = penExternalsCss;
    const jsExternal = penExternalsJs;

    res.render('pen', {
      title: 'Pen', penId, htmlCode, cssCode, jsCode, htmlClass, htmlHead, cssExternal, jsExternal, penName,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
