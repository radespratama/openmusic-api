const UserHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "0.0.1",
  register: async (server, { service, validator }) => {
    const userHandler = new UserHandler(service, validator);
    server.route(routes(userHandler));
  },
};
