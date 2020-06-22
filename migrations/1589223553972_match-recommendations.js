/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable(
		'users_matches',
		{
			id: {
				type: 'UUID',
				primaryKey: true,
				default: pgm.func('uuid_generate_v4()'),
			},
			user_id: { type: 'UUID', notNull: true },
			match_id: { type: 'UUID', notNull: true },
			created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
			deleted_at: { type: 'TIMESTAMP', default: null },
		},
		{ isNotExists: true },
	);
};

exports.down = (pgm) => {
	pgm.dropTable('users_matches', { ifExists: true, cascade: true });
};
