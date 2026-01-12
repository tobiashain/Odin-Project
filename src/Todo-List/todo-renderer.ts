import { ChecklistTask } from './checklist-task';
import { adjustHeight } from './helper';
import type { Todo } from './todo';
import {
  Priority,
  State,
  TodoPriorityColor,
  TodoStateColor,
  type Task,
} from './types';

function updateTodoRow(row: HTMLElement, todo: Todo): void {
  let todoColor =
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

  const title = row.querySelector('.todo-title');
  if (title) title.textContent = todo.title;

  const desc = row.querySelector('.todo-desc');
  if (desc) {
    desc.textContent = todo.description ?? '';
  }

  const dateInput = row.querySelector('.todo-date') as HTMLInputElement;
  if (dateInput) {
    if (
      todo.dueDate.toISOString().slice(0, 10) <
        new Date().toISOString().slice(0, 10) &&
      todo.state !== State.Done
    ) {
      dateInput.className = 'todo-date overdue';
      todoColor = TodoStateColor.Overdue;
    } else {
      dateInput.className = 'todo-date';
    }
    dateInput.value = todo.dueDate.toISOString().slice(0, 10);
  }

  const priority = row.querySelector('.todo-priority') as HTMLSelectElement;
  if (priority) {
    priority.value = todo.priority;
  }

  const state = row.querySelector('.todo-state') as HTMLSelectElement;
  if (state) {
    state.value = todo.state;
  }

  requestAnimationFrame(() => {
    row.style.backgroundColor = todoPriorityColor;
    row.style.borderLeftColor = todoColor;
  });
}

function createTask(task: Task, onChange?: (value: Task) => void) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'todo-task';

  if (typeof task === 'string') {
    const note = document.createElement('textarea');
    note.innerText = task;
    note.rows = 1;
    note.className = 'todo-note';
    setTimeout(() => {
      adjustHeight(note);
    }, 0);

    note.addEventListener('input', () => {
      adjustHeight(note);
    });

    note.addEventListener('blur', () => {
      note.value = note.value.trim();
      adjustHeight(note);
    });

    taskDiv.appendChild(note);

    if (onChange) {
      note.addEventListener('change', () => {
        onChange(note.value.trim());
      });
    }
  } else {
    const checklist = document.createElement('div');
    checklist.className = 'todo-checklist';

    const items: [string, boolean][] = task.items.map(([l, v]) => [l, v]);
    items.forEach(([label, checked], index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'item';

      const text = document.createElement('span');
      text.innerText = label;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = checked;

      if (onChange) {
        checkbox.addEventListener('change', () => {
          items[index]![1] = checkbox.checked;
          onChange(new ChecklistTask([...items]));
        });
      }
      wrapper.appendChild(text);
      wrapper.appendChild(checkbox);
      checklist.appendChild(wrapper);
    });
    taskDiv.appendChild(checklist);
  }

  return taskDiv;
}

function createDiv(
  text: string,
  className: string,
  onChange?: (value: string) => void,
): HTMLTextAreaElement {
  const input = document.createElement('textarea');
  input.value = text;
  input.className = className;
  input.setAttribute('rows', '1');

  setTimeout(() => {
    adjustHeight(input);
  }, 0);

  input.addEventListener('input', () => {
    adjustHeight(input);
  });

  input.addEventListener('blur', () => {
    input.value = input.value.trim();
    adjustHeight(input);
  });

  if (onChange) {
    input.addEventListener('change', () => onChange(input.value.trim()));
  }
  return input;
}

function createSelect<T extends string>(
  values: T[],
  defaultValue: T,
  onChange?: (value: T) => void,
): HTMLSelectElement {
  const select = document.createElement('select');
  for (const v of values) {
    const option = document.createElement('option');
    option.value = v;
    option.textContent = v;
    select.appendChild(option);
  }
  select.value = defaultValue;
  if (onChange) {
    select.addEventListener('change', () => onChange(select.value as T));
  }

  return select;
}

function createDateInput(
  date: Date,
  onChange?: (value: string) => void,
): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'date';
  input.min = new Date().toISOString().split('T')[0] ?? '';
  input.value = (date ?? new Date()).toISOString().slice(0, 10);
  if (onChange) {
    input.addEventListener('change', () => {
      if (!input.value) {
        input.value = new Date().toISOString().slice(0, 10);
      }
      onChange(input.value);
    });
  }
  return input;
}

function createLabel(forId: string, text: string): HTMLLabelElement {
  const label = document.createElement('label');
  label.setAttribute('for', forId);
  label.textContent = text;
  return label;
}

export {
  updateTodoRow,
  createTask,
  createDiv,
  createSelect,
  createLabel,
  createDateInput,
};
