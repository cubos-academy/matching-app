const { Router } = require('express');
const { fileUpload } = require('./utils/upload');

const User = require('./user/controller');
const { checkAccountStatus, encryptPassword } = require('./user/middleware');

const Session = require('./session/controller');
const { checkAuthorization } = require('./session/middleware');

const routes = Router();

routes.get('/hello', (req, res) => {
	res.json({ error: null, data: { message: 'Hello, World!!' } });
});

routes.post('/auth/', Session.auth);
routes.post('/auth/google', () => {});
routes.post('/auth/google', () => {});

routes.get(
	'/users/me',
	checkAuthorization,
	checkAccountStatus,
	User.getUserProfile,
);

routes.get(
	'/users/:id',
	checkAuthorization,
	checkAccountStatus,
	User.getProfile,
);

routes.post('/users/', encryptPassword, User.create);
routes.put(
	'/users/me',
	checkAuthorization,
	checkAccountStatus,
	encryptPassword,
	User.update,
);

routes.put(
	'/users/me/disable',
	checkAuthorization,
	checkAccountStatus,
	User.disable,
);

routes.post('/users/me/upload', checkAuthorization, fileUpload, User.upload);

module.exports = routes;
