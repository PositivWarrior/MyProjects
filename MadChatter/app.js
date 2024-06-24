// app.js

const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET_KEY = 'madChatter';

// DB connection
function connectToDatabase() {
	const db = mysql.createConnection({
		host: 'localhost',
		user: 'AdminKacpru',
		password: 'Niepokonani8',
		database: 'madchatter',
		port: 3306, // Correct MySQL port
	});

	db.connect((err) => {
		if (err) {
			console.error('Database connection failed:', err);
			console.log('Retrying in 5 seconds...');
			setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
		} else {
			console.log('MadChatter DB is on');
			setupRoutes(db);
		}
	});

	return db;
}

const db = connectToDatabase();

function setupRoutes(db) {
	const authRouter = require('./routes/auth')(db);
	const messageRouter = require('./routes/messages')(db);

	app.use('/auth', authRouter);
	app.use('/', messageRouter);

	// Serve the index.html file for the root route
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});

	// Socket.io
	io.on('connection', (socket) => {
		console.log('User connected');

		socket.on('sendMessage', (data) => {
			const { token, message } = data;
			jwt.verify(token, SECRET_KEY, (err, decoded) => {
				if (err) {
					console.error('Failed to authenticate token');
					return;
				}

				const query =
					'INSERT INTO messages (user_id, message) VALUES (?, ?)';
				db.query(query, [decoded.id, message], (err, result) => {
					if (err) {
						console.error('Failed to insert message:', err);
						return;
					}
					io.emit('receiveMessage', {
						id: result.insertId,
						user_id: decoded.id,
						message,
					});
				});
			});
		});

		socket.on('disconnect', () => {
			console.log('User disconnected');
		});
	});
}

server.listen(3000, () => {
	console.log('Server is running on port 3000');
});
