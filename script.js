// Task Manager

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// DOM Elements
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const remainingCount = document.getElementById("remaining-count");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearBtn = document.getElementById("clear-completed");

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update counters
function updateCounts() {
    const total = tasks.length;
    const remaining = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        total === 1 ? "1 task" : total + " tasks";

    remainingCount.textContent =
        remaining + " remaining";
}

// Render tasks
function renderTasks() {

    let filtered = tasks;

    if (currentFilter === "active") {
        filtered = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filtered = tasks.filter(task => task.completed);
    }

    taskList.innerHTML = "";

    if (filtered.length === 0) {
        taskList.innerHTML =
            '<li class="empty-state">No tasks here. Add one above!</li>';

        updateCounts();
        return;
    }

    filtered.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML =
            '<input type="checkbox" class="task-checkbox"' +
            (task.completed ? " checked" : "") +
            ' data-id="' + task.id + '">' +

            '<span class="task-text">' +
            task.text +
            '</span>' +

            '<button class="delete-btn" data-id="' +
            task.id +
            '">✕</button>';

        taskList.appendChild(li);
    });

    updateCounts();
}

// Add task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Toggle task
function toggleTask(id) {

    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Event Delegation
taskList.addEventListener("click", (e) => {

    const id = parseInt(e.target.getAttribute("data-id"));

    if (e.target.classList.contains("task-checkbox")) {
        toggleTask(id);
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteTask(id);
    }
});

// Add button
addBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        addTask();
    }

});

// Filter buttons
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentFilter =
            btn.getAttribute("data-filter");

        renderTasks();
    });

});

// Clear completed tasks
clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});

// Initial render
renderTasks();