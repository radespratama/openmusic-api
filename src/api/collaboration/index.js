const CollaborationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaboration",
  version: "0.0.1",
  register: async (
    server,
    { collaborationService, playlistService, validator }
  ) => {
    const collaborationHandler = new CollaborationHandler(
      collaborationService,
      playlistService,
      validator
    );
    server.route(routes(collaborationHandler));
  },
};
