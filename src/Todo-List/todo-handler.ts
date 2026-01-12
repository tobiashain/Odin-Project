import { Todo } from './todo';
import { todoMap, projectMap } from './index';
import {
  State,
  Priority,
  TodoStateColor,
  TodoPriorityColor,
  type TodoMapEvent,
  type Task,
  type FilterInput,
} from './types';
import {
  createDateInput,
  createDiv,
  createLabel,
  createSelect,
  createTask,
  updateTodoRow,
} from './todo-renderer';
import { getElement } from './helper';
import { dialogForm } from './form-handler';
import { settingsTitle } from './project-list-handler';

const todosContainer: HTMLElement = getElement('#todosContainer');
const addTodoDiv: HTMLElement = getElement('#addTodo');
const selectProject: HTMLElement = getElement('#selectProject');
const dueDate: HTMLInputElement = getElement('#dueDate');

const filterInput: FilterInput = {
  task: document.querySelector('#filterTask') as HTMLSelectElement,
  date: document.querySelector('#filterDate') as HTMLInputElement,
  priority: document.querySelector('#filterPriority') as HTMLSelectElement,
  state: document.querySelector('#filterState') as HTMLSelectElement,
};

const nodes = new Map<string, HTMLElement>();

function bindEvents() {
  addTodoDiv.addEventListener('click', () => {
    if (dialogForm) dialogForm.showModal();
  });

  dueDate.addEventListener('click', () => dueDate.showPicker());
  filterInput.date.addEventListener('click', () =>
    filterInput.date.showPicker(),
  );

  for (const element of Object.values(filterInput)) {
    element.addEventListener('change', filterTodo);
  }
}

function handleTodoMapEvent(event: TodoMapEvent) {
  if (event.type === 'clear') {
    addTodoDiv.style.display = 'none';
    selectProject.style.display = 'block';
  } else {
    addTodoDiv.style.display = 'flex';
    selectProject.style.display = 'none';
    settingsTitle.innerText = projectMap.projectId ?? '';
  }

  switch (event.type) {
    case 'bulk': {
      nodes.forEach((el) => el.remove());
      filterInput.task.value = 'All';
      filterInput.date.value = '';
      filterInput.priority.value = 'All';
      filterInput.state.value = 'All';
      nodes.clear();

      for (const [id, todo] of event.items) {
        const el = renderTodo(todo);
        todosContainer.appendChild(el);
        nodes.set(id, el);
      }
      break;
    }

    case 'set': {
      const todo = event.todo;
      let el = nodes.get(todo.id);

      if (!el) {
        el = renderTodo(todo);
        todosContainer.appendChild(el);
        nodes.set(todo.id, el);
      } else {
        updateTodoRow(el, todo);
      }

      el.hidden = !matchesFilter(todo);
      break;
    }

    case 'delete': {
      const el = nodes.get(event.id);
      if (el) {
        el.remove();
        nodes.delete(event.id);
        todoMap?.delete(event.id);
      }
      break;
    }

    case 'clear': {
      nodes.forEach((el) => el.remove());
      nodes.clear();
      break;
    }

    case 'filter': {
      const visibleIds = new Set(event.items.map(([id]) => id));
      nodes.forEach((el, id) => {
        el.hidden = !visibleIds.has(id);
      });
      break;
    }
  }
}

