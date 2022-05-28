const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(req, h) {
    try {
      this._validator.validateUserPayload(req.payload);
      const { username, password, fullname } = req.payload;
      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });

      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
        data: {
          userId,
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
}

module.exports = UserHandler;
