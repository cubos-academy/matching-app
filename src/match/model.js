/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const Pool = require('../utils/db');

const DEFAULT_ERR_RESPONSE = {
	error: 503,
	data: {
		message: 'Internal Error',
	},
};

const getLike = async (user_id, match_id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT * FROM users_matches WHERE (user_id = $1 AND match_id = $2) OR (user_id = $2 AND match_id = $1) AND deleted_at IS NULL',
			[user_id, match_id],
		);

		if (!rows.length) {
			return null;
		}

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const index = async (user_id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT * from users_matches WHERE (user_id = $1 OR match_id = $1) AND deleted_at IS NULL AND match_liked = TRUE and user_liked = TRUE',
			[user_id],
		);

		if (!rows.length) {
			return {
				error: null,
				data: [],
			};
		}

		return {
			error: null,
			data: rows,
		};
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const dismatch = async (user_id, match_id) => {
	try {
		await Pool.query(
			`UPDATE users_matches SET deleted_at = NOW() WHERE (user_id = $1 AND match_id = $2) OR (user_id = $2 AND match_id = $1)`,
			[user_id, match_id],
		);

		return {
			success: true,
		};
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const like = async (user_id, match_id, like_id) => {
	if (like_id) {
		try {
			await Pool.query(
				`UPDATE users_matches SET match_liked = TRUE WHERE match_id = $1`,
				[user_id],
			);

			return {
				success: true,
			};
		} catch (err) {
			return DEFAULT_ERR_RESPONSE;
		}
	}

	try {
		await Pool.query(
			`INSERT INTO users_matches (user_id, match_id, user_liked, match_liked) VALUES ($1, $2, TRUE, NULL)`,
			[user_id, match_id],
		);

		return {
			success: true,
		};
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

const pass = async (user_id, match_id, like_id) => {
	if (like_id) {
		try {
			await Pool.query(
				`UPDATE users_matches SET match_liked = FALSE WHERE match_id = $1`,
				[user_id],
			);

			return {
				success: true,
			};
		} catch (err) {
			return DEFAULT_ERR_RESPONSE;
		}
	}

	try {
		await Pool.query(
			`INSERT INTO users_matches (user_id, match_id, user_liked, match_liked) VALUES ($1, $2, FALSE, NULL)`,
			[user_id, match_id],
		);

		return {
			success: true,
		};
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

module.exports = { dismatch, getLike, index, like, pass };
