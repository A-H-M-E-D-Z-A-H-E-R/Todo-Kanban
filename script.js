// Header

const themeBtn = document.querySelector("#theme-btn");
const addTaskBtn = document.querySelector("#add-task-btn");

// Todo column

const todoCount = document.querySelector("#todo-count");
const todoTasks = document.querySelector("#todo-tasks");

// In Progress column

const progressCount = document.querySelector("#progress-count");
const progressTasks = document.querySelector("#progress-tasks");

// Done column

const doneCount = document.querySelector("#done-count");
const doneTasks = document.querySelector("#done-tasks");

// Statistics

const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const progressPercent = document.querySelector("#progress-percent");

/// Task Modal

const taskModal = document.querySelector("#task-modal");
const modalTitle = document.querySelector("#modal-title");
const closeModalBtn = document.querySelector("#close-modal");

/// Task Form

const taskForm = document.querySelector("#task-form");

const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");
const taskPriority = document.querySelector("#task-priority");
const taskDate = document.querySelector("#task-date");
const taskStatus = document.querySelector("#task-status");

/// Modal Actions

const cancelTaskBtn = document.querySelector("#cancel-task");

// toggle theme - func

const bodyEl = document.body;
themeBtn.addEventListener("click", () => {
  bodyEl.classList.toggle("light");
});

// add task btn func
let tasks = [];
addTaskBtn.addEventListener("click", () => {
  taskModal.classList.add("active");
});

closeModalBtn.addEventListener("click", () => {
  taskModal.classList.remove("active");
});
cancelTaskBtn.addEventListener("click", () => {
  taskModal.classList.remove("active");
});
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = {
    id: Date.now(),
    title: taskTitle.value,
    description: taskDescription.value,
    priority: taskPriority.value,
    date: taskDate.value,
    status: taskStatus.value,
  };

  tasks.push(task);
  taskForm.reset();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskModal.classList.remove("active");
  renderTasks();
});

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

// render tasks
function renderTasks() {
  todoTasks.innerHTML = "";
  progressTasks.innerHTML = "";
  doneTasks.innerHTML = "";
  tasks.forEach((task) => {
    const taskCard = document.createElement("article");

    taskCard.classList.add("task-card");

    taskCard.innerHTML = `
    <input type="checkbox" name="task-check" class="task-check" style="position:relative;  left:240px; top:30px; padding:20px;  accent-color: #6b4de6;  width: 15px;

    height: 15px;
    cursor: pointer ;margin-right:20px; ">
      <h3 style="width:70%;"> 
        ${task.title}
      </h3>
      <h6 style="margin-top:10px;">
        ${task.priority}
      </h6>
      <p style="font-size:0.9rem; margin-top: 10px; color:gray;">${task.description} </p>

      <p style="position:relative; left:180px;top:40px; font-size:0.9rem; color:#9298a5;">${task.date}</p>

      <button style=" background:transparent; color: #fc3737; border:1px solid  #fc3737;padding: 10px; border-radius: 10px;  margin-top: 10px;">Remove</button>

    `;
    const checkBox = taskCard.querySelector(".task-check");

    const taskName = taskCard.querySelector("h3");

    checkBox.checked = task.status === "done";

    if (task.status === "done") {
      taskName.style.textDecoration = "line-through";
    }
    checkBox.addEventListener("change", () => {
      if (checkBox.checked) {
        task.status = "done";
      } else {
        task.status = "todo";
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });
    const removeBtn = taskCard.querySelector("button");
    removeBtn.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);

      localStorage.setItem("tasks", JSON.stringify(tasks));

      renderTasks();
    });
    const priorityColor = taskCard.querySelector("h6");
    if (task.priority === "high") {
      priorityColor.style.color = "#fc3737";
    } else if (task.priority === "medium") {
      priorityColor.style.color = "#f59e0b";
    } else {
      priorityColor.style.color = "#22c55e";
    }

    if (task.status === "todo") {
      todoTasks.appendChild(taskCard);
    } else if (task.status === "progress") {
      progressTasks.appendChild(taskCard);
    } else {
      doneTasks.appendChild(taskCard);
    }
  });

  const completed = tasks.filter((task) => task.status === "done").length;
  const remaining = tasks.filter((task) => task.status !== "done").length;

  todoCount.textContent = tasks.filter((task) => task.status === "todo").length;

  progressCount.textContent = tasks.filter(
    (task) => task.status === "progress",
  ).length;

  doneCount.textContent = completed;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  remainingTasks.textContent = remaining;

  const percentage =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  progressPercent.textContent = `${percentage}%`;
}

renderTasks();
