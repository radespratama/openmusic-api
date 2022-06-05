const PlaylistSongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistSongs",
  version: "0.0.1",
  register: async (server, { service, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(service, validator);
    server.route(routes(playlistSongsHandler));
  },
};
