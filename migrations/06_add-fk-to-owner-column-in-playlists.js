exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname) VALUES('old_playlists', 'old_playlists', 'old_playlists', 'old_playlists')"
  );
  pgm.sql("UPDATE playlists SET owner = 'old_notes' WHERE owner = NULL");

  pgm.addConstraint(
    "playlists",
    "fk_playlists.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlists'");
  pgm.sql("DELETE FROM users WHERE id = 'old_playlists'");

  pgm.dropConstraint("playlists", "fk_playlists.owner_users.id");
};
