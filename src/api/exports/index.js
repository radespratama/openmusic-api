const ExportsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "0.0.1",
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(service, validator);
    server.route(routes(exportsHandler));
  },
};
