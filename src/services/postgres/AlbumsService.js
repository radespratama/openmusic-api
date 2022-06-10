const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapAlbumDBToModel } = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id",
      values: [id, name, year, insertedAt],
    });

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT id, name, year FROM albums");
    return result.rows;
  }

  async getAlbumById(id) {
    const result = await this._pool.query({
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const resultSongs = await this._pool.query({
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    });

    return {
      ...result.rows.map(mapAlbumDBToModel)[0],
      songs: resultSongs.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const result = await this._pool.query({
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    });

    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async editAlbumCoverById(id, fileLocation) {
    await this._pool.query({
      text: "UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id",
      values: [fileLocation, id],
    });
  }

  async deleteAlbumById(id) {
    const result = await this._pool.query({
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async isAlbumExist(id) {
    const result = await this._pool.query({
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }

  async likeTheAlbum(id, userId) {
    await this.isAlbumExist(id);

    const result = await this._pool.query({
      text: "SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
      values: [id, userId],
    });

    let message = "";
    if (!result.rowCount) {
      const resultInsert = await this._pool.query({
        text: "INSERT INTO user_album_likes (album_id, user_id) VALUES($1, $2) RETURNING id",
        values: [id, userId],
      });

      if (!resultInsert.rowCount) {
        throw new InvariantError("Gagal menyukai album");
      }
      message = "Berhasil menyukai album";
    } else {
      const resultDelete = await this._pool.query({
        text: "DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
        values: [id, userId],
      });

      if (!resultDelete.rowCount) {
        throw new InvariantError("Gagal membatalkan menyukai album");
      }
      message = "Batal menyukai album";
    }
    await this._cacheService.delete(`user_album_likes:${id}`);
    return message;
  }

  async getAlbumLikesById(id) {
    try {
      const source = "cache";
      const likes = await this._cacheService.get(`user_album_likes:${id}`);
      return { likes: +likes, source };
    } catch (error) {
      await this.isAlbumExist(id);

      const result = await this._pool.query({
        text: "SELECT * FROM user_album_likes WHERE album_id = $1",
        values: [id],
      });

      const likes = result.rowCount;
      await this._cacheService.set(`user_album_likes:${id}`, likes);
      const source = "server";

      return { likes, source };
    }
  }
}

module.exports = AlbumsService;
