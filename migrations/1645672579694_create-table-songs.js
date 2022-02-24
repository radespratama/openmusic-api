exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(80)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(80)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(80)",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(80)",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
      notNull: false
    },
    albumId: {
      type: "VARCHAR(50)",
      notNull: false,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint(
    "songs",
    "fk_album.album_id_albums.id",
    'FOREIGN KEY ("albumId") REFERENCES albums(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
