const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylists({ name, credentialId: owner }) {
    const id = `playlist-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: "INSERT INTO playlists VALUES ($1, $2, $3, $4, $4) RETURNING id",
      values: [id, name, owner, insertedAt],
    });
    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const result = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
             LEFT JOIN users ON users.id = playlists.owner 
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    });
    return result.rows;
  }

  async getPlaylistsById(id) {
    const result = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
             LEFT JOIN users ON users.id = playlists.owner 
             WHERE playlists.id=$1`,
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const result = await this._pool.query({
      text: "DELETE FROM playlists WHERE id=$1 RETURNING id",
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Playlists gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const result = await this._pool.query({
      text: "SELECT * FROM playlists WHERE id=$1",
      values: [id],
    });
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
