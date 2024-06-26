const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'MadChatter BOT';

// Run when client connects
io.on('connection', (socket) => {
	// Welcome current user
	socket.emit('message', formatMessage(botName, 'Welcome to Mad Chatter!'));

	// Broadcast on user connects
	socket.broadcast.emit(
		'message',
		formatMessage(botName, 'A user has joined the MadChatter!'),
	);

	// On user disconnect
	socket.on('disconnect', () => {
		io.emit(
			'message',
			formatMessage(botName, 'A user has left the MadChatter!'),
		);
	});

	// Listen for chatMessage
	socket.on('chatMessage', (msg) => {
		io.emit('message', formatMessage('USER', msg));
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`MadChatter is running on port ${PORT}`);
});
