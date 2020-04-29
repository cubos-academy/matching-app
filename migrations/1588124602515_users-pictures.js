/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("users_pictures", {
        id: { type: "UUID", primaryKey: true, default: pgm.func("uuid_generate_v4()") },
        "user_id": { type: "UUID", notNull: true, foreignKey: "true" },
        url: { type: "TEXT", notNull: true },
        deleted_at: { type: "TIMESTAMP", default: null },
    }, { isNotExists: true });
    pgm.addConstraint("users", "user_id", {
        foreignKeys: {
            columns: "id",
            references: "users",
        }
    });
};

exports.down = pgm => {
    pgm.dropTable("users_pictures", { ifExists: true, cascade: true });
    pgm.dropConstraint("users", "user_ids", { ifExists: true, cascade: true });
};
