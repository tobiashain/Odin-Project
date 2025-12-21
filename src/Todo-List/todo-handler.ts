import { FormHandler } from './form-handler';
import { Todo } from './todo';
import {
  todoMap,
  projectMap,
  switchTodoMap,
  getElement,
  adjustHeight,
  projectListHandler,
} from './index';
import {
  State,
  Priority,
  TodoStateColor,
  TodoPriorityColor,
  type TodoMapEvent,
  type Task,
  type FilterInput,
} from './types';
import { ChecklistTask } from './checklist-task';

const formHandler = new FormHandler();

export class TodoHandler {
  private containerDiv: HTMLElement;
  private addTodoDiv: HTMLElement;
  private selectProject: HTMLElement;
  private filterInput: FilterInput;

  private nodes = new Map<string, HTMLElement>();

  constructor() {
    this.containerDiv = getElement('.container');
    this.addTodoDiv = getElement('#addTodo');
    this.selectProject = getElement('#selectProject');
    this.filterInput = {
      task: document.querySelector('#filterTask') as HTMLSelectElement,
      date: document.querySelector('#filterDate') as HTMLInputElement,
      priority: document.querySelector('#filterPriority') as HTMLSelectElement,
      state: document.querySelector('#filterState') as HTMLSelectElement,
    };

    this.bindEvents();
  }

  private bindEvents() {
    this.addTodoDiv.addEventListener('click', () => {
      if (formHandler.dialogForm) {
        formHandler.dialogForm.showModal();
      }
    });
  }

  public handleTodoMapEvent(event: TodoMapEvent) {
    const container = this.containerDiv;

    if (event.type === 'clear') {
      this.addTodoDiv.style.display = 'none';
      this.selectProject.style.display = 'block';
    } else {
      this.addTodoDiv.style.display = 'flex';
      this.selectProject.style.display = 'none';
      projectListHandler.settingsTitle.innerText = projectMap.projectId ?? '';
    }

    switch (event.type) {
      case 'bulk':
        for (const el of this.nodes.values()) {
          el.remove();
        }
        this.nodes.clear();
        for (const [id, todo] of event.items) {
          const el = this.renderTodo(todo);
          container.appendChild(el);
          this.nodes.set(id, el);
        }
        break;

      case 'set': {
        const todo = event.todo;
        const existing = this.nodes.get(todo.id);
        if (existing) {
          this.updateTodoRow(existing, todo);
        } else {
          const el = this.renderTodo(todo);
          container.appendChild(el);
          this.nodes.set(todo.id, el);
        }
        break;
      }

      case 'delete': {
        const el = this.nodes.get(event.id);
        if (el) {
          el.remove();
          this.nodes.delete(event.id);
        }
        break;
      }

      case 'clear':
        for (const el of this.nodes.values()) {
          el.remove();
        }
        this.nodes.clear();
        break;
    }
  }

  private renderTodo(todo: Todo): HTMLElement {
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
      this.createDiv(todo.title, 'todo-title', (value) => {
        todo.editTask({ title: value });
        todoMap!.notify({ type: 'set', id: todo.id, todo });
      }),
    );

    el.appendChild(
      this.createDiv(todo.description ?? '', 'todo-desc', (value) => {
        todo.editTask({ description: value });
        todoMap!.notify({ type: 'set', id: todo.id, todo });
      }),
    );

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    wrapper.appendChild(this.createLabel('todo-date', 'Due'));
    wrapper.appendChild(this.createLabel('todo-priority', 'Priority'));
    wrapper.appendChild(this.createLabel('todo-state', 'Progress'));

    el.appendChild(wrapper);

    const dateInput = this.createDateInput(todo.dueDate, (date) => {
      if (!date) {
        todo.editTask({ dueDate: new Date() });
      } else {
        todo.editTask({ dueDate: new Date(date) });
      }

      todoMap!.notify({ type: 'set', id: todo.id, todo });
    });

    dateInput.addEventListener('click', () => {
      dateInput.showPicker();
    });

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

    const priority = this.createSelect(
      Object.values(Priority),
      todo.priority,
      (value) => {
        todo.editTask({ priority: value as Priority });
        todoMap!.notify({ type: 'set', id: todo.id, todo });
      },
    );
    priority.className = 'todo-priority';
    wrapper.appendChild(priority);

    const state = this.createSelect(
      Object.values(State),
      todo.state,
      (value) => {
        todo.editTask({ state: value as State });
        todoMap!.notify({ type: 'set', id: todo.id, todo });
      },
    );
    state.className = 'todo-state';
    wrapper.appendChild(state);

    const task = this.createTask(todo.task ?? '', (value) => {
      todo.editTask({ task: value as Task });
      todoMap!.notify({ type: 'set', id: todo.id, todo });
    });
    el.appendChild(task);
    el.style.borderLeft = `15px solid ${todoStateColor}`;
    return el;
  }

  private updateTodoRow(row: HTMLElement, todo: Todo): void {
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

    row.style.background = todoPriorityColor;
    row.style.borderLeft = `15px solid ${todoColor}`;
  }

  private createTask(task: Task, onChange?: (value: Task) => void) {
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

      taskDiv.appendChild(note);

      if (onChange) {
        note.addEventListener('change', () => {
          onChange(note.value);
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

  private createDiv(
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
    if (onChange) {
      input.addEventListener('change', () => onChange(input.value));
    }
    return input;
  }

  private createSelect<T extends string>(
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

  private createDateInput(
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

  private createLabel(forId: string, text: string): HTMLLabelElement {
    const label = document.createElement('label');
    label.setAttribute('for', forId);
    label.textContent = text;
    return label;
  }
}
