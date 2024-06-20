document.addEventListener('DOMContentLoaded', () => {
	let todoList = [];

	const todoInput = document.getElementById('todo-input');
	const todoForm = document.getElementById('todo-form');
	const todoListElement = document.getElementById('todo-list');
	const deleteAllBtn = document.getElementById('delete-btn');

	todoForm.addEventListener('submit', (event) => {
		event.preventDefault();
		addTodo();
	});

	deleteAllBtn.addEventListener('click', deleteAllTodos);

	function addTodo() {
		const todoText = todoInput.value.trim();
		if (todoText === '') {
			alert('Please enter a todo item.');
			return;
		}

		todoList.push({ text: todoText, completed: false });
		todoInput.value = '';
		saveTodoList();
		renderTodoList();
	}

	function renderTodoList() {
		todoListElement.innerHTML = '';
		todoList.forEach((todo, index) => {
			const li = document.createElement('li');
			li.className = 'list-group-item todo-item';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = todo.completed;
			checkbox.addEventListener('change', () =>
				toggleTodoComplete(index),
			);

			const span = document.createElement('span');
			span.textContent = todo.text;
			if (todo.completed) {
				span.classList.add('completed');
			}

			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'delete-btn';
			deleteBtn.textContent = 'Del';
			deleteBtn.addEventListener('click', () => deleteTodo(index));

			li.appendChild(checkbox);
			li.appendChild(span);
			li.appendChild(deleteBtn);
			todoListElement.appendChild(li);
		});
	}

	function deleteTodo(index) {
		todoList.splice(index, 1);
		saveTodoList();
		renderTodoList();
	}

	function deleteAllTodos() {
		console.log('Delete All button clicked');
		if (confirm('Are you sure you want to delete all todos?')) {
			todoList = [];
			console.log('All todos deleted');
			saveTodoList();
			renderTodoList();
		}
	}

	function toggleTodoComplete(index) {
		todoList[index].completed = !todoList[index].completed;
		saveTodoList();
		renderTodoList();
	}

	function saveTodoList() {
		localStorage.setItem('todoList', JSON.stringify(todoList));
	}

	function loadTodoList() {
		const storedTodoList = localStorage.getItem('todoList');
		if (storedTodoList) {
			todoList = JSON.parse(storedTodoList);
		}
	}

	loadTodoList();
	renderTodoList();
});
