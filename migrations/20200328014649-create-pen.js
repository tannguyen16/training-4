
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(
    `create table "Pens"
    (
      "PenId" serial not null
        constraint "Pens_pk"
          primary key,
      "Name" varchar(255),
      "Uri" varchar(255) not null,
      "UserId" int not null
        constraint "Pens_Users_UserId_fk"
          references "Users"
            on delete cascade,
      "CreatedDate" date,
      "UpdatedDate" date
    );`,
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Pens'),
};
