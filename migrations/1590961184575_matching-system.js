/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns(
		'users_matches',
		{
			user_liked: { type: 'BOOL' },
			match_liked: { type: 'BOOL' },
			deleted_at: { type: 'TIMESTAMP', default: null },
		},
		{ ifNotExists: true },
	);
};

exports.down = (pgm) => {
	pgm.dropColumn('users', ['user_liked', 'match_liked'], {
		ifExists: true,
	});
};
