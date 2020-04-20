
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(
    `create table "PenPreviews"
    (
      "PenPreviewId" serial not null
        constraint "PenPreviews_pk"
          primary key,
      "PenId" int not null,
      "Url" varchar(255),
      "CreatedDate" timestamp
    );
    alter table "PenPreviews"
      add constraint "PenPreviews_Pens_PenId_fk"
        foreign key ("PenId") references "Pens"
          on delete cascade;
    `,
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('PenPreviews'),
};
