/* eslint-disable camelcase */

const shortSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const longSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

module.exports = { shortSongs, longSongs };
