/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns(
		'users',
		{
			description: { type: 'VARCHAR(140)' },
			lives_in: { type: 'VARCHAR(80)' },
			latitude: { type: 'FLOAT8' },
			longitude: { type: 'FLOAT8' },
			school: { type: 'VARCHAR(100)' },
			work: { type: 'VARCHAR(100)' },
			show_location: { type: 'BOOL', notNull: true, default: true },
			birthdate: { type: 'DATE' },
		},
		{ ifNotExists: true },
	);
};

exports.down = (pgm) => {
	pgm.dropColumn(
		'users',
		[
			'description',
			'lives_in',
			'latitude',
			'longitude',
			'school',
			'work',
			'show_location',
			'birthdate',
		],
		{ ifExists: true },
	);
};
