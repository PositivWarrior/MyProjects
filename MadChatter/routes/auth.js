// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'madChatter';

module.exports = (db) => {
	router.post('/register', (req, res) => {
		const { username, password } = req.body;
		const hashedPassword = bcrypt.hashSync(password, 8);

		const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
		db.query(query, [username, hashedPassword], (err, result) => {
			if (err) {
				console.error('Failed to register user:', err);
				return res.status(500).send('Failed to register user');
			}
			res.status(200).send('User registered successfully');
		});
	});

	router.post('/login', (req, res) => {
		const { username, password } = req.body;

		const query = 'SELECT * FROM users WHERE username = ?';
		db.query(query, [username], (err, results) => {
			if (err) {
				console.error('Failed to login:', err);
				return res.status(500).send('Failed to login');
			}

			if (
				results.length === 0 ||
				!bcrypt.compareSync(password, results[0].password)
			) {
				return res.status(401).send('Invalid username or password');
			}

			const token = jwt.sign({ id: results[0].id }, SECRET_KEY, {
				expiresIn: '1h',
			});
			res.status(200).send({ auth: true, token });
		});
	});

	return router;
};
