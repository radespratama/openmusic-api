const AlbumsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "0.0.1",
  register: async (
    server,
    {
      albumsService, albumsValidator, storageService, uploadsValidator
    }
  ) => {
    const albumsHandler = new AlbumsHandler(
      albumsService,
      albumsValidator,
      storageService,
      uploadsValidator
    );
    server.route(routes(albumsHandler));
  },
};
