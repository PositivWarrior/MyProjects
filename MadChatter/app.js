const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());

// DB connection
const db = mysql.createConnection({
	host: 'localhost',
	user: 'AdminKacpru',
	password: 'Niepokonani8',
	database: 'madchatter',
});

db.connect((err) => {
	if (err) {
		console.error('Database connection failed', err);
		return;
	}
	console.log('MadChatter DB is on');
});

// Routes for REG and LOGIN

// Routes for CRUD messages

// Socket.io
io.on('connection', (socket) => {
	console.log('User connected');

	socket.on('sendMessage', (data) => {
		// Save msg and broadcast
		const { userId, message } = data;
		const query = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
		db.query(query, [userId, message], (err, result) => {
			if (err) {
				console.error('Failed to insert message:'.err);
				return;
			}
			io.emit('recieveMesssage', {
				id: result.insertId,
				userId,
				message,
			});
		});
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
