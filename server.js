const express = require('express');
const Sentry = require('@sentry/node');
const http = require('http');

const server = express();
const app = http.createServer(server);
const io = require('socket.io')(app);

require('./src/chat')(io);

const routes = require('./src/routes');
const sentryConf = require('./src/utils/sentry');

Sentry.init(sentryConf);

server.use(Sentry.Handlers.requestHandler());
server.use(express.json());
server.use(routes);
server.use(Sentry.Handlers.errorHandler());

app.listen(process.env.PORT);
