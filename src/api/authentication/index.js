const AuthenticationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "0.0.1",
  register: async (
    server,
    {
      authenticationService, userService, tokenManager, validator,
    },
  ) => {
    const authenticationHandler = new AuthenticationHandler(
      authenticationService,
      userService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationHandler));
  },
};
