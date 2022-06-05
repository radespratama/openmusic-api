const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postAlbumLikesHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.countAlbumLikesHandler,
  },
];

module.exports = routes;
