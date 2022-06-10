const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const result = await this._pool.query({
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    });

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(user) {
    const result = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id  
      WHERE playlists.owner = $1 OR collaborations.user_id = $1;`,
      values: [user],
    });

    return result.rows;
  }

  async deletePlaylistById(id) {
    const result = await this._pool.query({
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const result = await this._pool.query({
      text: "INSERT INTO playlist_songs (playlist_id, song_id) VALUES($1, $2) RETURNING id",
      values: [playlistId, songId],
    });

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const resultPlaylist = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    });

    const result = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    });

    return { ...resultPlaylist.rows[0], songs: result.rows };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const result = await this._pool.query({
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    });

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal dihapus");
    }
  }

  async addActivityToPlaylist(playlistId, songId, userId, action) {
    const result = await this._pool.query({
      text: "INSERT INTO playlist_activities (playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4) RETURNING id",
      values: [playlistId, songId, userId, action],
    });

    if (!result.rows[0].id) {
      throw new InvariantError("Activity gagal ditambahkan ke playlist");
    }
  }

  async getActivitiesFromPlaylist(playlistId) {
    const result = await this._pool.query({
      text: `SELECT users.username, songs.title, action, time
      FROM playlist_activities
      JOIN songs ON songs.id = playlist_activities.song_id
      JOIN users ON users.id = playlist_activities.user_id
      WHERE playlist_activities.playlist_id = $1`,
      values: [playlistId],
    });

    return result.rows;
  }

  async verifyPlaylistOwner(id, owner) {
    const result = await this._pool.query({
      text: "SELECT * FROM playlists WHERE id = $1",
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
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
