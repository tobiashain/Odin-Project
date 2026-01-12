import {
  type FormValues,
  type FormDOMValidity,
  Priority,
  State,
} from './types';
import { ChecklistTask } from './checklist-task';
import { Todo } from './todo';
import { todoMap } from './index';
import { getElement } from './helper';

const form: HTMLFormElement = getElement('form');
const formDomValidity: FormDOMValidity = {
  title: getElement('#title'),
  date: getElement('#dueDate'),
  taskInput: getElement('#taskInput'),
};
const selectTaskElement: HTMLSelectElement = getElement('#selectTask');
const taskDiv: HTMLElement = getElement('#taskDiv');
const dialogForm: HTMLDialogElement = getElement('dialog');
const closeBtn: HTMLButtonElement = getElement('#closeBtn');
const dueDateInput: HTMLInputElement = getElement('#dueDate');
const listContainer: HTMLElement = getElement('#listContainer');

function bindEvents() {
  closeBtn.addEventListener('click', closeForm);
  dueDateInput.min = new Date().toISOString().slice(0, 10);
  selectTask();
  submitTask();
}

function submitTask() {
  formDomValidity.title.addEventListener('change', () => {
    validateField(
      'title',
      formDomValidity.title.value.trim() !== '',
      'Title cannot be empty',
    );
  });

  formDomValidity.date.addEventListener('change', () => {
    validateField(
      'date',
      !isNaN(new Date(formDomValidity.date.value).getTime()),
      'Please enter a valid date',
    );
  });

  formDomValidity.taskInput.addEventListener('change', () => {
    const { note, checklist } = fetchTask();

    const hasNote = typeof note === 'string' && note.trim() !== '';
    const hasChecklist = Array.isArray(checklist) && checklist.length > 0;

    validateField(
      'taskInput',
      hasNote || hasChecklist,
      'Title cannot be empty',
    );
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { formData, note, checklist } = fetchTask();
    if (!validateForm(formData, note, checklist)) return;

    if (checklist.length > 0) {
      formData.task = new ChecklistTask(
        checklist.map((item) => [String(item), false] as [string, boolean]),
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

    closeForm();
  });
}

function fetchTask() {
  const data = new FormData(form);

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

function selectTask() {
  const renderTaskControls = (value: string) => {
    taskDiv.innerHTML = '';
    const input = formDomValidity.taskInput;
    input.type = 'text';
    input.id = 'taskInput';
    taskDiv.appendChild(input);

    if (value === 'notes') {
      input.placeholder = 'Enter your note';
      input.value = '';
      input.name = 'note';
      listContainer.innerHTML = '';
    } else if (value === 'checklist') {
      input.placeholder = 'Enter checklist item';

      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.textContent = 'Add item';

      addButton.addEventListener('click', () => {
        if (input.value.trim() === '') return;
        listContainer.appendChild(createChecklistItem(input.value));
        input.value = '';
      });

      taskDiv.appendChild(addButton);
    }
  };

  selectTaskElement.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    renderTaskControls(target.value);
  });

  renderTaskControls(selectTaskElement.value);
}

function createChecklistItem(value: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'check-item';

  const itemHidden = document.createElement('input');
  itemHidden.type = 'text';
  itemHidden.name = 'checklist[]';
  itemHidden.value = value;
  itemHidden.readOnly = true;
  itemHidden.style.display = 'none';

  const label = document.createElement('span');
  label.textContent = value;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'X';
  removeBtn.addEventListener('click', () => wrapper.remove());

  wrapper.append(itemHidden, label, removeBtn);
  return wrapper;
}

function validateField(
  fieldName: keyof typeof formDomValidity,
  condition: boolean,
  message: string,
): boolean {
  const input = formDomValidity[fieldName];
  if (!condition) {
    input.setCustomValidity(message);
    input.reportValidity();
    return false;
  } else {
    input.setCustomValidity('');
    return true;
  }
}

function validateForm(
  formData: FormValues,
  note: (string | File) | null,
  checklist: (string | File)[],
): boolean {
  let valid = true;

  Object.values(formDomValidity).forEach((input) =>
    input.setCustomValidity(''),
  );

  valid =
    validateField(
      'title',
      typeof formData.title === 'string' && formData.title.trim() !== '',
      'Title cannot be empty',
    ) && valid;

  valid =
    validateField(
      'date',
      formData.dueDate instanceof Date && !isNaN(formData.dueDate.getTime()),
      'Please enter a valid date',
    ) && valid;

  const hasNote =
    typeof note === 'string' &&
    note.trim() !== '' &&
    selectTaskElement.value === 'notes';
  const hasChecklist =
    Array.isArray(checklist) &&
    checklist.length > 0 &&
    selectTaskElement.value === 'checklist';
  valid =
    validateField(
      'taskInput',
      hasNote || hasChecklist,
      'Please add a note or a checklist',
    ) && valid;

  return valid;
}

function closeForm() {
  dialogForm.close();
  form.reset();
  Object.values(formDomValidity).forEach((el) => el.setCustomValidity(''));
  listContainer.innerHTML = '';
  selectTaskElement.value = 'notes';
  selectTask();
}

bindEvents();

export { dialogForm, closeForm, fetchTask };
