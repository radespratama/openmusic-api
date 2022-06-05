const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const {
        title, year, genre, performer, duration, albumId
      } = req.payload;
      const songId = await this._service.addSongs({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      const response = h.response({
        status: "success",
        message: "Song berhasil ditambahkan",
        data: {
          songId,
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

  async getSongsHandler(req, h) {
    try {
      const { query } = req;
      const songs = await this._service.getSongs(query);
      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      const response = h.response({
        status: "error",
        message: "Mohon maaf, Server dalam gangguan akan segera diperbaiki.",
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async getSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: {
          song,
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

  async putSongByIdHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const { id } = req.params;
      await this._service.editSongById(id, req.payload);
      return {
        status: "success",
        message: "Song berhasil diperbarui",
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

  async deleteSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);
      return {
        status: "success",
        message: "Song berhasil dihapus",
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
      // Server ERROR!
      const response = h.response({
        status: "fail",
        message: "Mohon maaf, Server dalam gangguan akan segera diperbaiki.",
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = SongsHandler;
