const PlaylistSongActivitiesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistSongActivities",
  version: "0.0.1",
  register: async (server, { service }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      service
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};
