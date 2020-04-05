const express = require('express');
const db = require('../models');

const router = express.Router();

const getUserByUsername = async (username) => {
  try {
    const selectUsernameQuery = 'SELECT * FROM "Users" WHERE "Username" = :username';
    const user = await db.sequelize.query(selectUsernameQuery, {
      replacements: { username },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return user;
  } catch (err) {
    throw Error(err);
  }
};

const getUserByEmail = async (email) => {
  try {
    const selectUsernameQuery = 'SELECT * FROM "Users" WHERE "Email" = :email';
    const user = await db.sequelize.query(selectUsernameQuery, {
      replacements: { email },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return user;
  } catch (err) {
    throw Error(err);
  }
};

const insertUser = async (passwordHash, data) => {
  try {
    const insertQuery = `INSERT INTO "Users"
                            ("Username", "Email", "Password", "CreatedDate")
                            VALUES
                            (:username, :email, :password, :date);`;

    await db.sequelize.query(insertQuery, {
      replacements: {
        ...data,
        password: passwordHash,
        date: new Date(),
      },
      type: db.sequelize.QueryTypes.INSERT,
    });
  } catch (err) {
    throw Error(err);
  }
};

const deleteUsers = async () => {
  try {
    const deleteUser = 'DELETE FROM "Users"';

    await db.sequelize.query(deleteUser, {
      type: db.sequelize.QueryTypes.DELETE,
    });
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  insertUser,
  deleteUsers,
};
