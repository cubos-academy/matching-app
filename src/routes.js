const { Router } = require('express');
const { fileUpload } = require('./utils/upload');

const User = require('./user/controller');
const { checkAccountStatus, encryptPassword } = require('./user/middleware');

const Session = require('./session/controller');
const { checkAuthorization } = require('./session/middleware');

const Match = require('./match/controller');

const routes = Router();

routes.get('/hello', (req, res) => {
	res.json({ error: null, data: { message: 'Hello, World!!' } });
});

routes.post('/auth/', Session.auth);
routes.post('/auth/google', () => {});
routes.post('/auth/google', () => {});

routes.get(
	'/user/me',
	checkAuthorization,
	checkAccountStatus,
	User.getUserProfile,
);

routes.get(
	'/user/recommendations',
	checkAuthorization,
	checkAccountStatus,
	User.recommendations,
);

routes.get(
	'/user/:id',
	checkAuthorization,
	checkAccountStatus,
	User.getProfile,
);

routes.post('/user/', encryptPassword, User.create);
routes.put(
	'/user/me',
	checkAuthorization,
	checkAccountStatus,
	encryptPassword,
	User.update,
);

routes.put(
	'/users/me/profile',
	checkAuthorization,
	checkAccountStatus,
	User.updateProfile,
);

routes.put(
	'/user/me/disable',
	checkAuthorization,
	checkAccountStatus,
	User.disable,
);

routes.post('/user/me/upload', checkAuthorization, fileUpload, User.upload);

routes.get('/matches/', checkAuthorization, Match.index);

routes.post('/matches', checkAuthorization, Match.match);

routes.delete('/matches/', checkAuthorization, Match.dismatch);

module.exports = routes;
