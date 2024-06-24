// public/script.js

const socket = io();
let authToken = '';

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');

const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');

const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');

socket.on('receiveMessage', (data) => {
	const messageElement = document.createElement('li');
	messageElement.textContent = data.message;
	messages.appendChild(messageElement);
});

messageInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		const message = messageInput.value;
		socket.emit('sendMessage', { token: authToken, message });
		messageInput.value = '';
	}
});

registerButton.addEventListener('click', () => {
	const username = document.getElementById('register-username').value;
	const password = document.getElementById('register-password').value;

	fetch('/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	}).then((response) => {
		if (response.ok) {
			alert('User registered successfully');
		} else {
			alert('Failed to register');
		}
	});
});

loginButton.addEventListener('click', () => {
	const username = document.getElementById('login-username').value;
	const password = document.getElementById('login-password').value;

	fetch('/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.auth) {
				authToken = data.token;
				authContainer.style.display = 'none';
				chatContainer.style.display = 'block';
			} else {
				alert('Failed to login');
			}
		});
});
