const { checkSocketAuthorization } = require('./middleware');

const secret_key = 'cubos_academy';
const palavras_proibidas = [];
const censura = (message) => {
	// Tratamento;
	return message;
};

const socket_io = (io) => {
	io.use(checkSocketAuthorization);

	io.on('connection', (socket) => {
		// socket.decoded.match_id;
		socket.broadcast.emit(
			'STATUS_NOTIFICATION',
			`User ${socket.decoded.name} visualizou às 18h34.`,
		);

		socket.on('CHAT_MESSAGE', (content) => {
			// validação


			io.emit('CHAT_MESSAGE', {
				username: socket.decoded.name,
				message: censura(content.message),
			});
		});

		socket.on('disconnect', () => {
			socket.broadcast.emit(
				'STATUS_NOTIFICATION',
				`User ${socket.decoded.name} desconectou-se do chat.`,
			);
		});
	});
};

module.exports = socket_io;
