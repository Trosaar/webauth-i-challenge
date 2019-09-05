const express = require('express');
const bcrypt = require('bcryptjs');

const authDB = require('./auth-model.js');

const router = express.Router();

// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.
// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'.

router.post('/register', (req, res) => {
	const user = req.body

	user.password = bcrypt.hashSync(user.password, 15)

	authDB.add(user)
	.then(savedUser => {
		res.status(201).json(savedUser);
	})
	.catch(err => {
		res.status(500).json(err)
	});
});

router.post('/login', checkLogin, (req, res) => {
	const {username, password} = req.body;

	authDB.findBy({ username })
	.first()
	.then(user => {
		if(bcrypt.compareSync(password, user.password) && user) {
			res.status(200).json({ message: `logged in as ${user.username}.`})
		} else {
			res.status(401).json({ message: 'Invalid Credentials' })
		}
	})
	.catch(err => {
		res.status(500).json(err)
	})
})

router.get('/users', (req, res) => {
	authDB.find()
	.then(users => {
		res.status(200).json(users)
	})
	.catch(err => {
		res.status(500).json(err)
	})
});

function checkLogin(req, res, next) {
	const { username, password } = req.headers;

	if(username && password) {
		authDB.findBy({ username })
		.first()
		.then(user => {
			if(bcrypt.compareSync(password, user.password) && user) {
				next()
			} else {
				res.status(401).json({ message: "invalid Credentials"})
			}
		})
		.catch(err => {
			res.status(500).json({ message: "Invalid Credentials" })
		})
	} else {
		res.status(400).json({ message: 'please provide username and password'})
	}
}

module.exports = router;