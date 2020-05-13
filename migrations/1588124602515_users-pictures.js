/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable(
		'users_pictures',
		{
			id: {
				type: 'UUID',
				primaryKey: true,
				default: pgm.func('uuid_generate_v4()'),
			},
			user_id: { type: 'UUID', notNull: true },
			url: { type: 'TEXT', notNull: true },
			created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
			deleted_at: { type: 'TIMESTAMP', default: null },
		},
		{ isNotExists: true },
	);
};

exports.down = (pgm) => {
	pgm.dropTable('users_pictures', { ifExists: true, cascade: true });
};
