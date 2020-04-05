
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(
    `create table "PenExternals"
    (
      "PenExternalId" serial not null
        constraint "PenExternals_pk"
          primary key,
      "PenId" int not null,
      "Type" smallint,
      "Url" varchar(255),
      "CreatedDate" timestamp
    );
    alter table "PenExternals"
      add constraint "PenExternals_Pens_PenId_fk"
        foreign key ("PenId") references "Pens"
          on delete cascade;`,
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('PenExternals'),
};
