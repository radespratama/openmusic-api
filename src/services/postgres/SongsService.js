const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { shortSongs, longSongs } = require("../../utils/songs");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({
    title, year, genre, performer, duration, albumId
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id",
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        insertedAt,
      ],
    });
    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getSongs({ title = "", performer = "" }) {
    const result = await this._pool.query({
      text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)",
      values: [`%${title}%`, `%${performer}%`],
    });
    return result.rows.map(shortSongs);
  }

  async getSongById(id) {
    const result = await this._pool.query({
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Songs tidak ditemukan");
    }
    return result.rows.map(longSongs)[0];
  }

  async getSongsByAlbumId(albumId) {
    const result = await this._pool.query({
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [albumId],
    });
    return result.rows.map(longSongs);
  }

  async getSongsByPlaylistId(playlistId) {
    const result = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs 
             LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id 
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    });
    return result.rows;
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId
  }) {
    const result = await this._pool.query({
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui songs. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const result = await this._pool.query({
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Songs gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongsService;
