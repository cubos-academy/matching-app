/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns(
		'users',
		{
			min_age: { type: 'SMALLINT' },
			max_age: { type: 'SMALLINT' },
		},
		{ ifNotExists: true },
	);
};

exports.down = (pgm) => {
	pgm.dropColumn('users', ['birthdate', 'min_age', 'max_age'], {
		ifExists: true,
	});
};
