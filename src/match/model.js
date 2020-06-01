/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const Pool = require('../utils/db');

const DEFAULT_ERR_RESPONSE = {
	error: 503,
	data: {
		message: 'Internal Error',
	},
};

const getOne = async (user_id, match_id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT id, email, password_hash FROM users_matches WHERE user_id = $1 AND match_id = $2 AND deleted_at IS NULL',
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
			'SELECT * from users_matches WHERE user_id = $1 AND deleted_at IS NULL AND match_liked = TRUE and user_liked = TRUE',
			[user_id],
		);

		if (!rows.length) {
			return null;
		}

		return rows;
	} catch (err) {
		return DEFAULT_ERR_RESPONSE;
	}
};

// const match = async (user_id, match_id) => {
// 	try {
// 	    const match =
// 		const { rows } = await Pool.query(`UPDATE users_matches SET `, [email]);
// 	} catch
// };

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

module.exports = { dismatch, getOne, index };
