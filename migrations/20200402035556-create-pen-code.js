
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(
    `create table "PenCode"
    (
      "PenCodeId" serial not null
        constraint "PenCode_pk"
          primary key,
      "PenId" int not null
        constraint "PenCode_Pens_PenId_fk"
          references "Pens"
            on delete cascade,
      "CodeType" smallint,
      "HtmlClass" varchar(255),
      "HtmlHead" text,
      "Body" text,
      "Hash" text,
      "CreatedDate" timestamp
    );`,
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('PenCode'),
};
