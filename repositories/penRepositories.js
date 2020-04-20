const express = require('express');
const db = require('../models');

const router = express.Router();

const PEN_CODE_TYPE = {
  HTML: 0,
  CSS: 1,
  JAVASCRIPT: 2,
};

const PEN_EXTERNAL_TYPE = {
  CSS: 1,
  JAVASCRIPT: 2,
};

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
    const selectPenQuery = 'SELECT * FROM "Pens" WHERE "Uri" = :uri';
    const pen = await db.sequelize.query(selectPenQuery, {
      replacements: { uri },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return pen[0];
  } catch (err) {
    throw Error(err);
  }
};

const getPenCodeById = async (penId) => {
  try {
    const selectPenCodeQuery = `
      SELECT * FROM "PenCode" WHERE "PenId" = :penId AND "CodeType" = :codeTypeHtml ORDER BY "CreatedDate" LIMIT 1;
      SELECT * FROM "PenCode" WHERE "PenId" = :penId AND "CodeType" = :codeTypeCss ORDER BY "CreatedDate" LIMIT 1;
      SELECT * FROM "PenCode" WHERE "PenId" = :penId AND "CodeType" = :codeTypeJs ORDER BY "CreatedDate" LIMIT 1;`;

    const penCodes = await db.sequelize.query(selectPenCodeQuery, {
      replacements: {
        penId, codeTypeHtml: PEN_CODE_TYPE.HTML, codeTypeCss: PEN_CODE_TYPE.CSS, codeTypeJs: PEN_CODE_TYPE.JAVASCRIPT,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return penCodes;
  } catch (err) {
    throw Error(err);
  }
};

const getPenExternalsById = async (penId, type) => {
  try {
    const selectPenCodeQuery = `
      SELECT * FROM "PenExternals" WHERE "PenId" = :penId AND "Type" = :type;`;

    const penExternals = await db.sequelize.query(selectPenCodeQuery, {
      replacements: {
        penId, type,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return penExternals;
  } catch (err) {
    throw Error(err);
  }
};

const insertCodeToDb = async (insertCodeQuery, penId, codeType, data, body, transaction) => {
  try {
    await db.sequelize.query(insertCodeQuery, {
      replacements: {
        penId,
        codeType,
        htmlClass: data.htmlClass,
        htmlHead: data.htmlHead,
        body,
        createdDate: new Date(),
      },
      transaction,
      type: db.sequelize.QueryTypes.INSERT,
    });
  } catch (err) {
    throw Error(err);
  }
};

const insertExternalToDb = async (insertExternalQuery, penId, type, url, transaction) => {
  try {
    await db.sequelize.query(insertExternalQuery, {
      replacements: {
        penId,
        type,
        url,
        createdDate: new Date(),
      },
      transaction,
      type: db.sequelize.QueryTypes.INSERT,
    });
  } catch (err) {
    throw Error(err);
  }
};

const insertPen = async (userId, uri, data) => {
  try {
    await db.sequelize.transaction(async (transaction) => {
      const insertPenQuery = `INSERT INTO "Pens"
                            ("UserId", "Name", "Uri", "CreatedDate")
                            VALUES
                            (:userId, :name, :uri, :createdDate) 
                            RETURNING "PenId";`;

      const pen = await db.sequelize.query(insertPenQuery, {
        replacements: {
          name: data.penName,
          userId,
          uri,
          createdDate: new Date(),
        },
        transaction,
        type: db.sequelize.QueryTypes.INSERT,
      });

      const newPenId = pen[0][0].PenId;

      const insertCodeQuery = `INSERT INTO "PenCode"
                            ("PenId", "CodeType", "HtmlClass", "HtmlHead", "Body", "CreatedDate")
                            VALUES
                            (:penId, :codeType, :htmlClass, :htmlHead, :body, :createdDate);`;

      const insertExternalQuery = `INSERT INTO "PenExternals"
                            ("PenId", "Type", "Url", "CreatedDate")
                            VALUES
                            (:penId, :type, :url, :createdDate);`;

      await insertCodeToDb(insertCodeQuery, newPenId, PEN_CODE_TYPE.HTML, data, data.htmlCode, transaction);
      await insertCodeToDb(insertCodeQuery, newPenId, PEN_CODE_TYPE.CSS, data, data.cssCode, transaction);
      await insertCodeToDb(insertCodeQuery, newPenId, PEN_CODE_TYPE.JAVASCRIPT, data, data.jsCode, transaction);

      if (data.cssExternal) {
        const promises = data.cssExternal.map(async (url) => {
          let urlPromise;
          if (url !== '') urlPromise = await insertExternalToDb(insertExternalQuery, newPenId, PEN_EXTERNAL_TYPE.CSS, url, transaction);
          return urlPromise;
        });
        await Promise.all(promises);
      }

      if (data.jsExternal) {
        const promises = data.jsExternal.map(async (url) => {
          let urlPromise;
          if (url !== '') urlPromise = await insertExternalToDb(insertExternalQuery, newPenId, PEN_EXTERNAL_TYPE.JAVASCRIPT, url, transaction);
          return urlPromise;
        });

        await Promise.all(promises);
      }
    });
  } catch (err) {
    throw Error(err);
  }
};

const updatePen = async (data) => {
  try {
    await db.sequelize.transaction(async (transaction) => {
      const updateQuery = `UPDATE "Pens"
                            SET "Name" = :penName, "UpdatedDate" = :updatedDate
                            WHERE "PenId" = :penId;
                        UPDATE "PenCode"
                            SET "Body" = :htmlCode, "HtmlClass" = :htmlClass, "HtmlHead" = :htmlHead, "CreatedDate" = :updatedDate
                            WHERE "PenId" = :penId AND "CodeType" = :codeTypeHtml;
                        UPDATE "PenCode"
                            SET "Body" = :cssCode, "HtmlClass" = :htmlClass, "HtmlHead" = :htmlHead, "CreatedDate" = :updatedDate
                            WHERE "PenId" = :penId AND "CodeType" = :codeTypeCss;
                        UPDATE "PenCode"
                            SET "Body" = :jsCode, "HtmlClass" = :htmlClass, "HtmlHead" = :htmlHead, "CreatedDate" = :updatedDate
                            WHERE "PenId" = :penId AND "CodeType" = :codeTypeJs;`;
      await db.sequelize.query(updateQuery, {
        replacements: {
          ...data,
          updatedDate: new Date(),
          codeTypeHtml: PEN_CODE_TYPE.HTML,
          codeTypeCss: PEN_CODE_TYPE.CSS,
          codeTypeJs: PEN_CODE_TYPE.JAVASCRIPT,
        },
        type: db.sequelize.QueryTypes.UPDATE,
      });

      const removeExternalsQuery = 'DELETE FROM "PenExternals" WHERE "PenId" = :penId';
      await db.sequelize.query(removeExternalsQuery, {
        replacements: {
          penId: data.penId,
        },
        type: db.sequelize.QueryTypes.DELETE,
      });

      const insertExternalQuery = `INSERT INTO "PenExternals"
                            ("PenId", "Type", "Url", "CreatedDate")
                            VALUES
                            (:penId, :type, :url, :createdDate);`;

      if (data.cssExternal) {
        const promises = data.cssExternal.map(async (url) => {
          let urlPromise;
          if (url !== '') urlPromise = await insertExternalToDb(insertExternalQuery, data.penId, PEN_EXTERNAL_TYPE.CSS, url, transaction);
          return urlPromise;
        });
        await Promise.all(promises);
      }

      if (data.jsExternal) {
        const promises = data.jsExternal.map(async (url) => {
          let urlPromise;
          if (url !== '') urlPromise = await insertExternalToDb(insertExternalQuery, data.penId, PEN_EXTERNAL_TYPE.JAVASCRIPT, url, transaction);
          return urlPromise;
        });

        await Promise.all(promises);
      }
    });

    const pen = await getPenById(data.penId);
    return pen;
  } catch (err) {
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
  PEN_CODE_TYPE,
  PEN_EXTERNAL_TYPE,
  getPenById,
  getPenByURI,
  getPenCodeById,
  getPenExternalsById,
  insertPen,
  updatePen,
  deletePen,
};
