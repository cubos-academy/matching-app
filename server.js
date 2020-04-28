const express = require("express");
const routes = require("./src/routes");

const server = express();

server.use(express.json());
server.use(routes);

server.listen(process.env.PORT);
