import { type FormValues, Priority, State } from './types';
import { ChecklistTask, Todo } from './todo';
import { todoMap } from './index';

export class FormHandler {
  private form: HTMLFormElement | undefined;
  private selectTaskElement: HTMLSelectElement | null;
  private taskDiv: HTMLElement | null;
  private _dialogForm: HTMLDialogElement | null;
  private closeBtn: HTMLButtonElement | null;

  get dialogForm() {
    return this._dialogForm;
  }
  constructor() {
    this.form = document.querySelector('form') as HTMLFormElement;
    this.selectTaskElement = document.querySelector('#selectTask');
    this.taskDiv = document.querySelector('#taskDiv');
    this._dialogForm = document.querySelector('dialog');
    this.closeBtn = document.querySelector('#closeBtn');

    this.bindEvents();
  }

  private bindEvents() {
    if (this.closeBtn && this._dialogForm && this.form) {
      this.closeBtn.addEventListener('click', () => {
        this.form!.reset();
        this._dialogForm!.close();
      });
    }
    this.selectTask();
    this.fetchTask();
  }

  private fetchTask() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(this.form);

        const note = data.get('note');
        const checklist = data.getAll('checklist[]');

        const formData: FormValues = {
          title: data.get('title') as string,
          description: data.get('description') as string,
          dueDate: new Date(data.get('dueDate') as string),
          priority: data.get('priority') as Priority,
        };

        const hasNote = typeof note === 'string' && note.trim() !== '';
        const hasChecklist = Array.isArray(checklist) && checklist.length > 0;

        const valid =
          typeof formData.title === 'string' &&
          formData.title.trim() !== '' &&
          formData.dueDate instanceof Date &&
          !isNaN(formData.dueDate.getTime()) &&
          Boolean(formData.priority) &&
          (hasNote || hasChecklist);

        if (!valid) {
          alert('invalid');
          return;
        }

        if (note !== null) {
          formData.task = String(note);
        } else if (checklist.length > 0) {
          formData.task = new ChecklistTask(
            checklist.map((item) => {
              return [String(item), false] as [string, boolean];
            }),
          );
        }
        const id = crypto.randomUUID();
        const todo = new Todo(
          id,
          formData.title,
          formData.description,
          formData.dueDate,
          formData.priority,
          State.NotStarted,
          formData.task,
        );
        todoMap.set(id, todo);
        if (this._dialogForm) {
          this._dialogForm.close();
          this.form!.reset();
        }
      });
    }
  }

  private selectTask() {
    if (this.selectTaskElement && this.taskDiv) {
      const renderTaskControls = (value: string) => {
        this.taskDiv!.innerHTML = '';
        if (value === 'notes') {
          const noteInput = document.createElement('input');
          noteInput.type = 'text';
          noteInput.placeholder = 'Enter your note';
          noteInput.name = 'note';
          this.taskDiv!.appendChild(noteInput);
        } else if (value === 'checklist') {
          const itemInput = document.createElement('input');
          itemInput.type = 'text';
          itemInput.placeholder = 'Enter checklist item';

          const addButton = document.createElement('button');
          addButton.type = 'button';
          addButton.textContent = 'Add item';

          const listContainer = document.createElement('div');

          addButton.addEventListener('click', () => {
            if (itemInput.value.trim() === '') return;
            const wrapper = document.createElement('div');

            const itemHidden = document.createElement('input');
            itemHidden.type = 'text';
            itemHidden.name = 'checklist[]';
            itemHidden.value = itemInput.value;
            itemHidden.readOnly = true;
            itemHidden.style.display = 'none';

            const label = document.createElement('span');
            label.textContent = itemInput.value;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => wrapper.remove());

            wrapper.appendChild(itemHidden);
            wrapper.appendChild(label);
            wrapper.appendChild(removeBtn);

            listContainer.appendChild(wrapper);
            itemInput.value = '';
          });

          this.taskDiv!.appendChild(itemInput);
          this.taskDiv!.appendChild(addButton);
          this.taskDiv!.appendChild(listContainer);
        }
      };

      this.selectTaskElement.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        renderTaskControls(target.value);
      });

      renderTaskControls(this.selectTaskElement.value);
    }
  }
}
