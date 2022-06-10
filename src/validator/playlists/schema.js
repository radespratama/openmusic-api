const Joi = require("joi");

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PostActivityPayloadSchema = Joi.object({
  songId: Joi.string().required(),
  userId: Joi.string().required(),
  action: Joi.string().required(),
  time: Joi.string().required(),
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongPayloadSchema,
  PostActivityPayloadSchema,
};
