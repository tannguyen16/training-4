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
};

const insertExternalToDb = async (insertExternalQuery, penId, type, url, transaction) => {
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

      await insertCodeToDb(insertCodeQuery, newPenId, PEN_CODE_TYPE.HTML, data, data.htmlCode, transaction);
      await insertCodeToDb(insertCodeQuery, newPenId, PEN_CODE_TYPE.CSS, data, data.cssCode, transaction);
      await insertCodeToDb(insertCodeQuery, newPenId, PEN_CODE_TYPE.JAVASCRIPT, data, data.jsCode, transaction);

      const insertExternalQuery = `INSERT INTO "PenExternals"
                            ("PenId", "Type", "Url", "CreatedDate")
                            VALUES
                            (:penId, :type, :url, :createdDate);`;

      if (data['cssExternal[]']) {
        if (Array.isArray(data['cssExternal[]'])) {
          data['cssExternal[]'].forEach(async (url) => {
            await insertExternalToDb(insertExternalQuery, newPenId, PEN_EXTERNAL_TYPE.CSS, url, transaction);
          });
        } else {
          await insertExternalToDb(insertExternalQuery, newPenId, PEN_EXTERNAL_TYPE.CSS, data['cssExternal[]'], transaction);
        }
      }

      if (data['jsExternal[]']) {
        if (Array.isArray(data['jsExternal[]'])) {
          data['jsExternal[]'].forEach(async (url) => {
            await insertExternalToDb(insertExternalQuery, newPenId, PEN_EXTERNAL_TYPE.JAVASCRIPT, url, transaction);
          });
        } else {
          await insertExternalToDb(insertExternalQuery, newPenId, PEN_EXTERNAL_TYPE.JAVASCRIPT, data['jsExternal[]'], transaction);
        }
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

      if (data['cssExternal[]']) {
        if (Array.isArray(data['cssExternal[]'])) {
          data['cssExternal[]'].forEach(async (url) => {
            await insertExternalToDb(insertExternalQuery, data.penId, PEN_EXTERNAL_TYPE.CSS, url, transaction);
          });
        } else {
          await insertExternalToDb(insertExternalQuery, data.penId, PEN_EXTERNAL_TYPE.CSS, data['cssExternal[]'], transaction);
        }
      }

      if (data['jsExternal[]']) {
        if (Array.isArray(data['jsExternal[]'])) {
          data['jsExternal[]'].forEach(async (url) => {
            await insertExternalToDb(insertExternalQuery, data.penId, PEN_EXTERNAL_TYPE.JAVASCRIPT, url, transaction);
          });
        } else {
          await insertExternalToDb(insertExternalQuery, data.penId, PEN_EXTERNAL_TYPE.JAVASCRIPT, data['jsExternal[]'], transaction);
        }
      }
    });
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
