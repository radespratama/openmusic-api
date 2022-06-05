require("dotenv").config();

const { resolve } = require("path");
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");

const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/AlbumsService");
const AlbumsValidator = require("./validator/albums");

const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const SongsValidator = require("./validator/songs");

const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const playlists = require("./api/playlists");
const PlaylistsService = require("./services/postgres/PlaylistsService");
const PlaylistsValidator = require("./validator/playlists");

const playlistSongs = require("./api/playlist_songs");
const PlaylistSongsService = require("./services/postgres/PlaylistSongsService");
const PlaylistSongsValidator = require("./validator/playlist_songs");

const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

const playlistSongActivities = require("./api/playlist_song_activities");
const PlaylistSongActivitiesService = require("./services/postgres/PlaylistSongActivitiesService");

const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

const albumLikes = require("./api/album_likes");
const AlbumLikesService = require("./services/postgres/AlbumLikesService");

const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const storageService = new StorageService(
    resolve(__dirname, "api/uploads/file/images")
  );
  const cacheService = new CacheService();
  const albumLikesService = new AlbumLikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT || 6000,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
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
      credential: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: {
          albumsService,
          songsService,
        },
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        service: {
          playlistSongsService,
          playlistsService,
          songsService,
          playlistSongActivitiesService,
        },
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: {
          collaborationsService,
          playlistsService,
          usersService,
        },
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistSongActivities,
      options: {
        service: {
          playlistSongActivitiesService,
          playlistsService,
        },
      },
    },
    {
      plugin: _exports,
      options: {
        service: {
          ProducerService,
          playlistsService,
        },
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: {
          storageService,
          albumsService,
        },
        validator: UploadsValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        service: {
          albumLikesService,
          albumsService,
        },
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
