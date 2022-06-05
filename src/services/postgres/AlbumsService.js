const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { albums } = require("../../utils/albums");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: "INSERT INTO albums VALUES ($1, $2, $3, $4, $4) RETURNING id",
      values: [id, name, year, insertedAt],
    });
    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const result = await this._pool.query({
      text: "SELECT id, name, year FROM albums WHERE id=$1",
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Albums tidak ditemukan");
    }
    return result.rows.map(albums)[0];
  }

  async editAlbumById(id, { name, year }) {
    const result = await this._pool.query({
      text: "UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id",
      values: [name, year, id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui albums. Id tidak ditemukan");
    }
  }

  async addCoverValueById(id, cover) {
    const result = await this._pool.query({
      text: "UPDATE albums SET cover=$1 WHERE id=$2 RETURNING id",
      values: [cover, id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui albums. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const result = await this._pool.query({
      text: "DELETE FROM albums WHERE id=$1 RETURNING id",
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Albums gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumsService;
