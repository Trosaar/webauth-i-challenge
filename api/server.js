const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const AuthRouter = require('../routes/auth-router.js')

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', AuthRouter);


server.get('/', (req, res) => {
	res.send('<h1>IT LIVES!!/h1>');
});

module.exports = server;