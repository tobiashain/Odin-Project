import backButton from '../shared';

enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}
enum State {
  NotStarted = 'Not Started',
  Pending = 'Pending',
  Done = 'Done',
}
type Task = NoteTask | ChecklistTask;

class Todo {
  constructor(
    id: string,
    title: string,
    description: string,
    dueDate: Date,
    priority: Priority,
    state: State,
    task: Task,
  ) {}

  public deleteTask() {}

  public editTask() {}

  public changePriority() {}

  public filter(done: boolean) {}
}

const todoMap = new Map<string, Todo>();

class NoteTask {
  constructor(note: string) {}
}

class ChecklistTask {
  constructor(list: [string, boolean][]) {}
}

class DOMHandler {
  private form: HTMLFormElement | undefined;
  private selectTaskElement: HTMLSelectElement | null;
  private taskDiv: HTMLElement | null;
  constructor() {
    this.form = document.querySelector('form') as HTMLFormElement;
    this.selectTaskElement = document.querySelector('#selectTask');
    this.taskDiv = document.querySelector('#taskDiv');

    this.bindEvents();
  }

  private bindEvents() {
    this.selectTask();
    this.fetchTask();
  }

  private fetchTask() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(this.form);
        const formData = {
          title: data.get('title') as string,
          description: data.get('description') as string,
          dueData: new Date(data.get('dueDate') as string),
          priority: data.get('priority') as Priority,
          state: data.get('state') as State,
        };
      });
    }
  }

  private selectTask() {
    if (this.selectTaskElement && this.taskDiv) {
      this.selectTaskElement.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.taskDiv!.innerHTML = '';
        if (target.value === 'notes') {
          const noteInput = document.createElement('input');
          noteInput.type = 'text';
          noteInput.placeholder = 'Enter your note';
          noteInput.name = 'note';
          this.taskDiv!.appendChild(noteInput);
        } else if (target.value === 'checklist') {
          const itemInput = document.createElement('input');
          itemInput.type = 'text';
          itemInput.placeholder = 'Enter checklist item';

          const addButton = document.createElement('button');
          addButton.type = 'button';
          addButton.textContent = 'Add item';

          const listContainer = document.createElement('ul');

          addButton.addEventListener('click', () => {
            if (itemInput.value.trim() === '') return;
            const li = document.createElement('li');
            li.textContent = itemInput.value;
            listContainer.appendChild(li);
            itemInput.value = '';
          });

          this.taskDiv!.appendChild(itemInput);
          this.taskDiv!.appendChild(addButton);
          this.taskDiv!.appendChild(listContainer);
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DOMHandler();
});
