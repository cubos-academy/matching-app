const express = require('express');
const Sentry = require('@sentry/node');
const routes = require('./src/routes');
const sentryConf = require('./src/utils/sentry');

const server = express();

Sentry.init(sentryConf);

server.use(Sentry.Handlers.requestHandler());
server.use(express.json());
server.use(routes);
server.use(Sentry.Handlers.errorHandler());

server.listen(process.env.PORT);
