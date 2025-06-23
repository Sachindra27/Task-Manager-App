document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTask');
    const tasksContainer = document.getElementById('tasksContainer');

    // Load tasks on page load
    loadTasks();

    // Add task event
    addTaskBtn.addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value.trim();
        if (!title) return alert('Please enter a task title');

        const priority = document.getElementById('taskPriority').value;
        const deadline = document.getElementById('taskDeadline').value;

        fetch('backend.php?action=create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                title,
                priority,
                deadline
            })
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById('taskTitle').value = '';
            loadTasks();
        });
    });

    // Load all tasks
    function loadTasks() {
        fetch('backend.php?action=read')
            .then(response => response.json())
            .then(tasks => {
                tasksContainer.innerHTML = '';
                
                if (tasks.length === 0) {
                    tasksContainer.innerHTML = '<p>No tasks found. Add one above!</p>';
                    return;
                }

                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `task ${task.priority}`;
                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>Priority: ${task.priority}</p>
                        <p>Deadline: ${task.deadline || 'Not set'}</p>
                        <select class="status-select" data-id="${task.id}">
                            <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
                            <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                            <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
                        </select>
                        <button class="delete-btn" data-id="${task.id}">Delete</button>
                    `;
                    tasksContainer.appendChild(taskElement);
                });

                // Add event listeners for status changes
                document.querySelectorAll('.status-select').forEach(select => {
                    select.addEventListener('change', (e) => {
                        updateTaskStatus(e.target.dataset.id, e.target.value);
                    });
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        deleteTask(e.target.dataset.id);
                    });
                });
            });
    }

    function updateTaskStatus(id, status) {
        fetch('backend.php?action=update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id,
                status
            })
        });
    }

    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch('backend.php?action=delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ id })
            })
            .then(() => loadTasks());
        }
    }
});