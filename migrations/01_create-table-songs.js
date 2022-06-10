exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
      notNull: false,
    },
    album_id: {
      type: "TEXT",
      notNull: false,
    },
    inserted_at: {
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
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
