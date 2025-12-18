import { FormHandler } from './form-handler';
import { Todo } from './todo';
import { todoMap, projectMap, switchTodoMap, getElement } from './index';
import {
  State,
  Priority,
  TodoStateColor,
  TodoPriorityColor,
  type TodoMapEvent,
  type Task,
} from './types';
import { ChecklistTask } from './checklist-task';

const formHandler = new FormHandler();

export class DOMHandler {
  private containerDiv: HTMLElement;
  private addTodoDiv: HTMLElement;
  private selectProject: HTMLElement;
  private projectListDiv: HTMLElement;
  private addProject: HTMLButtonElement;
  private settingsTitle: HTMLElement;
  private nodes = new Map<string, HTMLElement>();

  constructor() {
    this.containerDiv = getElement('.container');
    this.addTodoDiv = getElement('#addTodo');
    this.selectProject = getElement('#selectProject');
    this.projectListDiv = getElement('#projectList');
    this.addProject = getElement<HTMLButtonElement>('#addProject');
    this.settingsTitle = getElement('#settingsTitle');

    this.bindEvents();
  }

  private bindEvents() {
    this.addTodoDiv.addEventListener('click', () => {
      if (formHandler.dialogForm) {
        formHandler.dialogForm.showModal();
      }
    });

    this.settingsTitle.innerText = projectMap.projectId ?? '';

    this.addProject?.addEventListener('click', () => {
      let counter = 0;
      const projects = projectMap.listProjects();
      function newProject() {
        let name = counter === 0 ? 'New Project' : `New Project (${counter})`;

        if (!projects.some((project) => project === name)) {
          projectMap.addProject(name);
          switchTodoMap(projectMap.current);
        } else {
          counter++;
          newProject();
        }
      }

      newProject();
      this.projectList();
    });

    this.projectList();
  }

