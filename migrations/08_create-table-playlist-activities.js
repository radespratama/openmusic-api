exports.up = (pgm) => {
  pgm.createTable("playlist_activities", {
    id: {
      type: "VARCHAR(60)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(60)",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(60)",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(60)",
      notNull: true,
    },
    action: {
      type: "VARCHAR(10)",
      notNull: true,
    },
    time: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlist_activities",
    "fk_playlist_activities.playlist_id_playlist.id",
    "FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_activities");
};
