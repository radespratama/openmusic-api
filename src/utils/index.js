/* eslint-disable camelcase */

const mapSongDBToModel = ({ album_id, ...args }) => ({
  ...args,
  albumId: album_id,
});

const mapAlbumDBToModel = ({ cover_url, ...args }) => ({
  ...args,
  coverUrl: cover_url,
});

const shortSongs = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapSongDBToModel, mapAlbumDBToModel, shortSongs };
