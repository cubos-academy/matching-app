/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');

const checkSocketAuthorization = (socket, next) => {
	if (socket.handshake.query && socket.handshake.query.token) {
		jwt.verify(
			socket.handshake.query.token,
			process.env.JWT_SECRET,
			function (err, decoded) {
				if (err) return next(new Error('Authentication error'));
				socket.decoded = decoded;
			},
		);
		return next();
	}
	next(new Error('Authentication error'));
};

module.exports = { checkSocketAuthorization };
