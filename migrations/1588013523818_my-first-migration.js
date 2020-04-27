/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("users", {
    confirmed_code: { type: "VARCHAR(6)" },
    confirmed_at: { type: "TIMESTAMP" },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("users", ["confirmed_code", "confirmed_at"]);
};
