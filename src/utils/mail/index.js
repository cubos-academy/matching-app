const nodemailer = require('nodemailer');
const mailConf = require('./config');

const Mail = nodemailer.createTransport(mailConf);

const sendMail = (message) => {
	return Mail.sendMail({
		...mailConf.default,
		...message,
	});
};

module.exports = sendMail;
