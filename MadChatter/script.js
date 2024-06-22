const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');

socket.on('receiveMessage', (data) => {
	const messageElement = document.createElement('li');
	messageElement.textContent = data.message;
	messages.appendChild(messageElement);
});

messageInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		const message = messageInput.value;
		socket.emit('sendMessage', { userId: 1, message });
		messageInput.value = '';
	}
});
