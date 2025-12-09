import { FormHandler } from './form-handler';
import { type Todo } from './todo';
import { todoMap, projectMap, switchTodoMap } from './index';
import { State, Priority, type TodoMapEvent } from './types';

const formHandler = new FormHandler();

export class DOMHandler {
  private containerDiv: HTMLElement | null;
  private addTodoDiv: HTMLElement | null;
  private projectListDiv: HTMLElement | null;
  public nodes = new Map<string, HTMLElement>();

  constructor() {
    this.containerDiv = document.querySelector('.container');
    this.addTodoDiv = document.querySelector('#addTodo');
    this.projectListDiv = document.querySelector('#projectList');
    this.bindEvents();
  }

  private bindEvents() {
    if (this.addTodoDiv) {
      this.addTodoDiv?.addEventListener('click', () => {
        if (formHandler.dialogForm) {
          formHandler.dialogForm.showModal();
        }
      });
    }

    if (this.projectListDiv) {
      const projects = projectMap.listProjects();
      this.projectListDiv.innerHTML = '';
      const ul = document.createElement('ul');
      projects.forEach((project) => {
        const li = document.createElement('li');
        li.innerText = project;
        li.addEventListener('click', () => {
          switchTodoMap(projectMap.selectProject(project));
        });
        ul.appendChild(li);
      });
      this.projectListDiv.appendChild(ul);
    }
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

    const adjustHeight = () => {
      input.style.height = 'auto';
      input.style.height = input.scrollHeight + 'px';

      if (input.scrollHeight > parseInt(getComputedStyle(input).maxHeight)) {
        input.style.overflowY = 'auto';
      } else {
        input.style.overflowY = 'hidden';
      }
    };

    setTimeout(adjustHeight, 0);

    input.addEventListener('input', adjustHeight);
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

  private makeLabel(forId: string, text: string): HTMLLabelElement {
    const label = document.createElement('label') as HTMLLabelElement;
    label.setAttribute('for', forId);
    label.textContent = text;
    return label;
  }

  public renderTodo(todo: Todo): HTMLElement {
    const el = document.createElement('div');
    el.id = todo.id;
    el.className = 'todo';
    el.appendChild(
      this.createDiv(todo.title, 'todo-title', (value) => {
        todo.editTask({ title: value });
        todoMap!.notify({ type: 'set', id: todo.id, todo });
      }),
    );
    if (todo.description)
      el.appendChild(
        this.createDiv(todo.description, 'todo-desc', (value) => {
          todo.editTask({ description: value });
          todoMap!.notify({ type: 'set', id: todo.id, todo });
        }),
      );

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    wrapper.appendChild(this.makeLabel('todo-date', 'Due'));
    wrapper.appendChild(this.makeLabel('todo-priority', 'Priority'));
    wrapper.appendChild(this.makeLabel('todo-state', 'Progress'));

    el.appendChild(wrapper);

    const dateInput = this.createDateInput(todo.dueDate, (date) => {
      console.log(date);
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
      new Date().toISOString().slice(0, 10)
    ) {
      dateInput.className = 'todo-date overdue';
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

    return el;
  }

  public updateTodoRow(row: HTMLElement, todo: Todo): void {
    const title = row.querySelector('.todo-title');
    if (title) title.textContent = todo.title;

    const desc = row.querySelector('.todo-desc');
    if (desc) {
      if (todo.description) {
        desc.textContent = todo.description;
      } else {
        desc.remove();
      }
    } else if (todo.description) {
      const newDesc = this.createDiv(todo.description, 'todo-desc');
      row.insertBefore(newDesc, row.querySelector('.todo-date'));
    }

    const dateInput = row.querySelector('.todo-date') as HTMLInputElement;
    if (dateInput) {
      if (
        todo.dueDate.toISOString().slice(0, 10) <
        new Date().toISOString().slice(0, 10)
      ) {
        dateInput.className = 'todo-date overdue';
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
  }

  public handleTodoMapEvent(event: TodoMapEvent) {
    const container = this.containerDiv;
    if (!container) return;

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
}
