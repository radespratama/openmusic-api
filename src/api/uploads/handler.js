const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class UploadsHandler {
  constructor(service, validator) {
    const { storageService, albumsService } = service;
    this._service = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(req, h) {
    try {
      const { cover } = req.payload;
      const { id } = req.params;
      this._validator.validateImageHeaders(cover.hapi.headers);
      const filename = await this._service.writeFile(cover, cover.hapi);
      const fileloc = `http://${process.env.HOST}:${process.env.PORT}/upload/file/images/${filename}`;
      await this._albumsService.addCoverValueById(id, fileloc);
      const response = h.response({
        status: "success",
        message: `File telah disimpan dengan nama ${fileloc}`,
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
}

module.exports = UploadsHandler;
