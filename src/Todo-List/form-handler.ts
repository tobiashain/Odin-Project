import {
  type FormValues,
  type FormDOMValidity,
  Priority,
  State,
} from './types';
import { ChecklistTask } from './checklist-task';
import { Todo } from './todo';
import { todoMap, getElement } from './index';

export class FormHandler {
  private form: HTMLFormElement;
  private formDomValidity: FormDOMValidity;
  private selectTaskElement: HTMLSelectElement;
  private taskDiv: HTMLElement;
  private _dialogForm: HTMLDialogElement;
  private closeBtn: HTMLButtonElement;
  private dueDateInput: HTMLInputElement;
  private listContainer: HTMLElement;

  get dialogForm() {
    return this._dialogForm;
  }
  constructor() {
    this.form = getElement('form');
    this.formDomValidity = {
      title: getElement('#title'),
      date: getElement('#dueDate'),
      taskInput: getElement('#taskInput'),
    };
    this.selectTaskElement = getElement('#selectTask');
    this.taskDiv = getElement('#taskDiv');
    this._dialogForm = getElement('dialog');
    this.closeBtn = getElement('#closeBtn');
    this.dueDateInput = getElement('#dueDate');
    this.listContainer = getElement('#listContainer');

    this.bindEvents();
  }

  private bindEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.closeForm();
    });

    this.dueDateInput.min = new Date().toISOString().slice(0, 10);

    this.selectTask();
    this.submitTask();
  }

  private submitTask() {
    this.formDomValidity.title.addEventListener('change', () => {
      this.validateField(
        'title',
        this.formDomValidity.title.value.trim() !== '',
        'Title cannot be empty',
      );
    });

    this.formDomValidity.date.addEventListener('change', () => {
      this.validateField(
        'date',
        !isNaN(new Date(this.formDomValidity.date.value).getTime()),
        'Please enter a valid date',
      );
    });

    this.formDomValidity.taskInput.addEventListener('change', () => {
      let { note, checklist } = this.fetchTask();

      const hasNote = typeof note === 'string' && note.trim() !== '';
      const hasChecklist = Array.isArray(checklist) && checklist.length > 0;

      this.validateField(
        'taskInput',
        hasNote || hasChecklist,
        'Title cannot be empty',
      );
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      let { formData, note, checklist } = this.fetchTask();

      const valid = this.validateForm(formData, note, checklist);

      if (!valid) {
        return;
      }

      if (checklist.length > 0) {
        formData.task = new ChecklistTask(
          checklist.map((item) => {
            return [String(item), false] as [string, boolean];
          }),
        );
      } else if (note !== null) {
        formData.task = String(note);
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
      todoMap!.set(id, todo);

      this.closeForm();
    });
  }

  private fetchTask() {
    const data = new FormData(this.form);

    const note = data.get('note');
    const checklist = data.getAll('checklist[]');

    const formData: FormValues = {
      title: data.get('title') as string,
      description: data.get('description') as string,
      dueDate: new Date(data.get('dueDate') as string),
      priority: data.get('priority') as Priority,
    };

    return { formData, note, checklist };
  }

  private selectTask() {
    const renderTaskControls = (value: string) => {
      this.taskDiv!.innerHTML = '';
      const input = this.formDomValidity.taskInput;
      input.type = 'text';
      input.id = 'taskInput';
      this.taskDiv!.appendChild(input);
      if (value === 'notes') {
        input.placeholder = 'Enter your note';
        input.value = '';
        input.name = 'note';
        this.listContainer.innerHTML = '';
      } else if (value === 'checklist') {
        input.placeholder = 'Enter checklist item';

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.textContent = 'Add item';

        addButton.addEventListener('click', () => {
          if (input.value.trim() === '') return;
          const wrapper = document.createElement('div');
          wrapper.className = 'check-item';

          const itemHidden = document.createElement('input');
          itemHidden.type = 'text';
          itemHidden.name = 'checklist[]';
          itemHidden.value = input.value;
          itemHidden.readOnly = true;
          itemHidden.style.display = 'none';

          const label = document.createElement('span');
          label.textContent = input.value;

          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.textContent = 'X';
          removeBtn.addEventListener('click', () => wrapper.remove());

          wrapper.appendChild(itemHidden);
          wrapper.appendChild(label);
          wrapper.appendChild(removeBtn);

          this.listContainer!.appendChild(wrapper);
          input.value = '';
        });

        this.taskDiv!.appendChild(addButton);
      }
    };

    this.selectTaskElement.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      renderTaskControls(target.value);
    });

    renderTaskControls(this.selectTaskElement.value);
  }

  private validateField(
    fieldName: keyof typeof this.formDomValidity,
    condition: boolean,
    message: string,
  ): boolean {
    const input = this.formDomValidity[fieldName];
    if (!condition) {
      input.setCustomValidity(message);
      input.reportValidity();
      return false;
    } else {
      input.setCustomValidity('');
      return true;
    }
  }

  private validateForm(
    formData: FormValues,
    note: (string | File) | null,
    checklist: (string | File)[],
  ): boolean {
    let valid = true;

    Object.values(this.formDomValidity).forEach((input) =>
      input.setCustomValidity(''),
    );

    valid =
      this.validateField(
        'title',
        typeof formData.title === 'string' && formData.title.trim() !== '',
        'Title cannot be empty',
      ) && valid;

    valid =
      this.validateField(
        'date',
        formData.dueDate instanceof Date && !isNaN(formData.dueDate.getTime()),
        'Please enter a valid date',
      ) && valid;

    const hasNote =
      typeof note === 'string' &&
      note.trim() !== '' &&
      this.selectTaskElement.value === 'notes';
    const hasChecklist =
      Array.isArray(checklist) &&
      checklist.length > 0 &&
      this.selectTaskElement.value === 'checklist';
    valid =
      this.validateField(
        'taskInput',
        hasNote || hasChecklist,
        'Please add a note or a checklist',
      ) && valid;

    return valid;
  }

  private closeForm() {
    this._dialogForm.close();
    this.form.reset();
    Object.values(this.formDomValidity).forEach((el) => {
      el.setCustomValidity('');
    });
    this.listContainer.innerHTML = '';
    this.selectTaskElement.value = 'notes';
    this.selectTask();
  }
}