  public handleTodoMapEvent(event: TodoMapEvent) {
    const container = this.containerDiv;

    if (event.type === 'clear') {
      this.addTodoDiv.style.display = 'none';
      this.selectProject.style.display = 'block';
    } else {
      this.addTodoDiv.style.display = 'flex';
      this.selectProject.style.display = 'none';
      this.settingsTitle!.innerText = projectMap.projectId ?? '';
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

  private projectList() {
    const projects = projectMap.listProjects();
    this.projectListDiv.innerHTML = '';
    projects.forEach((project) => {
      this.createProject(project);
    });
  }

  private createProject(project: string) {
    const textarea = document.createElement('textarea');
    textarea.readOnly = true;
    textarea.className = 'project';
    textarea.value = project;
    textarea.rows = 1;

    let currentName = project;

    const btnEdit = document.createElement('button');
    btnEdit.innerHTML = `
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    const btnDelete = document.createElement('button');
    btnDelete.innerHTML = `
        <svg width="800px" height="800px" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.8489 22.6922C11.5862 22.7201 11.3509 22.5283 11.3232 22.2638L10.4668 14.0733C10.4392 13.8089 10.6297 13.5719 10.8924 13.5441L11.368 13.4937C11.6307 13.4659 11.8661 13.6577 11.8937 13.9221L12.7501 22.1126C12.7778 22.3771 12.5873 22.614 12.3246 22.6418L11.8489 22.6922Z" fill="#000000"/>
          <path d="M16.1533 22.6418C15.8906 22.614 15.7001 22.3771 15.7277 22.1126L16.5841 13.9221C16.6118 13.6577 16.8471 13.4659 17.1098 13.4937L17.5854 13.5441C17.8481 13.5719 18.0387 13.8089 18.011 14.0733L17.1546 22.2638C17.127 22.5283 16.8916 22.7201 16.6289 22.6922L16.1533 22.6418Z" fill="#000000"/>
          <path clip-rule="evenodd" d="M11.9233 1C11.3494 1 10.8306 1.34435 10.6045 1.87545L9.54244 4.37037H4.91304C3.8565 4.37037 3 5.23264 3 6.2963V8.7037C3 9.68523 3.72934 10.4953 4.67218 10.6145L7.62934 26.2259C7.71876 26.676 8.11133 27 8.56729 27H20.3507C20.8242 27 21.2264 26.6513 21.2966 26.1799L23.4467 10.5956C24.3313 10.4262 25 9.64356 25 8.7037V6.2963C25 5.23264 24.1435 4.37037 23.087 4.37037H18.4561L17.394 1.87545C17.1679 1.34435 16.6492 1 16.0752 1H11.9233ZM16.3747 4.37037L16.0083 3.50956C15.8576 3.15549 15.5117 2.92593 15.1291 2.92593H12.8694C12.4868 2.92593 12.141 3.15549 11.9902 3.50956L11.6238 4.37037H16.3747ZM21.4694 11.0516C21.5028 10.8108 21.3154 10.5961 21.0723 10.5967L7.1143 10.6285C6.86411 10.6291 6.67585 10.8566 6.72212 11.1025L9.19806 24.259C9.28701 24.7317 9.69985 25.0741 10.1808 25.0741H18.6559C19.1552 25.0741 19.578 24.7058 19.6465 24.2113L21.4694 11.0516ZM22.1304 8.7037C22.6587 8.7037 23.087 8.27257 23.087 7.74074V7.25926C23.087 6.72743 22.6587 6.2963 22.1304 6.2963H5.86957C5.34129 6.2963 4.91304 6.72743 4.91304 7.25926V7.74074C4.91304 8.27257 5.34129 8.7037 5.86956 8.7037H22.1304Z" fill="#000000" fill-rule="evenodd"/>
        </svg>`;

    textarea.addEventListener('input', () => {
      this.adjustHeight(textarea);
    });

    setTimeout(() => {
      this.adjustHeight(textarea);
    }, 0);

    textarea.addEventListener('click', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.readOnly) {
        switchTodoMap(projectMap.selectProject(currentName));
        this.settingsTitle.innerText = projectMap.projectId ?? '';
      }
    });

    textarea.addEventListener('blur', () => {
      if (textarea.value.trim() === '') {
        alert(`The project name should not be empty!`);
        textarea.focus();
        return;
      } else if (textarea.value.trim() === currentName) {
        textarea.style.caretColor = 'transparent';
        textarea.style.background = 'initial';
        textarea.readOnly = true;
        textarea.value = textarea.value.trim();
        this.adjustHeight(textarea);
        return;
      } else if (
        projectMap
          .listProjects()
          .some((project) => project === textarea.value.trim()) &&
        textarea.readOnly === false
      ) {
        alert('The project name already exists!');
        textarea.focus();
        return;
      }
      textarea.style.caretColor = 'transparent';
      textarea.style.background = 'transparent';
      textarea.readOnly = true;
      textarea.value = textarea.value.trim();
      this.adjustHeight(textarea);

      projectMap.renameProject(currentName, textarea.value);
      if (this.settingsTitle.innerText === currentName)
        this.settingsTitle.innerText = textarea.value;
      currentName = textarea.value;
    });

    btnEdit.addEventListener('click', () => {
      textarea.readOnly = false;
      textarea.style.caretColor = 'auto';
      textarea.style.background = '#5a5a85';
      textarea.focus();
    });

    btnDelete.addEventListener('click', () => {
      projectMap.deleteProject(project);
      this.settingsTitle.innerText = projectMap.projectId ?? '';
      this.projectList();
    });

    this.projectListDiv.appendChild(textarea);
    this.projectListDiv.appendChild(btnEdit);
    this.projectListDiv.appendChild(btnDelete);
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
        this.adjustHeight(note);
      }, 0);

      note.addEventListener('input', () => {
        this.adjustHeight(note);
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
      this.adjustHeight(input);
    }, 0);

    input.addEventListener('input', () => {
      this.adjustHeight(input);
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

  private adjustHeight(input: HTMLTextAreaElement) {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';

    if (input.scrollHeight > parseInt(getComputedStyle(input).maxHeight)) {
      input.style.overflowY = 'auto';
    } else {
      input.style.overflowY = 'hidden';
    }
  }
}
