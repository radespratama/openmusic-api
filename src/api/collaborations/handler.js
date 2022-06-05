const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class CollaborationsHandler {
  constructor(service, validator) {
    const { collaborationsService, playlistsService, usersService } = service;
    this._service = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(req, h) {
    try {
      this._validator.validateCollaborationPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId, userId } = req.payload;

      await this._playlistsService.getPlaylistsById(playlistId);
      await this._usersService.getUserById(userId);

      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );
      const collaborationId = await this._service.addCollaboration(
        playlistId,
        userId
      );
      const response = h.response({
        status: "success",
        message: "Kolaborasi berhasil ditambahkan",
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
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

  async deleteCollaborationHandler(req, h) {
    try {
      this._validator.validateCollaborationPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId, userId } = req.payload;
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );
      await this._service.deleteCollaboration(playlistId, userId);
      return {
        status: "success",
        message: "Kolaborasi berhasil dihapus",
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

module.exports = CollaborationsHandler;
