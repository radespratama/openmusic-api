const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2030)
    .required(),
});

module.exports = { AlbumPayloadSchema };
