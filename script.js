function Task(description, dueDate) {
    this.id = new Date().getTime();
    this.description = description;
    this.dueDate = dueDate;
    this.isCompleted = false;
}

Task.prototype.markAsCompleted = function() {
    this.isCompleted = true;
};

Task.prototype.editTask = function(newDescription, newDueDate) {
    this.description = newDescription;
    this.dueDate = newDueDate;
};

function TodoList() {
    this.tasks = [];
}

TodoList.prototype.addTask = function(task) {
    this.tasks.push(task);
    this.displayTasks();
};

TodoList.prototype.removeTask = function(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.displayTasks();
};

TodoList.prototype.editTask = function(task) {
    let newDescription = prompt('Enter a new description:', task.description);
    let newDueDate = prompt('Enter a new due date:', task.dueDate);

    if (newDescription !== null && newDueDate !== null) {
        task.editTask(newDescription, newDueDate);
        this.displayTasks();
    }
};

TodoList.prototype.displayTasks = function() {
    let taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    this.tasks.forEach(task => {
        let listItem = document.createElement('li');
        listItem.id = `task-${task.id}`;

        // Add a checkbox input element
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.isCompleted;
        checkbox.addEventListener('change', () => {
            task.isCompleted = checkbox.checked;
            this.updateTaskListItem(listItem, task);
        });

        listItem.appendChild(checkbox);

        // Display task information
        let taskInfo = document.createElement('span');
        taskInfo.textContent = ` Task: ${task.description} (Due: ${task.dueDate}) - ${task.isCompleted ? 'Completed' : 'Incomplete'}`;
        listItem.appendChild(taskInfo);

        // Add edit and remove buttons
        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => this.editTask(task));
        listItem.appendChild(editButton);

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => this.removeTask(task.id));
        listItem.appendChild(removeButton);

        taskListElement.appendChild(listItem);
    });
};

TodoList.prototype.updateTaskListItem = function(listItem, task) {
    listItem.querySelector('span').textContent = ` Task: ${task.description} (Due: ${task.dueDate}) - ${task.isCompleted ? 'Completed' : 'Incomplete'}`;
};

function addTask() {
    let description = document.getElementById('taskDescription').value;
    let dueDate = document.getElementById('dueDate').value;

    let newTask = new Task(description, dueDate);
    myTodoList.addTask(newTask);

    // Clear input fields after adding a task
    document.getElementById('taskDescription').value = '';
    document.getElementById('dueDate').value = '';
}

// Create ToDo List
let myTodoList = new TodoList();
