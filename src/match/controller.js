const Match = require('./model');

const index = async (req, res) => {
	const { auth_user_id } = req;

	const matches = await Match.index(auth_user_id);

	return res.json({
		error: null,
		data: matches.data,
	});
};

const dismatch = async (req, res) => {
	const {
		auth_user_id,
		params: { match_id },
	} = req;

	const match = await Match.getLike(auth_user_id, match_id);

	if (!match) {
		return res.json({
			error: 400,
			data: {
				message: 'You cannot perform this action',
			},
		});
	}

	await Match.dismatch(auth_user_id, match_id);

	return res.json({
		error: null,
		data: {
			success: true,
		},
	});
};

const like = async (req, res) => {
	const {
		auth_user_id,
		params: { match_id },
	} = req;

	const match_like = await Match.getLike(auth_user_id, match_id);

	await Match.like(
		auth_user_id,
		match_id,
		match_like ? match_like.id : undefined,
	);

	return res.json({
		error: null,
		data: {
			message: `You have liked with user of id ${match_id}`,
		},
	});
};

const pass = async (req, res) => {
	const {
		auth_user_id,
		params: { match_id },
	} = req;

	const match_like = await Match.getLike(auth_user_id, match_id);

	await Match.pass(
		auth_user_id,
		match_id,
		match_like ? match_like.id : undefined,
	);

	return res.json({
		error: null,
		data: {
			message: `You have passed the user of id ${match_id}`,
		},
	});
};

module.exports = { dismatch, index, like, pass };
