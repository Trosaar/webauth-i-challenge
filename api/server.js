const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const AuthRouter = require('../routes/auth-router.js')
const db = require('../database/dbConfig.js')

const server = express();

connectSessionStore = connectSessionKnex(session);

const sessionConfig = {
	name: 'PokemonTracker',
	secret: 'gottacatchemall Pokemon',
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false, // normamlly want this to be true so it can only be sent over HTTPS
		httpOnly: true // cant access using JS
	},
	resave: false,
	saveUninitialized: false, // legally needs to be false
	store: new connectSessionStore({ // should be done with local storage system like redis
		knex: db,
		tablename: 'session',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 1000 * 60 * 60
	})
}

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/auth', AuthRouter);


server.get('/', (req, res) => {
	res.send('<h1>IT LIVES!!/h1>');
});

module.exports = server;