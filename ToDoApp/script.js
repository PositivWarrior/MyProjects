let todoList = [];

let todoInput = document.getElementById('todo-input');

// Add event listener to todo-input for Enter key press
todoInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		addTodo();
	}
});

// Load Todo List from local storage
function loadTodoList() {
	let storedTodoList = localStorage.getItem('todoList');
	if (storedTodoList) {
		todoList = JSON.parse(storedTodoList);
	}
}

// Save Todo List to local storage
function saveTodoList() {
	localStorage.setItem('todoList', JSON.stringify(todoList));
}

document.getElementById('add-btn').addEventListener('click', addTodo);

function addTodo() {
	let todoInput = document.getElementById('todo-input');
	let todoText = todoInput.value.trim();

	if (todoText !== '') {
		todoList.push({ text: todoText, completed: false });
		todoInput.value = '';
		saveTodoList();
		renderTodoList();
	}
}

function renderTodoList() {
	let todoListHTML = '';
	todoList.forEach((todo, index) => {
		todoListHTML += `
            <li>
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span ${todo.completed ? 'class="completed"' : ''}>${
			todo.text
		}</span>
                <button class="delete-btn" data-index="${index}" style="background-color: red; color: white;">Del</button>
            </li>
        `;
	});
	document.getElementById('todo-list').innerHTML = todoListHTML;

	let deleteBtns = document.querySelectorAll('.delete-btn');
	deleteBtns.forEach((btn) => {
		btn.addEventListener('click', deleteTodo);
	});
}

function deleteTodo(event) {
	let index = event.target.getAttribute('data-index');
	todoList.splice(index, 1);
	saveTodoList();
	renderTodoList();
}

document.getElementById('delete-btn').addEventListener('click', deleteAllTodos);

function deleteAllTodos() {
	todoList = [];
	saveTodoList();
	renderTodoList();
}

loadTodoList();
renderTodoList();

document.addEventListener('DOMContentLoaded', renderTodoList);
