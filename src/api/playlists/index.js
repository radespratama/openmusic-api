const PlaylistsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlists",
  version: "0.0.1",
  register: async (server, { service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);
    server.route(routes(playlistsHandler));
  },
};
