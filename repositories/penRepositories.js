const express = require('express');
const db = require('../models');

const router = express.Router();

const getPenById = async (penId) => {
  try {
    const selectPenQuery = 'SELECT * FROM "Pens" WHERE "PenId" = :penId';
    const pen = await db.sequelize.query(selectPenQuery, {
      replacements: { penId },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return pen;
  } catch (err) {
    throw Error(err);
  }
};

const getPenByURI = async (uri) => {
  try {
    const selectPenQuery = 'SELECT * FROM "Pens" WHERE "URI" = :uri';
    const pen = await db.sequelize.query(selectPenQuery, {
      replacements: { uri },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return pen[0];
  } catch (err) {
    throw Error(err);
  }
};

const formatExternalArray = (array) => {
  console.log(array);
  let s = '{';
  array.forEach((element) => {
    s = `${s}"${element}",`;
  });
  s = s.slice(0, -1);
  s += '}';
  return s;
};

const insertPen = async (userId, uri, data) => {
  try {
    console.log(data);
    const insertQuery = `INSERT INTO "Pens"
                            ("UserId", "PenName", "HtmlCode", "HtmlExternal", "CssCode", "CssExternal", "JsCode", "JsExternal", "URI", "CreatedDate")
                            VALUES
                            (:userId, :penName, :htmlCode, :htmlExternal, :cssCode, :cssExternal, :jsCode, :jsExternal, :uri, :createdDate);`;
    await db.sequelize.query(insertQuery, {
      replacements: {
        ...data,
        userId,
        uri,
        htmlExternal: formatExternalArray(data['htmlExternal[]']),
        cssExternal: formatExternalArray(data['cssExternal[]']),
        jsExternal: formatExternalArray(data['jsExternal[]']),
        createdDate: new Date(),
      },
      type: db.sequelize.QueryTypes.INSERT,
    });
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
};

const updatePen = async (penId, data) => {
  try {
    const updateQuery = `UPDATE "Pens"
                            ("PenName", "HtmlCode", "HtmlExternal", "CssCode", "CssExternal", "JsCode", "JsExternal", "UpdatedDate")
                            VALUES
                            (:penName, :htmlCode, :htmlExternal, :cssCode, :cssExternal, :jsCode, :jsExternal, :updatedDate);`;
    await db.sequelize.query(updateQuery, {
      replacements: {
        ...data,
        htmlExternal: formatExternalArray(data['htmlExternal[]']),
        cssExternal: formatExternalArray(data['cssExternal[]']),
        jsExternal: formatExternalArray(data['jsExternal[]']),
        updatedDate: new Date(),
      },
      type: db.sequelize.QueryTypes.UPDATE,
    });
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
};

const deletePen = async (penId) => {
  try {
    const deleteQuery = `DELETE FROM "Pens"
                            WHERE PenId = :penId`;
    await db.sequelize.query(deleteQuery, {
      replacements: {
        penId,
      },
      type: db.sequelize.QueryTypes.DELETE,
    });
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  getPenById,
  getPenByURI,
  insertPen,
  updatePen,
  deletePen,
};
