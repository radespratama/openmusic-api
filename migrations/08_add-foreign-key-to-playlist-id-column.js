exports.up = (pgm) => {
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_id_playlists.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_id_playlists.id",
  );
};
