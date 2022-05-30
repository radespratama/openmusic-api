require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// Songs
const songs = require("./api/song");
const SongService = require("./services/SongService");
const SongValidator = require("./validator/song");

// Albums
const albums = require("./api/album");
const AlbumService = require("./services/AlbumService");
const AlbumValidator = require("./validator/album");

// User
const users = require("./api/user");
const UserService = require("./services/UserService");
const UserValidator = require("./validator/user");

// Authentication
const authentications = require("./api/authentication");
const AuthenticationService = require("./services/AuthenticationService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationValidator = require("./validator/authentication");

// Playlist
const playlists = require("./api/playlist");
const PlaylistService = require("./services/PlaylistService");
const PlaylistValidator = require("./validator/playlist");

// Collaboration
const collaborations = require("./api/collaboration");
const CollaborationService = require("./services/CollaborationService");
const CollaborationValidator = require("./validator/collaboration");

const ClientError = require("./exceptions/ClientError");

async function initServer() {
  const collaborationService = new CollaborationService();
  const songService = new SongService();
  const albumService = new AlbumService();
  const playlistService = new PlaylistService(collaborationService);
  const authenticationService = new AuthenticationService();
  const userService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.ext("onPreResponse", (req, h) => {
    const { response } = req;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return response.continue || response;
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistService,
        validator: CollaborationValidator,
      },
    },
  ]);

  await server.start();
  console.info(`Server running in ${server.info.uri}`);
}

initServer();
