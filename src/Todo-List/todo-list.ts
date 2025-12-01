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
type Task = String | ChecklistTask;
type TodoMapListener = (event: TodoMapEvent, map: Map<string, Todo>) => void;
type TodoMapEvent =
  | { type: 'set'; id: string; todo: Todo }
  | { type: 'delete'; id: string }
  | { type: 'clear' }
  | { type: 'bulk'; items: [string, Todo][] };

interface FormValues {
  title: string;
  description: string | undefined;
  dueDate: Date;
  priority: Priority;
  task?: Task;
}

interface StoredTodo {
  id: string;
  data: {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // ISO string
    priority: Priority;
    state: State;
    task?: Task;
  };
}

class ObservableTodoMap {
  private map = new Map<string, Todo>();
  private listeners: Set<TodoMapListener> = new Set();

  public set(id: string, todo: Todo) {
    this.map.set(id, todo);
    this.notify({ type: 'set', id, todo });
  }

  public delete(id: string) {
    const existed = this.map.delete(id);
    if (existed) this.notify({ type: 'delete', id });
  }

  public clear() {
    this.map.clear();
    this.notify({ type: 'clear' });
  }

  public get(id: string) {
    return this.map.get(id);
  }

  public entries(): IterableIterator<[string, Todo]> {
    return this.map.entries();
  }

  public filter(predicate: (todo: Todo) => boolean): Map<string, Todo> {
    const result = new Map<string, Todo>();
    for (const [id, todo] of this.map) {
      if (predicate(todo)) result.set(id, todo);
    }
    return result;
  }

  public seed() {
    const raw = localStorage.getItem('todoMap');
    if (raw) {
      const parsed: StoredTodo[] = JSON.parse(raw);
      for (const { id, data } of parsed) {
        this.map.set(
          id,
          new Todo(
            data.id,
            data.title,
            data.description,
            new Date(data.dueDate),
            data.priority,
            data.state,
            data.task,
          ),
        );
      }
    }
  }

  public subscribe(listener: TodoMapListener) {
    this.listeners.add(listener);

    listener({ type: 'bulk', items: Array.from(this.map.entries()) }, this.map);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(event: TodoMapEvent) {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener(event, this.map);
      } catch (err) {
        console.error('TodoMap listener error', err);
      }
    }
  }
}

class Todo {
  constructor(
    private _id: string,
    private _title: string,
    private _description: string | undefined,
    private _dueDate: Date,
    private _priority: Priority,
    private _state: State,
    private _task: Task | undefined,
  ) {}

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get dueDate() {
    return this._dueDate;
  }
  get priority() {
    return this._priority;
  }
  get state() {
    return this._state;
  }
  get task() {
    return this._task;
  }

  public editTask(payload: {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: Priority;
    state?: State;
    task?: Task | undefined;
  }) {
    if (payload.title !== undefined) this._title = payload.title;
    if (payload.description !== undefined)
      this._description = payload.description;
    if (payload.dueDate) this._dueDate = payload.dueDate;
    if (payload.priority) this._priority = payload.priority;
    if (payload.state) this._state = payload.state;
    if (payload.task !== undefined) this._task = payload.task;
  }

  public toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      dueDate: this._dueDate.toISOString(),
      priority: this._priority,
      state: this._state,
      task: this._task,
    };
  }
}

class ChecklistTask {
  private _items: [string, boolean][];
  constructor(items: [string, boolean][]) {
    this._items = items;
  }

  get items() {
    return this._items;
  }
}

class DOMHandler {
  private _containerDiv: HTMLElement | null;

  get containerDiv() {
    return this._containerDiv;
  }

  constructor() {
    this._containerDiv = document.querySelector('.container');
  }

  public createDiv(text?: string, className?: string): HTMLDivElement {
    const div = document.createElement('div');
    if (text) div.innerText = text;
    if (className) div.className = className;
    return div;
  }

  public createSelect<T extends string>(
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
    if (onChange)
      select.addEventListener('change', () => onChange(select.value as T));
    return select;
  }

  public createDateInput(
    date: Date,
    onChange?: (value: Date) => void,
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'date';
    input.value = date.toISOString().slice(0, 10);
    if (onChange)
      input.addEventListener('change', () => onChange(new Date(input.value)));
    return input;
  }
}

class FormHandler {
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

document.addEventListener('DOMContentLoaded', () => {
  new FormHandler();
});

const dom = new DOMHandler();
const todoMap = new ObservableTodoMap();

todoMap.seed();

todoMap.subscribe((event: TodoMapEvent, map: Map<string, Todo>) => {
  if (event.type !== 'bulk') {
    const serialized = JSON.stringify(
      Array.from(map.entries()).map(([id, todo]) => ({
        id,
        data: todo.toJSON(),
      })),
    );
    localStorage.setItem('todoMap', serialized);
  }
});

todoMap.subscribe((event: TodoMapEvent, map: Map<string, Todo>) => {
  console.log(map);
});

todoMap.subscribe((event: TodoMapEvent, map: Map<string, Todo>) => {
  if (event.type === 'bulk') {
    for (const [id, todo] of event.items) {
      const el = document.createElement('div');
      el.id = todo.id;

      el.appendChild(dom.createDiv(todo.title, 'todo-title'));
      if (todo.description)
        el.appendChild(dom.createDiv(todo.description, 'todo-desc'));

      el.appendChild(
        dom.createDateInput(todo.dueDate, (date) => {
          todo.editTask({ dueDate: date });
          todoMap.notify({ type: 'set', id: todo.id, todo });
        }),
      );

      el.appendChild(
        dom.createSelect(Object.values(Priority), todo.priority, (value) => {
          todo.editTask({ priority: value as Priority });
          todoMap.notify({ type: 'set', id: todo.id, todo });
        }),
      );

      el.appendChild(
        dom.createSelect(Object.values(State), todo.state, (value) => {
          todo.editTask({ state: value as State });
          todoMap.notify({ type: 'set', id: todo.id, todo });
        }),
      );

      dom.containerDiv?.appendChild(el);
    }

    //console.log(todoMap.filter((t) => t.priority === Priority.High));
    return;
  }
});
