const ExportPlaylistSongsPayloadSchema = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const ExportsValidator = {
  validateExportPlaylistSongsPayload: (payload) => {
    const validationResult = ExportPlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
