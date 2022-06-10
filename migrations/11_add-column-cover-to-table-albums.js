exports.up = (pgm) => {
  pgm.addColumn("albums", {
    cover_url: {
      type: "TEXT",
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("albums", "cover_url");
};