function renderTodo(todo: Todo): HTMLElement {
  let todoStateColor =
    todo.state === State.NotStarted
      ? TodoStateColor.NotStarted
      : todo.state === State.Pending
        ? TodoStateColor.Pending
        : TodoStateColor.Done;

  const todoPriorityColor =
    todo.priority === Priority.Low
      ? TodoPriorityColor.Low
      : todo.priority === Priority.Medium
        ? TodoPriorityColor.Medium
        : TodoPriorityColor.High;

  const el = document.createElement('div');
  el.id = todo.id;
  el.className = 'todo';
  el.style.background = todoPriorityColor;

  el.appendChild(
    createDiv(todo.title, 'todo-title', (value) => {
      todo.editTask({ title: value });
      todoMap!.notify({ type: 'set', id: todo.id, todo });
    }),
  );

  el.appendChild(
    createDiv(todo.description ?? '', 'todo-desc', (value) => {
      todo.editTask({ description: value });
      todoMap!.notify({ type: 'set', id: todo.id, todo });
    }),
  );

  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.appendChild(createLabel('todo-date', 'Due'));
  wrapper.appendChild(createLabel('todo-priority', 'Priority'));
  wrapper.appendChild(createLabel('todo-state', 'Progress'));
  el.appendChild(wrapper);

  const dateInput = createDateInput(todo.dueDate, (date) => {
    todo.editTask({ dueDate: date ? new Date(date) : new Date() });
    todoMap!.notify({ type: 'set', id: todo.id, todo });
  });

  dateInput.addEventListener('click', () => dateInput.showPicker());

  if (
    todo.dueDate.toISOString().slice(0, 10) <
      new Date().toISOString().slice(0, 10) &&
    todo.state !== State.Done
  ) {
    dateInput.className = 'todo-date overdue';
    todoStateColor = TodoStateColor.Overdue;
  } else {
    dateInput.className = 'todo-date';
  }

  wrapper.appendChild(dateInput);

  const priority = createSelect(
    Object.values(Priority),
    todo.priority,
    (value) => {
      todo.editTask({ priority: value as Priority });
      todoMap!.notify({ type: 'set', id: todo.id, todo });
    },
  );
  priority.className = 'todo-priority';
  wrapper.appendChild(priority);

  const state = createSelect(Object.values(State), todo.state, (value) => {
    todo.editTask({ state: value as State });
    todoMap!.notify({ type: 'set', id: todo.id, todo });
  });
  state.className = 'todo-state';
  wrapper.appendChild(state);

  const task = createTask(todo.task ?? '', (value) => {
    todo.editTask({ task: value as Task });
    todoMap!.notify({ type: 'set', id: todo.id, todo });
  });
  el.appendChild(task);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'todoDelete';
  deleteButton.innerHTML = `
    <svg width="800px" height="800px" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8489 22.6922C11.5862 22.7201 11.3509 22.5283 11.3232 22.2638L10.4668 14.0733C10.4392 13.8089 10.6297 13.5719 10.8924 13.5441L11.368 13.4937C11.6307 13.4659 11.8661 13.6577 11.8937 13.9221L12.7501 22.1126C12.7778 22.3771 12.5873 22.614 12.3246 22.6418L11.8489 22.6922Z" fill="#000000"/>
      <path d="M16.1533 22.6418C15.8906 22.614 15.7001 22.3771 15.7277 22.1126L16.5841 13.9221C16.6118 13.6577 16.8471 13.4659 17.1098 13.4937L17.5854 13.5441C17.8481 13.5719 18.0387 13.8089 18.011 14.0733L17.1546 22.2638C17.127 22.5283 16.8916 22.7201 16.6289 22.6922L16.1533 22.6418Z" fill="#000000"/>
      <path clip-rule="evenodd" d="M11.9233 1C11.3494 1 10.8306 1.34435 10.6045 1.87545L9.54244 4.37037H4.91304C3.8565 4.37037 3 5.23264 3 6.2963V8.7037C3 9.68523 3.72934 10.4953 4.67218 10.6145L7.62934 26.2259C7.71876 26.676 8.11133 27 8.56729 27H20.3507C20.8242 27 21.2264 26.6513 21.2966 26.1799L23.4467 10.5956C24.3313 10.4262 25 9.64356 25 8.7037V6.2963C25 5.23264 24.1435 4.37037 23.087 4.37037H18.4561L17.394 1.87545C17.1679 1.34435 16.6492 1 16.0752 1H11.9233ZM16.3747 4.37037L16.0083 3.50956C15.8576 3.15549 15.5117 2.92593 15.1291 2.92593H12.8694C12.4868 2.92593 12.141 3.15549 11.9902 3.50956L11.6238 4.37037H16.3747ZM21.4694 11.0516C21.5028 10.8108 21.3154 10.5961 21.0723 10.5967L7.1143 10.6285C6.86411 10.6291 6.67585 10.8566 6.72212 11.1025L9.19806 24.259C9.28701 24.7317 9.69985 25.0741 10.1808 25.0741H18.6559C19.1552 25.0741 19.578 24.7058 19.6465 24.2113L21.4694 11.0516ZM22.1304 8.7037C22.6587 8.7037 23.087 8.27257 23.087 7.74074V7.25926C23.087 6.72743 22.6587 6.2963 22.1304 6.2963H5.86957C5.34129 6.2963 4.91304 6.72743 4.91304 7.25926V7.74074C4.91304 8.27257 5.34129 8.7037 5.86956 8.7037H22.1304Z" fill="#000000" fill-rule="evenodd"/>
    </svg>`;
  deleteButton.addEventListener('click', () =>
    handleTodoMapEvent({ type: 'delete', id: todo.id }),
  );
  el.appendChild(deleteButton);

  el.style.borderLeft = `15px solid ${todoStateColor}`;
  return el;
}

function filterTodo() {
  const todo = projectMap.current;
  if (!todo) return;

  let filteredTodo = new Map(todo.entries());

  if (filterInput.task.value !== 'All') {
    filteredTodo = todoMap!.filter((t) => {
      if (filterInput.task.value === 'note') return typeof t.task === 'string';
      if (filterInput.task.value === 'checklist')
        return typeof t.task === 'object';
      return true;
    });
  }

  const dateValue = filterInput.date.value;
  if (dateValue) {
    filteredTodo = todoMap!.filter(
      (t) => t.dueDate.toISOString().slice(0, 10) <= dateValue,
    );
  }

  if (filterInput.priority.value !== 'All') {
    filteredTodo = todoMap!.filter(
      (t) => t.priority === filterInput.priority.value,
    );
  }

  if (filterInput.state.value !== 'All') {
    filteredTodo = todoMap!.filter((t) => t.state === filterInput.state.value);
  }

  handleTodoMapEvent({ type: 'filter', items: Array.from(filteredTodo) });
}

function matchesFilter(todo: Todo): boolean {
  if (filterInput.task.value !== 'All') {
    if (filterInput.task.value === 'note' && typeof todo.task !== 'string')
      return false;
    if (filterInput.task.value === 'checklist' && typeof todo.task !== 'object')
      return false;
  }

  if (
    filterInput.date.value &&
    todo.dueDate.toISOString().slice(0, 10) >= filterInput.date.value
  )
    return false;
  if (
    filterInput.priority.value !== 'All' &&
    todo.priority !== filterInput.priority.value
  )
    return false;
  if (
    filterInput.state.value !== 'All' &&
    todo.state !== filterInput.state.value
  )
    return false;

  return true;
}

bindEvents();

export { handleTodoMapEvent, filterTodo, renderTodo, matchesFilter };
