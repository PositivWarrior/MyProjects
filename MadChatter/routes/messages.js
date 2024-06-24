// routes/messages.js

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'madChatter';

// Middleware to verify JWT
function verifyJWT(req, res, next) {
	const token = req.headers['x-access-token'];
	if (!token) return res.status(403).send('No token provided');

	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) return res.status(500).send('Failed to authenticate token');
		req.userId = decoded.id;
		next();
	});
}

module.exports = (db) => {
	router.get('/messages', verifyJWT, (req, res) => {
		const query = 'SELECT * FROM messages';
		db.query(query, (err, results) => {
			if (err) {
				console.error('Failed to fetch messages:', err);
				return res.status(500).send('Failed to fetch messages');
			}
			res.status(200).send(results);
		});
	});

	router.post('/messages', verifyJWT, (req, res) => {
		const { message } = req.body;
		const query = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
		db.query(query, [req.userId, message], (err, result) => {
			if (err) {
				console.error('Failed to add message:', err);
				return res.status(500).send('Failed to add message');
			}
			res.status(200).send({
				id: result.insertId,
				user_id: req.userId,
				message,
			});
		});
	});

	return router;
};
