const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivities(playlistId, songId, userId, action) {
    const id = `playlist_song_activities-${nanoid(16)}`;

    const result = await this._pool.query({
      text: "INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, userId, action],
    });
    if (!result.rows[0].id) {
      throw new InvariantError("Activity gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getActivitiesByIdPlaylist(id, owner) {
    const result = await this._pool.query({
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
             FROM playlist_song_activities 
             JOIN playlists ON playlists.id = playlist_song_activities.playlist_id 
             JOIN songs ON songs.id = playlist_song_activities.song_id 
             JOIN users ON users.id = playlist_song_activities.user_id 
             LEFT JOIN collaborations ON collaborations.playlist_id = playlist_song_activities.id 
             WHERE playlists.id = $1 AND playlists.owner = $2 OR collaborations.user_id = $2 
             ORDER BY playlist_song_activities.time ASC`,
      values: [id, owner],
    });
    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
