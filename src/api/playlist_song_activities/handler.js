const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class PlaylistSongActivitiesHandler {
  constructor(service) {
    const { playlistSongActivitiesService, playlistsService } = service;
    this._service = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getActivitiesByIdPlaylistHandler(req, h) {
    try {
      const { id: credentialId } = req.auth.credentials;
      const { id: playlistId } = req.params;
      await this._playlistsService.verifyPlaylistAccess(
        playlistId,
        credentialId
      );
      let activities = null;
      activities = await this._service.getActivitiesByIdPlaylist(
        playlistId,
        credentialId
      );
      return {
        status: "success",
        data: {
          playlistId,
          activities,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongActivitiesHandler;
