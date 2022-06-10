const ExportsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "0.0.1",
  register: async (
    server,
    { producerService, playlistsService, validator }
  ) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      playlistsService,
      validator
    );
    server.route(routes(exportsHandler));
  },
};
