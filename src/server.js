require('dotenv').config();
const Hapi = require('@hapi/hapi');

// Songs
const songs = require("./api/song");
const SongService = require("./services/SongService");
const SongValidator = require("./validator/song");

// Albums
const albums = require("./api/album");
const AlbumService = require("./services/AlbumService");
const AlbumValidator = require("./validator/album");

const ClientError = require("./exceptions/ClientError");

async function initServer(){
  const songService = new SongService();
  const albumService = new AlbumService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
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
    }
  ]);

  await server.start();
  console.info(`Server running in ${server.info.uri}`)
}

initServer();