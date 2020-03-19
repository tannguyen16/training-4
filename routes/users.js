const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');

router.post('/', async (req, res) => {
  const insertQuery = `INSERT INTO "Users"
                            ("Username", "Email", "Password", "CreatedDate")
                            VALUES
                            (:username, :email, :password, :date);`;

  const saltRounds = 10;
  const { password } = req.body;

  try {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const newUserResult = await db.sequelize.query(insertQuery, {
        replacements: {
          ...req.body,
          password: hash,
          date: new Date(),
        },
        type: db.sequelize.QueryTypes.INSERT,
      });
      res.status(201).json(newUserResult);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const selectUsernameQuery = 'SELECT * FROM "Users" WHERE "Username" = :username';
  const selectEmailQuery = 'SELECT * FROM "Users" WHERE "Email" = :username';

  const saltRounds = 10;
  try {
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
        // TODO: No user
      }
    }

    bcrypt.compare(password, user[0].Password, (err, result) => {
      console.log(result);
      if (result) res.redirect('/dashboard');
      else {
        // TODO: Wrong password
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
