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
      type: "INT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "INT",
      notNull: false,
    },
    album_id: {
      type: "VARCHAR(50)",
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
