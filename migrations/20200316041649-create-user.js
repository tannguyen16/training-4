module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    UserId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    Username: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    Email: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    Password: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    CreatedDate: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
