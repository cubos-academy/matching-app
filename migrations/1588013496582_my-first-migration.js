/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createExtension("uuid-ossp", {
    ifNotExists: true,
  });
  pgm.createTable("users", {
    id: {
      type: "UUID",
      default: pgm.func("uuid_generate_v4()"),
      primaryKey: true,
    },
    name: { type: "VARCHAR(50)", notNull: true },
    email: { type: "VARCHAR(50)", notNull: true, unique: true },
    username: { type: "VARCHAR(20)", notNull: true },
    password_hash: { type: "VARCHAR(60)", notNull: true },
    phone: { type: "VARCHAR(12)", notNull: true },
    document_id: { type: "VARCHAR(11)", default: null },
    google_id: { type: "VARCHAR(200)", default: null },
    facebook_id: { type: "VARCHAR(200)", default: null },
    deleted_at: { type: "TIMESTAMP", default: null },
    created_at: { type: "TIMESTAMP", default: pgm.func("NOW()") },
    updated_at: { type: "TIMESTAMP", default: pgm.func("NOW()") },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
  pgm.dropExtension("uuid-ossp");
};
