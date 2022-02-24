const SongHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "songs",
  version: "0.0.1",
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};
