
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Pens', {
    PenId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    UserId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    PenName: {
      type: Sequelize.STRING,
    },
    HtmlCode: {
      type: Sequelize.TEXT,
    },
    HtmlExternal: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    CssCode: {
      type: Sequelize.TEXT,
    },
    CssExternal: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    JsCode: {
      type: Sequelize.TEXT,
    },
    JsExternal: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    URI: {
      type: Sequelize.STRING,
    },
    CreatedDate: {
      type: Sequelize.DATE,
    },
    UpdatedDate: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Pens'),
};
