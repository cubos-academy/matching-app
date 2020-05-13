const Pool = require('../utils/db');

const DEFAULT_ERR_RESPONSE = {
	error: 503,
	data: {
		message: 'Internal Error',
	},
};

const store = async (user) => {
	const { name, username, email, password_hash, phone, birthdate } = user;

	const userExists = await getOneByEmail(email);

	if (!userExists) {
		try {
			const {
				rows,
			} = await Pool.query(
				'INSERT INTO users (name, username, email, password_hash, phone, birthdate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
				[name, username, email, password_hash, phone, birthdate],
			);

			if (!rows.length) {
				return DEFAULT_ERR_RESPONSE;
			}

			return rows.shift();
		} catch (err) {
			return DEFAULT_ERR_RESPONSE;
		}
	}

	return {
		error: 409,
		data: {
			message: 'There is already an user with this email',
		},
	};
};

const getOneByEmail = async (email) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT id, email, password_hash FROM users WHERE email = $1 AND deleted_at IS NULL',
			[email],
		);

		if (!rows.length) {
			return null;
		}

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const getOne = async (id) => {
	try {
		const { rows } = await Pool.query(
			`
			SELECT
				users.*,
				array_remove(array_agg(photos.url), NULL) photos
			FROM users users
			LEFT JOIN users_pictures photos ON users.id = photos.user_id
			WHERE users.id = $1
			GROUP BY users.id;
		`,
			[id],
		);

		return rows.shift();
	} catch (err) {
		return {
			error: 503,
			message: 'Internal Error',
		};
	}
};

const update = async (user) => {
	const { id, email, password_hash, username, phone, name } = user;
	try {
		const { rows } = await Pool.query(
			`UPDATE users
				SET email = $1,
				password_hash = $2,
				username = $3,
				phone = $4,
				name = $5,
				updated_at = NOW()
			WHERE id = $6 RETURNING *;`,
			[email, password_hash, username, phone, name, id],
		);

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const updateProfile = async (user) => {
	const {
		name,
		birthdate,
		lives_in,
		latitude,
		longitude,
		school,
		work,
		show_location,
	} = user;
	try {
		const { rows } = await Pool.query(
			`
			UPDATE users SET
				name = $1,
				birthdate = $2,
				lives_in = $3,
				latitude = $4,
				longitude = $5,
				school = $6,
				work = $7,
				show_location = $8;
			`,
			[
				name,
				birthdate,
				lives_in,
				latitude,
				longitude,
				school,
				work,
				show_location,
			],
		);

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};
const getAll = () => {};

const disable = async (id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE users SET deleted_at = NOW() where id = $1',
			[id],
		);

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const upload = async ({ user_id, url }) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'INSERT INTO users_pictures (user_id, url) VALUES ($1, $2) RETURNING url;',
			[user_id, url],
		);

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const getRecommendations = async ({ min_age, max_age }) => {
	try {
		const { rows } = await Pool.query(
			`
			WITH tab_of_dates AS (
				select name, (extract (year from age(now(), birth))::integer) as age from users
			)
			SELECT
				tab_of_dates.*,
				array_agg(photos.url) photos,
			FROM tab_of_dates
			LEFT JOIN users_pictures photos
				ON users.id = photos.user_id;
			WHERE
				tab_of_ages.ages > $1 AND
				tab_of_ages.ages < $2
			;
		`,
			[min_age, max_age],
		);

		return rows;
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

module.exports = {
	store,
	getAll,
	getRecommendations,
	getOne,
	getOneByEmail,
	disable,
	update,
	updateProfile,
	upload,
};
