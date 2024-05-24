window.addEventListener('load', () => {
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const prioritySelect = document.querySelector("#new-task-priority");
	const incomplete_tasks_el = document.querySelector("#incomplete-tasks");
	const completed_tasks_el = document.querySelector("#completed-tasks");

	// Load tasks from local storage
	loadTasks();

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const taskText = input.value;
		const taskPriority = prioritySelect.value;

		if (taskText === "") {
			alert("Please enter a task");
			return;
		}

		const task = {
			text: taskText,
			completed: false,
			priority: parseInt(taskPriority)
		};

		addTaskToDOM(task);

		saveTasks();

		input.value = '';
		prioritySelect.value = '3';
	});

	function addTaskToDOM(task) {
		const task_el = document.createElement('div');
		task_el.classList.add('task');
		task_el.dataset.priority = task.priority;

		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');

		const task_checkbox_el = document.createElement('input');
		task_checkbox_el.type = 'checkbox';
		task_checkbox_el.classList.add('checkbox');
		task_checkbox_el.checked = task.completed;

		task_el.appendChild(task_checkbox_el);

		const task_input_el = document.createElement('input');
		task_input_el.classList.add('text');
		task_input_el.type = 'text';
		task_input_el.value = task.text;
		task_input_el.setAttribute('readonly', 'readonly');

		if (task.completed) {
			task_input_el.style.textDecoration = "line-through";
		}

		task_content_el.appendChild(task_input_el);
		task_el.appendChild(task_content_el);

		const task_actions_el = document.createElement('div');
		task_actions_el.classList.add('actions');

		const task_edit_el = document.createElement('button');
		task_edit_el.classList.add('edit');
		task_edit_el.innerText = 'Edit';

		const task_delete_el = document.createElement('button');
		task_delete_el.classList.add('delete');
		task_delete_el.innerText = 'Delete';

		task_actions_el.appendChild(task_edit_el);
		task_actions_el.appendChild(task_delete_el);

		task_el.appendChild(task_actions_el);

		if (task.completed) {
			insertTaskInOrder(completed_tasks_el, task_el);
		} else {
			insertTaskInOrder(incomplete_tasks_el, task_el);
		}

		task_checkbox_el.addEventListener('change', () => {
			task_input_el.style.textDecoration = task_checkbox_el.checked ? "line-through" : "none";
			if (task_checkbox_el.checked) {
				incomplete_tasks_el.removeChild(task_el);
				insertTaskInOrder(completed_tasks_el, task_el);
			} else {
				completed_tasks_el.removeChild(task_el);
				insertTaskInOrder(incomplete_tasks_el, task_el);
			}
			saveTasks();
		});

		task_edit_el.addEventListener('click', () => {
			if (task_edit_el.innerText.toLowerCase() == "edit") {
				task_edit_el.innerText = "Save";
				task_input_el.removeAttribute("readonly");
				task_input_el.focus();
			} else {
				task_edit_el.innerText = "Edit";
				task_input_el.setAttribute("readonly", "readonly");
				saveTasks();
			}
		});

		task_delete_el.addEventListener('click', () => {
			if (task_checkbox_el.checked) {
				completed_tasks_el.removeChild(task_el);
			} else {
				incomplete_tasks_el.removeChild(task_el);
			}
			saveTasks();
		});
	}

	function insertTaskInOrder(container, task_el) {
		const tasks = Array.from(container.querySelectorAll('.task'));
		const priority = parseInt(task_el.dataset.priority);
		const index = tasks.findIndex(existingTask => parseInt(existingTask.dataset.priority) > priority);

		if (index === -1) {
			container.appendChild(task_el);
		} else {
			container.insertBefore(task_el, tasks[index]);
		}
	}

	function saveTasks() {
		const tasks = [];
		document.querySelectorAll('.task').forEach(task_el => {
			const text = task_el.querySelector('.text').value;
			const completed = task_el.querySelector('.checkbox').checked;
			const priority = parseInt(task_el.dataset.priority);
			tasks.push({ text, completed, priority });
		});
		tasks.sort((a, b) => a.priority - b.priority); // Sort by priority before saving
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	function loadTasks() {
		const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
		tasks.sort((a, b) => a.priority - b.priority); // Sort by priority when loading
		tasks.forEach(task => addTaskToDOM(task));
	}
});
