const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums",
    handler: handler.getAlbumsHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        maxBytes: 512000,
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
  {
    method: "GET",
    path: "/albums/covers/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file/cover"),
      },
    },
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikesAlbumHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getAlbumLikesByIdHandler,
  },
];

module.exports = routes;
