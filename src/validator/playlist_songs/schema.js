const Joi = require("joi");

const PlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistSongsPayloadSchema };
