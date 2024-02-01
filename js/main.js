const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskLists = document.querySelector('#tasksList');

let tasks = [];

if (localStorage.getItem('taskLists')) {
  tasks = JSON.parse(localStorage.getItem('taskLists'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);

taskLists.addEventListener('click', deleteTask);

taskLists.addEventListener('click', doneTask);

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') return;

  const parentNode = event.target.closest('.list-group-item');
  parentNode.remove();

  const id = Number(parentNode.id);
  const index = tasks.findIndex((task) => task.id === id);
  tasks.splice(index, 1);
  saveToLocalStorage();

  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return;
  const parentNode = event.target.closest('.task-item');

  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHtml = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;
    taskLists.insertAdjacentHTML('afterbegin', emptyListHtml);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('taskLists', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
              <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18" />
              </button>
              <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18" />
              </button>
            </div>
          </li>`;

  taskLists.insertAdjacentHTML('beforeend', taskHtml);
}
