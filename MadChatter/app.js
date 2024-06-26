const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const formatMessage = require('./utils/messages');
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'MadChatter BOT';

// Run when client connects
io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		// Welcome current user
		socket.emit(
			'message',
			formatMessage(botName, 'Welcome to Mad Chatter!'),
		);

		// Broadcast on user connects
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(
					botName,
					`${user.username} has joined the MadChatter!`,
				),
			);

		// Users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// Listen for chatMessage
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});

	// On user disconnect
	socket.on('disconnect', () => {
		user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(
					botName,
					`${user.username} has left the MadChatter!`,
				),
			);

			// Users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`MadChatter is running on port ${PORT}`);
});
