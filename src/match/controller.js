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
		body: { match_id },
	} = req;

	const match = await Match.getMatch(auth_user_id, match_id);

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

const match = async (req, res) => {
	const {
		auth_user_id,
		body: { match_id },
	} = req;

	const response = await Match.getMatch(auth_user_id, match_id);

	const newly_match = await Match.match(response.id);

	return res.json({
		error: null,
		data: newly_match.data,
	});
};

module.exports = { dismatch, index, match };
