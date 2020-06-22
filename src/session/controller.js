const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/model');

const comparePassword = async (string, password) =>
	bcrypt.compare(string, password);

const auth = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			error: 400,
			message: 'Bad Format',
		});
	}

	const user = await User.getOneByEmail(email);

	if (user) {
		const doesPasswordMatch = await comparePassword(
			password,
			user.password_hash,
		);

		if (doesPasswordMatch) {
			const token = jwt.sign(
				{ id: user.id, name: user.name },
				process.env.JWT_SECRET,
				{
					expiresIn: process.env.JWT_EXPIRE_TIME,
				},
			);

			console.log(user);
			return res.json({
				email,
				username: user.username,
				name: user.name,
				token,
			});
		}
	}

	return res.status(403).json({
		error: 403,
		message: 'Forbidden',
	});
};

module.exports = { auth };
