module.exports = {
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PW,
	},
	secure: false,
	default: {
		from: 'Matching App <noreply@matchingapp.com>',
	},
};
