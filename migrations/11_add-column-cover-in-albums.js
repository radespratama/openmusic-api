exports.up = (pgm) => {
  pgm.addColumns("albums", {
    cover: {
      type: "text",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("albums", "cover");
};
