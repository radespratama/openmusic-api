const albums = ({
  id, name, year, cover, inserted_at, updated_at,
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const albumsWithSongs = ({
  id, name, year, cover, songs, inserted_at, updated_at,
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
  songs,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { albums, albumsWithSongs };
