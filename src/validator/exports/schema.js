const Joi = require("joi");

const ExportPlaylistSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistSongsPayloadSchema;
