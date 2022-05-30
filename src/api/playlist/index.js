const PlaylistHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlists",
  version: "0.0.1",
  register: async (server, { service, validator }) => {
    const playlistsApiHandler = new PlaylistHandler(service, validator);
    server.route(routes(playlistsApiHandler));
  },
};
